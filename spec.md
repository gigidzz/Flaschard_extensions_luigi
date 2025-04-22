**Developer Specification: Gesture-Controlled Spaced Repetition Flashcards**


**Table of Contents:**

1.  Introduction & Overview
2.  System Architecture
3.  Database Schema (Postgres/Supabase)
4.  Backend API Specification
5.  Browser Extension Specification
6.  Web Application Specification
    *   6.1. Core Setup & State Management
    *   6.2. Main View (Card List)
    *   6.3. Practice Session View & Flow
    *   6.4. Hand Gesture Recognition
    *   6.5. Statistics View
7.  Core Algorithm Details
    *   7.1. Modified-Leitner Spaced Repetition
    *   7.2. Hint Generation
8.  Error Handling Summary
9.  Testing Plan

---

**1. Introduction & Overview**

This document outlines the requirements for building a spaced repetition flashcard system. Users can create flashcards rapidly from web content using a browser extension and practice them via a web application. Practice sessions utilize the Modified-Leitner spaced repetition algorithm, and users rate card difficulty using webcam-based hand gesture recognition (with manual fallback). The system aims to provide an efficient and engaging learning experience.

**2. System Architecture**

The system comprises four main components:

1.  **Browser Extension:** (Targeting Chrome/Firefox) Allows users to create flashcards from selected text on webpages. Communicates with the Backend API.
2.  **Web Application:** A single-page application (SPA) served locally (localhost) where users practice cards, view their collection, and check statistics. Communicates with the Backend API.
3.  **Backend API:** A server-side application (e.g., Node.js/Express) that handles business logic, data validation, and database interactions. Provides RESTful endpoints for the frontend components.
4.  **Database:** A PostgreSQL database (managed via Supabase) storing user flashcards and practice history.

*(Diagram omitted, but visualizes Extension/Web App -> Backend API -> Database)*

**3. Database Schema (Postgres/Supabase)**

Two primary tables are required:

*   **Table: `flashcards`**
    *   Purpose: Stores the content and state of each flashcard.
    *   Columns:
        *   `id`: `UUID`, Primary Key, Default `gen_random_uuid()`.
        *   `front`: `TEXT`, Not Null.
        *   `back`: `TEXT`, Not Null.
        *   `hint`: `TEXT`, Nullable.
        *   `tags`: `TEXT[]`, Not Null, Default `{}` (empty array).
        *   `bucket`: `INTEGER`, Not Null, Default 0. (Range 0-5, where 5 is retired).
        *   `created_at`: `TIMESTAMP WITH TIME ZONE`, Not Null, Default `NOW()`.
        *   `updated_at`: `TIMESTAMP WITH TIME ZONE`, Not Null, Default `NOW()`. (Recommended: Configure a trigger to automatically update this timestamp on row modification).
*   **Table: `practice_history`**
    *   Purpose: Logs each practice attempt for statistical analysis.
    *   Columns:
        *   `id`: `UUID`, Primary Key, Default `gen_random_uuid()`.
        *   `card_id`: `UUID`, Not Null, Foreign Key referencing `flashcards.id`. (Recommended: `ON DELETE CASCADE` to automatically remove history if a card is deleted).
        *   `day`: `INTEGER`, Not Null. (The learning day number for this practice session).
        *   `difficulty`: `INTEGER`, Not Null (Valid values: 0, 1, 2).
        *   `practiced_at`: `TIMESTAMP WITH TIME ZONE`, Not Null, Default `NOW()`.

**4. Backend API Specification**

The API should follow REST principles. All request/response bodies should be JSON.

*   **`POST /api/cards`**
    *   **Method:** `POST`
    *   **Description:** Creates a new flashcard.
    *   **Request Body:**
        ```json
        {
          "front": "string (required)",
          "back": "string (required)",
          "hint": "string (optional)",
          "tags": ["string", "string", ...] // Optional, defaults to []
        }
        ```
    *   **Logic:** Validate `front` and `back` are present. Insert a new record into `flashcards` with `bucket = 0`, provided `hint` and `tags`, and generated `id`/timestamps.
    *   **Response (Success):** `201 Created` with the created card object in the body.
    *   **Response (Error):** `400 Bad Request` (validation failed), `500 Internal Server Error`.

