High-Level Project Structure

Chrome Extension - Vanilla JS, captures highlighted text
Web Application - React/Vite app for flashcard review
Camera Gesture Recognition - TensorFlow.js based gesture detection
Database - Supabase for storage

Detailed Blueprint
Phase 1: Project Setup and Infrastructure
Step 1.1: Set up Supabase Database

Create Supabase account
Set up Flashcards table with specified schema
Configure local environment variables

Step 1.2: Chrome Extension Scaffold

Create manifest.json for Chrome extension
Set up basic folder structure
Create placeholder files for extension functionality

Step 1.3: Web Application Scaffold

Initialize Vite + React application
Set up project structure
Configure basic routing and components

Phase 2: Chrome Extension Development
Step 2.1: Text Selection Detection

Implement text selection listener
Create button UI that appears near selected text

Step 2.2: Modal Interface

Create modal UI component
Implement open/close functionality

Step 2.3: Data Capture Form

Build form for flashcard name and hint
Implement form validation

Step 2.4: Supabase Integration (Extension)

Add Supabase client integration
Implement save functionality

Phase 3: Web Application Development
Step 3.1: Supabase Integration (Web App)

Set up Supabase client in the React app
Create data fetching hooks

Step 3.2: Flashcard Display Component

Create flashcard UI component
Implement flashcard grouping by day

Step 3.3: Flashcard Navigation

Implement next/previous flashcard functionality
Create "Next Day" button and logic

Step 3.4: Manual Rating Interface

Create rating buttons (Easy, Medium, Hard)
Implement rating submission logic

Phase 4: Camera Gesture Recognition
Step 4.1: Camera Setup

Implement camera access request
Set up video stream display

Step 4.2: TensorFlow.js Integration

Add TensorFlow.js and required models
Set up basic hand detection

Step 4.3: Gesture Recognition

Implement gesture detection for thumbs up, flat hand, and thumbs down
Map gestures to difficulty ratings

Step 4.4: Rating UI Integration

Connect gesture recognition to rating system
Implement visual feedback when gesture is detected

Phase 5: Integration and Testing
Step 5.1: End-to-End Testing

Test complete user flow from highlighting to reviewing
Verify data persistence in Supabase

Step 5.2: Error Handling

Implement error handling for database operations
Add camera permission error handling

Step 5.3: Performance Optimization

Optimize camera processing
Improve extension responsiveness

Iterative Development Plan
Let's break these steps down into even smaller, testable chunks:
Phase 1: Project Setup and Infrastructure
Step 1.1.1: Create Supabase Project

Sign up for Supabase (if needed)
Create a new project
Note the API URL and key

Step 1.1.2: Set Up Flashcards Table

Create schema definition
Set up columns: id, name, highlighted_text, hint, difficulty_level, created_date

Step 1.2.1: Create Extension Directory Structure

Set up folders for scripts, styles, and assets
Create initial manifest.json

Step 1.2.2: Add Basic Extension Files

Create background.js
Create content.js
Create popup.html and popup.js

Step 1.3.1: Initialize React Application

Create new Vite app with React template
Install dependencies

Step 1.3.2: Set Up Basic App Structure

Create component folders
Set up basic routing

Phase 2: Chrome Extension Development
Step 2.1.1: Implement Text Selection Event Listener

Add event listener for text selection
Parse selection data

Step 2.1.2: Create Selection Button

Create button element
Position button near selected text
Add button click handler

Step 2.2.1: Design Modal Component

Create HTML structure for modal
Add styling

Step 2.2.2: Implement Modal Logic

Add open/close functionality
Handle outside clicks for closing

Step 2.3.1: Build Flashcard Form

Create form elements for name and hint
Pre-populate with selected text

Step 2.3.2: Add Form Validation

Validate required fields
Show validation errors

Step 2.4.1: Add Supabase Client to Extension

Include Supabase JS library
Configure client with API credentials

Step 2.4.2: Implement Save Functionality

Create save function
Add success/error handling
Update UI on successful save

Phase 3: Web Application Development
Step 3.1.1: Configure Supabase in React

