// ISO 3166-1 numeric → alpha-2 code mapping
const NUM_TO_ALPHA = {
    "840": "US", "124": "CA", "484": "MX", "076": "BR", "032": "AR", "152": "CL", "170": "CO", "604": "PE", "862": "VE",
    "826": "GB", "250": "FR", "724": "ES", "276": "DE", "380": "IT", "752": "SE", "528": "NL", "643": "RU", "792": "TR",
    "156": "CN", "392": "JP", "410": "KR", "356": "IN", "566": "NG", "036": "AU", "554": "NZ",
    "818": "EG", "710": "ZA", "404": "KE", "012": "DZ", "504": "MA", "788": "TN", "434": "LY",
    "360": "ID", "764": "TH", "704": "VN", "608": "PH", "458": "MY", "682": "SA", "364": "IR", "368": "IQ",
    "616": "PL", "804": "UA", "203": "CZ", "040": "AT", "756": "CH", "056": "BE", "620": "PT", "246": "FI",
    "578": "NO", "208": "DK", "372": "IE", "300": "GR", "642": "RO", "100": "BG", "348": "HU", "191": "HR",
    "807": "MK", "070": "BA", "688": "RS", "008": "AL", "498": "MD",
    "586": "PK", "050": "BD", "144": "LK", "104": "MM", "524": "NP", "116": "KH", "418": "LA",
    "858": "UY", "600": "PY", "068": "BO", "218": "EC", "328": "GY", "740": "SR",
    "180": "CD", "024": "AO", "508": "MZ", "834": "TZ", "800": "UG",
    "232": "ER", "231": "ET", "706": "SO", "729": "SD", "148": "TD", "562": "NE", "466": "ML",
    "854": "BF", "384": "CI", "288": "GH", "694": "SL", "324": "GN",
    "120": "CM", "140": "CF", "178": "CG", "266": "GA", "226": "GQ",
    "716": "ZW", "894": "ZM", "454": "MW", "072": "BW", "516": "NA",
    "480": "MU", "450": "MG",
    "320": "GT", "340": "HN", "222": "SV", "558": "NI", "188": "CR", "591": "PA",
    "192": "CU", "332": "HT", "214": "DO", "388": "JM",
    "496": "MN", "398": "KZ", "860": "UZ", "795": "TM", "417": "KG", "762": "TJ",
    "268": "GE", "031": "AZ", "051": "AM",
    "376": "IL", "400": "JO", "422": "LB", "760": "SY", "275": "PS",
    "784": "AE", "512": "OM", "887": "YE", "634": "QA", "414": "KW", "048": "BH",
    "408": "KP", "158": "TW", "242": "FJ", "352": "IS", "304": "GL",
    "010": "AQ",
    // Baltics & small European
    "440": "LT", "428": "LV", "233": "EE", "703": "SK", "705": "SI", "442": "LU", "499": "ME",
    // Africa additional
    "204": "BJ", "108": "BI", "262": "DJ", "270": "GM", "426": "LS", "430": "LR",
    "478": "MR", "646": "RW", "686": "SN", "728": "SS", "732": "EH", "748": "SZ", "768": "TG",
    "624": "GW",
    // Asia additional
    "004": "AF", "064": "BT", "096": "BN", "626": "TL",
    // Americas additional
    "044": "BS", "084": "BZ", "238": "FK", "598": "PG", "630": "PR", "780": "TT",
    // Oceania additional
    "090": "SB", "540": "NC", "548": "VU",
    // Europe additional
    "112": "BY", "196": "CY", "260": "TF",
};

