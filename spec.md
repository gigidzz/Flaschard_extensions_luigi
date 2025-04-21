# Flashcard System - Integrated Specification

## System Overview

A comprehensive flashcard learning system with two main components:

1. A Chrome extension for capturing highlighted text as flashcards
2. A web application for reviewing flashcards using both the Leitner system and camera-based gesture recognition

## Components

### 1. Chrome Extension

**Technology**: Vanilla JavaScript, Chrome Extension API
**Functionality**:

- Detects text selection on web pages
- Shows a button near selected text
- Opens a modal form when button is clicked
- Captures flashcard name, selected text, and optional hint
- Saves data to Supabase database

### 2. Web Application

**Technology**: React, Vite, TensorFlow.js
**Functionality**:

- Retrieves flashcards from Supabase
- Organizes flashcards using the Leitner system (buckets)
- Groups flashcards by creation date
- Displays one flashcard at a time
- Provides navigation between cards and day groups
- Enables rating flashcards via camera gestures or manual controls
- Tracks progress statistics

### 3. Leitner Spaced Repetition System

**Implementation**: Already developed (from paste.txt)
**Key Functions**:

- `toBucketSets`: Converts bucket map to array of sets
- `practice`: Determines which cards to practice on a given day
- `update`: Updates buckets based on answer difficulty
- `getHint`: Retrieves hint for a flashcard
- `computeProgress`: Calculates learning statistics

### 4. Camera Gesture Recognition

**Technology**: TensorFlow.js with HandPose model
**Gestures**:

- Thumbs up 👍 = Easy (moves card up one bucket)
- Flat hand ✋ = Medium (keeps card in same bucket)
- Thumbs down 👎 = Hard (moves card to bucket 0)
  **Processing**:
- Continuous camera feed analysis
- Gesture detection with confidence thresholds
- Debounced to prevent accidental inputs

## Database Structure (Supabase)

### Flashcards Table

- `id`: UUID (primary key, auto-generated)
- `name`: Text (required)
- `highlighted_text`: Text (required)
- `hint`: Text (optional)
- `difficulty_level`: Text (easy/medium/hard, default 'medium')
- `created_date`: Timestamp with timezone (default now())
- `bucket`: Integer (default 0, for Leitner system)

### Practice Records Table

- `id`: UUID (primary key, auto-generated)
- `card_id`: UUID (foreign key to flashcards.id)
- `card_front`: Text (name of card, for statistics)
- `card_back`: Text (highlighted text, for statistics)
- `difficulty`: Integer (0=wrong, 1=hard, 2=easy)
- `practice_date`: Timestamp with timezone (default now())

## User Workflows

### Creating Flashcards

1. User highlights text in Chrome browser
2. Extension button appears near selection
3. User clicks button to open modal
4. User enters flashcard name and optional hint
5. User clicks save
6. Flashcard is saved to Supabase

### Reviewing Flashcards

1. User opens web application
2. Application retrieves flashcards from Supabase
3. Cards are organized by creation date and bucket
4. System determines which cards to practice today
5. User reviews one card at a time:
   - Front shows flashcard name
   - Click/tap flips to show answer (highlighted text)
   - User rates difficulty via gesture or buttons
6. Based on rating, card moves between buckets
7. User can navigate between cards and day groups

### Tracking Progress

1. System maintains statistics:
   - Total number of cards
   - Cards per bucket
   - Success rate
   - Average moves per card
2. User can view progress metrics in the application

## Integration Points

### Extension to Database

- Chrome extension uses Supabase client to save new flashcards
- Cards are initially placed in bucket 0

### Database to Web Application

- Web app retrieves all flashcards from Supabase
- Organizes cards into buckets and day groups
- Updates card buckets based on user ratings

### Leitner System to UI

- Leitner algorithm determines which cards to show on a given day
- UI displays cards according to this schedule
- Rating UI updates card buckets according to the system rules

### Gesture Recognition to Rating System

- Camera gestures are mapped to difficulty ratings
- Recognized gestures trigger the same update function as manual buttons
- Difficulty rating is translated to bucket movement

## Technical Requirements

### Chrome Extension

- Manifest V3 compatible
- Content script for text selection
- Background service worker for persistence
- Modal UI injected into page DOM

### Web Application

- React components for card display and navigation
- Reuse existing Leitner system functions
- TensorFlow.js for hand detection
- Fingerpose for gesture recognition
- Responsive design for various screen sizes

### Error Handling

- Graceful degradation when camera not available
- Database connection error recovery
- Clear user feedback for all error states
