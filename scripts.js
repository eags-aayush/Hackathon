document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.display = 'none'; // Hide the loading screen
        // Optionally, use location.reload() to refresh the page
        // location.reload();
    }, 3000); // 3000 milliseconds = 3 seconds
});
