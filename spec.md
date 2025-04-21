Flashcard Web Extension & Application Specification
Overview
A Chrome extension and local web application system for creating and reviewing flashcards. The Chrome extension captures highlighted text, and the web application allows review using camera-based hand gestures to rate difficulty.
Components

1. Chrome Extension

Technology: Vanilla JavaScript
Functionality:

Monitors for text highlighting in Chrome
Displays a button near highlighted text
Opens a modal when button is clicked
Captures flashcard name, highlighted text, and hint
Saves flashcard data to Supabase database
Simple development setup with direct JavaScript files

2. Web Application

Technology: React with Vite
Functionality:

Local-only application (no hosting)
Retrieves flashcards from Supabase
Displays one flashcard at a time
Groups flashcards by creation day
Randomizes flashcard order within day groups
Simple navigation with "Next Day" button
Always-on camera for gesture recognition
Backup manual rating buttons

3. Camera Gesture Recognition

Technology: TensorFlow.js with Fingerpose library
Gestures:

👍 (thumbs up) = Easy
✋ (flat hand) = Medium
👎 (thumbs down) = Hard

Functionality:

Always-on during flashcard review
Shows rating directly on flashcard when detected
Works entirely client-side

Database Structure (Supabase)

Plan: Free tier Supabase instance
Table: Flashcards

id (auto-generated)
name (flashcard name)
highlighted_text (text selected in Chrome)
hint (help text for recalling)
difficulty_level (easy, medium, hard)
created_date (for day grouping)

Authentication: None (local use only)

User Flow
Creating Flashcards:

User highlights text in Chrome
Extension button appears near highlighted text
User clicks button to open modal
User enters flashcard name and hint
User clicks save button
Flashcard is saved to Supabase database

Reviewing Flashcards:

User opens local web application
Application loads flashcards from Supabase
Cards are displayed one at a time, grouped by creation day
Camera is always on during review
User makes hand gestures to rate cards:

👍 = Easy
✋ = Medium
👎 = Hard

Rating appears on flashcard when detected
User can use backup buttons if gesture recognition fails
User navigates to next day's flashcards with "Next Day" button

Error Handling
Standard error handling with clear user notifications for:

Database connection failures
Camera permission issues
Flashcard saving problems

Technical Requirements
Chrome Extension:

Chrome-only support
Manifest V3 compatible
Simple setup without complex build tools

Web Application:

Vite-based React application
Local development/usage only
No authentication requirements
TensorFlow.js and Fingerpose for gesture recognition

Prioritization

Functionality over design
Simple user experience
Reliable gesture detection

Non-Requirements

User authentication
Multiple user support
Export functionality
Complex UI design
Cross-browser compatibility
Hosting/deployment
