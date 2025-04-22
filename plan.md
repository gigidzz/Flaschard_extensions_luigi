**I. High-Level Blueprint**

1.  **Backend Foundation (API & Database):**
    *   Set up the Node.js/Express backend project.
    *   Configure Supabase client.
    *   Define and migrate database schemas (`flashcards`, `practice_history`).
    *   Implement basic CRUD API endpoints for `flashcards`.
2.  **Backend Core Logic (Spaced Repetition & Stats):**
    *   Implement the Modified-Leitner bucket update logic.
    *   Implement the practice queue scheduling logic.
    *   Implement the practice recording endpoint (`PATCH /api/cards/.../practice`) including history logging.
    *   Implement the statistics calculation endpoint (`GET /api/stats`).
3.  **Web Application Foundation (Display & Core State):**
    *   Set up the frontend project (e.g., Vite + React/Vue/Svelte or Plain TS/JS).
    *   Implement basic UI layout (Nav, Main Content Area).
    *   Implement `localStorage` handling for the learning `day`.
    *   Implement an API client module for backend communication.
    *   Implement the Main View: Fetch and display the list of all flashcards (`GET /api/cards`), including delete functionality (`DELETE /api/cards/...`).
4.  **Web Application - Manual Practice Loop:**
    *   Implement the Practice View skeleton.
    *   Implement the "Start Practice" flow: fetch the practice queue (`GET /api/practice-queue`).
    *   Display card Front, then Back on button click.
    *   Implement *manual* difficulty buttons (Wrong/Hard/Easy).
    *   Wire manual buttons to the practice recording endpoint (`PATCH /api/cards/.../practice`), including error handling (retries) and history logging trigger.
    *   Implement the logic for advancing to the next card or ending the session (updating `day` in `localStorage`).
5.  **Web Application - Enhancements (Stats & Hints):**
    *   Implement the Stats View: Fetch (`GET /api/stats`) and display statistics.
    *   Implement the frontend hint generation logic.
    *   Integrate the "Get Hint" button and display logic into the Practice View.
6.  **Browser Extension (Creation Flow):**
    *   Set up the browser extension project (manifest, popup, content script).
    *   Implement the popup UI (HTML/CSS).
    *   Implement content script to get highlighted text.
    *   Implement message passing to pre-fill the 'Back' field in the popup.
    *   Implement popup logic: handle inputs, parse tags, handle Save/Cancel.
    *   Wire the 'Save' button to the backend (`POST /api/cards`), including error handling.
7.  **Web Application - Gesture Integration:**
    *   Integrate TensorFlow.js and Hand Pose Detection model.
    *   Implement webcam access request and feed display triggered by "Show Answer".
    *   Implement the gesture detection loop and classification logic (mapping landmarks to Down/Flat/Up).
    *   Replace manual buttons with gesture detection as the primary input method in the Practice View.
    *   Implement the timeout/fallback mechanism to show manual buttons if gestures fail.
8.  **Final Polish & Integration:**
    *   Review UI/UX consistency.
    *   Add loading indicators.
    *   Refine error messages.
    *   Comprehensive testing (Unit, Integration, E2E).

**II. Iterative Breakdown into Small, Testable Steps**

*(This refines the blueprint above into more granular actions suitable for prompts)*

**Phase 1: Backend Foundation & Core Data**

1.  **Setup Backend & DB Connection:** Node.js/Express project, install dependencies (Express, pg/Supabase client, cors), configure Supabase connection. Basic health check endpoint (`/`).
2.  **Define `flashcards` Schema:** Create SQL/migration script for the `flashcards` table as defined in the spec. Apply it via Supabase UI or CLI.
3.  **Implement `POST /api/cards`:** Create the endpoint, validate input, insert into DB. Add basic integration test.
4.  **Implement `GET /api/cards`:** Create the endpoint, fetch all from DB. Add integration test.
5.  **Implement `DELETE /api/cards/{cardId}`:** Create the endpoint, delete from DB. Add integration test.

**Phase 2: Backend Spaced Repetition Logic**

