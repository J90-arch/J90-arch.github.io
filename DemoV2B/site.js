const FAVORITES_KEY = "worldview_v2b_favorites";
const SETTINGS_KEY = "worldview_v2b_settings";
const LAST_COUNTRY_KEY = "worldview_v2b_last_country";
const DEFAULT_SETTINGS = {
    accountName: "Alex Morgan",
    accountEmail: "alex@worldview.app",
    theme: "dark",
    fontSize: "medium",
    language: "English",
    defaultCountry: "NL",
};
const PAGE_FILES = {
    home: "map.html",
    countrySearch: "index.html",
    search: "search.html",
    movies: "movies.html",
    people: "people.html",
    movie: "movie.html",
    person: "person.html",
    theaters: "theaters.html",
    settings: "settings.html",
};

const DEFAULT_CITY_BY_COUNTRY = {
    NL: "Amsterdam",
    JP: "Tokyo",
    FR: "Paris",
    ES: "Madrid",
    DE: "Berlin",
    BR: "São Paulo",
    IN: "Mumbai",
    AU: "Sydney",
    IT: "Rome",
    MX: "Mexico City",
    CA: "Toronto",
    US: "New York",
    GB: "London",
    KR: "Seoul",
    LT: "Vilnius",
    LV: "Riga",
    EE: "Tallinn",
    BE: "Brussels",
    PT: "Lisbon",
    SE: "Stockholm",
    NO: "Oslo",
    DK: "Copenhagen",
    FI: "Helsinki",
    PL: "Warsaw",
    CZ: "Prague",
    AT: "Vienna",
    CH: "Zurich",
    IE: "Dublin",
    TR: "Istanbul",
    GR: "Athens",
    ZA: "Cape Town",
    AR: "Buenos Aires",
    CL: "Santiago",
    CO: "Bogotá",
    NZ: "Auckland",
    SG: "Singapore",
    MY: "Kuala Lumpur",
    TH: "Bangkok",
    ID: "Jakarta",
    PH: "Manila",
    VN: "Ho Chi Minh City",
    HK: "Hong Kong",
    TW: "Taipei",
    CN: "Beijing",
    AE: "Dubai",
    SA: "Riyadh",
    EG: "Cairo",
    IL: "Tel Aviv",
    HU: "Budapest",
    RO: "Bucharest",
    BG: "Sofia",
    HR: "Zagreb",
    SI: "Ljubljana",
    SK: "Bratislava",
    RS: "Belgrade",
    UA: "Kyiv",
    IS: "Reykjavík",
    LU: "Luxembourg",
};

function defaultCityForCountry(code) {
    const normalized = String(code || "").toUpperCase();
    return DEFAULT_CITY_BY_COUNTRY[normalized] || COUNTRY_CATALOG[normalized]?.name || MAP_NAMES[normalized] || "City Center";
}

const state = {
    page: document.body.dataset.page || "home",
    favorites: [],
    settings: { ...DEFAULT_SETTINGS },
    country: "NL",
    collection: "popular",
    mediaType: "movies",
    searchScope: "all",
    roleFilter: "all",
    search: "",
    countrySearchQuery: "",
    id: "",
    city: defaultCityForCountry("NL"),
    date: "2026-04-04",
    settingsSection: "language",
};

document.addEventListener("DOMContentLoaded", initSite);

function initSite() {
    state.favorites = loadFavoriteCountries();
    state.settings = loadSettings();
    syncStateFromUrl();
    applySettings();
    persistSelectedCountry();
    renderShell();
    bindCommonEvents();
    renderSidebar();
    renderPage();
    updateDocumentTitle();
    queueLiveEnhancements();
}

function syncStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    state.country = sanitizeCountry(params.get("country"))
        || sanitizeCountry(localStorage.getItem(LAST_COUNTRY_KEY))
        || sanitizeCountry(state.settings.defaultCountry)
        || "NL";
    state.collection = ["popular", "madeIn"].includes(params.get("collection"))
        ? params.get("collection")
        : "popular";
    state.mediaType = ["movies", "tvshows"].includes(params.get("type")) ? params.get("type") : "movies";
    state.searchScope = ["movies", "people", "all"].includes(params.get("scope")) ? params.get("scope") : defaultSearchScope();
    state.roleFilter = ["all", "actor", "director"].includes(params.get("role")) ? params.get("role") : "all";
    state.search = (params.get("q") || "").trim();
    state.countrySearchQuery = (params.get("countryq") || "").trim();
    state.id = (params.get("id") || "").trim();
    const defaultCity = defaultCityForCountry(state.country);
    state.city = (params.get("city") || defaultCity).trim() || defaultCity;
    state.date = (params.get("date") || "2026-04-04").trim() || "2026-04-04";
    state.settingsSection = ["account", "language", "visual"].includes(params.get("section")) ? params.get("section") : "language";
}

function loadFavoriteCountries() {
    try {
        const raw = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
        return Array.isArray(raw)
            ? raw.map(code => String(code || "").toUpperCase()).filter((code, index, arr) => code.length === 2 && arr.indexOf(code) === index)
            : [];
    } catch {
        return [];
    }
}

function saveFavoriteCountries() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites.slice(0, 20)));
}

