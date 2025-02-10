// Offset variables in degrees for manual adjustment (tweak these as needed)
const longitudeOffsetDeg = -24;    // Positive moves dots east, negative moves them west
const latitudeOffsetDeg = -1;    // Positive moves dots north, negative moves them south

// Latitude cutoff variables in degrees (adjust based on your map's cropping)
const cutoffTopDeg = 10;          // Degrees cut off from the top (north), e.g., if 10° is missing from the top, set to 10
const cutoffBottomDeg = 35;      // Degrees cut off from the bottom (south), e.g., Antarctica missing => set to 70

// Longitude cutoff variables in degrees (adjust based on your map's cropping)
const cutoffLeftDeg = 10;         // Degrees cut off from the left (west), e.g., if 30° is missing from the left, set to 30
const cutoffRightDeg = 0;        // Degrees cut off from the right (east), e.g., if 20° is missing from the right, set to 20


// Load the map image and draw it onto a hidden canvas
const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

// Load 'map.png' to detect land areas
const mapImage = new Image();
mapImage.src = 'map.png';

mapImage.onload = () => {
    // Match canvas size to the image dimensions
    canvas.width = mapImage.width;
    canvas.height = mapImage.height;

    // Draw the map onto the canvas
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    // Place random dots, user location, and known locations
    generateDots();
    fetchUserLocation();
};

// Generate random red dots on land
function generateDots() {
    const targetDots = Math.floor(Math.random() * 5) + 3;  // Random number between 3 and 7
    let placedDots = 0;
    let attempts = 0;

    while (placedDots < targetDots && attempts < 1000) {
        const randomX = Math.floor(Math.random() * canvas.width);
        const randomY = Math.floor(Math.random() * canvas.height);

        // Check if the pixel at (randomX, randomY) is black (land)
        const pixel = ctx.getImageData(randomX, randomY, 1, 1).data;

        if (isBlack(pixel)) {
            placeDot(randomY, randomX);
            placedDots++;
        }

        attempts++;
    }

    console.log(`${placedDots} dots successfully placed on land.`);
}

// Check if the pixel is black (R=0, G=0, B=0, A=255)
function isBlack(pixel) {
    return pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 255;
}

// Place red dots on the map
function placeDot(top, left) {
    const pulse = document.createElement('div');
    pulse.className = 'pulse';

    const dotLayer = document.getElementById('dot-layer');

    // Convert canvas coordinates to percentage of the screen
    const topPosition = (top / canvas.height) * 100;
    const leftPosition = (left / canvas.width) * 100;

    pulse.style.top = `${topPosition}%`;
    pulse.style.left = `${leftPosition}%`;

    dotLayer.appendChild(pulse);
}

// Fetch user location and place a green dot
async function fetchUserLocation() {
    try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        if (data.status === 'success') {
            placeUserLocationDot(data.lat, data.lon);
        }
    } catch (error) {
        console.error('Failed to fetch user location:', error);
    }
}

// Place the user's location using Robinson projection with offsets
function placeUserLocationDot(lat, lon) {
    const dotLayer = document.getElementById('dot-layer');

    // Apply degree offsets for fine-tuning
    const adjustedLon = lon + longitudeOffsetDeg;
    const adjustedLat = lat + latitudeOffsetDeg;

    // Convert adjusted longitude to percentage with cutoffs
    const leftPosition = mapLongitudeToX(adjustedLon);

    // Convert adjusted latitude using Robinson Projection with cutoffs
    const topPosition = mapLatitudeToY(adjustedLat);

    // Create and place the green dot
    const userDot = document.createElement('div');
    userDot.className = 'user-location';
    userDot.style.top = `${topPosition}%`;
    userDot.style.left = `${leftPosition}%`;

    dotLayer.appendChild(userDot);
}

// Adjusted mapping for longitude with left and right cutoffs
function mapLongitudeToX(lon) {
    const maxLon = 180 - cutoffRightDeg;   // Adjusted max longitude (right edge of the map)
    const minLon = -180 + cutoffLeftDeg;   // Adjusted min longitude (left edge of the map)

    // Clamp longitudes to ensure they stay within visible map
    if (lon > maxLon) lon = maxLon;
    if (lon < minLon) lon = minLon;

    // Normalize longitude to a 0-1 range based on visible map
    const normalizedLon = (lon - minLon) / (maxLon - minLon);

    // Convert to percentage of map width
    return normalizedLon * 100;
}

// Adjusted Robinson Projection mapping for latitude with top and bottom cutoffs
function mapLatitudeToY(lat) {
    const maxLat = 90 - cutoffTopDeg;     // Adjusted maximum latitude (top of the map)
    const minLat = -90 + cutoffBottomDeg; // Adjusted minimum latitude (bottom of the map)

    // Clamp latitudes to ensure they stay within visible map
    if (lat > maxLat) lat = maxLat;
    if (lat < minLat) lat = minLat;

    // Normalize latitude to a 0-1 range based on visible map
    const normalizedLat = (maxLat - lat) / (maxLat - minLat);

    // Convert to percentage of map height
    return normalizedLat * 100;
}