6.  **Define `practice_history` Schema:** Create SQL/migration script for `practice_history` table. Apply it.
7.  **Implement Bucket Update Logic:** Create a testable utility function `calculateNewBucket(currentBucket, difficulty)` based on the spec. Add unit tests.
8.  **Implement `PATCH /api/cards/{cardId}/practice`:** Create the endpoint, validate input, use `calculateNewBucket`, update `flashcards` table, *and* insert into `practice_history`. Add integration test covering DB changes.
9.  **Implement Scheduling Logic:** Create a testable utility function `isCardDue(cardBucket, dayNumber)`. Add unit tests.
10. **Implement `GET /api/practice-queue`:** Create the endpoint, query `flashcards` using `isCardDue` logic. Add integration test.
11. **Implement `GET /api/stats`:** Create the endpoint, perform DB aggregations/calculations as per spec. Add integration test.

**Phase 3: Web App Foundation & Card Listing**

12. **Setup Frontend Project:** Initialize Vite (or similar) with TypeScript (React/Vue/Svelte optional). Basic HTML structure.
13. **Implement API Client:** Create a module/service to handle fetch requests to the backend API endpoints (error handling basics included).
14. **Implement `localStorage` Day Service:** Create a module to get/set/increment the `learningDay` in `localStorage`. Add unit tests.
15. **Implement Main View Component:** Create the component. Add "Start Practice" button (non-functional initially).
16. **Fetch & Display Card List:** Use the API client in the Main View to call `GET /api/cards` and display the results (Front, Back, Tags).
17. **Implement Delete Card Functionality:** Add Delete buttons to the list, wire them to call `DELETE /api/cards/{cardId}` via the API client, update the UI on success.

**Phase 4: Web App - Manual Practice Loop**

18. **Implement Practice View Component Skeleton:** Create the component, basic layout for card display area.
19. **Implement "Start Practice" Flow:** Wire the button in Main View to navigate to Practice View. On Practice View load, get `day` from `localStorage`, call `GET /api/practice-queue` via API client. Handle empty queue (show message, increment day, navigate back).
20. **Display Card Front/Back:** Display the front of the first card from the queue. Implement "Show Answer" button to reveal the back. Hide "Show Answer" after click.
21. **Implement Manual Difficulty Buttons:** Add "Wrong", "Hard", "Easy" buttons, initially hidden, revealed after "Show Answer".
22. **Wire Manual Buttons to Backend:** On button click, get `difficulty` and `day`, call `PATCH /api/cards/{cardId}/practice` via API client. Implement retry logic on failure as specified.
23. **Implement Next Card/Session End Logic:** On successful PATCH response, remove card from local queue. If queue empty, show "Session Complete", increment `day`, navigate back. If not empty, display the front of the next card.

**Phase 5: Web App - Stats & Hints**

24. **Implement Stats View Component:** Create the component.
25. **Fetch & Display Stats:** Use API client to call `GET /api/stats` and display the results.
26. **Implement Frontend Hint Function:** Create a testable utility function `generateHint(card)` as per spec. Add unit tests.
27. **Integrate Hints in Practice View:** Add "Get Hint" button. Wire it to call `generateHint` and display the result. Hide "Get Hint" button after use. Ensure "Show Answer" remains available.

**Phase 6: Browser Extension**

28. **Setup Extension Project:** Create `manifest.json`, popup files (HTML/CSS/JS), content script JS. Configure basic permissions (activeTab, storage, scripting).
29. **Implement Content Script & Message Passing:** Content script gets `window.getSelection()`. Background script listens for extension icon click, injects content script, receives selection via message passing.
30. **Implement Popup UI & Pre-fill:** Populate popup fields (pre-fill 'Back' with message from background/content script). Implement basic input handling.
31. **Implement Save Logic:** Add 'Save' button handler. Parse tags. Construct JSON payload.
32. **Wire Save to Backend:** Call `POST /api/cards` from popup using `fetch`. Handle success (close popup) and error (show message in popup). Implement 'Cancel' button.

**Phase 7: Web App - Gesture Integration**