function loadSettings() {
    try {
        const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
        return { ...DEFAULT_SETTINGS, ...(raw || {}) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function persistSelectedCountry() {
    if (state.country) localStorage.setItem(LAST_COUNTRY_KEY, state.country);
}

function applySettings() {
    document.body.dataset.theme = state.settings.theme;
    document.body.dataset.fontSize = state.settings.fontSize;
}

function isFocusPage() {
    return state.page === "theaters" || state.page === "settings";
}

function showMainSidebar() {
    return !isFocusPage() && state.page !== "search" && state.page !== "countrySearch";
}

function getShellTitle() {
    return "WorldView";
}

function getShellSubtitle() {
    const entry = getCountryEntry(state.country);
    return {
        home: `${entry.name} selected`,
        countrySearch: `Browse by continent or search directly`,
        search: `Search results in ${entry.name}`,
        movies: `${entry.name} exploration`,
        people: `${entry.name} exploration`,
        movie: `${entry.name} detail`,
        person: `${entry.name} detail`,
    }[state.page] || "WorldView";
}

function renderShell() {
    const app = document.getElementById("app");
    const isHomePage = state.page === "home";

    if (isFocusPage()) {
        app.innerHTML = `
            <div class="focus-shell">
                <main id="page-root" class="focus-main"></main>
            </div>
        `;
        return;
    }

    const sidebarMarkup = showMainSidebar() ? `
        <aside class="sidebar${isHomePage ? " home-sidebar" : ""}">
            <div class="sidebar-header" id="sidebar-header"></div>
            <div class="sidebar-body${isHomePage ? " home-sidebar-body" : ""}" id="sidebar-body"></div>
        </aside>
    ` : "";

    app.innerHTML = `
        <div class="app-shell${isHomePage ? " home-shell" : ""}">
            <header class="topbar">
                <div class="topbar-shell">
                    <a class="brand shell-brand brand-link" href="${buildPageUrl("countrySearch", { country: state.country, countryq: state.countrySearchQuery })}" aria-label="Open WorldView country search">
                        <div class="brand-mark">✦</div>
                        <div class="shell-brand-copy">
                            <h1>${escapeHtml(getShellTitle())}</h1>
                            <p>${escapeHtml(getShellSubtitle())}</p>
                        </div>
                    </a>
                    <div class="topbar-center">
                        <form class="page-search shell-search" id="global-search-form">
                            <input type="text" id="global-search-input" placeholder="Search titles or celebs..." value="${escapeHtml(state.search)}">
                            <select id="global-search-scope">
                                <option value="movies" ${defaultSearchScope() === "movies" ? "selected" : ""}>Titles</option>
                                <option value="people" ${defaultSearchScope() === "people" ? "selected" : ""}>Celebs</option>
                            </select>
                            <button class="primary-btn" type="submit">Search</button>
                        </form>
                        <nav class="topnav" aria-label="Primary">
                            ${renderNavLink("countrySearch", "Country Search")}
                            ${renderNavLink("home", "Country Selection")}
                            ${renderNavLink("movies", "Popular Movies")}
                            ${renderNavLink("people", "Popular Celebs")}
                        </nav>
                    </div>
                    <a class="header-settings-btn" id="open-settings-btn" aria-label="Open settings" href="${buildPageUrl("settings", { country: state.country })}">Settings</a>
                </div>
            </header>

            <main class="workspace${showMainSidebar() ? "" : " workspace-wide"}${isHomePage ? " home-workspace" : ""}">
                ${sidebarMarkup}
                <section id="page-root" class="${state.page === "home" ? "map-page map-area home-map-area" : "page-main"}"></section>
            </main>
        </div>
    `;
}

function bindCommonEvents() {
    const globalSearchForm = document.getElementById("global-search-form");
    if (globalSearchForm) {
        globalSearchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const query = document.getElementById("global-search-input").value.trim();
            const scope = document.getElementById("global-search-scope").value;
            window.location.href = buildPageUrl("search", { country: state.country, q: query, scope });
        });
    }

    window.addEventListener("resize", () => {
        if (state.page !== "home") return;
        const root = document.getElementById("page-root");
        if (!root) return;
        syncHomeMapViewport(root);
        buildMap();
        bindMapInteractions();
        highlightMapCountry(state.country);
        bindHomeMapTools();
    });
}

function renderSidebar(searchQuery = "") {
    const header = document.getElementById("sidebar-header");
    const container = document.getElementById("sidebar-body");
    if (!header || !container) return;

    switch (state.page) {
        case "home":
            renderHomeSidebar(header, container, searchQuery);
            break;
        case "countrySearch":
            renderCountrySearchSidebar(header, container);
            break;
        case "movies":
            renderMoviesSidebar(header, container);
            break;
        case "search":
            renderSearchSidebar(header, container);
            break;
        case "people":
            renderPeopleSidebar(header, container);
            break;
        case "movie":
            renderMovieSidebar(header, container);
            break;
        case "person":
            renderPersonSidebar(header, container);
            break;
        case "theaters":
            renderTheaterSidebar(header, container);
            break;
        default:
            header.innerHTML = `<div><h2>Navigation</h2><p>Browse the main sections of WorldView.</p></div>`;
            container.innerHTML = `<div class="sidebar-group sidebar-links">${renderSidebarLink("Country Selection", buildPageUrl("home", { country: state.country }))}</div>`;
    }

    bindSidebarInteractions();
}

function renderHomeSidebar(header, container, searchQuery = "") {
    header.innerHTML = `
        <div>
            <h2>Country Selection</h2>
            <p>Choose a country from the map or open the focused country-search flow.</p>
        </div>
    `;

    const favorites = state.favorites.filter(code => COUNTRY_CATALOG[code]);
    const featured = FEATURED_COUNTRIES.filter(code => COUNTRY_CATALOG[code] && !state.favorites.includes(code));
    const query = searchQuery.trim().toLowerCase();

    const searchBlock = `
        <div class="sidebar-group">
            <label class="sidebar-label" for="country-search">Country Search</label>
            <input class="sidebar-input" type="text" id="country-search" placeholder="Search countries..." value="${escapeHtml(searchQuery)}" autocomplete="off" spellcheck="false">
        </div>
    `;

    const alternateSearchLink = `
        <section class="sidebar-group sidebar-links">
            ${renderSidebarLink("Open Country Search", buildPageUrl("countrySearch", { country: state.country, countryq: searchQuery }))}
        </section>
    `;

    if (query) {
        const matches = Object.entries(COUNTRY_CATALOG)
            .filter(([, entry]) => entry.name.toLowerCase().includes(query))
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .map(([code]) => code);
        container.innerHTML = `
            ${searchBlock}
            ${alternateSearchLink}
            <section class="sidebar-group">
                <h3 class="sidebar-title">Search Results</h3>
                <div class="country-list">
                    ${matches.length ? matches.map(code => renderCountryCard(code)).join("") : '<div class="empty-card">No countries found.</div>'}
                </div>
            </section>
        `;
        return;
    }

    container.innerHTML = `
        ${searchBlock}
        ${alternateSearchLink}
        <section class="sidebar-group">
            <h3 class="sidebar-title">Favourites</h3>
            <div class="country-list compact-country-list">
                ${favorites.length ? favorites.map(code => renderCountryCard(code, { compact: true })).join("") : '<div class="empty-card">No countries here yet.</div>'}
            </div>
        </section>
        <section class="sidebar-group">
            <h3 class="sidebar-title">Featured Countries</h3>
            <div class="country-list compact-country-list">
                ${featured.map(code => renderCountryCard(code, { compact: true })).join("")}
            </div>
        </section>
    `;
}

function renderCountrySearchSidebar(header, container) {
    header.innerHTML = `
        <div>
            <h2>Country Search</h2>
            <p>Focused country search with expandable continents and quick access to the map.</p>
        </div>
    `;

    container.innerHTML = `
        <section class="sidebar-group sidebar-links">
            ${renderSidebarLink("Open Country Selection", buildPageUrl("home", { country: state.country }))}
        </section>
    `;
}

function renderMoviesSidebar(header, container) {
    header.innerHTML = `
        <div>
            <h2>Movie Exploration</h2>
            <p>Browse popular titles or titles made in the selected country.</p>
        </div>
    `;

    container.innerHTML = `
        <section class="sidebar-group">
            <label class="sidebar-label" for="sidebar-country-select">Country</label>
            <select class="sidebar-select" id="sidebar-country-select">${renderCountryOptions(state.country)}</select>
            <p class="sidebar-note">Switch countries without leaving the movie exploration flow.</p>
        </section>
        <section class="sidebar-group">
            <span class="sidebar-label">Collection</span>
            <div class="sidebar-chip-row">
                ${renderCollectionLink("popular", "Popular In Country")}
                ${renderCollectionLink("madeIn", "Made In Country")}
            </div>
        </section>
        <section class="sidebar-group">
            <span class="sidebar-label">Media Type</span>
            <div class="sidebar-chip-row">
                ${renderTypeLink("movies", "Movies")}
                ${renderTypeLink("tvshows", "TV Shows")}
            </div>
        </section>
    `;
}

function renderSearchSidebar(header, container) {
    header.innerHTML = `
        <div>
            <h2>Search</h2>
            <p>The contextual graph treats search as its own page that can branch directly into title or person detail pages.</p>
        </div>
    `;

    container.innerHTML = `
        <section class="sidebar-group">
            <label class="sidebar-label" for="sidebar-country-select">Country</label>
            <select class="sidebar-select" id="sidebar-country-select">${renderCountryOptions(state.country)}</select>
        </section>
        <section class="sidebar-group">
            <span class="sidebar-label">Search Scope</span>
            <div class="sidebar-chip-row">
                ${renderSearchScopeLink("all", "All")}
                ${renderSearchScopeLink("movies", "Titles")}
                ${renderSearchScopeLink("people", "Celebs")}
            </div>
        </section>
        <section class="sidebar-group">
            <span class="sidebar-label">Role Filter</span>
            <div class="sidebar-chip-row">
                ${renderRoleLink("search", "all", "All Roles")}
                ${renderRoleLink("search", "actor", "Actors")}
                ${renderRoleLink("search", "director", "Directors")}
            </div>
        </section>
        <section class="sidebar-group">
            <span class="sidebar-label">Search Query</span>
            <form class="sidebar-form" action="search.html">
                <input type="hidden" name="country" value="${escapeHtml(state.country)}">
                <input type="hidden" name="scope" value="${escapeHtml(state.searchScope)}">
                <input type="hidden" name="role" value="${escapeHtml(state.roleFilter)}">
                <input type="text" name="q" placeholder="Search titles or celebs..." value="${escapeHtml(state.search)}">
                <button class="primary-btn" type="submit">Search</button>
            </form>
        </section>
        <section class="sidebar-group sidebar-links">
            ${renderSidebarLink("Open Movie Exploration", buildPageUrl("movies", { country: state.country, collection: state.collection, type: "movies" }))}
            ${renderSidebarLink("Open Celeb Exploration", buildPageUrl("people", { country: state.country }))}
        </section>
    `;
}

function renderPeopleSidebar(header, container) {
    header.innerHTML = `
        <div>
            <h2>Celeb Exploration</h2>
            <p>Browse actors and directors, then jump into related titles through contextual links.</p>
        </div>
    `;

    container.innerHTML = `
        <section class="sidebar-group">
            <label class="sidebar-label" for="sidebar-country-select">Country</label>
            <select class="sidebar-select" id="sidebar-country-select">${renderCountryOptions(state.country)}</select>
        </section>
        <section class="sidebar-group">
            <span class="sidebar-label">Role Filter</span>
            <div class="sidebar-chip-row">
                ${renderRoleLink("people", "all", "All Roles")}
                ${renderRoleLink("people", "actor", "Actors")}
                ${renderRoleLink("people", "director", "Directors")}
            </div>
        </section>
        <section class="sidebar-group">
            <span class="sidebar-label">Search Celebs</span>
            <form class="sidebar-form" action="people.html">
                <input type="hidden" name="country" value="${escapeHtml(state.country)}">
                <input type="hidden" name="role" value="${escapeHtml(state.roleFilter)}">
                <input type="text" name="q" placeholder="Search actors or directors..." value="${escapeHtml(state.search)}">
                <button class="primary-btn" type="submit">Search</button>
            </form>
        </section>
    `;
}

function renderMovieSidebar(header, container) {
    const item = findMediaById(state.country, state.id, state.mediaType) || findMediaById(state.country, state.id);
    const moreTitles = item
        ? listMedia(state.country, item.collection || state.collection, item.type || state.mediaType).filter(other => other.id !== item.id).slice(0, 4)
        : [];

    header.innerHTML = `
        <div>
            <h2>Title Context</h2>
            <p>Movie description pages keep navigation visible and branch into celeb or cinema map pages.</p>
        </div>
    `;

    container.innerHTML = `
        <section class="sidebar-group sidebar-links">
            ${renderSidebarLink("Back to Movies", buildPageUrl("movies", { country: state.country, collection: state.collection, type: "movies" }))}
            ${item ? renderSidebarLink("Open Theater Map", buildPageUrl("theaters", { country: state.country, id: item.id, type: item.type, collection: item.collection })) : ""}
        </section>
        <section class="sidebar-group">
            <h3 class="sidebar-title">Related Titles</h3>
            <div class="sidebar-poster-grid">
                ${moreTitles.length ? moreTitles.map(other => renderSidebarMediaTile(other)).join("") : '<div class="empty-card">No extra titles in this set.</div>'}
            </div>
        </section>
    `;
}

function renderPersonSidebar(header, container) {
    const person = findPersonById(state.country, state.id);
    const related = person ? getRelatedMediaForPerson(state.country, person) : { linked: [], unlinked: [] };

    header.innerHTML = `
        <div>
            <h2>Person Context</h2>
            <p>Person pages should let users move back into titles quickly, which is the key contextual-architecture example.</p>
        </div>
    `;

    container.innerHTML = `
        <section class="sidebar-group sidebar-links">
            ${renderSidebarLink("Back to Celebs", buildPageUrl("people", { country: state.country }))}
        </section>
        <section class="sidebar-group">
            <h3 class="sidebar-title">Known For</h3>
            <div class="sidebar-poster-grid">
                ${related.linked.length ? related.linked.map(item => renderSidebarMediaTile(item)).join("") : '<div class="empty-card">No linked titles found for this person.</div>'}
            </div>
        </section>
    `;
}

function renderTheaterSidebar(header, container) {
    const item = findMediaById(state.country, state.id, state.mediaType) || findMediaById(state.country, state.id);
    header.innerHTML = `
        <div>
            <h2>Cinema Map</h2>
            <p>This page hangs below the movie description in the contextual-structure graph.</p>
        </div>
    `;

    container.innerHTML = `
        <section class="sidebar-group">
            <span class="sidebar-label">Current Selection</span>
            <p class="sidebar-note">${escapeHtml(item ? item.title : "No title selected")} · ${escapeHtml(getCountryEntry(state.country).name)}</p>
            <div class="sidebar-meta">
                <span class="meta-pill">${escapeHtml(state.city)}</span>
                <span class="meta-pill">${escapeHtml(state.date)}</span>
            </div>
        </section>
        <section class="sidebar-group sidebar-links">
            ${item ? renderSidebarLink("Back to Title", buildMediaDetailUrl(item)) : ""}
        </section>
    `;
}

function bindSidebarInteractions() {
    if (state.page === "home") {
        const searchInput = document.getElementById("country-search");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                renderSidebar(searchInput.value.trim());
            });
        }
        bindHomeCountryButtons();
    }

    const countrySelect = document.getElementById("sidebar-country-select");
    if (countrySelect) {
        countrySelect.addEventListener("change", () => {
            const code = sanitizeCountry(countrySelect.value);
            if (!code) return;
            window.location.href = buildSidebarTarget(code);
        });
    }
}