const MAP_NAMES = {
    "US": "United States", "CA": "Canada", "MX": "Mexico", "BR": "Brazil", "AR": "Argentina",
    "CL": "Chile", "CO": "Colombia", "PE": "Peru", "VE": "Venezuela", "EC": "Ecuador",
    "BO": "Bolivia", "PY": "Paraguay", "UY": "Uruguay", "GY": "Guyana", "SR": "Suriname",
    "GB": "United Kingdom", "FR": "France", "ES": "Spain", "DE": "Germany", "IT": "Italy",
    "SE": "Sweden", "NL": "Netherlands", "RU": "Russia", "TR": "Turkey", "PT": "Portugal",
    "BE": "Belgium", "AT": "Austria", "CH": "Switzerland", "PL": "Poland", "CZ": "Czechia",
    "UA": "Ukraine", "RO": "Romania", "BG": "Bulgaria", "HU": "Hungary", "HR": "Croatia",
    "RS": "Serbia", "BA": "Bosnia & Herzegovina", "AL": "Albania", "MK": "North Macedonia",
    "MD": "Moldova", "FI": "Finland", "NO": "Norway", "DK": "Denmark", "IE": "Ireland",
    "GR": "Greece", "IS": "Iceland", "GL": "Greenland",
    "CN": "China", "JP": "Japan", "KR": "South Korea", "KP": "North Korea", "IN": "India",
    "PK": "Pakistan", "BD": "Bangladesh", "LK": "Sri Lanka", "MM": "Myanmar", "NP": "Nepal",
    "KH": "Cambodia", "LA": "Laos", "TH": "Thailand", "VN": "Vietnam", "MY": "Malaysia",
    "ID": "Indonesia", "PH": "Philippines", "TW": "Taiwan", "MN": "Mongolia",
    "KZ": "Kazakhstan", "UZ": "Uzbekistan", "TM": "Turkmenistan", "KG": "Kyrgyzstan", "TJ": "Tajikistan",
    "GE": "Georgia", "AZ": "Azerbaijan", "AM": "Armenia",
    "SA": "Saudi Arabia", "IR": "Iran", "IQ": "Iraq", "SY": "Syria", "JO": "Jordan",
    "IL": "Israel", "LB": "Lebanon", "AE": "UAE", "OM": "Oman", "YE": "Yemen",
    "KW": "Kuwait", "QA": "Qatar",
    "EG": "Egypt", "ZA": "South Africa", "KE": "Kenya", "NG": "Nigeria", "ET": "Ethiopia",
    "TZ": "Tanzania", "UG": "Uganda", "DZ": "Algeria", "MA": "Morocco", "TN": "Tunisia",
    "LY": "Libya", "SD": "Sudan", "TD": "Chad", "NE": "Niger", "ML": "Mali",
    "BF": "Burkina Faso", "CI": "Ivory Coast", "GH": "Ghana", "SL": "Sierra Leone",
    "GN": "Guinea", "CM": "Cameroon", "CF": "Central African Rep.", "CG": "Congo",
    "CD": "DR Congo", "AO": "Angola", "MZ": "Mozambique", "ZW": "Zimbabwe", "ZM": "Zambia",
    "MW": "Malawi", "BW": "Botswana", "NA": "Namibia", "MG": "Madagascar", "SO": "Somalia",
    "ER": "Eritrea", "GA": "Gabon", "GQ": "Equatorial Guinea",
    "AU": "Australia", "NZ": "New Zealand", "FJ": "Fiji",
    "GT": "Guatemala", "HN": "Honduras", "SV": "El Salvador", "NI": "Nicaragua",
    "CR": "Costa Rica", "PA": "Panama", "CU": "Cuba", "HT": "Haiti", "DO": "Dominican Republic",
    "JM": "Jamaica",
    // Baltics & small European
    "LT": "Lithuania", "LV": "Latvia", "EE": "Estonia", "SK": "Slovakia", "SI": "Slovenia",
    "LU": "Luxembourg", "ME": "Montenegro", "BY": "Belarus", "CY": "Cyprus",
    // Africa additional
    "BJ": "Benin", "BI": "Burundi", "DJ": "Djibouti", "GM": "Gambia", "LS": "Lesotho",
    "LR": "Liberia", "MR": "Mauritania", "RW": "Rwanda", "SN": "Senegal", "SS": "South Sudan",
    "EH": "Western Sahara", "SZ": "Eswatini", "TG": "Togo", "GW": "Guinea-Bissau",
    // Asia additional
    "AF": "Afghanistan", "BT": "Bhutan", "BN": "Brunei", "TL": "Timor-Leste",
    // Americas additional
    "BS": "Bahamas", "BZ": "Belize", "FK": "Falkland Islands", "PG": "Papua New Guinea",
    "PR": "Puerto Rico", "TT": "Trinidad & Tobago",
    // Oceania additional
    "SB": "Solomon Islands", "NC": "New Caledonia", "VU": "Vanuatu",
    // Other
    "TF": "French Southern Territories",
};

// Convert alpha-2 code to flag emoji (e.g. "US" → 🇺🇸)
function countryFlag(code) {
    if (!code || code.length !== 2) return "";
    return String.fromCodePoint(
        ...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
    );
}

function buildMap() {
    const svg = d3.select("#world-map");
    const container = document.querySelector(".map-area");
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Natural Earth projection — handles antimeridian correctly
    const projection = d3.geoNaturalEarth1()
        .scale(width / 5.8)
        .translate([width / 2, height / 2]);

    const pathGen = d3.geoPath().projection(projection);

    const zoomLayer = svg.append("g").attr("class", "map-zoom-layer");

    // Subtle graticule (grid lines)
    const graticule = d3.geoGraticule().step([20, 20]);
    zoomLayer.append("path")
        .datum(graticule())
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#d6dee7")
        .attr("stroke-width", 0.3);

    // Globe outline
    zoomLayer.append("path")
        .datum({ type: "Sphere" })
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#c6d2de")
        .attr("stroke-width", 0.5);

    // Draw countries from inlined TopoJSON (WORLD_TOPO from world-data.js)
    const countries = topojson.feature(WORLD_TOPO, WORLD_TOPO.objects.countries).features;

    zoomLayer.selectAll("path.country")
        .data(countries)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", pathGen)
        .attr("data-code", d => NUM_TO_ALPHA[String(d.id)] || "")
        .attr("data-name", d => {
            const code = NUM_TO_ALPHA[String(d.id)];
            return code ? (MAP_NAMES[code] || code) : "";
        });

    const zoomBehavior = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[-width, -height], [width * 2, height * 2]])
        .on("zoom", event => {
            zoomLayer.attr("transform", event.transform);
        });

    svg.call(zoomBehavior);
    svg.node().__mapZoomBehavior = zoomBehavior;
}
