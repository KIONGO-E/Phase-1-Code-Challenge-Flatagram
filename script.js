// Constants
const baseUrl = 'http://localhost:3000';
const imageId = 1; // Assuming we always want to work with image ID 1

// DOM Elements
const titleElement = document.getElementById('card-title');
const imageElement = document.getElementById('card-image');
const likeCountElement = document.getElementById('like-count');
const likeButton = document.getElementById('like-button');
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment');

// Fetch image data and comments
async function fetchImageData() {
  try {
    const response = await fetch(`${baseUrl}/images/${imageId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching image data:', error);
  }
}

// Update UI with image data and comments
async function updateUI() {
  const imageData = await fetchImageData();
  if (imageData) {
    titleElement.textContent = imageData.title;
    imageElement.src = imageData.image;
    likeCountElement.textContent = `${imageData.likes} likes`;

    // Clear previous comments
    commentsList.innerHTML = '';

    // Add comments to the comments list
    imageData.comments.forEach(comment => {
      const li = document.createElement('li');
      li.textContent = comment.content;
      commentsList.appendChild(li);
    });
  }
}

likeButton.addEventListener('click', async () => {
    // Increment likes visually
    const currentLikes = parseInt(likeCountElement.textContent);
    const updatedLikes = currentLikes + 1;
    likeCountElement.textContent = `${updatedLikes} likes`;
  
    // Send PATCH request to update likes on the server
    try {
      const response = await fetch(`${baseUrl}/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: updatedLikes }),
      });
      if (!response.ok) {
        throw new Error('Failed to update likes on server');
      }
      
    } catch (error) {
      console.error('Error updating likes on server:', error);
      // Revert the UI change if update fails (optional)
      likeCountElement.textContent = `${currentLikes} likes`;
    }
  });
  
// Event listeners
likeButton.addEventListener('click', async () => {
  // Increment likes (no persistence)
  const imageData = await fetchImageData();
  if (imageData) {
    imageData.likes++;
    likeCountElement.textContent = `${imageData.likes} likes`;
  }
});

commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = commentInput.value.trim();
  if (content) {
    const newComment = {
      imageId: imageId,
      content: content,
    };
    // Update UI instantly (no persistence)
    const li = document.createElement('li');
    li.textContent = content;
    commentsList.appendChild(li);
    commentInput.value = ''; // Clear input field
  }
});

// Initialize the app
updateUI();