33. **Install & Setup TFJS:** Add TensorFlow.js dependencies (`@tensorflow/tfjs`, `@tensorflow-models/hand-pose-detection`).
34. **Implement Webcam Service:** Create module to handle `getUserMedia`, attach stream to `<video>` element, handle permissions.
35. **Integrate Webcam Activation:** In Practice View, call Webcam Service on "Show Answer". Display video feed. Load Hand Pose model.
36. **Implement Gesture Classification:** Create utility function `classifyGesture(landmarks)` mapping key landmark positions to Down/Flat/Up/None. Add basic tests if possible (mock landmarks).
37. **Implement Detection Loop:** Start analyzing video feed with the Hand Pose model repeatedly (e.g., `requestAnimationFrame`). Call `classifyGesture`.
38. **Wire Gestures to Practice Logic:** If a valid gesture (Down/Flat/Up) is detected, map it to difficulty (0/1/2), trigger the `PATCH` request logic (Step 22), stop detection for this card. Display feedback ("Easy detected!"). Hide manual buttons initially.
39. **Implement Timeout/Fallback:** Add timers. After 5s without detection, show "Try again". After 10s, stop webcam/detection, hide gesture instructions, show manual buttons.

**Phase 8: Final Polish**

40. **Refine UI & Add Loading States:** Improve CSS, add spinners/indicators during API calls.
41. **Review Error Handling:** Ensure all error paths provide clear user feedback.
42. **Comprehensive Testing:** Fill gaps in Unit, Integration, and E2E tests based on the testing plan. Manual testing across browsers.

**III. LLM Prompts for Implementation**

Here are the prompts designed for a code-generation LLM, building incrementally and emphasizing testing.

---
**Context:** We are starting the backend for the Gesture Flashcards project using Node.js, Express, and Supabase (Postgres).

```text
# Prompt 1: Backend Setup & DB Connection

**Goal:** Initialize the Node.js/Express backend project and establish a connection to Supabase.

**Requirements:**
1.  Create a new Node.js project (`npm init`).
2.  Install necessary dependencies: `express`, `cors`, `pg` (or `@supabase/supabase-js` if using their JS client directly), `dotenv`.
3.  Set up a basic Express server in `server.js` (or `index.js`).
4.  Enable CORS using the `cors` middleware.
5.  Configure Supabase connection details using environment variables (`.env` file for `SUPABASE_URL`, `SUPABASE_KEY` or Postgres connection string). Load these using `dotenv`.
6.  Create a Supabase client instance (or a `pg` Pool) and export it from a dedicated config module (e.g., `db.js` or `supabaseClient.js`).
7.  Add a simple health check endpoint (`GET /`) that returns a 200 OK status and a JSON message like `{"status": "ok"}`.
8.  Include basic error handling middleware for Express.
9.  Add a `start` script in `package.json` (e.g., `node server.js`).

**Testing:** No automated tests needed for this step, but ensure the server starts (`npm start`) and the health check endpoint is accessible via browser or `curl`. Ensure environment variables are loaded correctly.
```

---
**Context:** We have the basic backend server running. Now, let's define the `flashcards` table in Supabase.

```text
# Prompt 2: Define `flashcards` Schema (SQL)

**Goal:** Provide the SQL script to create the `flashcards` table in Supabase/Postgres according to the specification.

**Requirements:**
1.  Write a `CREATE TABLE` SQL statement for the `flashcards` table.
2.  Include all specified columns: `id` (UUID, PK, default gen_random_uuid()), `front` (TEXT, NOT NULL), `back` (TEXT, NOT NULL), `hint` (TEXT, NULL), `tags` (TEXT[], NOT NULL, default '{}'), `bucket` (INTEGER, NOT NULL, default 0), `created_at` (TIMESTAMPTZ, NOT NULL, default NOW()), `updated_at` (TIMESTAMPTZ, NOT NULL, default NOW()).
3.  (Optional but Recommended) Include SQL to enable the `uuid-ossp` extension if `gen_random_uuid()` is used.
4.  (Optional but Recommended) Include SQL to create a trigger function that automatically updates `updated_at` whenever a row in `flashcards` is modified.

**Testing:** This SQL script will be applied manually via the Supabase SQL Editor or saved as a migration file. Verify the table structure in the Supabase UI after application.
```

