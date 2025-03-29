document.addEventListener("DOMContentLoaded", function() {
    // Fetch navbar and footer components
    const navbarPromise = fetch('components/navbar.html').then(response => response.text());
    const footerPromise = fetch('components/footer.html').then(response => response.text());

    Promise.all([navbarPromise, footerPromise]).then(([navbarHTML, footerHTML]) => {
        // Insert the fetched HTML into the placeholders
        document.getElementById('navbar').innerHTML = navbarHTML;
        document.getElementById('footer').innerHTML = footerHTML;

        // Now that the components are loaded, remove the preload class to display the page
        document.body.classList.remove('preload');

        // ---- Update footer dates (Option A) ----
        const currentYear = new Date().getFullYear();
        const footerCurrentYearEl = document.getElementById('current-year');
        const footerNextYearEl = document.getElementById('next-year');
        if (footerCurrentYearEl && footerNextYearEl) {
            footerCurrentYearEl.textContent = currentYear;
            footerNextYearEl.textContent = currentYear + 1;
        }
        // -----------------------------------------

        // Smooth scrolling for navigation links (only for internal hash links)
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
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
    }).catch(error => {
        console.error('Error loading components:', error);
        // Even if an error occurs, unhide the page
        document.body.classList.remove('preload');
    });
});