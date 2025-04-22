let flashcardButtonActive = false;

function removeFlashcardButton() {
  const existingButton = document.getElementById('flashcard-button');
  if (existingButton) {
    existingButton.remove();
    flashcardButtonActive = false;
  }
}

let lastSelectedText = '';

document.addEventListener('mouseup', function(e) {
  setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();
    lastSelectedText = selectedText;
    
    removeFlashcardButton();
    
    if (selectedText.length > 0) {
      const button = document.createElement('div');
      button.id = 'flashcard-button';
      button.innerText = '+';
      button.title = 'Create Flashcard';
      
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      button.style.top = `${rect.bottom + window.scrollY + 10}px`;
      button.style.left = `${rect.left + (rect.width / 2) - 10}px`;
      
      button.addEventListener('click', function(btnEvent) {
        btnEvent.stopPropagation();
        
        const pageUrl = window.location.href;
        const pageTitle = document.title;
        
        showFlashcardPopup(lastSelectedText, pageUrl, pageTitle);
        removeFlashcardButton();
      });
      
      document.body.appendChild(button);
      flashcardButtonActive = true;
    }
  }, 10);
});

document.addEventListener('click', function(e) {
  if (flashcardButtonActive && 
      e.target.id !== 'flashcard-button' && 
      !e.target.closest('#flashcard-popup')) {
    const selection = window.getSelection();
    if (selection.toString().trim().length === 0) {
      removeFlashcardButton();
    }
  }
});

window.addEventListener('blur', removeFlashcardButton);

window.addEventListener('scroll', removeFlashcardButton);

function showFlashcardPopup(text, url, pageTitle) {
  const existingPopup = document.getElementById('flashcard-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  const popup = document.createElement('div');
  popup.id = 'flashcard-popup';
  
  popup.innerHTML = `
    <div class="popup-header">
      <h3>Create Flashcard</h3>
      <button id="close-popup" type="button">×</button>
    </div>
    <div class="popup-content">
      <div class="form-group">
        <label for="card-title">Flashcard Title:</label>
        <input type="text" id="card-title" placeholder="Enter a title for this flashcard">
      </div>
      <div class="form-group">
        <label for="card-content">Content:</label>
        <textarea id="card-content">${text}</textarea>
      </div>
      <div class="form-group">
        <label for="card-hint">Hint:</label>
        <textarea id="card-hint" placeholder="Enter a hint (optional)"></textarea>
      </div>
      <div class="form-group">
        <label for="card-tags">Tags (comma separated):</label>
        <input type="text" id="card-tags" placeholder="Enter tags">
      </div>
      <button id="save-card" type="button">Save Flashcard</button>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  const closeButton = document.getElementById('close-popup');
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation();
      popup.remove();
    });
  }
  
  const saveButton = document.getElementById('save-card');
  if (saveButton) {
    saveButton.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const title = document.getElementById('card-title').value;
      const content = document.getElementById('card-content').value;
      const hint = document.getElementById('card-hint').value;
      const tags = document.getElementById('card-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const flashcard = {
        title: title || 'Untitled',
        content,
        hint,
        source: {
          url,
          title: pageTitle
        },
        tags,
        createdAt: new Date().toISOString()
      };
    
    chrome.runtime.sendMessage({
      action: 'saveFlashcard',
      flashcard
    }, function(response) {
      console.log(response, 'response')
      if (response && response.success) {
        const savedMessage = document.createElement('div');
        savedMessage.className = 'saved-message';
        savedMessage.innerText = 'Flashcard saved!';
        popup.appendChild(savedMessage);
        
        setTimeout(function() {
          popup.remove();
        }, 1500);
      } else {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerText = 'Error saving flashcard. Please try again.';
        popup.appendChild(errorMessage);
      }
    });
  });
}
}