function renderSidebarLink(label, href) {
    return `<a class="sidebar-inline-link" href="${href}">${label}</a>`;
}

function renderCountryCard(code, options = {}) {
    const { compact = false } = options;
    const entry = getCountryEntry(code);
    const popularCount = (entry.popular.movies?.length || 0) + (entry.popular.tvshows?.length || 0);
    const madeInCount = (entry.madeIn.movies?.length || 0) + (entry.madeIn.tvshows?.length || 0);
    const peopleCount = listPeople(code).length;
    const active = state.country === code ? " active" : "";

    const inner = compact
        ? `
            <div class="country-flag compact-country-flag">${countryFlag(code)}</div>
            <div class="compact-country-copy">
                <strong class="compact-country-name">${escapeHtml(entry.name)}</strong>
            </div>
        `
        : `
            <div class="country-flag">${countryFlag(code)}</div>
            <div>
                <h4>${escapeHtml(entry.name)}</h4>
                <p>${escapeHtml(entry.blurb)}</p>
                <div class="country-meta">
                    <span class="meta-pill">${popularCount} popular</span>
                    <span class="meta-pill">${madeInCount} local</span>
                    <span class="meta-pill">${peopleCount} celebs</span>
                </div>
            </div>
        `;

    const className = `country-item${compact ? " country-item-compact" : ""}${active}`;
    if (state.page === "home") {
        return `<button type="button" class="${className}" data-country-select="${code}">${inner}</button>`;
    }
    return `<a class="${className}" href="${buildSidebarTarget(code)}">${inner}</a>`;
}

function bindHomeCountryButtons() {
    if (state.page !== "home") return;
    document.querySelectorAll("[data-country-select]").forEach(button => {
        button.addEventListener("click", () => {
            state.country = button.dataset.countrySelect;
            persistSelectedCountry();
            updateUrlWithoutNavigation(buildPageUrl("home", { country: state.country }));
            renderSidebar(document.getElementById("country-search").value.trim());
            updateHomeHero();
            bindHomeMapTools();
            refreshShellTargets();
            highlightMapCountry(state.country);
            updateDocumentTitle();
        });
    });
}

function renderPage() {
    const root = document.getElementById("page-root");
    root.className = isFocusPage()
        ? "focus-main"
        : (state.page === "home" ? "map-page map-area" : `page-main${showMainSidebar() ? "" : " page-main-wide"}`);

    switch (state.page) {
        case "home":
            renderHomePage(root);
            break;
        case "countrySearch":
            renderCountrySearchPage(root);
            bindCountrySearchPageEvents();
            break;
        case "movies":
            renderMoviesPage(root);
            break;
        case "search":
            renderSearchPage(root);
            break;
        case "people":
            renderPeoplePage(root);
            break;
        case "movie":
            renderMovieDetailPage(root);
            break;
        case "person":
            renderPersonDetailPage(root);
            break;
        case "theaters":
            renderTheaterPage(root);
            break;
        case "settings":
            renderSettingsPage(root);
            break;
        default:
            root.innerHTML = `<div class="empty-card">Unknown page.</div>`;
    }
}

async function queueLiveEnhancements() {
    hydrateLivePosters();
    hydrateLivePeople();
}

async function hydrateLivePosters() {
    if (typeof tmdbFindMediaVisual !== "function") return;
    const posters = [...document.querySelectorAll("[data-media-title]")];
    await Promise.all(posters.map(async (node) => {
        if (node.dataset.liveVisualLoaded) return;
        node.dataset.liveVisualLoaded = "1";
        const visual = await tmdbFindMediaVisual(node.dataset.mediaTitle, node.dataset.mediaType);
        if (visual?.poster) {
            node.style.backgroundImage = `url("${visual.poster}")`;
            node.dataset.livePoster = "1";
        }
    }));
}

async function hydrateLivePeople() {
    if (typeof tmdbFindPersonVisual !== "function") return;
    const avatars = [...document.querySelectorAll("[data-person-name]")];
    await Promise.all(avatars.map(async (node) => {
        if (node.dataset.liveVisualLoaded) return;
        node.dataset.liveVisualLoaded = "1";
        const visual = await tmdbFindPersonVisual(node.dataset.personName);
        if (visual?.profile) {
            node.innerHTML = `<img src="${visual.profile}" alt="">`;
        }
    }));
}

function syncHomeMapViewport(root = document.getElementById("page-root")) {
    if (state.page !== "home" || !root) return;
    const topbarHeight = document.querySelector(".topbar")?.getBoundingClientRect().height || 0;
    const viewportHeight = Math.max(520, Math.round(window.innerHeight - topbarHeight - 12));
    root.style.height = `${viewportHeight}px`;
    root.style.minHeight = `${viewportHeight}px`;
    root.style.maxHeight = `${viewportHeight}px`;
}

function renderHomePage(root) {
    syncHomeMapViewport(root);
    root.innerHTML = `
        <div class="hero-card map-selection-panel" id="home-hero"></div>
        <div class="map-controls" aria-label="Map controls">
            <button class="icon-btn map-control-btn" id="map-zoom-in" type="button" aria-label="Zoom in">＋</button>
            <button class="icon-btn map-control-btn" id="map-zoom-out" type="button" aria-label="Zoom out">－</button>
            <button class="icon-btn map-control-btn" id="map-zoom-reset" type="button" aria-label="Reset zoom">⟲</button>
        </div>
        <svg id="world-map" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet"></svg>
        <div class="map-tooltip" id="tooltip"></div>
    `;

    buildMap();
    bindMapInteractions();
    highlightMapCountry(state.country);
    updateHomeHero();
    bindHomeMapTools();
}
function getCountryCountSummary(code) {
    const entry = getCountryEntry(code);
    return {
        popular: (entry.popular.movies?.length || 0) + (entry.popular.tvshows?.length || 0),
        madeIn: (entry.madeIn.movies?.length || 0) + (entry.madeIn.tvshows?.length || 0),
        people: listPeople(code).length,
    };
}

function getContinentGroups() {
    return TMDB_CONTINENT_COUNTRY_GROUPS
        .map(group => ({ ...group, codes: group.codes.filter(code => COUNTRY_CATALOG[code]) }))
        .filter(group => group.codes.length);
}

function getContinentForCountry(code) {
    const countryCode = sanitizeCountry(code);
    return getContinentGroups().find(group => group.codes.includes(countryCode))?.id || getContinentGroups()[0]?.id || "europe";
}

function getContinentNameForCountry(code) {
    const countryCode = sanitizeCountry(code);
    return getContinentGroups().find(group => group.codes.includes(countryCode))?.name || "Other";
}

function buildCountrySearchMatches(query) {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return [];

    return getContinentGroups().flatMap(group =>
        group.codes.filter(code => {
            const entry = getCountryEntry(code);
            const haystack = `${normalizeText(entry.name)} ${normalizeText(group.name)} ${String(code).toLowerCase()}`;
            return haystack.includes(normalizedQuery);
        })
    );
}

function renderContinentCountryButton(code, continentName) {
    const entry = getCountryEntry(code);
    const counts = getCountryCountSummary(code);
    const isActive = state.country === code ? " active" : "";
    const searchText = `${normalizeText(entry.name)} ${normalizeText(continentName)} ${String(code).toLowerCase()}`;

    return `
        <button
            type="button"
            class="continent-country-btn${isActive}"
            data-alt-country="${code}"
            data-country-search="${escapeHtml(searchText)}"
        >
            <span class="continent-country-flag">${countryFlag(code)}</span>
            <span class="continent-country-copy">
                <strong>${escapeHtml(entry.name)}</strong>
                <span>${counts.popular} popular · ${counts.madeIn} local · ${counts.people} celebs</span>
            </span>
        </button>
    `;
}

function renderContinentBlock(group) {
    const containsSelected = group.codes.includes(state.country);
    return `
        <details class="continent-card" data-continent-card data-continent-id="${group.id}" ${containsSelected ? "open" : ""}>
            <summary>
                <div>
                    <p class="page-kicker">${group.codes.length} countries</p>
                    <h3>${escapeHtml(group.name)}</h3>
                </div>
                <div class="continent-summary-side">
                    <span class="meta-pill">${group.codes.length}</span>
                    <span class="continent-toggle" aria-hidden="true">⌄</span>
                </div>
            </summary>
            <div class="continent-country-grid">
                ${group.codes.map(code => renderContinentCountryButton(code, group.name)).join("")}
            </div>
        </details>
    `;
}