*   **`GET /api/cards`**
    *   **Method:** `GET`
    *   **Description:** Retrieves all flashcards.
    *   **Request Body:** None.
    *   **Logic:** Fetch all records from the `flashcards` table.
    *   **Response (Success):** `200 OK` with a JSON array of full flashcard objects.
        ```json
        [
          { "id": "uuid", "front": "...", "back": "...", "hint": "...", "tags": [], "bucket": 0, "created_at": "...", "updated_at": "..." },
          ...
        ]
        ```
    *   **Response (Error):** `500 Internal Server Error`.

*   **`DELETE /api/cards/{cardId}`**
    *   **Method:** `DELETE`
    *   **Description:** Deletes a specific flashcard.
    *   **URL Parameter:** `{cardId}` (UUID of the card).
    *   **Request Body:** None.
    *   **Logic:** Delete the record from `flashcards` where `id` matches `{cardId}`. If `practice_history.card_id` has `ON DELETE CASCADE`, related history will also be deleted.
    *   **Response (Success):** `204 No Content`.
    *   **Response (Error):** `404 Not Found`, `500 Internal Server Error`.

*   **`GET /api/practice-queue?day={dayNumber}`**
    *   **Method:** `GET`
    *   **Description:** Retrieves flashcards scheduled for practice on a specific day.
    *   **Query Parameter:** `day` (integer, required).
    *   **Request Body:** None.
    *   **Logic:** Query `flashcards` table for cards where `bucket` is between 0 and 4 (inclusive). Filter these results to include only cards where `day % (2^bucket) == 0`.
    *   **Response (Success):** `200 OK` with a JSON array of the full flashcard objects scheduled for practice. Returns an empty array `[]` if none are scheduled.
    *   **Response (Error):** `400 Bad Request` (missing/invalid day parameter), `500 Internal Server Error`.