---
**Context:** The `flashcards` table exists. Let's implement the API endpoint to create new flashcards. We will use Test-Driven Development (TDD) principles for the backend logic where feasible.

```text
# Prompt 3: Implement `POST /api/cards` Endpoint

**Goal:** Create the backend API endpoint to add a new flashcard to the database.

**Requirements:**
1.  Create an API route file (e.g., `routes/cards.js`) and mount it in `server.js` under the `/api/cards` path.
2.  Implement the `POST /` handler within this route file.
3.  Import the DB/Supabase client.
4.  Validate the request body: ensure `front` and `back` properties exist and are non-empty strings. Return a 400 error if validation fails.
5.  If valid, construct the SQL `INSERT` statement (or use the Supabase client method) to add a new row to the `flashcards` table. Use the provided `front`, `back`, `hint`, `tags`, and set the default `bucket` to 0.
6.  Handle potential database errors during insertion (return 500 error).
7.  If successful, return a 201 status code and the newly created card object (including its generated `id` and timestamps) in the JSON response body.

**Testing:**
1.  Create an integration test file (e.g., using Jest and Supertest).
2.  Write tests for the `POST /api/cards` endpoint:
    *   Test successful card creation (201 status, correct response body). Verify the card exists in the (test) database afterward.
    *   Test validation errors (400 status) for missing `front` or `back`.
    *   Test handling of optional `hint` and `tags` (including empty tags array).
```

---
**Context:** Users can now create cards. Let's add the endpoint to retrieve all existing flashcards.

```text
# Prompt 4: Implement `GET /api/cards` Endpoint

**Goal:** Create the backend API endpoint to retrieve all flashcards.

**Requirements:**
1.  In the `routes/cards.js` file, implement the `GET /` handler.
2.  Import the DB/Supabase client.
3.  Construct the SQL `SELECT * FROM flashcards` statement (or use the Supabase client method). Order results predictably (e.g., by `created_at`).
4.  Handle potential database errors (return 500 error).
5.  If successful, return a 200 status code and a JSON array containing all flashcard objects in the response body. Return an empty array `[]` if no cards exist.

**Testing:**
1.  Add integration tests to the existing test file:
    *   Test retrieving an empty list when the DB is empty.
    *   Test retrieving a list of multiple cards after creating them via the POST endpoint. Verify the structure and content of the returned array.
```

---
**Context:** We need the ability to delete flashcards.

```text
# Prompt 5: Implement `DELETE /api/cards/{cardId}` Endpoint

**Goal:** Create the backend API endpoint to delete a specific flashcard.

**Requirements:**
1.  In `routes/cards.js`, implement the `DELETE /:cardId` handler (using Express route parameters).
2.  Import the DB/Supabase client.
3.  Extract the `cardId` from `req.params`. Validate it's a valid UUID format (optional but good practice).
4.  Construct the SQL `DELETE FROM flashcards WHERE id = $1` statement (or use the Supabase client method).
5.  Check the result of the delete operation to see if a row was actually deleted. If not (e.g., ID didn't exist), return a 404 status.
6.  Handle potential database errors (return 500 error).
7.  If successful (row deleted), return a 204 status code with no content in the response body.

**Testing:**
1.  Add integration tests:
    *   Test deleting an existing card (create one first). Verify the 204 status and that the card is gone from the DB.
    *   Test deleting a non-existent card ID (should return 404).
    *   Test deleting with an invalid ID format (optional, might return 500 from DB or 400 if validated).
```

---
**Context:** Now moving to the core Spaced Repetition logic. First, define the `practice_history` table.