function renderCountrySearchPage(root) {
    const entry = getCountryEntry(state.country);
    const counts = getCountryCountSummary(state.country);

    root.innerHTML = `
        <section class="country-search-page">
            <section class="page-header country-search-hero">
                <div class="country-search-hero-copy">
                    <p class="page-kicker">Country Search</p>
                    <h2 class="page-title">Search countries first</h2>
                    <p class="page-copy">Use the search bar for speed, or open a continent to browse the countries inside it.</p>
                </div>
                <label class="country-search-big" for="country-alt-search">
                    <span class="sidebar-label">Search Countries</span>
                    <input
                        id="country-alt-search"
                        type="text"
                        placeholder="Search for a country..."
                        value="${escapeHtml(state.countrySearchQuery)}"
                        autocomplete="off"
                        spellcheck="false"
                    >
                </label>
            </section>

            <section class="country-search-layout">
                <div>
                    <section class="section-card country-search-results" id="country-search-results" hidden>
                        <div class="country-search-results-header">
                            <h3 class="sidebar-title">Search Results</h3>
                            <span class="country-search-results-count" id="country-search-results-count"></span>
                        </div>
                        <div class="continent-country-grid country-search-results-grid" id="country-search-results-grid"></div>
                    </section>

                    <div class="continent-grid" id="continent-grid">
                        ${getContinentGroups().map(renderContinentBlock).join("")}
                    </div>

                    <div class="empty-card country-search-empty" id="country-search-empty" hidden>No countries match that search yet.</div>
                </div>

                <aside class="country-search-side">
                    <section class="country-summary-card country-search-side-card">
                        <p class="page-kicker">Selected Country</p>
                        <h3>${countryFlag(state.country)} ${escapeHtml(entry.name)}</h3>
                        <p>${escapeHtml(entry.blurb)}</p>
                        <div class="hero-meta">
                            <span class="hero-pill">${counts.popular} popular titles</span>
                            <span class="hero-pill">${counts.madeIn} locally made titles</span>
                            <span class="hero-pill">${counts.people} celebs</span>
                        </div>
                    </section>

                    <div class="country-search-side-actions">
                        <a class="primary-btn country-search-map-btn" href="${buildPageUrl("home", { country: state.country })}">Open Map</a>
                        <a class="secondary-btn" href="${buildPageUrl("movies", { country: state.country, collection: state.collection, type: "movies" })}">Popular Movies</a>
                        <a class="secondary-btn" href="${buildPageUrl("people", { country: state.country })}">Popular Celebs</a>
                                </div>
                </aside>
            </section>
        </section>
    `;
}

function bindCountrySearchPageEvents() {
    const input = document.getElementById("country-alt-search");
    if (!input) return;
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);

    const pageRoot = document.getElementById("page-root");

    const applyFilter = () => {
        state.countrySearchQuery = input.value.trim();
        const selectedContinent = getContinentForCountry(state.country);
        const continentCards = [...document.querySelectorAll("[data-continent-card]")];
        const continentGrid = document.getElementById("continent-grid");
        const resultsPanel = document.getElementById("country-search-results");
        const resultsGrid = document.getElementById("country-search-results-grid");
        const resultsCount = document.getElementById("country-search-results-count");
        const emptyState = document.getElementById("country-search-empty");
        const matchingCodes = buildCountrySearchMatches(state.countrySearchQuery);

        if (state.countrySearchQuery) {
            if (resultsGrid) {
                resultsGrid.innerHTML = matchingCodes
                    .map(code => renderContinentCountryButton(code, getContinentNameForCountry(code)))
                    .join("");
            }
            if (resultsCount) {
                resultsCount.textContent = matchingCodes.length
                    ? `${matchingCodes.length} match${matchingCodes.length === 1 ? "" : "es"}`
                    : "";
            }
            if (resultsPanel) resultsPanel.hidden = matchingCodes.length === 0;
            if (continentGrid) continentGrid.hidden = true;
            if (emptyState) emptyState.hidden = matchingCodes.length > 0;
            return;
        }

        if (resultsGrid) resultsGrid.innerHTML = "";
        if (resultsCount) resultsCount.textContent = "";
        if (resultsPanel) resultsPanel.hidden = true;
        if (continentGrid) continentGrid.hidden = false;
        continentCards.forEach(card => {
            card.hidden = false;
            card.open = card.dataset.continentId === selectedContinent;
            card.querySelectorAll("[data-alt-country]").forEach(button => {
                button.hidden = false;
            });
        });
        if (emptyState) emptyState.hidden = true;
    };

    input.addEventListener("input", () => {
        updateUrlWithoutNavigation(buildPageUrl("countrySearch", { country: state.country, countryq: input.value.trim() }));
        applyFilter();
    });

    if (pageRoot) {
        pageRoot.addEventListener("click", event => {
            const button = event.target.closest("[data-alt-country]");
            if (!button || !pageRoot.contains(button)) return;
            const code = sanitizeCountry(button.dataset.altCountry);
            if (!code) return;
            state.country = code;
            persistSelectedCountry();
            updateUrlWithoutNavigation(buildPageUrl("countrySearch", { country: state.country, countryq: state.countrySearchQuery }));
            refreshShellTargets();
            updateDocumentTitle();
            renderCountrySearchPage(document.getElementById("page-root"));
            bindCountrySearchPageEvents();
        });
    }

    applyFilter();
}

function updateHomeHero() {
    const hero = document.getElementById("home-hero");
    if (!hero) return;
    const entry = getCountryEntry(state.country);
    const popularCount = (entry.popular.movies?.length || 0) + (entry.popular.tvshows?.length || 0);
    const madeInCount = (entry.madeIn.movies?.length || 0) + (entry.madeIn.tvshows?.length || 0);
    const peopleCount = listPeople(state.country).length;

    hero.innerHTML = `
        <div class="map-panel-handle" id="home-hero-handle" aria-label="Drag selected country panel" title="Drag panel">
            <span class="map-panel-grip" aria-hidden="true">
                <span></span><span></span><span></span>
                <span></span><span></span><span></span>
            </span>
        </div>
        <p class="page-kicker">Selected Country</p>
        <h2>${countryFlag(state.country)} ${escapeHtml(entry.name)}</h2>
        <p class="hero-text">${escapeHtml(entry.blurb)}</p>
        <div class="hero-meta">
            <span class="hero-pill">${popularCount} popular titles</span>
            <span class="hero-pill">${madeInCount} locally made titles</span>
            <span class="hero-pill">${peopleCount} celebs</span>
        </div>
        <div class="hero-actions">
            <a class="secondary-btn" href="${buildPageUrl("movies", { country: state.country, collection: state.collection, type: "movies" })}">Browse movies</a>
            <a class="secondary-btn" href="${buildPageUrl("people", { country: state.country })}">Browse celebs</a>
            <a class="secondary-btn" href="${buildPageUrl("settings", { country: state.country })}">Settings</a>
        </div>
    `;
}

function bindHomeMapTools() {
    const svgNode = document.getElementById("world-map");
    const zoomBehavior = svgNode?.__mapZoomBehavior;
    if (svgNode && zoomBehavior && typeof d3 !== "undefined") {
        const svg = d3.select(svgNode);
        const zoomIn = document.getElementById("map-zoom-in");
        const zoomOut = document.getElementById("map-zoom-out");
        const zoomReset = document.getElementById("map-zoom-reset");
        if (zoomIn && !zoomIn.dataset.bound) {
            zoomIn.dataset.bound = "1";
            zoomIn.addEventListener("click", () => {
                svg.transition().duration(180).call(zoomBehavior.scaleBy, 1.35);
            });
        }
        if (zoomOut && !zoomOut.dataset.bound) {
            zoomOut.dataset.bound = "1";
            zoomOut.addEventListener("click", () => {
                svg.transition().duration(180).call(zoomBehavior.scaleBy, 0.74);
            });
        }
        if (zoomReset && !zoomReset.dataset.bound) {
            zoomReset.dataset.bound = "1";
            zoomReset.addEventListener("click", () => {
                svg.transition().duration(180).call(zoomBehavior.transform, d3.zoomIdentity);
            });
        }
    }

    const panel = document.getElementById("home-hero");
    const handle = document.getElementById("home-hero-handle");
    const stage = document.getElementById("page-root");
    if (!panel || !handle || !stage) return;

    handle.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        handle.classList.add("dragging");
        const stageRect = stage.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const offsetX = event.clientX - panelRect.left;
        const offsetY = event.clientY - panelRect.top;

        panel.style.right = "auto";
        panel.style.left = `${panelRect.left - stageRect.left}px`;
        panel.style.top = `${panelRect.top - stageRect.top}px`;

        const onMove = (moveEvent) => {
            const maxLeft = Math.max(0, stageRect.width - panelRect.width);
            const maxTop = Math.max(0, stageRect.height - panelRect.height);
            const nextLeft = Math.min(Math.max(0, moveEvent.clientX - stageRect.left - offsetX), maxLeft);
            const nextTop = Math.min(Math.max(0, moveEvent.clientY - stageRect.top - offsetY), maxTop);
            panel.style.left = `${nextLeft}px`;
            panel.style.top = `${nextTop}px`;
        };

        const stop = () => {
            handle.classList.remove("dragging");
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", stop);
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", stop);
    });
}


function bindMapInteractions() {
    const svg = document.getElementById("world-map");
    const tooltip = document.getElementById("tooltip");

    svg.addEventListener("mousemove", (event) => {
        const path = event.target.closest("path.country[data-code]");
        if (!path) {
            tooltip.classList.remove("visible");
            return;
        }
        const code = path.getAttribute("data-code");
        if (!COUNTRY_CATALOG[code]) {
            tooltip.classList.remove("visible");
            return;
        }
        const rect = svg.closest(".map-area").getBoundingClientRect();
        tooltip.textContent = `${countryFlag(code)} ${MAP_NAMES[code] || code}`;
        tooltip.style.left = `${event.clientX - rect.left + 16}px`;
        tooltip.style.top = `${event.clientY - rect.top - 30}px`;
        tooltip.classList.add("visible");
    });

    svg.addEventListener("mouseleave", () => tooltip.classList.remove("visible"));

    svg.addEventListener("click", (event) => {
        const path = event.target.closest("path.country[data-code]");
        if (!path) return;
        const code = path.getAttribute("data-code");
        if (!COUNTRY_CATALOG[code]) return;
        state.country = code;
        persistSelectedCountry();
        updateUrlWithoutNavigation(buildPageUrl("home", { country: state.country }));
        const countrySearch = document.getElementById("country-search");
        renderSidebar(countrySearch ? countrySearch.value.trim() : "");
        updateHomeHero();
        bindHomeMapTools();
        refreshShellTargets();
        highlightMapCountry(state.country);
        updateDocumentTitle();
    });
}

function highlightMapCountry(code) {
    document.querySelectorAll("#world-map path.country.highlighted").forEach(node => node.classList.remove("highlighted"));
    const path = document.querySelector(`#world-map path.country[data-code="${code}"]`);
    if (path) path.classList.add("highlighted");
}

