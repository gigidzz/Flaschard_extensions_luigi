# Flashcard Practice System - Todo List

## Immediate Next Steps

### Backend Setup
- [ ] Initialize Node.js/Express project
  - [ ] Create project directory
  - [ ] Run `npm init -y`
  - [ ] Install dependencies:  
    `npm install express cors dotenv typescript ts-node @types/node @types/express @supabase/supabase-js`
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up Supabase connection
  - [ ] Create `.env` file with Supabase credentials
  - [ ] Create `src/config/supabase.ts` for client initialization
- [ ] Create basic server structure
  - [ ] Create `src/app.ts` and `src/server.ts`
  - [ ] Add health check endpoint (`GET /`)
  - [ ] Set up middleware (CORS, JSON parsing)
- [ ] Create API route structure
- [ ] Create database schema in Supabase
  - [ ] Set up `flashcards` table with fields:
    - [ ] `id` (UUID, PK, auto-generated)
    - [ ] `front` (TEXT, required)
    - [ ] `back` (TEXT, required)
    - [ ] `hint` (TEXT, optional)
    - [ ] `tags` (TEXT[], default '{}')
    - [ ] `point` (INTEGER, default 0)
    - [ ] `difficulty_level` (TEXT, nullable)
    - [ ] `created_at` (TIMESTAMP, auto)
    - [ ] `updated_at` (TIMESTAMP, auto)

### Backend API Implementation
- [ ] Implement core types in `src/types/index.ts`
  - [ ] Flashcard interface
  - [ ] API Response interface
  - [ ] Difficulty Level type
- [ ] Implement flashcard CRUD endpoints
  - [ ] `POST /api/flashcards` (Create)
  - [ ] `GET /api/flashcards` (Read all)
  - [ ] `GET /api/flashcards/:id` (Read one)
  - [ ] `DELETE /api/flashcards/:id` (Delete)
- [ ] Implement practice system endpoints
  - [ ] Update the points calculation function
  - [ ] `PATCH /api/flashcards/update-difficulty`
  - [ ] `GET /api/practice-queue`
  - [ ] `PATCH /api/flashcards/:id/reset`
  - [ ] `GET /api/stats`
- [ ] Add error handling middleware

### Frontend Setup
- [ ] Initialize frontend project
  - [ ] Set up Vite or similar
  - [ ] Configure TypeScript
  - [ ] Set up basic project structure (components, services, etc.)
- [ ] Create API client service
  - [ ] Implement fetch wrapper with error handling
  - [ ] Create API methods for all backend endpoints
- [ ] Implement `localStorage` service for tracking learning days

## Main View Implementation
- [ ] Create layout components
  - [ ] Header/navigation
  - [ ] Main content area
  - [ ] Footer
- [ ] Create flashcard list view
  - [ ] Fetch and display all flashcards
  - [ ] Add delete functionality
  - [ ] Add reset functionality for cards with points ≥ 5
  - [ ] Include card creation form
- [ ] Implement flashcard creation form
  - [ ] Input fields for front, back, hint, tags
  - [ ] Form validation
  - [ ] Submission handling

## Practice View Implementation
- [ ] Create practice view component
  - [ ] Fetch practice queue on load
  - [ ] Handle empty queue case
  - [ ] Display card front/back logic
  - [ ] Manage practice session state
- [ ] Implement card display component
  - [ ] Show front initially
  - [ ] Add "Show Answer" button
  - [ ] Reveal back on button click
  - [ ] Add manual difficulty buttons
    - [ ] Wrong, Hard, Easy buttons
    - [ ] Connect to `update-difficulty` endpoint
    - [ ] Handle response and advance to next card

## Stats Implementation
- [ ] Create stats view component
  - [ ] Fetch and display statistics
  - [ ] Design clear visualizations

## Browser Extension
- [ ] Set up browser extension project
  - [ ] Create `manifest.json`
  - [ ] Set up popup HTML/CSS/JS
- [ ] Create content script
  - [ ] Implement text selection capture
  - [ ] Message passing to popup
- [ ] Create popup interface
  - [ ] Form for card creation
  - [ ] Pre-fill with selected text
  - [ ] Handle tags and submission

## Gesture Recognition
- [ ] Set up TensorFlow.js integration
  - [ ] Install dependencies
  - [ ] Create webcam access service
- [ ] Implement gesture detection
  - [ ] Hand pose model integration
  - [ ] Landmark detection and processing
  - [ ] Gesture classification logic
  - [ ] Connect gestures to practice flow
  - [ ] Map gestures to difficulty levels
  - [ ] Add feedback indicators
  - [ ] Implement timeout/fallback mechanism

## Final Polish
- [ ] Improve UI/UX
  - [ ] Add loading indicators
  - [ ] Enhance error messages
  - [ ] Improve visual design
  - [ ] Add animations/transitions
- [ ] Implement testing
  - [ ] Unit tests for critical functions
  - [ ] Integration tests for API endpoints
  - [ ] End-to-end tests for key user flows
- [ ] Optimize performance
  - [ ] Review and optimize API calls
  - [ ] Implement caching where appropriate
  - [ ] Optimize gesture detection

## Issues to Address
- [ ] Fix point addition in `update-difficulty` endpoint to fetch current points first
- [ ] Ensure proper error handling for all API endpoints
- [ ] Implement complete type safety throughout the application
- [ ] Design mobile-responsive UI for all views

## Features for Future Consideration
- [ ] User authentication and multi-user support
- [ ] Card sharing functionality
- [ ] Export/import flashcards (CSV, JSON)
- [ ] Advanced statistics and learning analytics
- [ ] Keyboard shortcuts for practice
- [ ] Dark mode / theme customization
- [ ] Offline support using IndexedDB
