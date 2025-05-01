# Flashcard Practice System - Technical Specification

## System Overview

A web application and browser extension for creating, practicing, and managing flashcards with a points-based spaced repetition system. The application includes gesture recognition for hands-free practice.

## Core Components

### 1. Database Schema

**Flashcards Table**
- `id`: UUID primary key, auto-generated
- `front`: TEXT, required (question/prompt)
- `back`: TEXT, required (answer/content)
- `hint`: TEXT, optional (learning aid)
- `tags`: TEXT[], default '{}' (categorization)
- `point`: INTEGER, default 0 (learning progress)
- `difficulty_level`: TEXT, nullable (last practice result: 'easy', 'hard', 'wrong')
- `created_at`: TIMESTAMP WITH TIME ZONE, default NOW()

### 2. Backend API Endpoints

#### Flashcard Management
- `POST /api/flashcards`
  - Create a new flashcard
  - Body: `{ front, back, hint?, tags? }`
  - Response: `{ success, data: <flashcard>, message }`

- `GET /api/flashcards`
  - Retrieve all flashcards
  - Response: `{ success, data: [<flashcard>], message }`

- `GET /api/flashcards/:id`
  - Retrieve a specific flashcard
  - Response: `{ success, data: <flashcard>, message }`

- `DELETE /api/flashcards/:id`
  - Delete a flashcard
  - Response: `{ success, message }`

- `PATCH /api/flashcards/:id/reset`
  - Reset a card's points to 0 to make it practicable again
  - Response: `{ success, data: <flashcard>, message }`

#### Practice System
- `PATCH /api/flashcards/update-difficulty`
  - Update flashcard difficulty and points after practice
  - Body: `{ id, difficulty_level }`
  - Response: `{ success, data: <flashcard>, message }`
  - Logic:
    - If difficulty = 'wrong': points = 0
    - If difficulty = 'hard': points += 1
    - If difficulty = 'easy': points += 2

- `GET /api/practice-queue`
  - Get all flashcards eligible for practice (points < 5)
  - Response: `{ success, data: [<flashcard>], message }`

- `GET /api/stats`
  - Get practice statistics
  - Response: `{
      success,
      data: {
        totalCards,
        learntCards, // points >= 5
        practicingCards, // points < 5
        averageDifficulty,
        // Other relevant stats
      },
      message
    }`

### 3. Frontend Components

#### Main UI Screens
1. **Home/Dashboard**
   - List of all flashcards with stats
   - Create, edit, delete cards
   - Reset learned cards to practice them again
   - Start practice session button

2. **Practice View**
   - Shows card front initially
   - "Show Answer" button reveals the back
   - Difficulty buttons or gesture detection for rating
   - Progress indicator for current session

3. **Stats View**
   - Cards learned vs. practicing
   - Progress charts
   - Daily practice stats

#### Browser Extension
- Popup with form to create new flashcards
- Auto-capture highlighted text
- Quick tag selection
- Direct submission to backend

### 4. Points-Based System Logic

1. **Learning Progress**
   - Each card starts with 0 points
   - Points accumulate based on practice results:
     - Wrong answer: Set points to 0
     - Hard answer: Add 1 point
     - Easy answer: Add 2 points
   - Cards with points ≥ 5 are considered "learned"
   - Learned cards are excluded from practice queue
   - Cards can be reset to 0 points manually to practice again

2. **Practice Queue**
   - Includes all cards with points < 5
   - No day-based scheduling required
   - All eligible cards are shown in practice sessions

### 5. Gesture Recognition System

1. **Hand Pose Detection**
   - Uses TensorFlow.js and Hand Pose Detection model
   - Activates webcam after "Show Answer" is clicked
   - Detects hand landmarks and classifies gestures

2. **Gesture Types**
   - Down gesture (fingers pointing down): Wrong (0 points)
   - Horizontal palm (flat hand): Hard (+1 point)
   - Up gesture (fingers pointing up): Easy (+2 points)

3. **Fallback System**
   - 5-second timeout for first gesture detection attempt
   - 10-second timeout to fallback to manual buttons

## Technical Stack

### Backend
- Node.js with Express
- Supabase (PostgreSQL)
- TypeScript for type safety

### Frontend
- JavaScript/TypeScript
- HTML/CSS
- Optional framework (React/Vue/Svelte)
- TensorFlow.js for gesture recognition

### Browser Extension
- JavaScript
- Browser Extension API (Manifest V3)
- Content scripts for text selection

## Data Flow

1. **Flashcard Creation**
   - User creates card via web app or browser extension
   - Backend validates and stores in database
   - Points initialized to 0

2. **Practice Session**
   - Frontend fetches practice queue (cards with points < 5)
   - User practices cards one by one
   - Difficulty rating sent to backend
   - Backend updates points based on difficulty
   - Frontend loads next card or ends session

3. **Card Learning Lifecycle**
   - New card (0 points)
   - Practicing (1-4 points)
   - Learned (≥5 points)
   - Can be reset to 0 points manually