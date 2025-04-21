# Flashcard System: Implementation Checklist

## Phase 1: Project Setup and Infrastructure

### Supabase Setup

- [ ] Create Supabase account
- [ ] Create new project
- [ ] Note API URL and anon public key
- [ ] Create "flashcards" table with schema:
  - [ ] id (UUID, auto-generated)
  - [ ] name (text, not null)
  - [ ] highlighted_text (text, not null)
  - [ ] hint (text)
  - [ ] difficulty_level (text, default 'medium')
  - [ ] created_date (timestamp with timezone, default now())
  - [ ] bucket (integer, default 0)
- [ ] Create "practice_records" table with schema:
  - [ ] id (UUID, auto-generated)
  - [ ] card_id (UUID, foreign key to flashcards)
  - [ ] card_front (text)
  - [ ] card_back (text)
  - [ ] difficulty (integer)
  - [ ] practice_date (timestamp with timezone, default now())
- [ ] Test connection with API key

### Chrome Extension Scaffold

- [ ] Create extension directory structure
  - [ ] scripts/
  - [ ] styles/
  - [ ] assets/
  - [ ] popup/
- [ ] Create manifest.json (Manifest V3)
  - [ ] Add required permissions (activeTab, storage, etc.)
  - [ ] Configure content scripts
  - [ ] Set up background service worker
- [ ] Create placeholder files
  - [ ] background.js (service worker)
  - [ ] content.js
  - [ ] content.css
  - [ ] popup.html
  - [ ] popup.js
- [ ] Add extension icon (16px, 48px, 128px sizes)
- [ ] Test basic extension loading in Chrome

### Web Application Scaffold

- [ ] Initialize Vite + React application
  - [ ] `npm create vite@latest flashcard-app -- --template react`
- [ ] Install dependencies
  - [ ] Supabase client (`@supabase/supabase-js`)
  - [ ] TensorFlow.js (`@tensorflow/tfjs`)
  - [ ] Fingerpose or hand-pose-detection
  - [ ] Other UI libraries if needed
- [ ] Create project structure
  - [ ] `/src/components/`
  - [ ] `/src/hooks/`
  - [ ] `/src/utils/`
  - [ ] `/src/styles/`
- [ ] Set up environment variable handling
  - [ ] Create `.env` file
  - [ ] Add Supabase URL and API key
  - [ ] Add to `.gitignore`
- [ ] Create basic app layout
- [ ] Test basic app runs

## Phase 2: Chrome Extension Development

### Text Selection Detection

- [ ] Add event listener for text selection in content.js
- [ ] Create function to detect selected text on mouseup
- [ ] Parse and validate selection data
- [ ] Create selection button element
- [ ] Style button appearance in content.css
- [ ] Position button near selected text
- [ ] Add logic to remove button when selection changes
- [ ] Handle edge cases (multiple selections, rapid changes)
- [ ] Add button click handler
- [ ] Test selection detection across different websites

### Modal Interface

- [ ] Create HTML structure for modal
- [ ] Add CSS styles for modal
- [ ] Implement show/hide functionality
- [ ] Add positioning logic
- [ ] Handle outside clicks to close
- [ ] Implement escape key to close
- [ ] Prevent page scrolling when modal is open
- [ ] Test modal on different page layouts

### Data Capture Form

- [ ] Create form elements in modal
  - [ ] Flashcard name input
  - [ ] Selected text display (readonly)
  - [ ] Hint textarea
  - [ ] Save and Cancel buttons
- [ ] Pre-populate form with selected text
- [ ] Add form validation
  - [ ] Required fields validation
  - [ ] Input sanitization
- [ ] Show validation errors
- [ ] Style form elements
- [ ] Test form submission and validation

### Supabase Integration (Extension)

- [ ] Create supabase-client.js utility
- [ ] Initialize Supabase client with credentials
- [ ] Create function to save flashcard
- [ ] Connect form submission to save function
- [ ] Add success/error handling
- [ ] Show feedback to user after save
- [ ] Add options page for Supabase configuration
- [ ] Store configuration in chrome.storage.local
- [ ] Test end-to-end saving functionality
- [ ] Add error recovery options

## Phase 3: Web Application Development

### Leitner System Integration

- [ ] Transfer existing functions from paste.txt
  - [ ] toBucketSets
  - [ ] practice
  - [ ] update
  - [ ] getHint
  - [ ] computeProgress
- [ ] Create interfaces for Flashcard and other types
- [ ] Create utility for converting Supabase data to Flashcard objects
- [ ] Create utility for converting practice records to history array
- [ ] Connect Leitner functions to React component state
- [ ] Test Leitner system with sample data

### Supabase Integration (Web App)

- [ ] Create supabase.js client configuration
- [ ] Set up environment variables
- [ ] Create fetchFlashcards function
- [ ] Create updateFlashcard function
- [ ] Create savePracticeRecord function
- [ ] Add error handling for database operations
- [ ] Create custom hook for flashcard data
- [ ] Create custom hook for practice history
- [ ] Test database connection and operations

### Flashcard Display Component

- [ ] Create Flashcard component
  - [ ] Front/back card design
  - [ ] Flip animation
  - [ ] Name display
  - [ ] Text content display
  - [ ] Hint display logic
- [ ] Create FlashcardContainer component
  - [ ] Card state management
  - [ ] Current card tracking
- [ ] Add keyboard handlers for card interaction
- [ ] Style components for clean appearance
- [ ] Implement loading states
- [ ] Add error handling
- [ ] Test card display and interaction

### Flashcard Navigation