*   **`PATCH /api/cards/{cardId}/practice`**
    *   **Method:** `PATCH`
    *   **Description:** Records the result of a practice trial and updates the card's bucket.
    *   **URL Parameter:** `{cardId}` (UUID of the card).
    *   **Request Body:**
        ```json
        {
          "difficulty": 0 | 1 | 2, // required (0=Wrong, 1=Hard, 2=Easy)
          "day": number // required (current learning day number)
        }
        ```
    *   **Logic:**
        1.  Validate input (`difficulty` is 0, 1, or 2; `day` is a non-negative integer).
        2.  Retrieve the card with `{cardId}` and its `currentBucket`. If not found, return 404.
        3.  Calculate `newBucket` based on `difficulty` and `currentBucket` (See Section 7.1).
        4.  Update the `bucket` and `updated_at` fields for the card in the `flashcards` table.
        5.  Insert a new record into `practice_history` table with `card_id`, `day`, and `difficulty`.
    *   **Response (Success):** `200 OK`.
    *   **Response (Error):** `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.

*   **`GET /api/stats`**
    *   **Method:** `GET`
    *   **Description:** Retrieves learning progress statistics.
    *   **Request Body:** None.
    *   **Logic:**
        1.  Calculate `totalCards` (count from `flashcards`).
        2.  Calculate `bucketCounts`: Aggregate counts for each bucket (0-5) from `flashcards`. Ensure the result array always has 6 elements, using 0 for empty buckets.
        3.  Calculate `totalSessions` (count from `practice_history`).
        4.  Calculate `easyCount` (count from `practice_history` where `difficulty = 2`).
        5.  Calculate `totalDifficultySum` (sum of `difficulty` from `practice_history`).
        6.  Calculate `correctPercentage = (totalSessions > 0) ? easyCount / totalSessions : 0`.
        7.  Calculate `averageDifficulty = (totalSessions > 0) ? totalDifficultySum / totalSessions : 0`.
    *   **Response (Success):** `200 OK` with JSON body:
        ```json
        {
          "totalCards": number,
          "bucketCounts": [number, number, number, number, number, number], // Counts for buckets 0-5
          "totalSessions": number,
          "correctPercentage": number, // Float 0.0 to 1.0
          "averageDifficulty": number // Float 0.0 to 2.0
        }
        ```
    *   **Response (Error):** `500 Internal Server Error`.

**5. Browser Extension Specification**

*   **Functionality:** Create flashcards from web content.
*   **Trigger:** User highlights text -> Clicks extension icon.
*   **UI (Popup):**
    *   `Front`: Text input. Required.
    *   `Back`: Text area. Pre-filled with highlighted text. Required.
    *   `Hint`: Text input. Optional.
    *   `Tags`: Text input (single field). User enters comma-separated values. Optional.
    *   `Save Card` Button.
    *   `Cancel` Button or `X` icon.
*   **Data Handling:**
    *   On `Save Card`:
        1.  Validate `Front` and `Back` are not empty.
        2.  Parse `Tags` input: split string by comma, trim whitespace from each resulting item, filter out empty strings.
        3.  Construct JSON payload: `{ front, back, hint, tags: parsedTagsArray }`.
        4.  Send `POST /api/cards` request with the payload.
*   **Interaction & Error Handling:**
    *   `Cancel`: Close popup, no action.
    *   `Save Card` Success: Close popup.
    *   `Save Card` Failure (API returns error or network issue): Display error message within popup (e.g., "Save failed. Check connection?"). Keep popup open with user input intact. Allow retry.

**6. Web Application Specification**

*   **Environment:** Single Page Application (SPA) served locally (e.g., via `http-server` or framework dev server).
*   **Target Browser:** Modern evergreen browsers (Chrome, Firefox).

    **6.1. Core Setup & State Management**
    *   **Learning Day Tracking:**
        *   Use browser `localStorage` to store the current learning `day` number (key: e.g., `learningDay`).
        *   On app load, retrieve `day` from `localStorage`. If not present or invalid, default to `0`.
        *   Increment `day` by 1 in `localStorage` only after a full practice session for that day concludes successfully (i.e., when "No more cards..." message is shown).

    **6.2. Main View (Card List)**
    *   **Initial Display:** Show a "Start Today's Practice" button and a section to display all flashcards.
    *   **Card Grid/List:**
        *   Fetch data using `GET /api/cards`.
        *   Display each card showing: `Front` text, `Back` text, `Tags` (display array nicely).
        *   Include a "Delete" button for each card.
    *   **Functionality:**
        *   `Delete` Button: Sends `DELETE /api/cards/{cardId}` request. On success, remove the card from the view (ideally without full page reload). Handle potential errors.
        *   `Start Today's Practice` Button: Initiates the Practice Session flow (Section 6.3).

    **6.3. Practice Session View & Flow**
    1.  **Initiation:** User clicks "Start Today's Practice".
    2.  **Fetch Queue:** Get current `day` from `localStorage`. Send `GET /api/practice-queue?day={day}`. Handle API errors gracefully (display message, halt session).
    3.  **Empty Queue Check:** If the returned queue array is empty, display "No more cards to practice today.", increment `day` in `localStorage`, end session.
    4.  **Display Card (Front):**
        *   Take the first card from the queue.
        *   Display its `Front` text prominently.
        *   Display active "Get Hint" and "Show Answer" buttons.
    5.  **Get Hint Action:**
        *   Hide the `Front` text.
        *   Generate the hint string on the frontend (See Section 7.2).
        *   Display the generated hint text (e.g., where the `Front` text was).
        *   Hide or disable the "Get Hint" button. "Show Answer" remains active.
    6.  **Show Answer Action:**
        *   Hide `Front`/`Hint` text and all buttons.
        *   Display the card's `Back` text.
        *   Initiate webcam/gesture recognition flow (See Section 6.4).
    7.  **Process Difficulty:** (Triggered by gesture success or manual button click)
        *   Get `difficulty` (0, 1, or 2) and current `day` from `localStorage`.
        *   Send `PATCH /api/cards/{cardId}/practice` with `{ difficulty, day }`.
        *   Handle API response:
            *   **Success:** Proceed to step 8.
            *   **Failure:** Initiate automatic retry mechanism (1-2 retries with short delay). Show user feedback ("Retrying..."). If retries fail, show persistent error ("Save failed, skipping card.") and proceed to step 8.
    8.  **Load Next Card:**
        *   Remove the just-practiced card from the local queue array.
        *   If queue is now empty, go to Step 3 (Empty Queue Check).
        *   If queue has more cards, go to Step 4 (Display Card (Front)) with the next card.

    **6.4. Hand Gesture Recognition**
    *   **Library:** TensorFlow.js Hand Pose Detection model (@tensorflow-models/hand-pose-detection).
    *   **Activation:** Request webcam permission *only* when "Show Answer" is clicked. Handle permission denial gracefully (may need to immediately show manual buttons).
    *   **UI:** When webcam is active, display simple icons/text explaining the gestures: Thumbs Down = Wrong, Flat Hand = Hard, Thumbs Up = Easy.
    *   **Detection Loop:**
        *   Once permission granted and model loaded, analyze webcam stream approx. 4 times per second (using `requestAnimationFrame` or `setInterval`).
        *   Process detection results to identify clear Thumbs Down, Flat Hand, or Thumbs Up poses. (Requires interpreting landmark positions to classify gestures).
        *   Map detected gesture to difficulty: Down->0, Flat->1, Up->2.
    *   **Triggering:** The *first frame* where a valid gesture is clearly detected immediately triggers the "Process Difficulty" step (6.3.7). Provide brief visual feedback (e.g., "Easy Detected!").
    *   **Timeout & Fallback:**
        1.  If no valid gesture detected for **5 seconds**: Show message "Gesture not detected. Try again." Keep webcam active & detection running.
        2.  If still no valid gesture detected within the *next* **5 seconds** (10 seconds total):
            *   Stop webcam feed and gesture analysis loop.
            *   Hide gesture instructions.
            *   Display manual buttons: "Wrong", "Hard", "Easy".
            *   Show message: "Couldn't detect gesture. Please select manually."
        3.  Manual button clicks directly trigger the "Process Difficulty" step (6.3.7) with the corresponding difficulty value.

    **6.5. Statistics View**
    *   **Navigation:** Provide a clear way to navigate to this view (e.g., "Stats" link).
    *   **Data Fetching:** On view load, send `GET /api/stats`. Handle potential API errors.
    *   **Display:** Present the statistics received from the API clearly:
        *   Total Cards
        *   Bucket Counts (e.g., as a bar chart or table showing counts for Buckets 0-5).
        *   Total Sessions Practiced
        *   Correct Percentage (e.g., as a percentage value).
        *   Average Difficulty (e.g., as a numerical value or simple rating).

