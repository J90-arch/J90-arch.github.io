// List of countries for calibration
const calibrationCountries = [
    { name: "The Netherlands", lat: 52.1326, lon: 5.2913 },
    { name: "Cuba", lat: 21.5218, lon: -77.7812 },
    { name: "Madagascar", lat: -18.7669, lon: 46.8691 },
    { name: "Singapore", lat: 1.3521, lon: 103.8198 },
    { name: "Malta", lat: 35.9375, lon: 14.3754 }
];

let currentCountryIndex = 0;
let recordedOffsets = [];

// Start calibration process
export function startCalibration() {
    console.log(`Calibration started!`);
    console.log(`Click on: ${calibrationCountries[currentCountryIndex].name}`);
}

// Handle map clicks
export function handleCalibrationClick(event) {
    if (currentCountryIndex >= calibrationCountries.length) {
        console.log("Calibration complete!");
        calculateProjectionParameters();
        return;
    }

    const mapRect = document.getElementById('map').getBoundingClientRect();
    const clickX = event.clientX - mapRect.left;
    const clickY = event.clientY - mapRect.top;
    const mapWidth = mapRect.width;
    const mapHeight = mapRect.height;

    // Convert click coordinates to percentages
    const clickLeftPercent = (clickX / mapWidth) * 100;
    const clickTopPercent = (clickY / mapHeight) * 100;

    // Get the expected coordinates for the country
    const country = calibrationCountries[currentCountryIndex];
    const expectedLeftPercent = ((country.lon + 180) / 360) * 100;
    const expectedTopPercent = robinsonLatitudeToY(country.lat);

    // Calculate the offsets
    const longitudeOffset = clickLeftPercent - expectedLeftPercent;
    const latitudeOffset = clickTopPercent - expectedTopPercent;

    recordedOffsets.push({ longitudeOffset, latitudeOffset });

    console.log(`Captured click for ${country.name}`);
    console.log(`Expected (Lat, Lon): (${country.lat}, ${country.lon})`);
    console.log(`Expected Position: Left ${expectedLeftPercent.toFixed(2)}%, Top ${expectedTopPercent.toFixed(2)}%`);
    console.log(`Clicked Position: Left ${clickLeftPercent.toFixed(2)}%, Top ${clickTopPercent.toFixed(2)}%`);
    console.log(`Offset Captured: Longitude ${longitudeOffset.toFixed(2)}%, Latitude ${latitudeOffset.toFixed(2)}%`);

    currentCountryIndex++;

    if (currentCountryIndex < calibrationCountries.length) {
        console.log(`Click on: ${calibrationCountries[currentCountryIndex].name}`);
    } else {
        console.log("Calibration clicks complete! Calculating projection parameters...");
        calculateProjectionParameters();
    }
}

// Robinson Projection adjustment for latitude
function robinsonLatitudeToY(lat) {
    const absLat = Math.abs(lat);

    const robinsonCoefficients = [
        0.00000, 0.06200, 0.12400, 0.18600, 0.24800, 0.31000,
        0.37200, 0.43400, 0.49600, 0.55800, 0.62000, 0.68200,
        0.74400, 0.80600, 0.86800, 0.93000, 0.99200, 1.00000
    ];

    const latitudeBreakpoints = [
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
        55, 60, 65, 70, 75, 80, 90
    ];

    let lowerIndex = 0;
    for (let i = 0; i < latitudeBreakpoints.length - 1; i++) {
        if (absLat >= latitudeBreakpoints[i] && absLat <= latitudeBreakpoints[i + 1]) {
            lowerIndex = i;
            break;
        }
    }

    const lowerLat = latitudeBreakpoints[lowerIndex];
    const upperLat = latitudeBreakpoints[lowerIndex + 1];
    const lowerCoeff = robinsonCoefficients[lowerIndex];
    const upperCoeff = robinsonCoefficients[lowerIndex + 1];

    const ratio = (absLat - lowerLat) / (upperLat - lowerLat);
    const scale = lowerCoeff + ratio * (upperCoeff - lowerCoeff);

    const yPercentage = lat >= 0
        ? (50 - scale * 50)
        : (50 + scale * 50);

    return yPercentage;
}

// Calculate final projection parameters and export them
export function calculateProjectionParameters() {
    const totalOffsets = recordedOffsets.reduce((acc, offset) => {
        acc.longitudeOffset += offset.longitudeOffset;
        acc.latitudeOffset += offset.latitudeOffset;
        return acc;
    }, { longitudeOffset: 0, latitudeOffset: 0 });

    const numClicks = recordedOffsets.length;
    const avgLongitudeOffset = totalOffsets.longitudeOffset / numClicks;
    const avgLatitudeOffset = totalOffsets.latitudeOffset / numClicks;

    console.log(`\nCalibration Complete!`);
    console.log(`Recommended Longitude Offset: ${avgLongitudeOffset.toFixed(2)}%`);
    console.log(`Recommended Latitude Offset: ${avgLatitudeOffset.toFixed(2)}%`);

    console.log(`\nApply these offsets to your dot placement logic:`);
    console.log(`
        const leftPosition = ((lon + 180) / 360) * 100 + ${avgLongitudeOffset.toFixed(2)};
        const topPosition = robinsonLatitudeToY(lat) + ${avgLatitudeOffset.toFixed(2)};
    `);

    // Export the calculated parameters
    return {
        longitudeOffset: avgLongitudeOffset,
        latitudeOffset: avgLatitudeOffset
    };
}
