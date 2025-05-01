# Flaschard_extensions_luigi

A web application designed to help users practice flashcards. The system supports creating, managing, and practicing flashcards with features like spaced repetition, statistics tracking, and a browser extension for quick card creation.

## Features

- **Flashcard Management**: Create, read, update, and delete flashcards.
- **Practice System**: Practice flashcards with difficulty tracking and spaced repetition.
- **Statistics**: View your practice statistics and performance.
- **Browser Extension**: Create flashcards directly from selected text in the browser.
- **Gesture Recognition**: Use hand gestures to control the practice system (via TensorFlow.js).

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Supabase
- **Frontend**: Vite, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Browser Extension**: JavaScript, HTML/CSS
- **Gesture Recognition**: TensorFlow.js

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher

### Setting Up the Project

Follow these steps to get the project up and running on your local machine.

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/gigidzz/Flaschard_extensions_luigi.git
   cd Flashcard-extensions-luigi
   cd backend 
2. npm install
3. configure .env and .env.testing files
4. npm run dev

### Frontend Setup
5. navigate to frontend folder, and same steps without .env.testing

## browser extension setup
6. cd browser-extension
7. Follow the browser-specific instructions to load the unpacked extension. For Chrome:

Go to chrome://extensions/

Enable "Developer Mode"

Click "Load Unpacked" and select the extension folder.

8. Running Tests
To run unit tests, use:

npm test