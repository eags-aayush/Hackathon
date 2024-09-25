document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const issueForm = document.getElementById('issue-form');
    const improvementForm = document.getElementById('improvement-form');
    const mapContainer = L.map('map').setView([51.505, -0.09], 13); // Default center

    // Hide loading screen initially
    loadingScreen.style.display = 'none';

    // Initialize the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapContainer);

    let userMarker, issueMarker, suggestionMarker;

    // Function to set the user's live location
    function setUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                // Add marker at user's current location
                userMarker = L.marker([latitude, longitude]).addTo(mapContainer)
                    .bindPopup('You are here')
                    .openPopup();

                // Center map on the user's location
                mapContainer.setView([latitude, longitude], 13);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Function to show loading screen and refresh page
    function showLoadingScreen(event) {
        event.preventDefault(); // Prevent form from submitting immediately

        // Show the loading screen
        loadingScreen.style.display = 'flex';

        // Simulate loading for 3 seconds, then refresh the page
        setTimeout(() => {
            loadingScreen.style.display = 'none'; // Hide loading screen after timeout
            window.location.reload(); // Refresh the page
        }, 3000); // 3 seconds
    }

    // Attach the loading screen to both forms' submit events
    issueForm.addEventListener('submit', showLoadingScreen);
    improvementForm.addEventListener('submit', showLoadingScreen);

    // Trigger the user's location when the page loads
    setUserLocation();
});
