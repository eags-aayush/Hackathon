document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const addressInput = document.getElementById('current-address');
    const issueForm = document.getElementById('issue-form');
    const improvementForm = document.getElementById('improvement-form');

    // Initially hide the loading screen
    loadingScreen.style.display = 'none';

    // Initialize the Leaflet.js map
    const map = L.map('map').setView([51.505, -0.09], 13); // Default center (London for example)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Check for geolocation support and get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Update the map view to the user's location
            map.setView([lat, lng], 13);

            // Display user's coordinates in the address input box
            addressInput.value = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

            // Add a marker to show user's current location
            L.marker([lat, lng]).addTo(map)
                .bindPopup('Your current location').openPopup();
        }, error => {
            console.error("Error getting location: ", error);
            addressInput.value = "Unable to retrieve your location.";
        });
    } else {
        addressInput.value = "Geolocation is not supported by your browser.";
    }

    // Function to add a marker for an issue
    function addIssueMarker(lat, lng, description) {
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>Issue:</b> ${description}`)
            .openPopup();
    }

    // Function to add a marker for an improvement
    function addImprovementMarker(lat, lng, description) {
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>Improvement:</b> ${description}`)
            .openPopup();
    }

    // Show the loading screen for 3 seconds and then hide it
    function showLoadingScreen() {
        loadingScreen.style.display = 'flex'; // Show the loading screen
        setTimeout(() => {
            loadingScreen.style.display = 'none'; // Hide after 3 seconds
        }, 3000);
    }

    // Handle Issue Form Submission
    issueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showLoadingScreen(); // Show loading screen on form submission

        const lat = map.getCenter().lat; // Example using map's current center
        const lng = map.getCenter().lng;
        const description = e.target.elements['description'].value;

        // Add marker to the map
        addIssueMarker(lat, lng, description);
    });

    // Handle Improvement Form Submission
    improvementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showLoadingScreen(); // Show loading screen on form submission

        const lat = map.getCenter().lat; // Example using map's current center
        const lng = map.getCenter().lng;
        const description = e.target.elements['improvement-description'].value;

        // Add marker to the map
        addImprovementMarker(lat, lng, description);
    });
});