**7. Core Algorithm Details**

    **7.1. Modified-Leitner Spaced Repetition**
    *   **Buckets:** 0 (New/Forgotten), 1, 2, 3, 4 (Active), 5 (Retired).
    *   **Scheduling Rule:** Practice cards in active bucket `i` (0-4) on day `d` if `d % (2^i) == 0`.
    *   **Bucket Update Logic (After Practice):**
        *   Input: `currentBucket`, `difficulty` (0, 1, or 2).
        *   Output: `newBucket`.
        *   If `difficulty == 0` (Wrong): `newBucket = 0`
        *   If `difficulty == 1` (Hard): `newBucket = min(5, currentBucket + 1)`
        *   If `difficulty == 2` (Easy): `newBucket = min(5, currentBucket + 2)`

    **7.2. Hint Generation (Frontend)**
    *   **Trigger:** User clicks "Get Hint" button during practice.
    *   **Input:** The current `Flashcard` object (containing `card.hint` and `card.back`).
    *   **Logic:**
        1.  `userHint = card.hint || ""` (Handle null/undefined hint).
        2.  `trimmedBack = card.back.trim()`
        3.  If `trimmedBack.length === 0`, return `userHint` (or a default message if `userHint` is also empty).
        4.  `firstChar = trimmedBack.charAt(0)`
        5.  `length = trimmedBack.length`
        6.  `generatedHint = "The answer starts with '${firstChar}' and has ${length} characters."`
        7.  Combine: If `userHint` exists, return `Hint: ${userHint}. ${generatedHint}`. Otherwise, return `Hint: ${generatedHint}`.
    *   **Output:** The final hint string to be displayed.