Install Supabase client
Create API utility functions

Step 3.1.2: Create Flashcard Data Hooks

Implement hook to fetch flashcards
Add data transformation for day grouping

Step 3.2.1: Create Flashcard Component

Design flashcard UI
Add front/back flip functionality

Step 3.2.2: Implement Flashcard Grouping

Group flashcards by creation date
Randomize order within groups

Step 3.3.1: Build Navigation Controls

Create next/previous buttons
Implement navigation logic

Step 3.3.2: Add Day Navigation

Create "Next Day" button
Implement day switching logic

Step 3.4.1: Create Rating UI

Design rating buttons
Add hover and active states

Step 3.4.2: Implement Rating Submission

Connect buttons to Supabase update
Add visual feedback for rating

Phase 4: Camera Gesture Recognition
Step 4.1.1: Request Camera Permissions

Add camera permission request
Handle permission rejection

Step 4.1.2: Set Up Video Stream

Create video element
Configure stream settings

Step 4.2.1: Add TensorFlow.js

Install TensorFlow.js and HandPose
Load required models

Step 4.2.2: Basic Hand Detection

Implement hand position detection
Add visual feedback for detected hands

Step 4.3.1: Define Gesture Recognizers

Define thumbs up detection
Define flat hand detection
Define thumbs down detection

Step 4.3.2: Test and Calibrate Gestures

Add gesture confidence thresholds
Test gesture accuracy

Step 4.4.1: Connect Gestures to Ratings

Map gestures to difficulty levels
Implement debouncing for gesture detection

Step 4.4.2: Add Visual Feedback

Show detected gesture icon
Animate rating confirmation

Phase 5: Integration and Testing
Step 5.1.1: Test Extension to Web App Flow

Verify data saves from extension
Confirm data appears in web app

Step 5.1.2: Test Complete User Journey

Walk through entire user flow
Identify any gaps or issues

Step 5.2.1: Add Database Error Handling

Implement connection error handling
Add retry logic

Step 5.2.2: Camera Error Recovery

Handle camera initialization failures
Provide fallback options

Step 5.3.1: Optimize Camera Processing

Reduce processing frequency
Implement worker if needed

Step 5.3.2: Improve UI Responsiveness

Add loading states
Optimize render performance

Now, let's create the LLM prompts for each implementation step:
Code Generation Prompts
Prompt 1: Supabase Setup and Configuration
Create the necessary Supabase configuration for a flashcard application. The application needs:

1. A Supabase project configuration guide
2. SQL for creating a "flashcards" table with the following fields:

   - id (auto-generated UUID)
   - name (text, not null)
   - highlighted_text (text, not null)
   - hint (text)
   - difficulty_level (text, default to 'medium')
   - created_date (timestamp with timezone, default to now())

3. A JavaScript utility file for connecting to Supabase from both a Chrome extension and a React application
4. Example usage of how to:
   - Insert a new flashcard
   - Query flashcards grouped by creation date
   - Update a flashcard's difficulty level

The code should be simple, well-commented, and follow best practices for Supabase integration.
Prompt 2: Chrome Extension Scaffold
Create a complete scaffold for a Chrome extension (Manifest V3) that will capture highlighted text on web pages. Include:

1. A manifest.json file with all necessary permissions for:

   - Accessing the current tab
   - Running content scripts on all pages
   - Storing data locally
   - Making network requests to a Supabase API

2. A directory structure with:

   - background.js (service worker)
   - content.js (for interacting with web pages)
   - popup.html and popup.js (for extension popup)
   - Any necessary CSS files
   - Any necessary asset placeholders

3. Basic files with minimal placeholder functionality that log to the console to verify they're working.

The extension will need to detect text selection, show a button near selected text, and open a form to capture flashcard data. Don't implement these features yet, just set up the scaffold with the right permissions and structure.
Prompt 3: Text Selection Detection in Chrome Extension
Build on the Chrome extension scaffold to implement text selection detection and a button that appears near selected text. Specifically:

