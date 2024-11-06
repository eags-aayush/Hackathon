// Initialize the map
const mapContainer = L.map('map').setView([20.5937, 78.9629], 5); // Center over India

// Create marker icons
const currentLocationIcon = L.icon({
    iconUrl: 'static/images/current-location.png', // Update with your icon path
    iconSize: [30, 40],
    iconAnchor: [15, 40]
});

const improvementIcon = L.icon({
    iconUrl: 'static/images/improvement.png', // Update with your icon path
    iconSize: [30, 40],
    iconAnchor: [15, 40]
});

const issueIcon = L.icon({
    iconUrl: 'static/images/issue.png', // Update with your icon path
    iconSize: [30, 40],
    iconAnchor: [15, 40]
});

// Define the geographical bounds for India
const bounds = [
    [8.083333, 68.7], // Southwest corner
    [37.6, 97.25] // Northeast corner
];

// Set the max bounds of the map to only show India
mapContainer.setMaxBounds(bounds);
mapContainer.setMinZoom(5); // Set minimum zoom to prevent zooming out too far

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapContainer);

// Function to restrict map view to India
mapContainer.on('zoomend', function () {
    // If the current view is outside the defined bounds, reset the view to India
    if (!mapContainer.getBounds().intersects(bounds)) {
        mapContainer.setView([20.5937, 78.9629], 5); // Reset to center over India
    }
});

// Get User's Live Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Display Map with User's Location
function showMap(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Center map on the user's location
    mapContainer.setView([lat, lng], 13);

    // Add marker for user's current location with custom icon
    const userMarker = L.marker([lat, lng], { icon: currentLocationIcon }).addTo(mapContainer)
        .bindPopup("You are here").openPopup();

    // Display user's address
    document.getElementById("current-address").value = `Lat: ${lat}, Lng: ${lng}`;

    // Load existing issues from the database
    loadExistingIssues();
}

// Handle errors in getting location
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Load existing issues and display them on the map
function loadExistingIssues() {
    fetch('/get-issues')
        .then(response => response.json())
        .then(issues => {
            issues.forEach(issue => {
                const [lat, lng, type, description] = issue;
                // Use the custom icon for issue markers
                L.marker([lat, lng], { icon: issueIcon }).addTo(mapContainer)
                    .bindPopup(`${type}: ${description}`);
            });
        });
}

// Handle form submission for issues
document.getElementById('issue-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const issueData = {
        latitude: userMarker.getLatLng().lat,
        longitude: userMarker.getLatLng().lng,
        issue_type: this.elements['issue-type'].value,
        description: this.elements['description'].value
    };

    // Send data to the backend
    fetch('/submit-issue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
    }).then(response => {
        if (response.ok) {
            alert('Issue submitted successfully!');
            // Refresh the map markers
            loadExistingIssues();
        } else {
            alert('Failed to submit issue.');
        }
    });
});

// Handle form submission for improvements
document.getElementById('improvement-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const improvementData = {
        latitude: userMarker.getLatLng().lat,
        longitude: userMarker.getLatLng().lng,
        improvement_type: this.elements['improvement-type'].value,
        description: this.elements['improvement-description'].value
    };

    // Send data to the backend
    fetch('/submit-improvement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(improvementData)
    }).then(response => {
        if (response.ok) {
            alert('Improvement suggestion submitted successfully!');
            // Refresh the map markers
            loadExistingIssues();
        } else {
            alert('Failed to submit improvement suggestion.');
        }
    });
});

// Get user's location when the page loads
window.onload = getLocation;