function renderMoviesPage(root) {
    const entry = getCountryEntry(state.country);
    const items = searchMedia(state.country, state.collection, state.mediaType, state.search);
    const filterPills = [
        state.collection === "popular" ? "Popular In Country" : "Made In Country",
        state.mediaType === "tvshows" ? "TV Shows" : "Movies",
        state.search ? `Query: ${state.search}` : "No keyword filter",
    ];
    root.innerHTML = `
        <section class="page-header">
            <div class="page-header-top">
                <div>
                    <p class="page-kicker">Title Exploration</p>
                    <h2 class="page-title">${countryFlag(state.country)} ${escapeHtml(entry.name)} · ${state.collection === "popular" ? "Popular Titles" : "Made In Country"}</h2>
                    <p class="page-copy">Separate title-exploration page, consistent with the report's contextual architecture and list-page flow.</p>
                </div>
            </div>
            <div class="page-toolbar">
                <div class="toolbar-group">
                    ${renderCollectionLink("popular", "Popular In Country")}
                    ${renderCollectionLink("madeIn", "Made In Country")}
                    ${renderTypeLink("movies", "Movies")}
                    ${renderTypeLink("tvshows", "TV Shows")}
                </div>
            </div>
        </section>
        <section class="section-stack">
            ${renderFilterSummaryCard(filterPills)}
            <section class="section-card">
                <div class="section-header">
                    <div>
                        <h3>${items.length} results</h3>
                        <p class="inline-note">Click a title to open a separate detail page. Related celebs link into the celeb flow.</p>
                    </div>
                </div>
                <div class="poster-list-grid">
                    ${items.length ? items.map(item => renderMediaPosterTile(item)).join("") : '<div class="empty-card">No titles matched this search.</div>'}
                </div>
            </section>
        </section>
    `;
}

function renderSearchPage(root) {
    const entry = getCountryEntry(state.country);
    const titleResults = searchAllMedia(state.country, state.search);
    const peopleResults = searchPeople(state.country, state.search, state.roleFilter);
    const resultHeading = `Results for ${state.collection === "madeIn" ? "made-in titles" : "popular titles"} in ${entry.name}`;

    const titleSection = `
        <section class="section-card">
            <div class="section-header">
                <div>
                    <h3>${titleResults.length} title results</h3>
                    <p class="inline-note">Browse posters and jump directly into title detail pages.</p>
                </div>
            </div>
            <div class="poster-result-grid">
                ${titleResults.length ? titleResults.map(item => renderSearchPosterCard(item)).join("") : '<div class="empty-card">No titles matched this query.</div>'}
            </div>
        </section>
    `;

    const peopleSection = `
        <section class="section-card">
            <div class="section-header">
                <div>
                    <h3>${peopleResults.length} celeb results</h3>
                    <p class="inline-note">Person results link directly into person detail pages, which can then link back into titles.</p>
                </div>
            </div>
            <div class="person-grid">
                ${peopleResults.length ? peopleResults.map(person => renderPersonCard(person)).join("") : '<div class="empty-card">No celebs matched this query.</div>'}
            </div>
        </section>
    `;

    root.innerHTML = `
        <section class="page-header">
            <div class="page-header-top search-feature-header">
                <div>
                    <p class="page-kicker">Search</p>
                    <h2 class="page-title">${escapeHtml(resultHeading)}</h2>
                    <p class="page-copy">Search results with poster-first browsing and a quick mode switch.</p>
                </div>
                <div class="page-actions search-feature-actions">
                    ${state.searchScope !== "people" ? renderSearchCollectionCard() : ""}
                </div>
            </div>
            <div class="page-toolbar">
                <div class="toolbar-group">
                    ${renderSearchScopeLink("all", "All Results")}
                    ${renderSearchScopeLink("movies", "Titles")}
                    ${renderSearchScopeLink("people", "Celebs")}
                    ${renderRoleLink("search", "all", "All Roles")}
                    ${renderRoleLink("search", "actor", "Actors")}
                    ${renderRoleLink("search", "director", "Directors")}
                </div>
            </div>
        </section>
        <section class="section-stack">
            ${state.searchScope === "movies" ? titleSection : ""}
            ${state.searchScope === "people" ? peopleSection : ""}
            ${state.searchScope === "all" ? `${titleSection}${peopleSection}` : ""}
        </section>
    `;
}

function renderPeoplePage(root) {
    const entry = getCountryEntry(state.country);
    const people = searchPeople(state.country, state.search, state.roleFilter);
    const filterPills = [
        state.roleFilter === "director" ? "Directors" : state.roleFilter === "actor" ? "Actors" : "All Roles",
        state.search ? `Query: ${state.search}` : "No keyword filter",
    ];
    root.innerHTML = `
        <section class="page-header">
            <div class="page-header-top">
                <div>
                    <p class="page-kicker">Celeb Exploration</p>
                    <h2 class="page-title">${countryFlag(state.country)} ${escapeHtml(entry.name)} · Popular Celebs</h2>
                    <p class="page-copy">Separate celeb exploration page. From here, users can jump into titles through country-specific actors and directors.</p>
                </div>
            </div>
            <div class="page-toolbar">
                <div class="toolbar-group">
                    <a class="nav-link active" href="${buildPageUrl("people", { country: state.country })}">Celebs</a>
                    ${renderRoleLink("people", "all", "All Roles")}
                    ${renderRoleLink("people", "actor", "Actors")}
                    ${renderRoleLink("people", "director", "Directors")}
                    <a class="inline-link" href="${buildPageUrl("movies", { country: state.country, collection: state.collection, type: "movies" })}">Go to Movies</a>
                </div>
            </div>
        </section>
        <section class="section-stack">
            ${renderFilterSummaryCard(filterPills)}
            <section class="section-card">
                <div class="section-header">
                    <div>
                        <h3>${people.length} results</h3>
                        <p class="inline-note">Celeb cards link to separate person pages. Known-for titles link back into movie detail pages.</p>
                    </div>
                </div>
                <div class="star-list-grid">
                    ${people.length ? people.map(person => renderStarListTile(person)).join("") : '<div class="empty-card">No featured celebs are available for this country yet.</div>'}
                </div>
            </section>
        </section>
    `;
}

function renderMovieDetailPage(root) {
    const item = findMediaById(state.country, state.id, state.mediaType) || findMediaById(state.country, state.id);
    if (!item) {
        root.innerHTML = renderNotFoundCard("Title not found", "The requested title could not be found for this country.", buildPageUrl("movies", { country: state.country }));
        return;
    }
    const relatedPeople = getRelatedPeopleForMedia(state.country, item);
    const moreTitles = listMedia(state.country, item.collection || state.collection, item.type || state.mediaType)
        .filter(other => other.id !== item.id)
        .slice(0, 4);

    root.innerHTML = `
        <section class="page-header">
            <div class="page-header-top">
                <div>
                    <p class="page-kicker">Title Detail</p>
                    <h2 class="page-title">Movie Description</h2>
                    <p class="page-copy">Separate item page with contextual links to celebs and theater information.</p>
                </div>
                <div class="page-actions">
                    <a class="back-link" href="${buildPageUrl("movies", { country: state.country, collection: item.collection || state.collection, type: item.type || state.mediaType })}">Back to Movies</a>
                </div>
            </div>
        </section>
        <div class="detail-layout detail-layout-item">
            <aside class="detail-side-stack">
                <section class="detail-card">
                    <div class="detail-visual">${renderPosterVisual(item, true)}</div>
                </section>
                <section class="detail-card">
                    <div class="section-header"><h3>Extra Information</h3></div>
                    <p class="detail-text">This movie is available in theaters through the extra-information flow described in the report.</p>
                    <div class="detail-actions">
                        <a class="primary-btn" href="${buildPageUrl("theaters", { country: state.country, id: item.id, type: item.type || state.mediaType, collection: item.collection || state.collection })}">View theater map</a>
                    </div>
                </section>
            </aside>
            <div class="detail-main">
                <section class="detail-card">
                    <p class="detail-kicker">${item.type === "tvshows" ? "TV Show" : "Movie"}</p>
                    <h3 class="detail-title">${escapeHtml(item.title)}</h3>
                    <div class="detail-meta">
                        ${renderMediaPills(item)}
                    </div>
                    <p class="detail-text">${escapeHtml(item.overview || "Discover story details, cast, and where to watch this title.")}</p>
                    <div class="providers-row">${renderProviderPills(item)}</div>
                    <div class="section-header">
                        <div>
                            <h3>Main Information</h3>
                            <p class="inline-note">Actors and directors sit in the main information area in the wireframe.</p>
                        </div>
                    </div>
                    <div class="cast-grid">
                        ${relatedPeople.length ? relatedPeople.map(person => renderCastCard(person)).join("") : '<div class="empty-card">No cast or crew are listed for this title yet.</div>'}
                    </div>
                </section>
            </div>
        </div>
    `;
}

function renderPersonDetailPage(root) {
    const person = findPersonById(state.country, state.id);
    if (!person) {
        root.innerHTML = renderNotFoundCard("Person not found", "The requested person could not be found for this country.", buildPageUrl("people", { country: state.country }));
        return;
    }
    const relatedMedia = getRelatedMediaForPerson(state.country, person);
    root.innerHTML = `
        <section class="page-header">
            <div class="page-header-top">
                <div>
                    <p class="page-kicker">Person Detail</p>
                    <h2 class="page-title">Celeb Description</h2>
                    <p class="page-copy">Separate person page with contextual links back into title detail pages.</p>
                </div>
                <div class="page-actions">
                    <a class="back-link" href="${buildPageUrl("people", { country: state.country })}">Back to Celebs</a>
                </div>
            </div>
        </section>
        <div class="detail-layout detail-layout-item">
            <aside class="detail-side-stack">
                <section class="detail-card">
                    <div class="detail-visual person-visual">${renderPersonAvatar(person, true)}</div>
                </section>
                <section class="detail-card">
                    <div class="section-header"><h3>Extra Information</h3></div>
                    <div class="known-for-row">
                        ${relatedMedia.linked.map(item => `<a class="inline-link" href="${buildMediaDetailUrl(item)}">${escapeHtml(item.title)}</a>`).join("")}
                        ${relatedMedia.unlinked.map(title => `<span class="known-for-pill">${escapeHtml(title)}</span>`).join("")}
                    </div>
                </section>
            </aside>
            <div class="detail-main">
                <section class="detail-card">
                    <p class="detail-kicker">${escapeHtml(person.role || "Creative")}</p>
                    <h3 class="detail-title">${escapeHtml(person.name)}</h3>
                    <p class="detail-text">Explore this celeb and jump directly into related titles.</p>
                    <div class="detail-actions">
                        <a class="secondary-btn" href="${buildPageUrl("movies", { country: state.country })}">Browse movies</a>
                    </div>
                </section>
            </div>
        </div>
    `;
}