1. In content.js, create a function that:

   - Listens for 'mouseup' events on the document
   - Checks if text is selected using window.getSelection()
   - Creates and positions a button near the selected text
   - Handles cases where the selection changes or is cleared

2. Style the button to:

   - Be clearly visible but not intrusive
   - Hover over page content
   - Have a simple "Add to Flashcards" label or icon

3. Add code to remove the button when:

   - The selection is cleared
   - The user clicks elsewhere on the page
   - The page is scrolled significantly

4. Include all necessary CSS in a content.css file that will be injected.

The button should not yet open a modal or capture data - just appear when text is selected and disappear appropriately. Ensure the code handles edge cases like rapid selection changes.
Prompt 4: Flashcard Modal in Chrome Extension
Implement a modal dialog for the Chrome extension that appears when the "Add to Flashcards" button is clicked. Build on the previous code by:

1. Creating a modal HTML structure in content.js that:

   - Is injected into the page when needed
   - Contains a form with:
     - A text input for the flashcard name (required)
     - A textarea showing the selected text (readonly)
     - A textarea for a hint (optional)
     - Save and Cancel buttons

2. Adding JavaScript to:

   - Show the modal when the selection button is clicked
   - Position the modal in the viewport
   - Close the modal when Cancel is clicked or when clicking outside
   - Validate form inputs before submission
   - Prevent page scrolling when the modal is open

3. Styling the modal with CSS to:
   - Overlay the page content
   - Have a clean, simple design
   - Include appropriate spacing and input sizes
   - Be responsive to different viewport sizes

The modal should not yet save data to Supabase - just capture input and log it to console when Save is clicked. Focus on creating a smooth user experience with proper validation and feedback.
Prompt 5: Supabase Integration for Chrome Extension
Connect the Chrome extension to Supabase for saving flashcard data. Building on the modal implementation:

1. Create a supabase-client.js file that:

   - Initializes the Supabase client with project URL and API key
   - Handles authentication (if needed)
   - Exports functions for database operations

2. Update the modal's save functionality to:

   - Collect form data
   - Format it as a flashcard object
   - Save it to Supabase using the client
   - Show success/error feedback to the user

3. Add configuration options by:

   - Creating an options page for the extension
   - Allowing the user to input their Supabase URL and key
   - Storing these securely using chrome.storage.local

4. Implement error handling for:
   - Network failures
   - Database errors
   - Validation issues

Include logging for debugging purposes, but ensure sensitive data is not exposed. The final code should provide clear feedback to the user when a flashcard is successfully saved or when an error occurs.
Prompt 6: React Web Application Setup
Create a React application using Vite that will display and manage flashcards from Supabase. Set up:

1. A new Vite project with:

   - React as the framework
   - TypeScript for type safety
   - Basic project structure (components, hooks, utils)

2. Install necessary dependencies:

   - @supabase/supabase-js
   - react-router-dom
   - Any UI libraries you recommend (keep it minimal)

3. Set up environment variables for:

   - Supabase URL
   - Supabase API key

4. Create a basic application structure with:

   - App component with routing
   - Layout component with header/footer
   - Placeholder pages for:
     - Flashcard review
     - Settings (if needed)

5. Set up a utils/supabase.js file that initializes the Supabase client.

The application should have a clean, minimal design focused on functionality rather than aesthetics. Don't implement the flashcard display functionality yet - just set up the project structure and configuration.
Prompt 7: Flashcard Data Fetching in React
Implement Supabase data fetching in the React application. Building on the previous setup:

1. Create a custom hook useFlashcards that:

   - Fetches flashcards from Supabase
   - Groups them by creation date
   - Randomizes the order within each day group
   - Provides loading and error states
   - Returns the grouped flashcards and necessary state

2. Create utility functions for:

   - Updating flashcard difficulty
   - Getting flashcards for a specific day
   - Calculating statistics (e.g., cards per difficulty level)

3. Implement data transformation functions that:

   - Format dates consistently
   - Group flashcards by day
   - Sort days chronologically
   - Randomize flashcard order within each day