```text
# Prompt 6: Define `practice_history` Schema (SQL)

**Goal:** Provide the SQL script to create the `practice_history` table.

**Requirements:**
1.  Write a `CREATE TABLE` SQL statement for the `practice_history` table.
2.  Include all specified columns: `id` (UUID, PK, default gen_random_uuid()), `card_id` (UUID, NOT NULL, FK referencing `flashcards.id`), `day` (INTEGER, NOT NULL), `difficulty` (INTEGER, NOT NULL), `practiced_at` (TIMESTAMPTZ, NOT NULL, default NOW()).
3.  Specify the Foreign Key constraint (`REFERENCES flashcards(id)`).
4.  Set the `ON DELETE` behavior for the foreign key (Recommended: `ON DELETE CASCADE` so history is removed when a card is deleted).

**Testing:** Apply manually via Supabase SQL Editor or save as migration. Verify table structure and foreign key constraint in Supabase UI.
```

---
**Context:** We need the logic to calculate the next bucket based on practice difficulty. This should be a pure, testable function.

```text
# Prompt 7: Implement Bucket Update Logic Utility Function

**Goal:** Create and test a standalone JavaScript/TypeScript function to calculate the next bucket.

**Requirements:**
1.  Create a utility file (e.g., `utils/leitner.js`).
2.  Implement a function `calculateNewBucket(currentBucket, difficulty)` that takes the current bucket number (0-5) and difficulty (0, 1, or 2) as input.
3.  Implement the logic based on the specification:
    *   difficulty 0 (Wrong) -> returns 0
    *   difficulty 1 (Hard) -> returns min(5, currentBucket + 1)
    *   difficulty 2 (Easy) -> returns min(5, currentBucket + 2)
4.  Handle potential edge cases or invalid inputs gracefully (e.g., return currentBucket if inputs are unexpected, though API validation should prevent this).

**Testing:**
1.  Create a unit test file (e.g., `utils/leitner.test.js`) using Jest.
2.  Write unit tests covering all combinations of valid `currentBucket` (0-5) and `difficulty` (0, 1, 2), including boundary conditions (e.g., moving into/within the retired bucket 5).
```

---
**Context:** With the bucket logic ready, implement the endpoint for recording practice attempts.

```text
# Prompt 8: Implement `PATCH /api/cards/{cardId}/practice` Endpoint

**Goal:** Create the API endpoint to record practice results, update the card's bucket, and log history.

**Requirements:**
1.  In `routes/cards.js`, implement the `PATCH /:cardId/practice` handler.
2.  Import the DB client and the `calculateNewBucket` utility function.
3.  Extract `cardId` from `req.params`.
4.  Validate the request body: ensure `difficulty` (0, 1, or 2) and `day` (non-negative integer) exist. Return 400 on failure.
5.  **Transaction:** Perform the following database operations within a single transaction if possible (using `BEGIN`/`COMMIT` in SQL or Supabase client transaction features):
    a.  Fetch the card with `cardId` from `flashcards` to get its `currentBucket`. Return 404 if not found.
    b.  Calculate the `newBucket` using `calculateNewBucket(currentBucket, difficulty)`.
    c.  Update the `flashcards` table: set `bucket = newBucket` and update `updated_at` for the given `cardId`.
    d.  Insert a new record into the `practice_history` table with `card_id`, `day`, and `difficulty`.
6.  Handle potential database errors (rollback transaction, return 500).
7.  If successful, commit the transaction and return a 200 OK status (response body can be empty or confirm success).

**Testing:**
1.  Add integration tests:
    *   Test successful practice recording for Wrong/Hard/Easy difficulties starting from different buckets. Verify the `flashcards.bucket` is updated correctly *and* a corresponding record exists in `practice_history`.
    *   Test 404 response for non-existent `cardId`.
    *   Test 400 response for invalid `difficulty` or `day` in the request body.
    *   (Advanced) Test transaction rollback if one part fails (e.g., history insert fails after bucket update attempt).
```

---
**Context:** We need the logic to determine if a card is due for practice on a given day.

