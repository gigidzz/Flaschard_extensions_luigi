# Flashcard Practice System - Updated Project Plan

**I. High-Level Blueprint**

1.  **Backend Foundation (API & Database):**
    *   Set up the Node.js/Express backend project.
    *   Configure Supabase client.
    *   Define database schema for flashcards with all necessary fields including points.
    *   Implement basic CRUD API endpoints for flashcards.
2.  **Backend Core Logic (Points & Practice System):**
    *   Implement the point accumulation logic for flashcards.
    *   Implement the practice queue logic (showing cards with less than 5 points).
    *   Implement the practice recording endpoint including point updates.
3.  **Web Application Foundation (Display & Core State):**
    *   Set up the frontend project (e.g., Vite + React/Vue/Svelte or Plain TS/JS).
    *   Implement basic UI layout (Nav, Main Content Area).
    *   Implement localStorage handling for the learning day.
    *   Implement an API client module for backend communication.
    *   Implement the Main View: Fetch and display the list of all flashcards (GET /api/flashcards), including delete functionality (DELETE /api/flashcards/...).
4.  **Web Application - Manual Practice Loop:**
    *   Implement the Practice View skeleton.
    *   Implement the "Start Practice" flow: fetch the practice queue (GET /api/practice-queue).
    *   Display card Front, then Back on button click.
    *   Implement *manual* difficulty buttons (Wrong/Hard/Easy).
    *   Wire manual buttons to the practice recording endpoint (PATCH /api/flashcards/update-difficulty).
    *   Implement the logic for advancing to the next card or ending the session.
5.  **Browser Extension (Creation Flow):**
    *   Set up the browser extension project (manifest, popup, content script).
    *   Implement the popup UI (HTML/CSS).
    *   Implement content script to get highlighted text.
    *   Implement message passing to pre-fill the 'Back' field in the popup.
    *   Implement popup logic: handle inputs, parse tags, handle Save/Cancel.
    *   Wire the 'Save' button to the backend (POST /api/flashcards), including error handling.
6.  **Web Application - Gesture Integration:**
    *   Integrate TensorFlow.js and Hand Pose Detection model.
    *   Implement webcam access request and feed display triggered by "Show Answer".
    *   Implement the gesture detection loop and classification logic (mapping landmarks to two fingers/Flat/Up).
    *   Replace manual buttons with gesture detection as the primary input method in the Practice View.
    *   Implement the timeout/fallback mechanism to show manual buttons if gestures fail.
7.  **Final Polish & Integration:**
    *   Review UI/UX consistency.
    *   Add loading indicators.
    *   Refine error messages.
    *   Comprehensive testing (Unit, Integration, E2E).

**II. Iterative Breakdown into Small, Testable Steps**

**Phase 1: Backend Foundation & Core Data**

1.  **Setup Backend & DB Connection:** Node.js/Express project, install dependencies (Express, Supabase client, cors), configure Supabase connection. Basic health check endpoint (/).
2.  **Define flashcards Schema:** Create the flashcards table in Supabase with fields for id, front, back, hint, tags, point (default 0), difficulty_level, created_at, updated_at.
3.  **Implement POST /api/flashcards:** Create the endpoint, validate input, insert into DB. Add basic integration test.
4.  **Implement GET /api/flashcards:** Create the endpoint, fetch all from DB. Add integration test.
5.  **Implement DELETE /api/flashcards/{cardId}:** Create the endpoint, delete from DB. Add integration test.

**Phase 2: Backend Points System Logic**

6.  **Implement Points Update Logic:** Create a testable utility function calculateNewPoints(currentPoints, difficulty) based on the spec: wrong → 0, hard → +1, easy → +2. Add unit tests.
7.  **Implement PATCH /api/flashcards/update-difficulty:** Create the endpoint, validate input, get current points from DB, calculate new points, update flashcards table. Add integration test covering DB changes.
8.  **Implement Practice Queue Logic:** Create a testable utility function that returns true for cards with points < 5. Add unit tests.
9.  **Implement GET /api/practice-queue:** Create the endpoint, query flashcards where points < 5. Add integration test.
10. **Implement GET /api/stats:** Create the endpoint, perform DB aggregations/calculations (total cards, learned cards with points >= 5, practicing cards with points < 5). Add integration test.
11. **Implement PATCH /api/flashcards/{cardId}/reset:** Create endpoint to reset a card's points to 0 to make it practicable again. Add integration test.

**Phase 3: Web App Foundation & Card Listing**

12. **Setup Frontend Project:** Initialize Vite (or similar) with TypeScript. Basic HTML structure.
13. **Implement API Client:** Create a module/service to handle fetch requests to the backend API endpoints (error handling basics included).
14. **Implement localStorage Day Service:** Create a module to get/set/increment the learningDay in localStorage. Add unit tests.
15. **Implement Main View Component:** Create the component. Add "Start Practice" button (non-functional initially).
16. **Fetch & Display Card List:** Use the API client in the Main View to call GET /api/flashcards and display the results (Front, Back, Tags, Points).
17. **Implement Delete Card Functionality:** Add Delete buttons to the list, wire them to call DELETE /api/flashcards/{cardId} via the API client, update the UI on success.
18. **Implement Reset Card Functionality:** Add Reset buttons to the list for cards with points >= 5, wire them to call PATCH /api/flashcards/{cardId}/reset, update the UI on success.

