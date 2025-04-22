chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'saveFlashcard') {
    console.log('Flashcard received in background.js:', request.flashcard);

    fetch('http://localhost:3000/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.flashcard)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Flashcard saved successfully:', data);
      sendResponse({ success: true, data });
    })
    .catch(error => {
      console.error('Error saving flashcard:', error);
      sendResponse({ success: false, error: error.message });
    });
    
    return true;
  }
});

chrome.runtime.onInstalled.addListener(function() {
  console.log('Flashcard Extension installed');
});