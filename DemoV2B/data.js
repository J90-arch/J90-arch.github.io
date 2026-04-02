// Sample data for countries, movies, and TV shows
const SEEDED_COUNTRY_DATA = {
    US: {
        name: "United States",
        flag: "\u{1F1FA}\u{1F1F8}",
        movies: [
            { title: "Oppenheimer", genre: "Drama / History", rating: "8.5/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "Spider-Man: Across the Spider-Verse", genre: "Animation / Action", rating: "8.7/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Killers of the Flower Moon", genre: "Crime / Drama", rating: "7.8/10", streaming: [{ name: "Apple TV+", tag: "apple" }] },
            { title: "Barbie", genre: "Comedy / Fantasy", rating: "7.0/10", streaming: [{ name: "HBO Max", tag: "hbo" }] },
        ],
        tvshows: [
            { title: "Stranger Things", genre: "Sci-Fi / Horror", rating: "8.7/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "The Last of Us", genre: "Drama / Action", rating: "8.8/10", streaming: [{ name: "HBO Max", tag: "hbo" }] },
            { title: "Only Murders in the Building", genre: "Comedy / Mystery", rating: "8.1/10", streaming: [{ name: "Hulu", tag: "hulu" }] },
            { title: "Andor", genre: "Sci-Fi / Drama", rating: "8.4/10", streaming: [{ name: "Disney+", tag: "disney" }] },
            { title: "Yellowjackets", genre: "Drama / Thriller", rating: "7.9/10", streaming: [{ name: "Paramount+", tag: "paramount" }] },
        ]
    },
    GB: {
        name: "United Kingdom",
        flag: "\u{1F1EC}\u{1F1E7}",
        movies: [
            { title: "Saltburn", genre: "Thriller / Drama", rating: "7.0/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "The Banshees of Inisherin", genre: "Drama / Comedy", rating: "7.7/10", streaming: [{ name: "Disney+", tag: "disney" }] },
            { title: "Living", genre: "Drama", rating: "7.4/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Sherlock", genre: "Crime / Drama", rating: "9.1/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Black Mirror", genre: "Sci-Fi / Thriller", rating: "8.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Slow Horses", genre: "Thriller / Drama", rating: "8.2/10", streaming: [{ name: "Apple TV+", tag: "apple" }] },
            { title: "Doctor Who", genre: "Sci-Fi / Adventure", rating: "8.6/10", streaming: [{ name: "Disney+", tag: "disney" }] },
        ]
    },
    KR: {
        name: "South Korea",
        flag: "\u{1F1F0}\u{1F1F7}",
        movies: [
            { title: "Parasite", genre: "Thriller / Drama", rating: "8.5/10", streaming: [{ name: "Hulu", tag: "hulu" }] },
            { title: "Decision to Leave", genre: "Romance / Thriller", rating: "7.4/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "Past Lives", genre: "Romance / Drama", rating: "7.8/10", streaming: [{ name: "Paramount+", tag: "paramount" }] },
        ],
        tvshows: [
            { title: "Squid Game", genre: "Thriller / Drama", rating: "8.0/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Extraordinary Attorney Woo", genre: "Drama / Comedy", rating: "8.7/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "All of Us Are Dead", genre: "Horror / Action", rating: "7.5/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Moving", genre: "Action / Sci-Fi", rating: "8.3/10", streaming: [{ name: "Disney+", tag: "disney" }] },
        ]
    },
    JP: {
        name: "Japan",
        flag: "\u{1F1EF}\u{1F1F5}",
        movies: [
            { title: "Suzume", genre: "Animation / Adventure", rating: "7.6/10", streaming: [{ name: "Crunchyroll", tag: "crunchyroll" }] },
            { title: "The Boy and the Heron", genre: "Animation / Fantasy", rating: "7.5/10", streaming: [{ name: "HBO Max", tag: "hbo" }] },
            { title: "Godzilla Minus One", genre: "Action / Sci-Fi", rating: "7.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ],
        tvshows: [
            { title: "Demon Slayer", genre: "Animation / Action", rating: "8.7/10", streaming: [{ name: "Crunchyroll", tag: "crunchyroll" }, { name: "Netflix", tag: "netflix" }] },
            { title: "Jujutsu Kaisen", genre: "Animation / Action", rating: "8.6/10", streaming: [{ name: "Crunchyroll", tag: "crunchyroll" }] },
            { title: "Shogun", genre: "Drama / History", rating: "8.7/10", streaming: [{ name: "Hulu", tag: "hulu" }, { name: "Disney+", tag: "disney" }] },
            { title: "Attack on Titan", genre: "Animation / Action", rating: "9.0/10", streaming: [{ name: "Crunchyroll", tag: "crunchyroll" }, { name: "Hulu", tag: "hulu" }] },
        ]
    },
    FR: {
        name: "France",
        flag: "\u{1F1EB}\u{1F1F7}",
        movies: [
            { title: "Anatomy of a Fall", genre: "Drama / Thriller", rating: "7.7/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "The Taste of Things", genre: "Romance / Drama", rating: "6.9/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Lupin", genre: "Crime / Mystery", rating: "7.5/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Call My Agent!", genre: "Comedy / Drama", rating: "8.2/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "The Bureau", genre: "Thriller / Drama", rating: "8.6/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ]
    },
    ES: {
        name: "Spain",
        flag: "\u{1F1EA}\u{1F1F8}",
        movies: [
            { title: "The Platform", genre: "Sci-Fi / Thriller", rating: "6.9/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Pain and Glory", genre: "Drama", rating: "7.5/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Money Heist", genre: "Crime / Thriller", rating: "8.2/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Elite", genre: "Drama / Thriller", rating: "7.4/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Welcome to Eden", genre: "Sci-Fi / Mystery", rating: "5.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    DE: {
        name: "Germany",
        flag: "\u{1F1E9}\u{1F1EA}",
        movies: [
            { title: "All Quiet on the Western Front", genre: "War / Drama", rating: "7.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "The Teachers' Lounge", genre: "Drama / Thriller", rating: "7.6/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Dark", genre: "Sci-Fi / Thriller", rating: "8.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "1899", genre: "Mystery / Horror", rating: "7.3/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "How to Sell Drugs Online (Fast)", genre: "Comedy / Crime", rating: "7.6/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    BR: {
        name: "Brazil",
        flag: "\u{1F1E7}\u{1F1F7}",
        movies: [
            { title: "City of God", genre: "Crime / Drama", rating: "8.6/10", streaming: [{ name: "HBO Max", tag: "hbo" }] },
            { title: "Bacurau", genre: "Thriller / Mystery", rating: "7.3/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "3%", genre: "Sci-Fi / Thriller", rating: "7.2/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Invisible City", genre: "Fantasy / Drama", rating: "6.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "The Chosen One", genre: "Thriller / Drama", rating: "6.5/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    IN: {
        name: "India",
        flag: "\u{1F1EE}\u{1F1F3}",
        movies: [
            { title: "RRR", genre: "Action / Drama", rating: "7.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Pathaan", genre: "Action / Thriller", rating: "6.3/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "Rocky Aur Rani Kii Prem Kahaani", genre: "Romance / Comedy", rating: "6.5/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Sacred Games", genre: "Crime / Thriller", rating: "8.5/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Panchayat", genre: "Comedy / Drama", rating: "8.9/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "The Family Man", genre: "Action / Thriller", rating: "8.7/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "Delhi Crime", genre: "Crime / Drama", rating: "8.5/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    AU: {
        name: "Australia",
        flag: "\u{1F1E6}\u{1F1FA}",
        movies: [
            { title: "The Dry", genre: "Crime / Drama", rating: "6.8/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "Nitram", genre: "Drama / Crime", rating: "6.9/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Bluey", genre: "Animation / Family", rating: "9.4/10", streaming: [{ name: "Disney+", tag: "disney" }] },
            { title: "Mr Inbetween", genre: "Crime / Drama", rating: "8.4/10", streaming: [{ name: "Hulu", tag: "hulu" }] },
            { title: "The Tourist", genre: "Thriller / Drama", rating: "7.2/10", streaming: [{ name: "HBO Max", tag: "hbo" }] },
        ]
    },
    MX: {
        name: "Mexico",
        flag: "\u{1F1F2}\u{1F1FD}",
        movies: [
            { title: "Roma", genre: "Drama", rating: "7.7/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Bardo", genre: "Drama / Comedy", rating: "6.3/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ],
        tvshows: [
            { title: "Narcos: Mexico", genre: "Crime / Drama", rating: "8.4/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Who Killed Sara?", genre: "Thriller / Drama", rating: "7.1/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Dark Desire", genre: "Thriller / Drama", rating: "6.2/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    IT: {
        name: "Italy",
        flag: "\u{1F1EE}\u{1F1F9}",
        movies: [
            { title: "Io Capitano", genre: "Drama / Adventure", rating: "7.5/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "A Chiara", genre: "Drama", rating: "7.0/10", streaming: [{ name: "Hulu", tag: "hulu" }] },
        ],
        tvshows: [
            { title: "Gomorrah", genre: "Crime / Drama", rating: "8.6/10", streaming: [{ name: "HBO Max", tag: "hbo" }] },
            { title: "Suburra", genre: "Crime / Drama", rating: "7.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "My Brilliant Friend", genre: "Drama", rating: "8.5/10", streaming: [{ name: "HBO Max", tag: "hbo" }] },
        ]
    },
    SE: {
        name: "Sweden",
        flag: "\u{1F1F8}\u{1F1EA}",
        movies: [
            { title: "Triangle of Sadness", genre: "Comedy / Drama", rating: "7.3/10", streaming: [{ name: "Hulu", tag: "hulu" }] },
        ],
        tvshows: [
            { title: "The Bridge", genre: "Crime / Thriller", rating: "8.6/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "Young Royals", genre: "Drama / Romance", rating: "8.1/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    CA: {
        name: "Canada",
        flag: "\u{1F1E8}\u{1F1E6}",
        movies: [
            { title: "Women Talking", genre: "Drama", rating: "6.8/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Schitt's Creek", genre: "Comedy", rating: "8.5/10", streaming: [{ name: "Netflix", tag: "netflix" }, { name: "Hulu", tag: "hulu" }] },
            { title: "Letterkenny", genre: "Comedy", rating: "8.6/10", streaming: [{ name: "Hulu", tag: "hulu" }] },
        ]
    },
    TR: {
        name: "Turkey",
        flag: "\u{1F1F9}\u{1F1F7}",
        movies: [
            { title: "Winter Sleep", genre: "Drama", rating: "8.0/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Ethos", genre: "Drama", rating: "8.4/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "The Gift", genre: "Fantasy / Mystery", rating: "7.3/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Midnight at the Pera Palace", genre: "Drama / Mystery", rating: "6.6/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    NG: {
        name: "Nigeria",
        flag: "\u{1F1F3}\u{1F1EC}",
        movies: [
            { title: "The Black Book", genre: "Action / Thriller", rating: "6.2/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ],
        tvshows: [
            { title: "Blood Sisters", genre: "Thriller / Drama", rating: "5.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "King of Boys: The Return of the King", genre: "Crime / Drama", rating: "5.9/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    RU: {
        name: "Russia",
        flag: "\u{1F1F7}\u{1F1FA}",
        movies: [
            { title: "Leviathan", genre: "Drama", rating: "7.6/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
        ],
        tvshows: [
            { title: "Better Than Us", genre: "Sci-Fi / Drama", rating: "7.1/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "To the Lake", genre: "Thriller / Drama", rating: "7.3/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    CN: {
        name: "China",
        flag: "\u{1F1E8}\u{1F1F3}",
        movies: [
            { title: "The Wandering Earth 2", genre: "Sci-Fi / Action", rating: "6.8/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ],
        tvshows: [
            { title: "The Three-Body Problem", genre: "Sci-Fi / Drama", rating: "7.9/10", streaming: [{ name: "Prime Video", tag: "prime" }] },
            { title: "Reset", genre: "Sci-Fi / Thriller", rating: "8.1/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
    NL: {
        name: "Netherlands",
        flag: "\u{1F1F3}\u{1F1F1}",
        movies: [
            { title: "Quo Vadis, Aida?", genre: "Drama / War", rating: "7.7/10", streaming: [{ name: "Hulu", tag: "hulu" }] },
        ],
        tvshows: [
            { title: "Ferry", genre: "Crime / Drama", rating: "6.1/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
            { title: "Ares", genre: "Horror / Drama", rating: "6.0/10", streaming: [{ name: "Netflix", tag: "netflix" }] },
        ]
    },
};


const TMDB_SUPPORTED_COUNTRY_META = {
    AD: { name: "Andorra", continent: "Europe" },
    AE: { name: "United Arab Emirates", continent: "Asia" },
    AF: { name: "Afghanistan", continent: "Asia" },
    AG: { name: "Antigua and Barbuda", continent: "North America" },
    AI: { name: "Anguilla", continent: "North America" },
    AL: { name: "Albania", continent: "Europe" },
    AM: { name: "Armenia", continent: "Asia" },
    AN: { name: "Netherlands Antilles", continent: "North America" },
    AO: { name: "Angola", continent: "Africa" },
    AQ: { name: "Antarctica", continent: "Antarctica" },
    AR: { name: "Argentina", continent: "South America" },
    AS: { name: "American Samoa", continent: "Oceania" },
    AT: { name: "Austria", continent: "Europe" },
    AU: { name: "Australia", continent: "Oceania" },
    AW: { name: "Aruba", continent: "North America" },
    AZ: { name: "Azerbaijan", continent: "Europe" },
    BA: { name: "Bosnia and Herzegovina", continent: "Europe" },
    BB: { name: "Barbados", continent: "North America" },
    BD: { name: "Bangladesh", continent: "Asia" },
    BE: { name: "Belgium", continent: "Europe" },
    BF: { name: "Burkina Faso", continent: "Africa" },
    BG: { name: "Bulgaria", continent: "Europe" },
    BH: { name: "Bahrain", continent: "Asia" },
    BI: { name: "Burundi", continent: "Africa" },
    BJ: { name: "Benin", continent: "Africa" },
    BM: { name: "Bermuda", continent: "North America" },
    BN: { name: "Brunei Darussalam", continent: "Asia" },
    BO: { name: "Bolivia", continent: "South America" },
    BR: { name: "Brazil", continent: "South America" },
    BS: { name: "Bahamas", continent: "North America" },
    BT: { name: "Bhutan", continent: "Asia" },
    BU: { name: "Burma", continent: "Asia" },
    BV: { name: "Bouvet Island", continent: "Antarctica" },
    BW: { name: "Botswana", continent: "Africa" },
    BY: { name: "Belarus", continent: "Europe" },
    BZ: { name: "Belize", continent: "North America" },
    CA: { name: "Canada", continent: "North America" },
    CC: { name: "Cocos  Islands", continent: "Asia" },
    CD: { name: "Congo", continent: "Africa" },
    CF: { name: "Central African Republic", continent: "Africa" },
    CG: { name: "Congo", continent: "Africa" },
    CH: { name: "Switzerland", continent: "Europe" },
    CI: { name: "Cote D'Ivoire", continent: "Africa" },
    CK: { name: "Cook Islands", continent: "Oceania" },
    CL: { name: "Chile", continent: "South America" },
    CM: { name: "Cameroon", continent: "Africa" },
    CN: { name: "China", continent: "Asia" },
    CO: { name: "Colombia", continent: "South America" },
    CR: { name: "Costa Rica", continent: "North America" },
    CS: { name: "Serbia and Montenegro", continent: "Europe" },
    CU: { name: "Cuba", continent: "North America" },
    CV: { name: "Cape Verde", continent: "Africa" },
    CX: { name: "Christmas Island", continent: "Asia" },
    CY: { name: "Cyprus", continent: "Europe" },
    CZ: { name: "Czech Republic", continent: "Europe" },
    DE: { name: "Germany", continent: "Europe" },
    DJ: { name: "Djibouti", continent: "Africa" },
    DK: { name: "Denmark", continent: "Europe" },
    DM: { name: "Dominica", continent: "North America" },
    DO: { name: "Dominican Republic", continent: "North America" },
    DZ: { name: "Algeria", continent: "Africa" },
    EC: { name: "Ecuador", continent: "South America" },
    EE: { name: "Estonia", continent: "Europe" },
    EG: { name: "Egypt", continent: "Africa" },
    EH: { name: "Western Sahara", continent: "Africa" },
    ER: { name: "Eritrea", continent: "Africa" },
    ES: { name: "Spain", continent: "Europe" },
    ET: { name: "Ethiopia", continent: "Africa" },
    FI: { name: "Finland", continent: "Europe" },
    FJ: { name: "Fiji", continent: "Oceania" },
    FK: { name: "Falkland Islands", continent: "South America" },
    FM: { name: "Micronesia", continent: "Oceania" },
    FO: { name: "Faeroe Islands", continent: "Europe" },
    FR: { name: "France", continent: "Europe" },
    GA: { name: "Gabon", continent: "Africa" },
    GB: { name: "United Kingdom", continent: "Europe" },
    GD: { name: "Grenada", continent: "North America" },
    GE: { name: "Georgia", continent: "Asia" },
    GF: { name: "French Guiana", continent: "South America" },
    GH: { name: "Ghana", continent: "Africa" },
    GI: { name: "Gibraltar", continent: "Europe" },
    GL: { name: "Greenland", continent: "North America" },
    GM: { name: "Gambia", continent: "Africa" },
    GN: { name: "Guinea", continent: "Africa" },
    GP: { name: "Guadaloupe", continent: "North America" },
    GQ: { name: "Equatorial Guinea", continent: "Africa" },
    GR: { name: "Greece", continent: "Europe" },
    GS: { name: "South Georgia and the South Sandwich Islands", continent: "Antarctica" },
    GT: { name: "Guatemala", continent: "North America" },
    GU: { name: "Guam", continent: "Oceania" },
    GW: { name: "Guinea-Bissau", continent: "Africa" },
    GY: { name: "Guyana", continent: "South America" },
    HK: { name: "Hong Kong", continent: "Asia" },
    HM: { name: "Heard and McDonald Islands", continent: "Antarctica" },
    HN: { name: "Honduras", continent: "North America" },
    HR: { name: "Croatia", continent: "Europe" },
    HT: { name: "Haiti", continent: "North America" },
    HU: { name: "Hungary", continent: "Europe" },
    ID: { name: "Indonesia", continent: "Asia" },
    IE: { name: "Ireland", continent: "Europe" },
    IL: { name: "Israel", continent: "Asia" },
    IN: { name: "India", continent: "Asia" },
    IO: { name: "British Indian Ocean Territory", continent: "Asia" },
    IQ: { name: "Iraq", continent: "Asia" },
    IR: { name: "Iran", continent: "Asia" },
    IS: { name: "Iceland", continent: "Europe" },
    IT: { name: "Italy", continent: "Europe" },
    JM: { name: "Jamaica", continent: "North America" },
    JO: { name: "Jordan", continent: "Asia" },
    JP: { name: "Japan", continent: "Asia" },
    KE: { name: "Kenya", continent: "Africa" },
    KG: { name: "Kyrgyz Republic", continent: "Asia" },
    KH: { name: "Cambodia", continent: "Asia" },
    KI: { name: "Kiribati", continent: "Oceania" },
    KM: { name: "Comoros", continent: "Africa" },
    KN: { name: "St. Kitts and Nevis", continent: "North America" },
    KP: { name: "North Korea", continent: "Asia" },
    KR: { name: "South Korea", continent: "Asia" },
    KW: { name: "Kuwait", continent: "Asia" },
    KY: { name: "Cayman Islands", continent: "North America" },
    KZ: { name: "Kazakhstan", continent: "Asia" },
    LA: { name: "Lao People's Democratic Republic", continent: "Asia" },
    LB: { name: "Lebanon", continent: "Asia" },
    LC: { name: "St. Lucia", continent: "North America" },
    LI: { name: "Liechtenstein", continent: "Europe" },
    LK: { name: "Sri Lanka", continent: "Asia" },
    LR: { name: "Liberia", continent: "Africa" },
    LS: { name: "Lesotho", continent: "Africa" },
    LT: { name: "Lithuania", continent: "Europe" },
    LU: { name: "Luxembourg", continent: "Europe" },
    LV: { name: "Latvia", continent: "Europe" },
    LY: { name: "Libyan Arab Jamahiriya", continent: "Africa" },
    MA: { name: "Morocco", continent: "Africa" },
    MC: { name: "Monaco", continent: "Europe" },
    MD: { name: "Moldova", continent: "Europe" },
    ME: { name: "Montenegro", continent: "Europe" },
    MG: { name: "Madagascar", continent: "Africa" },
    MH: { name: "Marshall Islands", continent: "Oceania" },
    MK: { name: "Macedonia", continent: "Europe" },
    ML: { name: "Mali", continent: "Africa" },
    MM: { name: "Myanmar", continent: "Asia" },
    MN: { name: "Mongolia", continent: "Asia" },
    MO: { name: "Macao", continent: "Asia" },
    MP: { name: "Northern Mariana Islands", continent: "Oceania" },
    MQ: { name: "Martinique", continent: "North America" },
    MR: { name: "Mauritania", continent: "Africa" },
    MS: { name: "Montserrat", continent: "North America" },
    MT: { name: "Malta", continent: "Europe" },
    MU: { name: "Mauritius", continent: "Africa" },
    MV: { name: "Maldives", continent: "Asia" },
    MW: { name: "Malawi", continent: "Africa" },
    MX: { name: "Mexico", continent: "North America" },
    MY: { name: "Malaysia", continent: "Asia" },
    MZ: { name: "Mozambique", continent: "Africa" },
    NA: { name: "Namibia", continent: "Africa" },
    NC: { name: "New Caledonia", continent: "Oceania" },
    NE: { name: "Niger", continent: "Africa" },
    NF: { name: "Norfolk Island", continent: "Oceania" },
    NG: { name: "Nigeria", continent: "Africa" },
    NI: { name: "Nicaragua", continent: "North America" },
    NL: { name: "Netherlands", continent: "Europe" },
    NO: { name: "Norway", continent: "Europe" },
    NP: { name: "Nepal", continent: "Asia" },
    NR: { name: "Nauru", continent: "Oceania" },
    NU: { name: "Niue", continent: "Oceania" },
    NZ: { name: "New Zealand", continent: "Oceania" },
    OM: { name: "Oman", continent: "Asia" },
    PA: { name: "Panama", continent: "North America" },
    PE: { name: "Peru", continent: "South America" },
    PF: { name: "French Polynesia", continent: "Oceania" },
    PG: { name: "Papua New Guinea", continent: "Oceania" },
    PH: { name: "Philippines", continent: "Asia" },
    PK: { name: "Pakistan", continent: "Asia" },
    PL: { name: "Poland", continent: "Europe" },
    PM: { name: "St. Pierre and Miquelon", continent: "North America" },
    PN: { name: "Pitcairn Island", continent: "Oceania" },
    PR: { name: "Puerto Rico", continent: "North America" },
    PS: { name: "Palestinian Territory", continent: "Asia" },
    PT: { name: "Portugal", continent: "Europe" },
    PW: { name: "Palau", continent: "Oceania" },
    PY: { name: "Paraguay", continent: "South America" },
    QA: { name: "Qatar", continent: "Asia" },
    RE: { name: "Reunion", continent: "Africa" },
    RO: { name: "Romania", continent: "Europe" },
    RS: { name: "Serbia", continent: "Europe" },
    RU: { name: "Russia", continent: "Europe" },
    RW: { name: "Rwanda", continent: "Africa" },
    SA: { name: "Saudi Arabia", continent: "Asia" },
    SB: { name: "Solomon Islands", continent: "Oceania" },
    SC: { name: "Seychelles", continent: "Africa" },
    SD: { name: "Sudan", continent: "Africa" },
    SE: { name: "Sweden", continent: "Europe" },
    SG: { name: "Singapore", continent: "Asia" },
    SH: { name: "St. Helena", continent: "Africa" },
    SI: { name: "Slovenia", continent: "Europe" },
    SJ: { name: "Svalbard & Jan Mayen Islands", continent: "Europe" },
    SK: { name: "Slovakia", continent: "Europe" },
    SL: { name: "Sierra Leone", continent: "Africa" },
    SM: { name: "San Marino", continent: "Europe" },
    SN: { name: "Senegal", continent: "Africa" },
    SO: { name: "Somalia", continent: "Africa" },
    SR: { name: "Suriname", continent: "South America" },
    SS: { name: "South Sudan", continent: "Africa" },
    ST: { name: "Sao Tome and Principe", continent: "Africa" },
    SU: { name: "Soviet Union", continent: "Europe" },
    SV: { name: "El Salvador", continent: "North America" },
    SY: { name: "Syrian Arab Republic", continent: "Asia" },
    SZ: { name: "Swaziland", continent: "Africa" },
    TC: { name: "Turks and Caicos Islands", continent: "North America" },
    TD: { name: "Chad", continent: "Africa" },
    TF: { name: "French Southern Territories", continent: "Antarctica" },
    TG: { name: "Togo", continent: "Africa" },
    TH: { name: "Thailand", continent: "Asia" },
    TJ: { name: "Tajikistan", continent: "Asia" },
    TK: { name: "Tokelau", continent: "Oceania" },
    TL: { name: "Timor-Leste", continent: "Oceania" },
    TM: { name: "Turkmenistan", continent: "Asia" },
    TN: { name: "Tunisia", continent: "Africa" },
    TO: { name: "Tonga", continent: "Oceania" },
    TP: { name: "East Timor", continent: "Asia" },
    TR: { name: "Turkey", continent: "Europe" },
    TT: { name: "Trinidad and Tobago", continent: "North America" },
    TV: { name: "Tuvalu", continent: "Oceania" },
    TW: { name: "Taiwan", continent: "Asia" },
    TZ: { name: "Tanzania", continent: "Africa" },
    UA: { name: "Ukraine", continent: "Europe" },
    UG: { name: "Uganda", continent: "Africa" },
    UM: { name: "United States Minor Outlying Islands", continent: "Oceania" },
    US: { name: "United States of America", continent: "North America" },
    UY: { name: "Uruguay", continent: "South America" },
    UZ: { name: "Uzbekistan", continent: "Asia" },
    VA: { name: "Holy See", continent: "Europe" },
    VC: { name: "St. Vincent and the Grenadines", continent: "North America" },
    VE: { name: "Venezuela", continent: "South America" },
    VG: { name: "British Virgin Islands", continent: "North America" },
    VI: { name: "US Virgin Islands", continent: "North America" },
    VN: { name: "Vietnam", continent: "Asia" },
    VU: { name: "Vanuatu", continent: "Oceania" },
    WF: { name: "Wallis and Futuna Islands", continent: "Oceania" },
    WS: { name: "Samoa", continent: "Oceania" },
    XC: { name: "Czechoslovakia", continent: "Europe" },
    XG: { name: "East Germany", continent: "Europe" },
    XI: { name: "Northern Ireland", continent: "Europe" },
    XK: { name: "Kosovo", continent: "Europe" },
    YE: { name: "Yemen", continent: "Asia" },
    YT: { name: "Mayotte", continent: "Africa" },
    YU: { name: "Yugoslavia", continent: "Europe" },
    ZA: { name: "South Africa", continent: "Africa" },
    ZM: { name: "Zambia", continent: "Africa" },
    ZR: { name: "Zaire", continent: "Africa" },
    ZW: { name: "Zimbabwe", continent: "Africa" },
};

Object.assign(
    MAP_NAMES,
    Object.fromEntries(Object.entries(TMDB_SUPPORTED_COUNTRY_META).map(([code, meta]) => [code, meta.name]))
);

const GENERATED_MOVIE_TEMPLATES = [
    {
        title: name => `${name} Spotlight`,
        genre: "Drama / Culture",
        rating: "7.4/10",
        provider: { name: "Netflix", tag: "netflix" },
        overview: name => `A placeholder feature used to keep ${name} explorable inside WorldView.`
    },
    {
        title: name => `${name} After Dark`,
        genre: "Thriller / Drama",
        rating: "7.1/10",
        provider: { name: "Prime Video", tag: "prime" },
        overview: name => `A placeholder late-night title connected to ${name} for browsing flows.`
    },
    {
        title: name => `${name} Stories`,
        genre: "Comedy / Drama",
        rating: "7.0/10",
        provider: { name: "Disney+", tag: "disney" },
        overview: name => `A placeholder crowd-pleaser that keeps the ${name} movie shelf populated.`
    },
];

const GENERATED_TV_TEMPLATES = [
    {
        title: name => `${name} Weekly`,
        genre: "Drama / Series",
        rating: "7.5/10",
        provider: { name: "Netflix", tag: "netflix" },
        overview: name => `A placeholder series slot for users exploring TV connected to ${name}.`
    },
    {
        title: name => `${name} Files`,
        genre: "Mystery / Drama",
        rating: "7.2/10",
        provider: { name: "Prime Video", tag: "prime" },
        overview: name => `A placeholder mystery-style series that keeps the ${name} TV flow active.`
    },
    {
        title: name => `${name} Nights`,
        genre: "Crime / Drama",
        rating: "7.3/10",
        provider: { name: "HBO Max", tag: "hbo" },
        overview: name => `A placeholder prestige-style series for the ${name} catalogue.`
    },
];

function buildGeneratedMedia(code, name, type) {
    const templates = type === "movies" ? GENERATED_MOVIE_TEMPLATES : GENERATED_TV_TEMPLATES;
    return templates.map((template, index) => ({
        title: template.title(name),
        year: 2024 - index,
        genre: template.genre,
        rating: template.rating,
        overview: template.overview(name),
        originCountry: code,
        subtitles: ["English"],
        streaming: [{ ...template.provider }],
    }));
}

function createGeneratedCountryData(code, meta) {
    const name = meta.name || MAP_NAMES[code] || code;
    return {
        name,
        flag: countryFlag(code),
        movies: buildGeneratedMedia(code, name, "movies"),
        tvshows: buildGeneratedMedia(code, name, "tvshows"),
    };
}

const COUNTRY_DATA = Object.fromEntries(
    Object.entries(TMDB_SUPPORTED_COUNTRY_META).map(([code, meta]) => [
        code,
        SEEDED_COUNTRY_DATA[code] || createGeneratedCountryData(code, meta),
    ])
);

const CONTINENT_DISPLAY_ORDER = [
    "Europe",
    "Asia",
    "North America",
    "South America",
    "Africa",
    "Oceania",
    "Antarctica",
    "Other",
];

const TMDB_CONTINENT_COUNTRY_GROUPS = CONTINENT_DISPLAY_ORDER
    .map(name => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        name,
        codes: Object.entries(TMDB_SUPPORTED_COUNTRY_META)
            .filter(([, meta]) => (meta.continent || "Other") === name)
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .map(([code]) => code),
    }))
    .filter(group => group.codes.length);


// Popular countries shown in sidebar
const POPULAR_COUNTRIES = ["US", "GB", "KR", "JP", "FR", "ES", "DE", "IN", "BR", "IT", "TR", "AU"];


const COUNTRY_BLURBS = {
    NL: "Use film and TV as a shortcut into Dutch culture, everyday references, and local conversation.",
    US: "Compare globally dominant entertainment with titles that define contemporary American media culture.",
    GB: "Explore British crime, period drama, and sharp comedy through titles with strong local identity.",
    KR: "Jump between globally popular Korean hits and titles that showcase Korean production culture.",
    JP: "Browse anime, live-action series, and films that shaped Japanese pop culture at home and abroad.",
    FR: "Discover French prestige cinema, comedy, and serialized storytelling with a strong national voice.",
    ES: "Explore Spanish thrillers, heist dramas, and auteur cinema through a country-specific lens.",
    DE: "See what German audiences connect with and what Germany exports through film and TV.",
    IN: "Move between mass-appeal Indian blockbusters and regional or culturally rooted productions.",
    BR: "Discover Brazilian crime, social drama, and streaming-era series with strong local identity.",
};

const COUNTRY_OVERRIDES = {
    NL: {
        popular: {
            movies: [
                { title: "Oppenheimer", year: 2023, genre: "Drama / History", rating: "8.5/10", overview: "A prestige historical drama that became a major global conversation piece and is easy for expats to use as shared cultural ground.", subtitles: ["English", "Dutch"] },
                { title: "Inside Out 2", year: 2024, genre: "Animation / Family", rating: "7.6/10", overview: "A family-friendly global hit representing the kind of widely discussed mainstream release many Dutch audiences also encounter.", subtitles: ["English", "Dutch"] },
                { title: "The Substance", year: 2024, genre: "Horror / Satire", rating: "7.3/10", overview: "A buzzy international title that helps spotlight what people are currently talking about.", subtitles: ["English", "Dutch"] },
            ],
            tvshows: [
                { title: "Adolescence", year: 2025, genre: "Crime / Drama", rating: "8.3/10", overview: "A topical English-language limited series suited to expats looking for shared conversation starters.", subtitles: ["English", "Dutch"] },
                { title: "Ferry: The Series", year: 2023, genre: "Crime / Drama", rating: "7.3/10", overview: "A recognizable Dutch-language title connected to one of the Netherlands' better-known crime franchises.", subtitles: ["English", "Dutch"], originCountry: "NL" },
                { title: "The Day of the Jackal", year: 2024, genre: "Thriller / Drama", rating: "8.1/10", overview: "A slick international thriller representing high-visibility TV people may already be discussing.", subtitles: ["English", "Dutch"] },
            ],
        },
        madeIn: {
            movies: [
                { title: "Black Book", year: 2006, genre: "War / Thriller", rating: "7.7/10", overview: "One of the Netherlands' best-known modern films, useful for cultural discovery beyond streaming trends.", originCountry: "NL" },
                { title: "Borgman", year: 2013, genre: "Thriller / Drama", rating: "6.7/10", overview: "A darkly strange Dutch film that helps surface less globally visible local cinema.", originCountry: "NL" },
                { title: "The Forgotten Battle", year: 2020, genre: "War / Drama", rating: "7.2/10", overview: "A Dutch war drama tied to regional history and memory.", originCountry: "NL" },
            ],
            tvshows: [
                { title: "Ferry", year: 2021, genre: "Crime / Drama", rating: "6.1/10", overview: "A Dutch crime series connected to the Undercover universe and recognizable to many local viewers.", originCountry: "NL" },
                { title: "Ares", year: 2020, genre: "Horror / Drama", rating: "6.0/10", overview: "A Dutch-language horror series that gives users a clearly local option.", originCountry: "NL" },
                { title: "Undercover", year: 2019, genre: "Crime / Drama", rating: "7.8/10", overview: "A Dutch-Belgian crime drama useful for local-language discovery.", originCountry: "NL" },
            ],
        },
        people: [
            { name: "Paul Verhoeven", role: "Director", knownFor: ["Black Book", "Elle", "RoboCop"] },
            { name: "Carice van Houten", role: "Actor", knownFor: ["Black Book", "Game of Thrones"] },
            { name: "Monic Hendrickx", role: "Actor", knownFor: ["Penoza", "Ferry"] },
        ],
    },
    US: {
        popular: {
            movies: [
                { title: "Oppenheimer", year: 2023, genre: "Drama / History", rating: "8.5/10", overview: "A prestige film that remained culturally visible well beyond its theatrical run.", subtitles: ["English"] },
                { title: "Dune: Part Two", year: 2024, genre: "Sci-Fi / Adventure", rating: "8.5/10", overview: "A blockbuster example of the kind of high-profile media people often reference socially.", subtitles: ["English"] },
                { title: "Barbie", year: 2023, genre: "Comedy / Fantasy", rating: "7.0/10", overview: "A mainstream cultural event that shaped online and offline conversation.", subtitles: ["English"] },
            ],
            tvshows: [
                { title: "The Last of Us", year: 2023, genre: "Drama / Action", rating: "8.8/10", overview: "A prestige adaptation with broad cultural reach.", subtitles: ["English"] },
                { title: "Severance", year: 2022, genre: "Sci-Fi / Drama", rating: "8.7/10", overview: "A heavily discussed workplace sci-fi series with strong social visibility.", subtitles: ["English"] },
                { title: "The Bear", year: 2022, genre: "Comedy / Drama", rating: "8.5/10", overview: "A character-focused hit that frequently enters everyday recommendations.", subtitles: ["English"] },
            ],
        },
        people: [
            { name: "Christopher Nolan", role: "Director", knownFor: ["Oppenheimer", "Inception"] },
            { name: "Zendaya", role: "Actor", knownFor: ["Dune", "Euphoria"] },
            { name: "Jeremy Allen White", role: "Actor", knownFor: ["The Bear"] },
        ],
    },
    GB: {
        popular: {
            movies: [
                { title: "Saltburn", year: 2023, genre: "Thriller / Drama", rating: "7.0/10", overview: "A conversation-driving British release with a distinct cultural vibe.", subtitles: ["English"] },
                { title: "Paddington 2", year: 2017, genre: "Family / Comedy", rating: "7.8/10", overview: "A beloved UK film that demonstrates how local hits can remain culturally relevant.", subtitles: ["English"] },
                { title: "The Banshees of Inisherin", year: 2022, genre: "Drama / Comedy", rating: "7.7/10", overview: "A prestige title adjacent to British/Irish viewing culture and awards conversation.", subtitles: ["English"] },
            ],
            tvshows: [
                { title: "Adolescence", year: 2025, genre: "Crime / Drama", rating: "8.3/10", overview: "A fresh UK conversation starter.", subtitles: ["English"] },
                { title: "Slow Horses", year: 2022, genre: "Thriller / Drama", rating: "8.2/10", overview: "A stylish British spy series that fits the app's culturally situated exploration.", subtitles: ["English"] },
                { title: "Doctor Who", year: 2005, genre: "Sci-Fi / Adventure", rating: "8.6/10", overview: "An iconic British franchise that doubles as cultural literacy.", subtitles: ["English"] },
            ],
        },
    },
    KR: {
        popular: {
            movies: [
                { title: "Exhuma", year: 2024, genre: "Horror / Mystery", rating: "7.0/10", overview: "A recent Korean hit that keeps the experience grounded in Korean theatrical culture.", originCountry: "KR" },
                { title: "Parasite", year: 2019, genre: "Thriller / Drama", rating: "8.5/10", overview: "A global phenomenon that also serves as an entry point into Korean cinema.", originCountry: "KR" },
                { title: "Decision to Leave", year: 2022, genre: "Romance / Thriller", rating: "7.4/10", overview: "A polished modern Korean thriller for culturally curious viewers.", originCountry: "KR" },
            ],
            tvshows: [
                { title: "Squid Game", year: 2021, genre: "Thriller / Drama", rating: "8.0/10", overview: "A globally visible Korean series that easily bridges expats into shared discussion.", originCountry: "KR" },
                { title: "Moving", year: 2023, genre: "Action / Sci-Fi", rating: "8.3/10", overview: "A contemporary Korean hit representative of high-end local TV production.", originCountry: "KR" },
                { title: "Extraordinary Attorney Woo", year: 2022, genre: "Drama / Comedy", rating: "8.7/10", overview: "A warm, accessible Korean-language series with strong local and international reach.", originCountry: "KR" },
            ],
        },
    },
    JP: {
        popular: {
            movies: [
                { title: "Godzilla Minus One", year: 2023, genre: "Action / Sci-Fi", rating: "7.8/10", overview: "A recent Japanese blockbuster with local identity and global visibility.", originCountry: "JP" },
                { title: "The Boy and the Heron", year: 2023, genre: "Animation / Fantasy", rating: "7.5/10", overview: "A culturally significant animated release tied to one of Japan's most important filmmakers.", originCountry: "JP" },
                { title: "Suzume", year: 2022, genre: "Animation / Adventure", rating: "7.6/10", overview: "An accessible modern anime film for cross-cultural discovery.", originCountry: "JP" },
            ],
            tvshows: [
                { title: "Shōgun", year: 2024, genre: "Drama / History", rating: "8.7/10", overview: "A globally visible historical drama linked to Japanese setting and imagery.", subtitles: ["English", "Japanese"] },
                { title: "Demon Slayer", year: 2019, genre: "Animation / Action", rating: "8.7/10", overview: "A contemporary anime pillar with strong domestic and international recognition.", originCountry: "JP" },
                { title: "Jujutsu Kaisen", year: 2020, genre: "Animation / Action", rating: "8.6/10", overview: "Another major anime touchpoint that helps users explore Japanese media culture.", originCountry: "JP" },
            ],
        },
    },
};

function cloneItems(items) {
    return (items || []).map(item => ({
        ...item,
        streaming: (item.streaming || []).map(provider => ({ ...provider })),
        subtitles: Array.isArray(item.subtitles) ? [...item.subtitles] : undefined,
    }));
}

function createFallbackCatalogEntry(code, data) {
    const movies = cloneItems(data.movies || []);
    const tvshows = cloneItems(data.tvshows || []);
    return {
        code,
        name: data.name || MAP_NAMES[code] || code,
        blurb: COUNTRY_BLURBS[code] || `Browse popular titles and locally produced work connected to ${MAP_NAMES[code] || code}.`,
        popular: { movies, tvshows },
        madeIn: { movies: cloneItems(data.movies || []), tvshows: cloneItems(data.tvshows || []) },
        people: [],
    };
}

function mergeCollection(baseCollection, overrideCollection) {
    return {
        movies: cloneItems((overrideCollection && overrideCollection.movies) || (baseCollection && baseCollection.movies) || []),
        tvshows: cloneItems((overrideCollection && overrideCollection.tvshows) || (baseCollection && baseCollection.tvshows) || []),
    };
}

const COUNTRY_CATALOG = Object.fromEntries(
    Object.entries(COUNTRY_DATA).map(([code, data]) => {
        const baseEntry = createFallbackCatalogEntry(code, data);
        const override = COUNTRY_OVERRIDES[code] || {};
        const merged = {
            ...baseEntry,
            ...override,
            code,
            name: data.name || MAP_NAMES[code] || code,
            blurb: override.blurb || COUNTRY_BLURBS[code] || baseEntry.blurb,
            popular: mergeCollection(baseEntry.popular, override.popular),
            madeIn: mergeCollection(baseEntry.madeIn, override.madeIn),
            people: (override.people || []).map(person => ({ ...person, knownFor: [...(person.knownFor || [])] })),
        };
        return [code, merged];
    })
);

const FEATURED_COUNTRIES = ["NL", ...POPULAR_COUNTRIES.filter(code => code !== "NL")];
