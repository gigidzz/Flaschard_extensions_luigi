This checklist breaks down the project into manageable steps based on the development plan. Check items off as they are completed and tested.

## Phase 1: Backend Foundation & Core Data

- [ ] Initialize Node.js/Express backend project (server, CORS, .env).
- [ ] Configure and test Supabase/Postgres connection.
- [ ] Write and apply SQL migration for `flashcards` table.
- [ ] Implement `POST /api/cards` endpoint (validation, DB insert).
- [ ] Write integration tests for `POST /api/cards` (success, validation errors).
- [ ] Implement `GET /api/cards` endpoint (DB fetch).
- [ ] Write integration tests for `GET /api/cards` (empty, populated list).
- [ ] Implement `DELETE /api/cards/:cardId` endpoint (DB delete, 404 handling).
- [ ] Write integration tests for `DELETE /api/cards/:cardId` (success, 404).

## Phase 2: Backend Spaced Repetition Logic

- [ ] Write and apply SQL migration for `practice_history` table (with FK and ON DELETE CASCADE).
- [ ] Implement `calculateNewBucket` utility function in `utils/leitner.js`.
- [ ] Write unit tests for `calculateNewBucket` covering all cases.
- [ ] Implement `PATCH /api/cards/:cardId/practice` endpoint (validation, bucket update, history log, transaction).
- [ ] Write integration tests for `PATCH .../practice` (success, 404, validation, DB changes).
- [ ] Implement `isCardDue` utility function in `utils/leitner.js`.
- [ ] Write unit tests for `isCardDue` covering all bucket/day cases.
- [ ] Implement `GET /api/practice-queue` endpoint (query param validation, filtering using `isCardDue`).
- [ ] Write integration tests for `GET /api/practice-queue` (various days, buckets, empty state, validation).
- [ ] Implement `GET /api/stats` endpoint (DB aggregation, calculations).
- [ ] Write integration tests for `GET /api/stats` (empty DB, populated DB, correct calculations).

## Phase 3: Web App Foundation & Card Listing

- [ ] Initialize Frontend project (Vite+TS or similar). Basic HTML/CSS structure.
- [ ] Create Frontend API client module/service for backend communication (include basic error handling).
- [ ] Create Frontend service for managing `learningDay` in `localStorage`.
- [ ] Write unit tests for `localStorage` service.
- [ ] Create Main View component structure (e.g., React component, HTML template).
- [ ] Add non-functional "Start Practice" button to Main View.
- [ ] Implement fetching (`GET /api/cards`) and displaying the card list in Main View.
- [ ] Add Delete buttons to card list items.
- [ ] Wire Delete buttons to `DELETE /api/cards/:cardId` via API client and update UI.

## Phase 4: Web App - Manual Practice Loop

- [ ] Create Practice View component structure.
- [ ] Implement navigation from Main View to Practice View.
- [ ] Fetch practice queue (`GET /api/practice-queue`) on Practice View load.
- [ ] Handle empty queue case (message, increment day, navigate back).
- [ ] Display Front text of the current card.
- [ ] Implement "Show Answer" button logic to reveal Back text and hide button.
- [ ] Add "Wrong", "Hard", "Easy" buttons (initially hidden after "Show Answer").
- [ ] Implement logic for manual buttons to call `PATCH .../practice` via API client.
- [ ] Implement specified retry logic for failed PATCH requests.
- [ ] Implement logic to advance to the next card in the queue.
- [ ] Implement logic for session end (message, increment day, navigate back).

## Phase 5: Web App - Stats & Hints

- [ ] Create Stats View component structure.
- [ ] Implement fetching (`GET /api/stats`) and displaying statistics in Stats View.
- [ ] Create Frontend `generateHint(card)` utility function.
- [ ] Write unit tests for `generateHint`.
- [ ] Add "Get Hint" button to Practice View.
- [ ] Wire "Get Hint" button to display generated hint and hide itself.

## Phase 6: Browser Extension

- [ ] Create Browser Extension project structure (`manifest.json`, popup, content script).
- [ ] Implement content script to get text selection.
- [ ] Implement background script logic for icon click and message passing (selection -> popup).
- [ ] Implement Popup HTML/CSS.
- [ ] Implement JS to receive selection message and pre-fill 'Back' field in popup.
- [ ] Implement Popup JS to read inputs, parse tags.
- [ ] Implement 'Save' button logic to call `POST /api/cards` using `fetch`.
- [ ] Implement 'Cancel' button logic.
- [ ] Implement error handling display within the popup on API failure.

## Phase 7: Web App - Gesture Integration

- [ ] Add TFJS dependencies (`@tensorflow/tfjs`, `@tensorflow-models/hand-pose-detection`) to Frontend project.
- [ ] Create Frontend service/module for webcam access (`getUserMedia`, video stream).
- [ ] Trigger webcam service and display video feed on "Show Answer" click.
- [ ] Load TFJS Hand Pose model.
- [ ] Create utility function `classifyGesture(landmarks)` to identify Down/Flat/Up/None.
- [ ] (Optional) Write basic tests for `classifyGesture` with mock landmarks.
- [ ] Implement loop (`requestAnimationFrame`) to analyze video feed with the model and call `classifyGesture`.
- [ ] If valid gesture detected, map to difficulty and trigger `PATCH .../practice` logic.
- [ ] Provide visual feedback on gesture detection (e.g., "Easy Detected!").
- [ ] Hide manual buttons when gesture detection is active.
- [ ] Implement 5s/10s timers for gesture detection.
- [ ] Implement fallback logic: stop webcam/detection, show manual buttons after 10s timeout.

## Phase 8: Final Polish & Testing

- [ ] Add loading indicators for API calls in Frontend.
- [ ] Review and refine CSS/styling for consistency across Web App and Extension Popup.
- [ ] Test and refine error message clarity and display across all error paths (Backend, Frontend, Extension).
- [ ] Perform E2E testing scenarios (create->practice->stats).
- [ ] Perform manual testing (usability, gestures under different conditions, cross-browser checks).
- [ ] Review and augment Unit/Integration tests coverage as needed.
- [ ] Code cleanup and documentation review.