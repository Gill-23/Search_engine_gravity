// Gravity Simulation Script

// Define gravity and friction constants
const GRAVITY = 0.3;
const FRICTION = 0.6; // Reduced friction for less bouncing

// Select elements to apply gravity to
const elements = document.querySelectorAll('.nav-bar, .search-container, .history-container, .additional-button, .search-button, .nav-button');

// Initialize properties for each element
const physicsElements = Array.from(elements).map(element => {
    // Get the current position relative to the viewport
    const rect = element.getBoundingClientRect();
    
    // Set initial position based on current layout
    element.style.position = 'absolute';
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    
    // Initialize velocity
    return {
        element: element,
        x: rect.left,
        y: rect.top,
        vx: 0,
        vy: 0,
        width: rect.width,
        height: rect.height,
        isSettled: false // Flag to check if the element has settled
    };
});

// Animation loop
function animate() {
    physicsElements.forEach(obj => {
        if (obj.isSettled) return; // Skip if the element has settled

        // Apply gravity
        obj.vy += GRAVITY;

        // Update positions
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Collision with bottom of the viewport
        if (obj.y + obj.height >= window.innerHeight) {
            obj.y = window.innerHeight - obj.height;
            obj.vy *= -FRICTION;

            // If the velocity is very small, stop the movement
            if (Math.abs(obj.vy) < 1) {
                obj.vy = 0;
                obj.vx = 0;
                obj.isSettled = true;
            }
        }

        // Collision with top of the viewport
        if (obj.y <= 0) {
            obj.y = 0;
            obj.vy *= -FRICTION;
        }

        // Collision with right side
        if (obj.x + obj.width >= window.innerWidth) {
            obj.x = window.innerWidth - obj.width;
            obj.vx *= -FRICTION;
        }

        // Collision with left side
        if (obj.x <= 0) {
            obj.x = 0;
            obj.vx *= -FRICTION;
        }

        // Apply the updated positions to the element
        obj.element.style.left = `${obj.x}px`;
        obj.element.style.top = `${obj.y}px`;
    });

    requestAnimationFrame(animate);
}

// Start the animation
animate();

// Handle window resize to adjust element positions
window.addEventListener('resize', () => {
    physicsElements.forEach(obj => {
        // Ensure elements stay within the new viewport dimensions
        if (obj.x + obj.width > window.innerWidth) {
            obj.x = window.innerWidth - obj.width;
        }
        if (obj.y + obj.height > window.innerHeight) {
            obj.y = window.innerHeight - obj.height;
            obj.vy = 0;
            obj.vx = 0;
            obj.isSettled = true;
        }
        obj.element.style.left = `${obj.x}px`;
        obj.element.style.top = `${obj.y}px`;
    });
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const searchHistoryList = document.querySelector('.search-history');

const searchHistory = [];

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchHistory.unshift(searchTerm);
        updateSearchHistory();
        searchInput.value = '';
        // Implement your search functionality here
        // For example, redirect to a search results page
        // window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    }
});

function updateSearchHistory() {
    searchHistoryList.innerHTML = '';
    searchHistory.forEach(term => {
        const listItem = document.createElement('li');
        listItem.textContent = term;
        searchHistoryList.appendChild(listItem);
    });
}