function renderTheaterPage(root) {
    const item = findMediaById(state.country, state.id, state.mediaType) || findMediaById(state.country, state.id);
    if (!item) {
        root.innerHTML = renderNotFoundCard("Theater map unavailable", "Select a title to view theater locations.", buildPageUrl("movies", { country: state.country }));
        return;
    }
    const theaters = buildTheatersForMedia(state.country, item);
    const [featuredTheater, ...otherTheaters] = theaters;
    root.innerHTML = `
        <div class="focus-page-wrap">
            <section class="page-header">
                <div class="page-header-top">
                    <div>
                        <p class="page-kicker">Theater Map</p>
                        <h2 class="page-title">${escapeHtml(item.title)} in ${escapeHtml(state.city)}</h2>
                        <p class="page-copy">Cinema map with a left sidebar for movie, location, and date.</p>
                    </div>
                    <div class="page-actions">
                        <a class="focus-close-btn" href="${buildMediaDetailUrl(item)}" aria-label="Exit theater map">✕</a>
                    </div>
                </div>
            </section>
            <div class="theater-focus-layout">
                <aside class="section-card theater-sidebar-panel">
                    <div class="section-header">
                        <div>
                            <h3>Search</h3>
                            <p class="inline-note">Movie, location, and date controls sit in the sidebar in the report wireframe.</p>
                        </div>
                    </div>
                    <form class="sidebar-form theater-sidebar-form" action="theaters.html">
                        <input type="hidden" name="country" value="${escapeHtml(state.country)}">
                        <input type="hidden" name="id" value="${escapeHtml(item.id)}">
                        <input type="hidden" name="type" value="${escapeHtml(item.type || state.mediaType)}">
                        <input type="hidden" name="collection" value="${escapeHtml(item.collection || state.collection)}">
                        <label>
                            <span class="sidebar-label">Movie</span>
                            <input class="sidebar-input" type="text" value="${escapeHtml(item.title)}" readonly>
                        </label>
                        <label>
                            <span class="sidebar-label">Location</span>
                            <input class="sidebar-input" type="text" name="city" value="${escapeHtml(state.city)}">
                        </label>
                        <label>
                            <span class="sidebar-label">Date</span>
                            <input class="sidebar-input" type="date" name="date" value="${escapeHtml(state.date)}">
                        </label>
                        <button class="primary-btn" type="submit">Search</button>
                    </form>
                    <button class="secondary-btn theater-toggle-btn" type="button">Detailed View Toggle</button>
                </aside>
                <section class="detail-card theater-stage">
                    <div class="theater-map">
                        <article class="map-info-card map-info-card-main">
                            <h3>${escapeHtml(featuredTheater.name)}</h3>
                            <p>${escapeHtml(featuredTheater.summary)}</p>
                            <div class="theater-times">
                                ${featuredTheater.times.map(time => `<span class="time-pill">${escapeHtml(time)}</span>`).join("")}
                            </div>
                            <div class="known-for-row">
                                ${featuredTheater.otherTitles.map(title => `<span class="known-for-pill">${escapeHtml(title)}</span>`).join("")}
                            </div>
                        </article>
                        ${otherTheaters.slice(0, 2).map((theater, index) => `
                            <article class="map-info-card map-info-card-reduced reduced-${index + 1}">
                                <h4>${escapeHtml(theater.name)}</h4>
                                <p>${escapeHtml(theater.summary)}</p>
                            </article>
                        `).join("")}
                        <div class="theater-pin pin-main"></div>
                        <div class="theater-pin pin-a"></div>
                        <div class="theater-pin pin-b"></div>
                    </div>
                </section>
            </div>
        </div>
    `;
}


function renderSettingsPage(root) {
    const sectionCopy = {
        account: {
            title: "Account",
            body: `
                <label class="setting-card">
                    <span class="setting-label">Display name</span>
                    <input class="sidebar-input" id="account-name-input" type="text" value="${escapeHtml(state.settings.accountName || DEFAULT_SETTINGS.accountName)}">
                </label>
                <label class="setting-card">
                    <span class="setting-label">Email</span>
                    <input class="sidebar-input" id="account-email-input" type="email" value="${escapeHtml(state.settings.accountEmail || DEFAULT_SETTINGS.accountEmail)}">
                </label>
                <button class="secondary-btn settings-reset-inline" id="reset-password-btn" type="button">Reset password</button>
            `,
        },
        language: {
            title: "Language Settings",
            body: `
                <label class="setting-card">
                    <span class="setting-label">Language</span>
                    <select id="language-select">
                        <option value="English">English</option>
                        <option value="Dutch">Dutch</option>
                        <option value="French">French</option>
                        <option value="Japanese">Japanese</option>
                    </select>
                </label>
                <label class="setting-card">
                    <span class="setting-label">Default country</span>
                    <select id="default-country-select">${renderCountryOptions(state.settings.defaultCountry)}</select>
                </label>
            `,
        },
        visual: {
            title: "Visual Settings",
            body: `
                <label class="setting-card">
                    <span class="setting-label">Theme</span>
                    <select id="theme-select">
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="contrast">High Contrast</option>
                    </select>
                </label>
                <label class="setting-card">
                    <span class="setting-label">Font size</span>
                    <select id="font-size-select">
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                    </select>
                </label>
                <button class="secondary-btn settings-reset-inline" id="reset-all-settings-btn" type="button">Reset all settings</button>
            `,
        },
    };
    const currentSection = sectionCopy[state.settingsSection] || sectionCopy.language;
    root.innerHTML = `
        <div class="focus-page-wrap settings-page">
            <section class="page-header">
                <div class="page-header-top">
                    <div>
                        <p class="page-kicker">Settings</p>
                        <h2 class="page-title">Settings</h2>
                        <p class="page-copy">Update your WorldView preferences from the section navigation on the left.</p>
                    </div>
                    <div class="page-actions">
                        <a class="focus-close-btn" href="${buildPageUrl("home", { country: state.country })}" aria-label="Exit settings">✕</a>
                    </div>
                </div>
            </section>
            <div class="settings-focus-layout">
                <aside class="section-card settings-sidebar-panel">
                    <nav class="settings-section-nav">
                        ${renderSettingsSectionLink("account", "Account")}
                        ${renderSettingsSectionLink("language", "Language Settings")}
                        ${renderSettingsSectionLink("visual", "Visual Settings")}
                    </nav>
                </aside>
                <section class="detail-card settings-main-panel">
                    <div class="section-header">
                        <div>
                            <h3>${currentSection.title}</h3>
                        </div>
                    </div>
                    <div class="settings-grid settings-grid-page">
                        ${currentSection.body}
                    </div>
                    <div class="settings-actions">
                        <p class="settings-status" id="settings-status">Change settings and press Save settings.</p>
                        <button class="primary-btn" id="save-settings-btn" type="button">Save settings</button>
                    </div>
                </section>
            </div>
        </div>
    `;

    populateSettingsInputs();
    bindSettingsPageEvents();
}

function renderMediaListCard(item) {
    const relatedPeople = getRelatedPeopleForMedia(state.country, item).slice(0, 2);
    return `
        <article class="content-card">
            ${renderPosterVisual(item)}
            <div>
                <div class="content-card-top">
                    <h3>${escapeHtml(item.title)}</h3>
                    <span class="rating-badge">${escapeHtml(item.rating || "TBD")}</span>
                </div>
                <div class="info-row">${renderMediaPills(item)}</div>
                <p>${escapeHtml(item.overview || "Discover story details and viewing options.")}</p>
                <div class="content-card-footer">
                    <a class="inline-link" href="${buildMediaDetailUrl(item)}">Open detail</a>
                    ${renderProviderPills(item)}
                </div>
                ${relatedPeople.length ? `<div class="section-actions">${relatedPeople.map(person => `<a class="inline-link" href="${buildPersonDetailUrl(person)}">${renderRoleIcon(person.role)} ${escapeHtml(person.name)}</a>`).join("")}</div>` : ""}
            </div>
        </article>
    `;
}

function renderPersonCard(person) {
    const related = getRelatedMediaForPerson(state.country, person);
    return `
        <article class="person-card person-tile">
            <div class="person-tile-visual">
                ${renderPersonAvatar(person, true)}
            </div>
            <div class="person-card-body">
                <div class="content-card-top">
                    <div>
                        <p class="person-role">${escapeHtml(person.role || "Creative")}</p>
                        <h3>${escapeHtml(person.name)}</h3>
                    </div>
                    <span class="rating-badge">${renderRoleIcon(person.role)} Celeb</span>
                </div>
                <p>Explore this celeb and move directly into related titles.</p>
                <div class="known-for-row">
                    ${related.linked.slice(0, 3).map(item => `<a class="inline-link" href="${buildMediaDetailUrl(item)}">${escapeHtml(item.title)}</a>`).join("")}
                    ${related.unlinked.slice(0, 2).map(title => `<span class="known-for-pill">${escapeHtml(title)}</span>`).join("")}
                </div>
                <div class="section-actions">
                    <a class="secondary-btn" href="${buildPersonDetailUrl(person)}">Open celeb page</a>
                </div>
            </div>
        </article>
    `;
}


function renderMiniMediaLink(item) {
    return `
        <a class="mini-link" href="${buildMediaDetailUrl(item)}">
            <div class="mini-link-icon">${renderMediaGlyph(item)}</div>
            <div>
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.genre || "Featured genre")}</p>
            </div>
        </a>
    `;
}

