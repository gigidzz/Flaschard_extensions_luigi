chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'saveFlashcard') {
    console.log('Flashcard received in background.js:', request.flashcard);
    
    const transformedFlashcard = {
      front: request.flashcard.title,
      back: request.flashcard.content,
      hint: request.flashcard.hint,
      tags: request.flashcard.tags || []
    };
    
    console.log('Sending transformed flashcard to server:', transformedFlashcard);
    
    fetch('http://localhost:3000/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transformedFlashcard)
    })
    .then(response => {
      console.log('Response from server:', response);
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'Network response was not ok');
        });
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