**Phase 4: Web App - Manual Practice Loop**

19. **Implement Practice View Component Skeleton:** Create the component, basic layout for card display area.
20. **Implement "Start Practice" Flow:** Wire the button in Main View to navigate to Practice View. On Practice View load, get day from localStorage, call GET /api/practice-queue via API client. Handle empty queue (show message, navigate back).
21. **Display Card Front/Back:** Display the front of the first card from the queue. Implement "Show Answer" button to reveal the back. Hide "Show Answer" after click.
22. **Implement Manual Difficulty Buttons:** Add "Wrong", "Hard", "Easy" buttons, initially hidden, revealed after "Show Answer".
23. **Wire Manual Buttons to Backend:** On button click, get difficulty, call PATCH /api/flashcards/update-difficulty via API client. Implement retry logic on failure.
24. **Implement Next Card/Session End Logic:** On successful PATCH response, remove card from local queue. If queue empty, show "Session Complete", navigate back. If not empty, display the front of the next card.

**Phase 5: Web App - Stats & Hints**

25. **Implement Stats View Component:** Create the component.
26. **Fetch & Display Stats:** Use API client to call GET /api/stats and display the results (total cards, learned cards, practicing cards).
27. **Implement Frontend Hint Function:** Create a testable utility function generateHint(card) as per spec. Add unit tests.
28. **Integrate Hints in Practice View:** Add "Get Hint" button. Wire it to call generateHint and display the result. Hide "Get Hint" button after use. Ensure "Show Answer" remains available.

**Phase 6: Browser Extension**

29. **Setup Extension Project:** Create manifest.json, popup files (HTML/CSS/JS), content script JS. Configure basic permissions (activeTab, storage, scripting).
30. **Implement Content Script & Message Passing:** Content script gets window.getSelection(). Background script listens for extension icon click, injects content script, receives selection via message passing.
31. **Implement Popup UI & Pre-fill:** Populate popup fields (pre-fill 'Back' with message from background/content script). Implement basic input handling.
32. **Implement Save Logic:** Add 'Save' button handler. Parse tags. Construct JSON payload.
33. **Wire Save to Backend:** Call POST /api/flashcards from popup using fetch. Handle success (close popup) and error (show message in popup). Implement 'Cancel' button.

**Phase 7: Web App - Gesture Integration**

34. **Install & Setup TFJS:** Add TensorFlow.js dependencies (@tensorflow/tfjs, @tensorflow-models/hand-pose-detection).
35. **Implement Webcam Service:** Create module to handle getUserMedia, attach stream to <video> element, handle permissions.
36. **Integrate Webcam Activation:** In Practice View, call Webcam Service on "Show Answer". Display video feed. Load Hand Pose model.
37. **Implement Gesture Classification:** Create utility function classifyGesture(landmarks) mapping key landmark positions to Down/Flat/Up/None. Add basic tests if possible (mock landmarks).
38. **Implement Detection Loop:** Start analyzing video feed with the Hand Pose model repeatedly (e.g., requestAnimationFrame). Call classifyGesture.
39. **Wire Gestures to Practice Logic:** If a valid gesture (Down/Flat/Up) is detected, map it to difficulty (0/1/2), trigger the PATCH request logic, stop detection for this card. Display feedback ("Easy detected!"). Hide manual buttons initially.
40. **Implement Timeout/Fallback:** Add timers. After 5s without detection, show "Try again". After 10s, stop webcam/detection, hide gesture instructions, show manual buttons.

**Phase 8: Final Polish**

41. **Refine UI & Add Loading States:** Improve CSS, add spinners/indicators during API calls.
42. **Review Error Handling:** Ensure all error paths provide clear user feedback.
43. **Comprehensive Testing:** Fill gaps in Unit, Integration, and E2E tests. Manual testing across browsers.

**III. Key Changes from Original Specification**

1. **Points System Instead of Leitner Algorithm:**
   - Flashcards start with 0 points
   - Wrong answer: points = 0
   - Hard answer: points += 1
   - Easy answer: points += 2
   - Card is considered "learned" when points >= 5
   - Cards can be reset to 0 points to practice again

2. **Database Structure:**
   - Single flashcards table instead of separate tables
   - No practice_history table needed
   - Fields include: id, front, back, hint, tags, point, difficulty_level, etc.

3. **API Endpoints:**
   - Changed /api/cards to /api/flashcards for clarity
   - PATCH /api/flashcards/update-difficulty handles point updates
   - Added PATCH /api/flashcards/{cardId}/reset to make learned cards practicable again
   - GET /api/practice-queue returns cards with points < 5

4. **Practice Logic:**
   - Practice queue includes all cards with points < 5
   - No day-based scheduling (all practicable cards are shown)
   - Learning progress tracked by points, not by buckets

This project plan maintains the core functionality and user experience while adapting to the simplified points-based system rather than the Leitner algorithm.