```text
# Prompt 9: Implement Scheduling Logic Utility Function

**Goal:** Create and test a standalone function to check if a card is due for practice.

**Requirements:**
1.  In the utility file (`utils/leitner.js`), implement a function `isCardDue(cardBucket, dayNumber)`.
2.  Implement the logic based on the specification:
    *   Return `false` if `cardBucket` is 5 (retired) or invalid (< 0).
    *   Return `true` if `dayNumber % (2 ** cardBucket) === 0`.
    *   Return `false` otherwise.

**Testing:**
1.  Add unit tests to `utils/leitner.test.js`:
    *   Test various combinations of `cardBucket` (0-5) and `dayNumber` (0, 1, 2, 3, 4, 7, 8, 15, 16, etc.) to cover the modulo logic (`2^0=1`, `2^1=2`, `2^2=4`, `2^3=8`, `2^4=16`).
    *   Ensure it correctly returns `false` for bucket 5.
```

---
**Context:** Implement the API endpoint to fetch the cards scheduled for practice today.

```text
# Prompt 10: Implement `GET /api/practice-queue` Endpoint

**Goal:** Create the API endpoint to get the list of flashcards due for practice.

**Requirements:**
1.  In `routes/cards.js` (or a new `routes/practice.js`), implement the `GET /practice-queue` handler (or `/api/practice-queue` if using a separate file).
2.  Import the DB client and the `isCardDue` utility function.
3.  Validate the `day` query parameter (`req.query.day`): ensure it exists and is a non-negative integer. Return 400 on failure.
4.  Fetch *all* cards from the `flashcards` table where `bucket` is between 0 and 4 (inclusive).
5.  Filter the fetched cards *in the backend code* using the `isCardDue(card.bucket, day)` function.
6.  Handle potential database errors (return 500).
7.  If successful, return a 200 OK status with a JSON array containing the full card objects for the filtered, due cards. Return `[]` if no cards are due.

**Testing:**
1.  Add integration tests:
    *   Setup cards in various buckets (0, 1, 2, 3, 4, 5).
    *   Test `GET /api/practice-queue?day=X` for different values of X (e.g., 0, 1, 2, 3, 4, 8, 16). Verify that only the correctly scheduled cards (and not retired ones) are returned.
    *   Test with an empty database (should return `[]`).
    *   Test 400 response for missing or invalid `day` parameter.
```

---
**Context:** Implement the final backend endpoint to calculate and return learning statistics.

```text
# Prompt 11: Implement `GET /api/stats` Endpoint

**Goal:** Create the API endpoint to calculate and return learning statistics.

**Requirements:**
1.  In `routes/cards.js` (or a new `routes/stats.js`), implement the `GET /stats` handler.
2.  Import the DB client.
3.  Perform necessary database queries/aggregations:
    *   `SELECT count(*) AS "totalCards" FROM flashcards;`
    *   Aggregate counts per bucket (0-5). Handle potential missing buckets (should report 0 count). A `GROUP BY bucket` query combined with post-processing might be needed to ensure all 6 buckets are represented.
    *   `SELECT count(*) AS "totalSessions", sum(difficulty) AS "totalDifficultySum", count(*) FILTER (WHERE difficulty = 2) AS "easyCount" FROM practice_history;`
4.  Calculate `correctPercentage` and `averageDifficulty` based on the aggregated history results (handle division by zero if `totalSessions` is 0).
5.  Format the `bucketCounts` into a 6-element array (index 0 = bucket 0 count, ..., index 5 = bucket 5 count).
6.  Handle potential database errors (return 500).
7.  Return a 200 OK status with the specified JSON structure in the response body: `{ totalCards, bucketCounts, totalSessions, correctPercentage, averageDifficulty }`.

**Testing:**
1.  Add integration tests:
    *   Test with an empty database (all stats should be 0, `bucketCounts` should be `[0,0,0,0,0,0]`).
    *   Create cards, log some practice history with varying difficulties using the PATCH endpoint.
    *   Test `GET /api/stats` and verify that all calculated values match expectations based on the setup data. Ensure `bucketCounts` has 6 elements.
```

**(Continue with prompts for Frontend Setup, Card Listing, Manual Practice, Stats/Hints, Extension, Gesture Integration, Polish following the same pattern: state the goal, list requirements, specify testing strategy, build upon previous steps.)**

This structure provides clear, incremental steps with integrated testing, suitable for guiding an LLM or a human developer through the implementation.