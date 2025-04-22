document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/stats')
      .then(response => response.json())
      .then(data => {
        document.getElementById('card-count').textContent = 
          `You have ${data.totalCards} flashcards.`;
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
        document.getElementById('card-count').textContent = 
          'Could not load stats. Please check your connection.';
      });
  });