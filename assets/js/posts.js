document.addEventListener("DOMContentLoaded", function() {
    const postFullView = document.getElementById('postFullView');
    const closePostBtn = document.getElementById('closePostBtn');
    const postFullContent = document.getElementById('postFullContent');
    const IMAGE_PATH = 'assets/images/';
    const DEFAULT_IMAGE = 'placeholder.jpg';
    let posts = [];
    
    // Load posts from JSON
    fetch('data/posts.json')
    .then(response => response.json())
    .then(data => {
        posts = data.posts;
        renderPostCards(posts);
    })
    .catch(error => console.error('Error loading posts:', error));
    
    // Get full image path
    function getImagePath(imageName) {
    if (!imageName) {
        return IMAGE_PATH + DEFAULT_IMAGE;
    }
    return IMAGE_PATH + imageName;
    }
    
    function renderPostCards(posts) {
        const container = document.getElementById('postsContainer');
        container.innerHTML = '';
        
        posts.forEach((post, index) => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.setAttribute('data-post-index', index);
            
            // Get full image path
            const imageUrl = getImagePath(post.image);
            
            postCard.innerHTML = `
                <img src="${imageUrl}" alt="${post.title}" class="post-card-image">
                <div class="post-card-content">
                    <h2 class="post-card-title">${post.title}</h2>
                    <p class="post-card-date">${post.date}</p>
                    <p class="post-card-description">${post.description}</p>
                </div>
            `;
            
            // Add click event to open full post
            postCard.addEventListener('click', function() {
                const postIndex = this.getAttribute('data-post-index');
                openFullPost(posts[postIndex]);
            });
            
            container.appendChild(postCard);
        });
    }
    
    // Open full post in modal
    function openFullPost(post) {
    // Get full image path
    const imageUrl = getImagePath(post.image);
    
    postFullContent.innerHTML = `
        <div class="post-full-header">
        <div>
            <h1 class="post-full-title">${post.title}</h1>
            <p class="post-full-date">${post.date}</p>
        </div>
        </div>
        <img src="${imageUrl}" alt="${post.title}" class="post-full-image">
        <div class="post-content">${post.content}</div>
    `;
    
    // Show modal
    postFullView.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Apply syntax highlighting
    Prism.highlightAllUnder(postFullContent);
    
    // Render LaTeX content
    renderMathInElement(postFullContent, {
        delimiters: [
        {left: "\\[", right: "\\]", display: true},
        {left: "\\(", right: "\\)", display: false}
        ]
    });
    }
    
    // Close full post modal
    closePostBtn.addEventListener('click', function() {
    postFullView.style.display = 'none';
    document.body.classList.remove('modal-open');
    });
    
    // Close modal when clicking outside of content
    postFullView.addEventListener('click', function(event) {
    if (event.target === postFullView) {
        postFullView.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && postFullView.style.display === 'block') {
        postFullView.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    });
});