function renderSidebarMediaTile(item) {
    return `
        <a class="sidebar-media-tile" href="${buildMediaDetailUrl(item)}">
            ${renderPosterVisual(item)}
            <h4>${escapeHtml(item.title)}</h4>
        </a>
    `;
}

function renderSearchPosterCard(item) {
    return `
        <a class="search-poster-card" href="${buildMediaDetailUrl(item)}">
            ${renderPosterVisual(item)}
            <h4>${escapeHtml(item.title)}</h4>
        </a>
    `;
}

function renderMediaPosterTile(item) {
    return `
        <a class="search-poster-card media-list-tile" href="${buildMediaDetailUrl(item)}">
            ${renderPosterVisual(item)}
            <h4>${escapeHtml(item.title)}</h4>
        </a>
    `;
}

function renderStarListTile(person) {
    return `
        <a class="star-list-tile" href="${buildPersonDetailUrl(person)}">
            <div class="star-list-visual">${renderPersonAvatar(person, true)}</div>
            <div>
                <p class="person-role">${escapeHtml(person.role || "Creative")}</p>
                <h4>${escapeHtml(person.name)}</h4>
            </div>
        </a>
    `;
}

function renderSearchCollectionCard() {
    return `
        <div class="search-mode-card">
            <a class="search-mode-link${state.collection === "madeIn" ? " active" : ""}" href="${buildPageUrl("search", { country: state.country, q: state.search, scope: state.searchScope, role: state.roleFilter, collection: "madeIn" })}">Made In</a>
            <a class="search-mode-link${state.collection === "popular" ? " active" : ""}" href="${buildPageUrl("search", { country: state.country, q: state.search, scope: state.searchScope, role: state.roleFilter, collection: "popular" })}">Popular</a>
        </div>
    `;
}

function renderFilterSummaryCard(pills = []) {
    return `
        <section class="summary-strip">
            <section class="section-card summary-card">
                <p class="sidebar-label">Summary of Filters</p>
                <div class="known-for-row">
                    ${pills.map(value => `<span class="known-for-pill">${escapeHtml(value)}</span>`).join("")}
                </div>
            </section>
        </section>
    `;
}

function renderMiniPersonLink(person) {
    return `
        <a class="mini-link" href="${buildPersonDetailUrl(person)}">
            <div class="mini-link-icon">${renderRoleIcon(person.role)}</div>
            <div>
                <h4>${escapeHtml(person.name)}</h4>
                <p>${escapeHtml(person.role || "Creative")}</p>
            </div>
        </a>
    `;
}

function renderTheaterCard(theater) {
    return `
        <article class="theater-card">
            <div>
                <h3>${escapeHtml(theater.name)}</h3>
                <p>${escapeHtml(theater.summary)}</p>
                <div class="theater-times">
                    ${theater.times.map(time => `<span class="time-pill">${escapeHtml(time)}</span>`).join("")}
                </div>
                <div class="known-for-row">
                    ${theater.otherTitles.map(title => `<span class="known-for-pill">${escapeHtml(title)}</span>`).join("")}
                </div>
            </div>
        </article>
    `;
}

function renderNotFoundCard(title, message, href) {
    return `
        <section class="page-header">
            <div class="empty-card">
                <h2 class="page-title">${escapeHtml(title)}</h2>
                <p class="page-copy">${escapeHtml(message)}</p>
                <div class="hero-actions">
                    <a class="primary-btn" href="${href}">Go back</a>
                </div>
            </div>
        </section>
    `;
}

function renderNavLink(page, label) {
    return `<a class="nav-link${isPageActive(page) ? " active" : ""}" data-nav-page="${page}" href="${buildNavTarget(page)}">${label}</a>`;
}

function refreshShellTargets() {
    document.querySelectorAll(".topnav [data-nav-page]").forEach(link => {
        const page = link.dataset.navPage;
        link.href = buildNavTarget(page);
        link.classList.toggle("active", isPageActive(page));
    });

    const settingsLink = document.getElementById("open-settings-btn");
    if (settingsLink) {
        settingsLink.href = buildPageUrl("settings", { country: state.country });
    }

    const brandLink = document.querySelector(".brand-link");
    if (brandLink) {
        brandLink.href = buildPageUrl("countrySearch", { country: state.country, countryq: state.countrySearchQuery });
    }

    const brandCopy = document.querySelector(".shell-brand-copy");
    if (brandCopy) {
        brandCopy.innerHTML = `<h1>${escapeHtml(getShellTitle())}</h1><p>${escapeHtml(getShellSubtitle())}</p>`;
    }
}

function renderCollectionLink(collection, label) {
    return `<a class="collection-btn${state.collection === collection ? " active" : ""}" href="${buildPageUrl("movies", { country: state.country, collection, type: state.mediaType, q: state.search })}">${label}</a>`;
}

function renderTypeLink(type, label) {
    return `<a class="type-tab${state.mediaType === type ? " active" : ""}" href="${buildPageUrl("movies", { country: state.country, collection: state.collection, type, q: state.search })}">${label}</a>`;
}

function renderSearchScopeLink(scope, label) {
    return `<a class="collection-btn${state.searchScope === scope ? " active" : ""}" href="${buildPageUrl("search", { country: state.country, q: state.search, scope, role: state.roleFilter })}">${label}</a>`;
}

function renderRoleLink(page, role, label) {
    const params = { country: state.country, role };
    if (page === "search") {
        params.q = state.search;
        params.scope = state.searchScope;
    } else {
        params.q = state.search;
    }
    return `<a class="type-tab${state.roleFilter === role ? " active" : ""}" href="${buildPageUrl(page, params)}">${label}</a>`;
}