- [ ] Group flashcards by creation date
- [ ] Implement next/previous card navigation
- [ ] Create day-based navigation
  - [ ] Show current day indicator
  - [ ] Add "Next Day" button
  - [ ] Add day progress display
- [ ] Randomize cards within day groups
- [ ] Add keyboard shortcuts
  - [ ] Left/right arrows for cards
  - [ ] Up/down arrows for days
- [ ] Add transition animations
- [ ] Show progress indicators
- [ ] Test navigation across different day groups

### Manual Rating Interface

- [ ] Create rating buttons component
  - [ ] Easy button (👍)
  - [ ] Medium button (✋)
  - [ ] Hard button (👎)
- [ ] Style rating buttons
- [ ] Connect buttons to update function
- [ ] Add Leitner system integration
  - [ ] Map ratings to AnswerDifficulty enum
  - [ ] Update buckets based on rating
  - [ ] Save practice record to database
- [ ] Show current difficulty level on card
- [ ] Add loading state during update
- [ ] Show success/error feedback
- [ ] Add keyboard shortcuts for rating
- [ ] Test rating functionality

## Phase 4: Camera Gesture Recognition

### Camera Setup

- [ ] Create CameraComponent
- [ ] Implement camera permission request
- [ ] Set up video display element
- [ ] Create useCamera custom hook
- [ ] Handle permission denial gracefully
- [ ] Add camera toggle functionality
- [ ] Style video display as overlay
- [ ] Add camera status indicators
- [ ] Test on different browsers/devices
- [ ] Add fallback for unsupported browsers

### TensorFlow.js Integration

- [ ] Set up TensorFlow.js and required models
- [ ] Create useHandDetection hook
- [ ] Load HandPose model
- [ ] Set up video frame processing
- [ ] Implement hand landmark detection
- [ ] Add visual feedback for detection
- [ ] Optimize processing frequency
- [ ] Clean up resources properly
- [ ] Add debug visualization option
- [ ] Test model loading and hand detection

### Gesture Recognition

- [ ] Define gesture descriptions
  - [ ] Thumbs up (Easy)
  - [ ] Flat hand (Medium)
  - [ ] Thumbs down (Hard)
- [ ] Create useGestureRecognition hook
- [ ] Implement gesture detection logic
- [ ] Add confidence threshold settings
- [ ] Implement debouncing for stability
- [ ] Create visual gesture feedback
- [ ] Add confirmation countdown
- [ ] Test gesture reliability
- [ ] Calibrate for different lighting conditions

### Rating UI Integration

- [ ] Connect gesture recognition to rating system
- [ ] Create GestureRatingController
- [ ] Implement visual feedback for detected gestures
- [ ] Connect confirmed gestures to Leitner update function
- [ ] Handle rating conflicts (manual vs gesture)
- [ ] Add user preferences for gesture sensitivity
- [ ] Test end-to-end gesture rating flow
- [ ] Verify data updates in Supabase

## Phase 5: Integration and Testing

### End-to-End Testing

- [ ] Test complete flow from highlight to review
- [ ] Verify Chrome extension to web app flow
- [ ] Check data persistence in Supabase
- [ ] Test on different websites
- [ ] Test with various text selection patterns
- [ ] Verify day grouping functionality
- [ ] Test camera gesture recognition reliability
- [ ] Check all keyboard shortcuts

### Error Handling

- [ ] Add error boundaries to React components
- [ ] Implement database error handling
  - [ ] Connection failures
  - [ ] Query errors
  - [ ] Data validation issues
- [ ] Add camera permission error handling
- [ ] Create fallback UI for component failures
- [ ] Implement retry logic where appropriate
- [ ] Add user-friendly error messages
- [ ] Test error recovery paths

### Performance Optimization

- [ ] Optimize camera processing
  - [ ] Reduce processing frequency
  - [ ] Use appropriate frame sizes
- [ ] Improve extension responsiveness
- [ ] Optimize React renders
  - [ ] Add memo where beneficial
  - [ ] Review component hierarchy
- [ ] Reduce unnecessary state updates
- [ ] Add loading indicators for better UX
- [ ] Profile and fix performance bottlenecks
- [ ] Test on lower-powered devices

### Final Polish

- [ ] Ensure consistent styling throughout
- [ ] Add responsive design adjustments
- [ ] Implement dark/light mode support
- [ ] Review accessibility
  - [ ] Keyboard navigation
  - [ ] ARIA attributes
  - [ ] Color contrast
- [ ] Add helpful empty states
- [ ] Create onboarding hints for first use
- [ ] Final browser compatibility check

## Phase 6: Packaging and Documentation

### Chrome Extension Packaging

- [ ] Update manifest.json for distribution
- [ ] Create promotional images
  - [ ] Store listing icon
  - [ ] Screenshots
- [ ] Remove debug code and console logs
- [ ] Package as ZIP file
- [ ] Test installation from package
- [ ] Document installation instructions

### Web Application Building

- [ ] Configure Vite build process
- [ ] Create production build
- [ ] Test built application
- [ ] Create simple serve script
- [ ] Document build and run process

### User Documentation

- [ ] Write getting started guide
  - [ ] Chrome extension installation
  - [ ] Web app setup
  - [ ] Supabase configuration
- [ ] Create usage instructions
  - [ ] Creating flashcards
  - [ ] Reviewing cards
  - [ ] Using gestures
- [ ] Add troubleshooting section
- [ ] Create quick reference guide
- [ ] Include keyboard shortcut list
- [ ] Document gesture recognition tips

### Developer Documentation

- [ ] Document code structure
- [ ] Create API documentation
- [ ] Add setup instructions for development
- [ ] Include testing procedures
- [ ] Document known issues and limitations