4. Add appropriate TypeScript interfaces for:
   - Flashcard
   - GroupedFlashcards
   - Hook return types

The code should be well-tested, include error handling, and follow React best practices. Don't build the UI components yet - focus on the data fetching and manipulation logic.
Prompt 8: Flashcard Display Component
Create a flashcard display component for the React application. Building on the data fetching functionality:

1. Design a Flashcard component that:

   - Displays one flashcard at a time
   - Shows the flashcard name prominently
   - Has a "flip" animation to reveal the answer (highlighted text)
   - Shows the hint when requested
   - Displays the current difficulty level
   - Has a clean, focused design

2. Create a FlashcardContainer component that:

   - Uses the useFlashcards hook
   - Manages the current card index
   - Handles navigation between cards
   - Shows loading and error states

3. Add interactions for:

   - Flipping the card (click or keyboard)
   - Showing/hiding the hint
   - Moving to the next/previous card

4. Include accessibility features:
   - Keyboard navigation
   - Appropriate ARIA attributes
   - Focus management

Style the components with CSS modules or your preferred styling approach. The design should be clean and distraction-free, focusing on the flashcard content. Don't implement the rating system or camera functionality yet.
Prompt 9: Flashcard Navigation and Day Grouping
Implement navigation between flashcards and day groups in the React application. Building on the flashcard display component:

1. Enhance the FlashcardContainer to:

   - Track the current day being viewed
   - Show the date of the current group
   - Display progress within the current day (e.g., "Card 3 of 10")

2. Create navigation controls for:

   - Moving to the next/previous card within a day
   - Skipping to the next day
   - Going back to previous days

3. Add a DayNavigation component that:

   - Shows available days as a simple navigation element
   - Highlights the current day
   - Allows jumping to any available day

4. Implement keyboard shortcuts for:
   - Next card (right arrow)
   - Previous card (left arrow)
   - Next day (down arrow)
   - Previous day (up arrow)

The navigation should be intuitive and provide clear feedback about the current position in the flashcard collection. Include animations for transitions between cards to enhance the user experience, but keep them subtle and quick.
Prompt 10: Manual Rating Interface
Implement a manual rating interface for flashcards in the React application. Building on the navigation functionality:

1. Create a RatingControls component with:

   - Three distinct buttons for Easy, Medium, and Hard ratings
   - Clear visual design showing the difficulty levels
   - Interactive states (hover, active, focus)
   - Keyboard accessibility

2. Connect the rating controls to Supabase by:

   - Creating a function to update flashcard difficulty
   - Showing loading state during the update
   - Providing success/error feedback

3. Enhance the Flashcard component to:

   - Show the current difficulty rating
   - Update the UI when the rating changes
   - Provide visual feedback during rating submission

4. Add options to:
   - Skip rating
   - Reset a card's rating

The interface should be intuitive and encourage quick rating decisions. Include appropriate animations for the rating process that provide clear feedback but don't delay the user's workflow. Ensure the rating system works reliably before moving on to the camera-based gesture system.
Prompt 11: Camera Access and Video Display
Implement camera access and video display in the React application for gesture recognition. Building on the previous functionality:

1. Create a CameraComponent that:

   - Requests camera permissions
   - Displays the video stream in a small overlay
   - Handles permission errors gracefully
   - Includes options to enable/disable the camera

2. Add a custom hook useCamera that:

   - Manages camera state and access
   - Provides methods for starting/stopping the camera
   - Creates a reference to the video element
   - Handles browser compatibility issues

3. Implement permission handling for:

   - Initial permission request
   - Denied permissions
   - Permission changes

4. Add UI elements for:
   - Camera status indication
   - Toggle camera on/off
   - Repositioning the camera display

Style the video display to be non-intrusive but easily visible during flashcard review. Don't implement the gesture recognition yet - focus on getting reliable camera access and display working across different browsers and devices.
Prompt 12: TensorFlow.js and HandPose Integration
Integrate TensorFlow.js and the HandPose model for hand detection in the React application. Building on the camera component:

1. Create a useHandDetection hook that:

   - Loads the TensorFlow.js and HandPose models
   - Processes video frames to detect hands
   - Provides hand landmark data
   - Handles model loading and processing states

2. Enhance the CameraComponent to:

   - Show visual feedback when hands are detected
   - Optionally display hand landmarks for debugging
   - Indicate when the model is loading or processing

3. Implement optimizations for:

   - Reducing processing frequency to maintain performance
   - Using requestAnimationFrame appropriately
   - Cleaning up resources when the component unmounts

4. Add a HandDebugView component (optional) that:
   - Shows the detected hand landmarks
   - Provides visual feedback on detection quality
   - Helps users position their hands correctly

The implementation should focus on reliable hand detection with good performance. Include fallback options when TensorFlow.js or camera access isn't available. Don't implement gesture recognition yet - just get the hand detection working reliably.
Prompt 13: Gesture Recognition Implementation
Implement gesture recognition for rating flashcards using the HandPose model. Building on the hand detection functionality:

1. Create a useGestureRecognition hook that:

   - Uses the Fingerpose library with TensorFlow.js
   - Defines gesture descriptions for:
     - Thumbs up (Easy)
     - Flat hand (Medium)
     - Thumbs down (Hard)
   - Detects these gestures from hand landmark data
   - Provides confidence scores for each gesture

2. Implement a GestureDetector component that:

   - Uses the useGestureRecognition hook
   - Provides visual feedback when gestures are detected
   - Shows the recognized gesture (icon or label)
   - Indicates confidence level

3. Add gesture processing logic for:

   - Debouncing to prevent rapid gesture changes
   - Minimum confidence thresholds
   - Time-based confirmation (hold gesture for X milliseconds)

4. Create gesture indication elements that:
   - Show the currently detected gesture
   - Animate during confirmation countdown
   - Provide clear feedback when a gesture is confirmed

Focus on making the gesture recognition reliable and avoiding false positives. Include configuration options for sensitivity and confirmation time to accommodate different users and environments.
Prompt 14: Connecting Gestures to Flashcard Ratings
Connect the gesture recognition system to the flashcard rating functionality. Building on both the gesture recognition and flashcard rating systems:

1. Enhance the FlashcardContainer component to:

   - Accept rating input from both manual controls and gestures
   - Deduplicate rating submissions
   - Provide consistent feedback regardless of input method

2. Create a GestureRatingController that:

   - Connects detected gestures to rating actions
   - Implements a confirmation flow before submitting ratings
   - Provides visual and optional audio feedback when a rating is applied

3. Add a user preference system for:

   - Enabling/disabling gesture-based rating
   - Adjusting gesture sensitivity
   - Setting confirmation time requirements

4. Implement a rating feedback display that:
   - Shows which gesture was detected
   - Indicates the corresponding difficulty level
   - Animates briefly when a rating is applied
   - Fades out after the rating is confirmed

The integration should feel natural and intuitive, with gestures providing a hands-free alternative to clicking the rating buttons. Include fallback to manual controls when gestures aren't detected correctly or the camera is disabled.
Prompt 15: Error Handling and Fallbacks
Implement comprehensive error handling and fallback mechanisms for the flashcard application. Enhancing all previous components:

1. Add error boundaries around:

   - The camera component
   - TensorFlow.js processing
   - Supabase operations

2. Create fallback UI components for:

   - Camera permission denials
   - Model loading failures
   - Network connectivity issues
   - Database errors

3. Implement recovery strategies for:

   - Retrying failed Supabase operations
   - Reinitializing camera access
   - Reloading TensorFlow models

4. Add user notifications for:
   - Transient errors (toast messages)
   - Persistent issues (inline error displays)
   - Recovery suggestions

The error handling should be user-friendly and provide clear guidance on how to resolve issues. Ensure the application remains functional (with reduced capabilities if necessary) when components fail, rather than breaking completely.
Prompt 16: Final Integration and Optimization
Complete the integration of all components and optimize the flashcard application for performance and user experience. Building on all previous implementation:

1. Finalize the component hierarchy by:

   - Ensuring all components are correctly connected
   - Optimizing prop passing and state management
   - Adding any missing integration points

2. Implement performance optimizations for:

   - Reducing unnecessary re-renders with React.memo and useMemo
   - Optimizing camera processing with useCallback
   - Adding virtualization for large flashcard sets

3. Enhance the user experience with:

   - Smooth transitions between all states
   - Consistent loading indicators
   - Helpful empty states
   - Onboarding hints for first-time users

4. Add final polish with:
   - Consistent styling throughout the application
   - Responsive design for different device sizes
   - Theme support (light/dark mode)
   - Final accessibility improvements

The completed application should provide a seamless experience from installing the Chrome extension to reviewing flashcards with gesture controls. Include documentation for users on how to get started and troubleshoot common issues.
Prompt 17: Chrome Extension Packaging and Distribution
Create the necessary files and configurations to package the Chrome extension for distribution. Building on the completed extension code:

1. Update the manifest.json to:

   - Include all required fields for the Chrome Web Store
   - Set appropriate version information
   - Define icons in various required sizes

2. Create promotional materials:

   - Extension icon in multiple sizes (16, 48, 128px)
   - Screenshot of the extension in use
   - Short description (under 132 characters)
   - Detailed description for the store listing

3. Update the code to:

   - Remove any debug logging
   - Ensure all error handling is user-friendly
   - Follow Chrome Web Store policies

4. Create a simple README with:
   - Installation instructions
   - Usage guide
   - Configuration options
   - Link to the web application

The packaging should prepare the extension for either personal distribution as a ZIP file or submission to the Chrome Web Store. Include instructions for both distribution methods and any required developer steps.
Prompt 18: Web Application Building and Deployment
Create build and deployment instructions for the React web application. Building on the completed application code:

1. Configure the Vite build process to:

   - Optimize for production
   - Handle environment variables correctly
   - Generate static assets for local use

2. Create a build script that:

   - Builds the React application
   - Includes a simple local server for testing
   - Handles environment configuration

3. Write documentation for:

   - Building the application locally
   - Running it without a full development environment
   - Configuring Supabase credentials

4. Add a simple desktop wrapper option using:
   - Electron (basic configuration)
   - OR instructions for using as a PWA

The build process should be simple and work reliably on different operating systems. Focus on making it easy for users to run the application locally without requiring advanced technical knowledge.
Prompt 19: Testing and Debugging Guide
Create comprehensive testing and debugging instructions for both the Chrome extension and React application. Building on all previous code:

1. Write testing procedures for:

   - Chrome extension functionality
   - React application features
   - Camera and gesture recognition
   - Supabase integration

2. Create debugging guides for common issues:

   - Extension not appearing or functioning
   - Camera permissions and access problems
   - TensorFlow.js model loading failures
   - Supabase connection issues

3. Add developer tools for:

   - Logging important events
   - Inspecting application state
   - Testing gestures without a camera
   - Simulating database errors

4. Include a troubleshooting section for end-users with:
   - Common problems and solutions
   - How to report bugs effectively
   - Steps to reset the application if needed

The testing and debugging documentation should be accessible to both developers and end-users, with appropriate sections for each audience. Include screenshots and clear step-by-step instructions where helpful.
Prompt 20: User Documentation and Getting Started Guide
Create user documentation and a getting started guide for the complete flashcard system. Building on all previous work:

1. Write a comprehensive getting started guide covering:

   - Installing the Chrome extension
   - Setting up the React application
   - Configuring Supabase connection
   - Creating your first flashcards
   - Using gesture recognition

2. Create usage instructions for:

   - Creating flashcards from web pages
   - Organizing flashcards by difficulty
   - Using the day-based grouping system
   - Practicing with gesture controls
   - Using keyboard shortcuts

3. Add best practices for:

   - Creating effective flashcards
   - Setting up optimal lighting for gesture recognition
   - Establishing a review routine
   - Using the difficulty ratings effectively

4. Include a quick reference card with:
   - Keyboard shortcuts
   - Gesture guides
   - Common troubleshooting tips