function renderSettingsSectionLink(section, label) {
    const icons = {
        account: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 20c1.8-4 5-6 8-6s6.2 2 8 6"></path>
            </svg>
        `,
        language: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5"></circle>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M19 5l-2.8 2.8M5 19l2.8-2.8"></path>
            </svg>
        `,
        visual: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path>
                <circle cx="12" cy="12" r="3.2"></circle>
            </svg>
        `,
    };
    return `
        <a class="settings-nav-link${state.settingsSection === section ? " active" : ""}" href="${buildPageUrl("settings", { country: state.country, section })}">
            <span class="settings-nav-icon">${icons[section] || "•"}</span>
            <span>${label}</span>
        </a>
    `;
}

function renderCountryOptions(selectedCode) {
    return Object.entries(MAP_NAMES)
        .filter(([code]) => COUNTRY_CATALOG[code])
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([code, name]) => `<option value="${code}" ${code === selectedCode ? "selected" : ""}>${escapeHtml(name)}</option>`)
        .join("");
}

function populateSettingsInputs() {
    const accountName = document.getElementById("account-name-input");
    const accountEmail = document.getElementById("account-email-input");
    const theme = document.getElementById("theme-select");
    const fontSize = document.getElementById("font-size-select");
    const language = document.getElementById("language-select");
    const defaultCountry = document.getElementById("default-country-select");
    if (accountName) accountName.value = state.settings.accountName || DEFAULT_SETTINGS.accountName;
    if (accountEmail) accountEmail.value = state.settings.accountEmail || DEFAULT_SETTINGS.accountEmail;
    if (theme) theme.value = state.settings.theme;
    if (fontSize) fontSize.value = state.settings.fontSize;
    if (language) language.value = state.settings.language || DEFAULT_SETTINGS.language;
    if (defaultCountry) defaultCountry.value = state.settings.defaultCountry;
}

function readSettingsInputs() {
    const accountName = document.getElementById("account-name-input");
    const accountEmail = document.getElementById("account-email-input");
    const theme = document.getElementById("theme-select");
    const fontSize = document.getElementById("font-size-select");
    const language = document.getElementById("language-select");
    const defaultCountry = document.getElementById("default-country-select");
    state.settings = {
        ...state.settings,
        accountName: accountName ? accountName.value.trim() || DEFAULT_SETTINGS.accountName : state.settings.accountName,
        accountEmail: accountEmail ? accountEmail.value.trim() || DEFAULT_SETTINGS.accountEmail : state.settings.accountEmail,
        theme: theme ? theme.value : state.settings.theme,
        fontSize: fontSize ? fontSize.value : state.settings.fontSize,
        language: language ? language.value : state.settings.language,
        defaultCountry: defaultCountry ? (sanitizeCountry(defaultCountry.value) || state.settings.defaultCountry || "NL") : state.settings.defaultCountry,
    };
    saveSettings();
    applySettings();
    return true;
}

function bindSettingsPageEvents() {
    const saveButton = document.getElementById("save-settings-btn");
    const resetAllButton = document.getElementById("reset-all-settings-btn");
    const resetPasswordButton = document.getElementById("reset-password-btn");
    const status = document.getElementById("settings-status");
    const inputs = document.querySelectorAll(".settings-main-panel input, .settings-main-panel select");

    const promptToSave = (message = "Change settings and press Save settings.") => {
        if (status) status.textContent = message;
    };

    inputs.forEach(input => {
        input.addEventListener("input", () => promptToSave());
        input.addEventListener("change", () => promptToSave());
    });

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            if (!readSettingsInputs()) return;
            promptToSave("Settings updated.");
        });
    }

    if (resetAllButton) {
        resetAllButton.addEventListener("click", () => {
            state.settings = { ...DEFAULT_SETTINGS };
            populateSettingsInputs();
            saveSettings();
            applySettings();
            promptToSave("All settings reset.");
        });
    }

    if (resetPasswordButton) {
        resetPasswordButton.addEventListener("click", () => {
            promptToSave("Password reset link sent.");
        });
    }
}

function saveSettingsFromModal() {
    readSettingsInputs();
}

function resetSettingsToDefault() {
    state.settings = { ...DEFAULT_SETTINGS };
    populateSettingsInputs();
    saveSettings();
    applySettings();
}

function openSettingsModal() {
    window.location.href = buildPageUrl("settings", { country: state.country, section: "language" });
}

function closeSettingsModal() {}

function isPageActive(page) {
    if (page === "countrySearch") return state.page === "countrySearch";
    if (page === "movies") return state.page === "movies" || state.page === "movie" || state.page === "theaters";
    if (page === "people") return state.page === "people" || state.page === "person";
    if (page === "search") return state.page === "search";
    return state.page === "home";
}

function defaultSearchScope() {
    if (state.page === "search") return state.searchScope || "all";
    return state.page === "people" || state.page === "person" ? "people" : "movies";
}

function buildNavTarget(page) {
    if (page === "countrySearch") return buildPageUrl("countrySearch", { country: state.country, countryq: state.countrySearchQuery });
    if (page === "home") return buildPageUrl("home", { country: state.country });
    if (page === "search") return buildPageUrl("search", { country: state.country, scope: state.searchScope, q: state.search, role: state.roleFilter });
    if (page === "movies") return buildPageUrl("movies", { country: state.country, collection: state.collection, type: "movies" });
    if (page === "people") return buildPageUrl("people", { country: state.country });
    return buildPageUrl(page, { country: state.country });
}

function buildSidebarTarget(code) {
    if (state.page === "movies") return buildPageUrl("movies", { country: code, collection: state.collection, type: state.mediaType, q: state.search });
    if (state.page === "search") return buildPageUrl("search", { country: code, q: state.search, scope: state.searchScope, role: state.roleFilter });
    if (state.page === "people") return buildPageUrl("people", { country: code, q: state.search, role: state.roleFilter });
    if (state.page === "person") return buildPageUrl("people", { country: code });
    if (state.page === "movie" || state.page === "theaters") return buildPageUrl("movies", { country: code, collection: state.collection, type: "movies" });
    return buildPageUrl("home", { country: code });
}

function buildPageUrl(page, params = {}) {
    const url = new URL(PAGE_FILES[page], window.location.href);
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        url.searchParams.set(key, value);
    });
    return `${url.pathname.split('/').pop()}${url.search}`;
}

function buildMediaDetailUrl(item) {
    return buildPageUrl("movie", {
        country: item.countryCode,
        id: item.id,
        type: item.type,
        collection: item.collection,
    });
}

function buildPersonDetailUrl(person) {
    return buildPageUrl("person", {
        country: person.countryCode,
        id: person.id,
    });
}

function updateUrlWithoutNavigation(url) {
    window.history.replaceState({}, "", url);
}

function updateDocumentTitle() {
    const entry = getCountryEntry(state.country);
    const pageName = {
        home: "Country Selection",
        countrySearch: "Country Search",
        search: "Search",
        movies: "Movies",
        people: "Celebs",
        movie: "WorldView",
        person: "Celeb Detail",
        theaters: "Theater Map",
        settings: "Settings",
    }[state.page] || "WorldView";
    document.title = `${pageName} - ${entry.name} - WorldView`;
}

function sanitizeCountry(code) {
    const value = String(code || "").toUpperCase();
    return COUNTRY_CATALOG[value] ? value : null;
}

function getCountryEntry(code) {
    return COUNTRY_CATALOG[sanitizeCountry(code) || "NL"];
}

function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeText(value) {
    return slugify(value).replace(/-/g, " ");
}

function shortPosterLabel(title) {
    return String(title || "").split(/\s+/).slice(0, 3).join(" ");
}

function renderMediaGlyph(item) {
    return item.type === "tvshows" ? "📺" : "🎬";
}

function renderRoleIcon(role) {
    const value = normalizeText(role || "");
    if (value.includes("director")) return "🎬";
    if (value.includes("actor")) return "🎭";
    return "⭐";
}

function renderPosterVisual(item, large = false) {
    return `
        <div class="poster-placeholder${large ? " poster-large" : ""}" data-media-title="${escapeHtml(item.title)}" data-media-type="${escapeHtml(item.type || "movies")}">
            <div class="poster-icon">${renderMediaGlyph(item)}</div>
            ${large ? `<div class="poster-title">${escapeHtml(shortPosterLabel(item.title))}</div>` : ""}
        </div>
    `;
}

function renderPersonAvatar(person, large = false) {
    return `
        <div class="person-avatar${large ? " person-avatar-large" : ""}" data-person-name="${escapeHtml(person.name)}" aria-hidden="true">
            <span>${renderRoleIcon(person.role)}</span>
        </div>
    `;
}

function renderCastCard(person) {
    return `
        <a class="cast-card" href="${buildPersonDetailUrl(person)}">
            ${renderPersonAvatar(person)}
            <div>
                <h4>${escapeHtml(person.name)}</h4>
                <p>${escapeHtml(person.role || "Creative")}</p>
            </div>
        </a>
    `;
}

function listMedia(countryCode, collection = "popular", type = "movies") {
    const entry = getCountryEntry(countryCode);
    return ((entry[collection] && entry[collection][type]) || []).map(item => ({
        ...item,
        id: slugify(item.title),
        type,
        collection,
        countryCode,
    }));
}

function listAllMedia(countryCode) {
    const seen = new Set();
    const items = [];
    ["popular", "madeIn"].forEach(collection => {
        ["movies", "tvshows"].forEach(type => {
            listMedia(countryCode, collection, type).forEach(item => {
                const key = `${item.type}:${item.id}`;
                if (seen.has(key)) return;
                seen.add(key);
                items.push(item);
            });
        });
    });
    return items;
}

function findMediaById(countryCode, id, preferredType) {
    const target = slugify(id);
    const items = preferredType
        ? [
            ...listMedia(countryCode, "popular", preferredType),
            ...listMedia(countryCode, "madeIn", preferredType),
          ]
        : listAllMedia(countryCode);
    return items.find(item => item.id === target) || null;
}

const FALLBACK_PERSON_TEMPLATES = [
    { name: "Alex Marin", role: "Actor" },
    { name: "Samira Noor", role: "Director" },
    { name: "Jordan Vale", role: "Actor" },
];

function buildFallbackPeople(countryCode) {
    const media = listAllMedia(countryCode);
    if (!media.length) return [];

    const titles = [...new Set(media.map(item => item.title))];
    return FALLBACK_PERSON_TEMPLATES.map((template, index) => ({
        name: `${template.name} (${countryCode})`,
        role: template.role,
        knownFor: titles.slice(index, index + 2).length ? titles.slice(index, index + 2) : titles.slice(0, 1),
    }));
}

function listPeople(countryCode) {
    const entry = getCountryEntry(countryCode);
    const source = entry.people && entry.people.length ? entry.people : buildFallbackPeople(countryCode);
    return source.map(person => ({
        ...person,
        id: slugify(person.name),
        countryCode,
    }));
}

function findPersonById(countryCode, id) {
    const target = slugify(id);
    return listPeople(countryCode).find(person => person.id === target) || null;
}

function searchMedia(countryCode, collection, type, query) {
    const input = normalizeText(query);
    const items = listMedia(countryCode, collection, type);
    if (!input) return items;
    return items.filter(item => {
        const haystack = [item.title, item.genre, item.overview, item.originCountry, ...(item.subtitles || [])]
            .map(normalizeText)
            .join(" ");
        return haystack.includes(input);
    });
}

function searchAllMedia(countryCode, query) {
    const input = normalizeText(query);
    const items = listAllMedia(countryCode);
    if (!input) return items;
    return items.filter(item => {
        const haystack = [item.title, item.genre, item.overview, item.originCountry, ...(item.subtitles || [])]
            .map(normalizeText)
            .join(" ");
        return haystack.includes(input);
    });
}

function searchPeople(countryCode, query, role = "all") {
    const input = normalizeText(query);
    const people = listPeople(countryCode);
    return people.filter(person => {
        const roleText = normalizeText(person.role || "");
        if (role === "actor" && !roleText.includes("actor")) return false;
        if (role === "director" && !roleText.includes("director")) return false;
        const haystack = [person.name, person.role, ...(person.knownFor || [])]
            .map(normalizeText)
            .join(" ");
        return !input || haystack.includes(input);
    });
}

function getRelatedPeopleForMedia(countryCode, item) {
    const titleNorm = normalizeText(item.title);
    return listPeople(countryCode).filter(person =>
        (person.knownFor || []).some(title => normalizeText(title) === titleNorm)
    );
}

function getRelatedMediaForPerson(countryCode, person) {
    const allMedia = listAllMedia(countryCode);
    const linked = [];
    const unlinked = [];
    (person.knownFor || []).forEach(title => {
        const match = allMedia.find(item => normalizeText(item.title) === normalizeText(title));
        if (match) linked.push(match);
        else unlinked.push(title);
    });
    return { linked, unlinked };
}

function renderMediaPills(item) {
    const pills = [];
    if (item.genre) pills.push(`<span class="info-pill">${escapeHtml(item.genre)}</span>`);
    if (item.year) pills.push(`<span class="info-pill">${escapeHtml(String(item.year))}</span>`);
    if (item.originCountry) pills.push(`<span class="info-pill">Made in ${escapeHtml(item.originCountry)}</span>`);
    if (item.subtitles?.length) pills.push(`<span class="info-pill">Subtitles: ${escapeHtml(item.subtitles.join(", "))}</span>`);
    return pills.join("");
}

function renderProviderPills(item) {
    if (!item.streaming || !item.streaming.length) {
        return '<span class="provider-pill provider-default">Provider details coming soon</span>';
    }
    return item.streaming.map(provider => `<span class="provider-pill provider-${escapeHtml(provider.tag || "default")}">${escapeHtml(provider.name)}</span>`).join("");
}

function buildTheatersForMedia(countryCode, item) {
    const countryName = getCountryEntry(countryCode).name;
    const otherTitles = listMedia(countryCode, item.collection || "popular", item.type || "movies")
        .filter(other => other.id !== item.id)
        .slice(0, 2)
        .map(other => other.title);

    return [
        {
            name: `${countryName} City Cinema`,
            summary: `Main information for ${item.title} in a central ${state.city} theater.`,
            times: ["13:00", "16:00", "21:30"],
            otherTitles,
        },
        {
            name: `${countryName} Riverside Screens`,
            summary: `Reduced information card with a few showtimes and nearby access.`,
            times: ["12:30", "18:00", "20:45"],
            otherTitles: otherTitles.reverse(),
        },
        {
            name: `${countryName} Indie House`,
            summary: `Smaller venue mock focused on local and festival programming.`,
            times: ["14:15", "19:15"],
            otherTitles,
        },
    ];
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
