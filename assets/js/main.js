document.addEventListener("DOMContentLoaded", function() {
    console.log("Main JS loaded");
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal links
        if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
            });
        }
        }
    });
    });
});