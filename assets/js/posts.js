document.addEventListener("DOMContentLoaded", function() {
    fetch('data/posts.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('postsContainer');
        data.posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.date}</p>
            <div class="post-content">${post.content}</div>
        `;
        container.appendChild(postEl);
        });
        // Apply syntax highlighting after posts are added.
        Prism.highlightAll();
        // LaTeX content can be rendered here if further processing is needed.
    })
    .catch(error => console.error('Error loading posts:', error));
});