**8. Error Handling Summary**

*   **Browser Extension Save (`POST /api/cards`):** Show error in popup, retain input, allow retry.
*   **Web App Fetch Practice Queue (`GET /api/practice-queue`):** Show error message in practice area, halt session start.
*   **Web App Save Practice Result (`PATCH /api/cards/{cardId}/practice`):** Show temporary error, retry automatically (1-2 times), show permanent error on final failure, skip to next card.
*   **Web App Fetch All Cards (`GET /api/cards`):** Show error message in card list area.
*   **Web App Delete Card (`DELETE /api/cards/{cardId}`):** Show temporary error message (e.g., toast notification).
*   **Web App Fetch Stats (`GET /api/stats`):** Show error message in stats area.
*   **Webcam Permission Denied:** Fallback immediately to manual difficulty buttons during practice.

**9. Testing Plan**

*   **Unit Tests:**
    *   **Backend:**
        *   Test Modified-Leitner bucket calculation logic (`calculateNewBucket(currentBucket, difficulty)`).
        *   Test scheduling logic (`isCardDue(cardBucket, dayNumber)`).
        *   Test request validation logic for each API endpoint.
        *   Mock database interactions to test API route handlers individually.
    *   **Frontend (Web App):**
        *   Test hint generation logic (`generateHint(card)`).
        *   Test state management logic (retrieving/incrementing/saving `day` in `localStorage`).
        *   Test gesture-to-difficulty mapping.
        *   Test UI component rendering based on state (e.g., showing front/back/hint, buttons).
    *   **Frontend (Extension):**
        *   Test tag parsing logic (`parseTags(tagString)`).
        *   Test construction of API request body.

*   **Integration Tests:**
    *   **API Level:** Use a test database. Send HTTP requests to the running backend API for each endpoint and verify:
        *   Correct database state changes (e.g., card created, bucket updated, history logged, card deleted).
        *   Correct responses (status codes, data format, calculated stats).
        *   Correct filtering/selection for `/api/practice-queue`.
    *   **Component Level:**
        *   Test Browser Extension -> Backend API interaction (sending card data, handling success/failure).
        *   Test Web Application -> Backend API interaction for all API calls (fetching queue, fetching cards, deleting cards, posting practice results, fetching stats). Verify frontend state updates correctly based on API responses.

*   **End-to-End (E2E) Tests:**
    *   Use browser automation tools (e.g., Cypress, Playwright).
    *   Simulate full user flows:
        1.  Create card via Extension -> Verify card appears in Web App list -> Practice the card using manual input -> Verify bucket updates -> Verify stats update.
        2.  Practice session flow: Start -> See Front -> Get Hint -> Show Answer -> Use manual buttons (Wrong/Hard/Easy) -> Verify next card/session end -> Verify `day` increments.
    *   *(Difficult but valuable if possible):* Simulate gesture detection flow: Show Answer -> Trigger mock gesture detection (requires advanced test setup or manual assist) -> Verify difficulty sent -> Verify next card loads. Test timeout and fallback to manual buttons.

*   **Manual Testing:**
    *   **Usability:** Is the flow intuitive? Are error messages clear? Is the gesture feedback helpful?
    *   **UI/UX:** Check layout consistency, responsiveness (if applicable), button states, text visibility.
    *   **Gesture Recognition Robustness:** Test with different hand sizes, lighting conditions, backgrounds. Check responsiveness and accuracy of Thumbs Up/Down/Flat Hand detection. Test the timeout and fallback mechanism thoroughly.
    *   **Cross-Browser Testing:** Test Extension and Web App in target browsers (e.g., latest Chrome, Firefox).
    *   **Edge Cases:** Test with empty hints/tags, zero practice history, network interruptions during critical actions.

---

This specification provides a detailed blueprint. The developer should refer back to this document throughout the implementation process.