
const FAVORITES_KEY = "worldview_v2_favorites";
const SETTINGS_KEY = "worldview_v2_settings";
const LAST_COUNTRY_KEY = "worldview_v2_last_country";
const DEFAULT_SETTINGS = {
    theme: "dark",
    fontSize: "medium",
    defaultCountry: "NL",
    preferMadeIn: false,
};

let selectedCountry = null;
let panelVisible = false;
let currentCollection = "popular";
let currentType = "movies";
let favoriteCountries = loadFavoriteCountries();
let settings = loadSettings();

window.addEventListener("DOMContentLoaded", () => {
    applySettings();
    populateDefaultCountrySelect();
    syncSettingsForm();

    buildMap();
    setupMapEvents();
    setupSidebarToggle();
    setupCountrySearch();
    setupDetailControls();
    setupTopNav();
    setupHeroActions();
    setupSettingsModal();

    renderCountryLists();
    restoreInitialCountry();
    renderSelection();
    updateHero();
    syncNavState();
});

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
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteCountries.slice(0, 20)));
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
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySettings() {
    document.body.dataset.theme = settings.theme;
    document.body.dataset.fontSize = settings.fontSize;
    if (settings.preferMadeIn && currentType !== "people") {
        currentCollection = "madeIn";
    }
}

function populateDefaultCountrySelect() {
    const select = document.getElementById("default-country-select");
    if (!select) return;

    const options = Object.entries(MAP_NAMES)
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([code, name]) => `<option value="${code}">${name}</option>`)
        .join("");

    select.innerHTML = options;
}

function syncSettingsForm() {
    document.getElementById("theme-select").value = settings.theme;
    document.getElementById("font-size-select").value = settings.fontSize;
    document.getElementById("default-country-select").value = settings.defaultCountry || "NL";
    document.getElementById("prefer-made-in-toggle").checked = !!settings.preferMadeIn;
}

function readSettingsForm() {
    settings = {
        theme: document.getElementById("theme-select").value,
        fontSize: document.getElementById("font-size-select").value,
        defaultCountry: document.getElementById("default-country-select").value,
        preferMadeIn: document.getElementById("prefer-made-in-toggle").checked,
    };
}

function restoreInitialCountry() {
    const lastCountry = localStorage.getItem(LAST_COUNTRY_KEY);
    const preferred = settings.defaultCountry || lastCountry || "NL";
    if (preferred && COUNTRY_CATALOG[preferred]) {
        selectCountry(preferred, { openPanel: false, preserveCollection: true });
    }
}

function setupSidebarToggle() {
    document.querySelector(".sidebar")?.classList.remove("collapsed");
}

function renderCountryLists() {
    renderCountryCollection(document.getElementById("favorites-list"), favoriteCountries);
    renderCountryCollection(document.getElementById("popular-list"), FEATURED_COUNTRIES.filter(code => !favoriteCountries.includes(code)));
}

function renderCountryCollection(container, codes) {
    if (!container) return;
    container.innerHTML = "";
    const validCodes = codes.filter(code => COUNTRY_CATALOG[code]);

    if (validCodes.length === 0) {
        container.innerHTML = `<div class="empty-card">No countries here yet.</div>`;
        return;
    }

    for (const code of validCodes) {
        const item = createCountryListItem(code);
        if (item) container.appendChild(item);
    }
}

function createCountryListItem(code) {
    const entry = COUNTRY_CATALOG[code];
    if (!entry) return null;

    const popularCount = (entry.popular.movies?.length || 0) + (entry.popular.tvshows?.length || 0);
    const madeInCount = (entry.madeIn.movies?.length || 0) + (entry.madeIn.tvshows?.length || 0);
    const peopleCount = entry.people?.length || 0;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `country-item${selectedCountry === code ? " active" : ""}`;
    button.innerHTML = `
        <div class="country-flag">${countryFlag(code)}</div>
        <div>
            <h4>${escapeHtml(entry.name)}</h4>
            <p>${escapeHtml(entry.blurb)}</p>
            <div class="country-meta">
                <span class="meta-pill">${popularCount} popular</span>
                <span class="meta-pill">${madeInCount} local</span>
                <span class="meta-pill">${peopleCount} people</span>
            </div>
        </div>
    `;
    button.addEventListener("click", () => selectCountry(code, { openPanel: true }));
    return button;
}

function setupCountrySearch() {
    const input = document.getElementById("country-search");
    const searchResultsSection = document.getElementById("search-results-section");
    const searchResults = document.getElementById("search-results");
    const favoritesSection = document.getElementById("favorites-list").closest(".sidebar-section");
    const featuredSection = document.getElementById("popular-list").closest(".sidebar-section");

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            searchResultsSection.hidden = true;
            favoritesSection.hidden = false;
            featuredSection.hidden = false;
            return;
        }

        searchResultsSection.hidden = false;
        favoritesSection.hidden = true;
        featuredSection.hidden = true;
        searchResults.innerHTML = "";

        const matches = Object.entries(MAP_NAMES)
            .filter(([, name]) => name.toLowerCase().includes(query))
            .sort((a, b) => {
                const aStarts = a[1].toLowerCase().startsWith(query) ? 0 : 1;
                const bStarts = b[1].toLowerCase().startsWith(query) ? 0 : 1;
                return aStarts - bStarts || a[1].localeCompare(b[1]);
            })
            .slice(0, 20);

        if (matches.length === 0) {
            searchResults.innerHTML = `<div class="empty-card">No countries found.</div>`;
            return;
        }

        for (const [code] of matches) {
            const item = createCountryListItem(code);
            if (item) searchResults.appendChild(item);
        }
    });
}

function clearCountrySearch() {
    const input = document.getElementById("country-search");
    if (!input.value) return;
    input.value = "";
    input.dispatchEvent(new Event("input"));
}

function setupMapEvents() {
    const svg = document.getElementById("world-map");
    const tooltip = document.getElementById("tooltip");

    svg.addEventListener("mousemove", (event) => {
        const path = event.target.closest("path.country[data-code]");
        if (!path) {
            tooltip.classList.remove("visible");
            return;
        }

        const code = path.getAttribute("data-code");
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
        if (COUNTRY_CATALOG[code]) {
            selectCountry(code, { openPanel: true });
        }
    });
}

function highlightCountry(code) {
    document.querySelectorAll("#world-map path.country.highlighted").forEach(node => node.classList.remove("highlighted"));
    const path = document.querySelector(`#world-map path.country[data-code="${code}"]`);
    if (path) path.classList.add("highlighted");
}

function selectCountry(code, options = {}) {
    const { openPanel = true, preserveCollection = false } = options;
    if (!COUNTRY_CATALOG[code]) return;

    selectedCountry = code;
    localStorage.setItem(LAST_COUNTRY_KEY, code);
    highlightCountry(code);

    if (!preserveCollection && settings.preferMadeIn && currentType !== "people") {
        currentCollection = "madeIn";
    }

    if (openPanel) panelVisible = true;

    renderCountryLists();
    renderSelection();
    updateHero();
    syncNavState();
    clearCountrySearch();
}

function renderSelection() {
    const panel = document.getElementById("detail-panel");
    if (!selectedCountry) {
        panel.classList.add("hidden");
        return;
    }

    const entry = COUNTRY_CATALOG[selectedCountry];
    document.getElementById("detail-flag").textContent = countryFlag(selectedCountry);
    document.getElementById("detail-country").textContent = entry.name;
    document.getElementById("detail-caption").textContent = panelVisible
        ? "Static placeholder data for demo exploration"
        : "Country selected on the map";
    document.getElementById("detail-blurb").textContent = entry.blurb;

    updateFavoriteButton();
    syncCollectionButtons();
    syncTypeButtons();
    renderDetailContent(entry);

    panel.classList.toggle("hidden", !panelVisible);
}

function renderDetailContent(entry) {
    const content = document.getElementById("detail-content");
    const collectionSwitch = document.getElementById("collection-switch");
    const status = document.getElementById("detail-status");

    if (currentType === "people") {
        collectionSwitch.classList.add("hidden");
        const people = entry.people || [];
        status.textContent = `Static placeholder people list · ${people.length} entries`;

        if (people.length === 0) {
            content.innerHTML = `<div class="empty-card">No people are mocked for this country yet.</div>`;
            return;
        }

        content.innerHTML = people.map(person => `
            <article class="person-card">
                <h3>${escapeHtml(person.name)}</h3>
                <div class="person-role">${escapeHtml(person.role || "Creative")}</div>
                <p>Placeholder person data for browsing cultural figures.</p>
                <div class="known-for-row">
                    ${(person.knownFor || []).map(title => `<span class="known-for-pill">${escapeHtml(title)}</span>`).join("")}
                </div>
            </article>
        `).join("");
        return;
    }

    collectionSwitch.classList.remove("hidden");
    const list = (entry[currentCollection] && entry[currentCollection][currentType]) || [];
    const label = currentCollection === "popular" ? "popular" : "made here";
    status.textContent = `Static placeholder ${label} list · ${list.length} ${currentType === "movies" ? "movies" : "TV shows"}`;

    if (list.length === 0) {
        content.innerHTML = `<div class="empty-card">No mocked ${currentType === "movies" ? "movies" : "TV shows"} for this view yet.</div>`;
        return;
    }

    content.innerHTML = list.map(item => renderMediaCard(item)).join("");
}

function renderMediaCard(item) {
    const infoPills = [];
    if (item.genre) infoPills.push(`<span class="info-pill">${escapeHtml(item.genre)}</span>`);
    if (item.year) infoPills.push(`<span class="info-pill">${escapeHtml(String(item.year))}</span>`);
    if (item.originCountry) infoPills.push(`<span class="info-pill">Made in ${escapeHtml(item.originCountry)}</span>`);
    if (item.subtitles?.length) infoPills.push(`<span class="info-pill">Subtitles: ${escapeHtml(item.subtitles.join(", "))}</span>`);

    const providers = (item.streaming || [])
        .map(provider => `<span class="provider-pill provider-${escapeHtml(provider.tag || "default")}">${escapeHtml(provider.name)}</span>`)
        .join("");

    const posterLabel = escapeHtml(item.title.split(/\s+/).slice(0, 3).join(" "));
    const overview = escapeHtml(item.overview || "Placeholder summary for the static demo. This content exists to validate the app flow, not the dataset.");
    const rating = escapeHtml(item.rating || "Mocked");

    return `
        <article class="content-card">
            <div class="poster-placeholder">${posterLabel}</div>
            <div>
                <div class="content-card-top">
                    <h3>${escapeHtml(item.title)}</h3>
                    <span class="rating-badge">${rating}</span>
                </div>
                <div class="info-row">${infoPills.join("")}</div>
                <p>${overview}</p>
                <div class="content-card-footer">
                    ${providers || '<span class="provider-pill">Provider info mocked</span>'}
                </div>
            </div>
        </article>
    `;
}

function setupDetailControls() {
    document.getElementById("favorite-country-btn").addEventListener("click", () => toggleFavoriteCountry(selectedCountry));
    document.getElementById("close-detail").addEventListener("click", () => {
        panelVisible = false;
        renderSelection();
        updateHero();
        syncNavState();
    });

    document.querySelectorAll(".collection-btn").forEach(button => {
        button.addEventListener("click", () => {
            currentCollection = button.dataset.collection;
            panelVisible = true;
            renderSelection();
            syncNavState();
        });
    });

    document.querySelectorAll(".type-tab").forEach(button => {
        button.addEventListener("click", () => {
            currentType = button.dataset.type;
            panelVisible = true;
            renderSelection();
            syncNavState();
        });
    });
}

function updateFavoriteButton() {
    const button = document.getElementById("favorite-country-btn");
    const active = selectedCountry && favoriteCountries.includes(selectedCountry);
    button.classList.toggle("active", !!active);
    button.textContent = active ? "★" : "☆";
}

function toggleFavoriteCountry(code) {
    if (!code) return;
    if (favoriteCountries.includes(code)) {
        favoriteCountries = favoriteCountries.filter(item => item !== code);
    } else {
        favoriteCountries = [code, ...favoriteCountries.filter(item => item !== code)].slice(0, 20);
    }
    saveFavoriteCountries();
    updateFavoriteButton();
    renderCountryLists();
}

function syncCollectionButtons() {
    document.querySelectorAll(".collection-btn").forEach(button => {
        button.classList.toggle("active", button.dataset.collection === currentCollection);
    });
}

function syncTypeButtons() {
    document.querySelectorAll(".type-tab").forEach(button => {
        button.classList.toggle("active", button.dataset.type === currentType);
    });
}

function setupTopNav() {
    document.querySelectorAll(".nav-chip[data-quick-view]").forEach(button => {
        button.addEventListener("click", () => {
            const view = button.dataset.quickView;
            if (view === "map") {
                panelVisible = false;
                renderSelection();
                updateHero();
                syncNavState();
                return;
            }

            if (!selectedCountry) {
                const fallback = settings.defaultCountry || "NL";
                selectCountry(fallback, { openPanel: false, preserveCollection: true });
            }

            currentType = view === "people" ? "people" : "movies";
            if (currentType !== "people" && settings.preferMadeIn) {
                currentCollection = "madeIn";
            }
            panelVisible = true;
            renderSelection();
            updateHero();
            syncNavState();
        });
    });

    document.getElementById("open-settings-btn").addEventListener("click", openSettingsModal);
}

function syncNavState() {
    document.querySelectorAll(".nav-chip[data-quick-view]").forEach(button => button.classList.remove("active"));
    if (!panelVisible) {
        document.querySelector('.nav-chip[data-quick-view="map"]').classList.add("active");
        return;
    }
    const selector = currentType === "people"
        ? '.nav-chip[data-quick-view="people"]'
        : '.nav-chip[data-quick-view="movies"]';
    document.querySelector(selector)?.classList.add("active");
}

function setupHeroActions() {
    document.getElementById("hero-card").addEventListener("click", (event) => {
        const button = event.target.closest("[data-hero-action]");
        if (!button) return;
        const action = button.dataset.heroAction;

        if (action === "open-default") {
            selectCountry(settings.defaultCountry || "NL", { openPanel: true });
            return;
        }
        if (action === "open-movies") {
            currentType = "movies";
            if (settings.preferMadeIn) currentCollection = "madeIn";
            panelVisible = true;
            renderSelection();
            syncNavState();
            return;
        }
        if (action === "open-people") {
            currentType = "people";
            panelVisible = true;
            renderSelection();
            syncNavState();
            return;
        }
        if (action === "settings") {
            openSettingsModal();
        }
    });
}

function updateHero() {
    const hero = document.getElementById("hero-card");
    if (!selectedCountry) {
        hero.innerHTML = `
            <p class="hero-kicker">Static GitHub Demo</p>
            <h2>Explore stories by country</h2>
            <p class="hero-text">Pick a country on the map or from the sidebar to browse placeholder popular titles, locally made titles, and notable people.</p>
            <div class="hero-meta">
                <span class="hero-pill">Local JS data</span>
                <span class="hero-pill">LocalStorage settings</span>
                <span class="hero-pill">No backend required</span>
            </div>
            <div class="hero-actions">
                <button class="hero-action" data-hero-action="open-default">Open Netherlands</button>
                <button class="hero-action ghost" data-hero-action="settings">Settings</button>
            </div>
        `;
        return;
    }

    const entry = COUNTRY_CATALOG[selectedCountry];
    const popularCount = (entry.popular.movies?.length || 0) + (entry.popular.tvshows?.length || 0);
    const madeInCount = (entry.madeIn.movies?.length || 0) + (entry.madeIn.tvshows?.length || 0);
    const peopleCount = entry.people?.length || 0;

    hero.innerHTML = `
        <p class="hero-kicker">Selected Country</p>
        <h2>${countryFlag(selectedCountry)} ${escapeHtml(entry.name)}</h2>
        <p class="hero-text">${escapeHtml(entry.blurb)}</p>
        <div class="hero-meta">
            <span class="hero-pill">${popularCount} popular titles</span>
            <span class="hero-pill">${madeInCount} locally made titles</span>
            <span class="hero-pill">${peopleCount} people</span>
        </div>
        <div class="hero-actions">
            <button class="hero-action" data-hero-action="open-movies">Open movies</button>
            <button class="hero-action ghost" data-hero-action="open-people">Open people</button>
            <button class="hero-action ghost" data-hero-action="settings">Settings</button>
        </div>
    `;
}

function setupSettingsModal() {
    document.getElementById("close-settings").addEventListener("click", closeSettingsModal);
    document.getElementById("modal-backdrop").addEventListener("click", closeSettingsModal);

    document.getElementById("save-settings-btn").addEventListener("click", () => {
        readSettingsForm();
        applySettings();
        saveSettings();
        renderSelection();
        updateHero();
        closeSettingsModal();
    });

    document.getElementById("reset-settings-btn").addEventListener("click", () => {
        settings = { ...DEFAULT_SETTINGS };
        applySettings();
        syncSettingsForm();
        saveSettings();
        renderSelection();
        updateHero();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeSettingsModal();
    });
}

function openSettingsModal() {
    syncSettingsForm();
    document.getElementById("settings-modal").classList.remove("hidden");
    document.getElementById("modal-backdrop").classList.remove("hidden");
    document.getElementById("modal-backdrop").classList.add("visible");
}

function closeSettingsModal() {
    document.getElementById("settings-modal").classList.add("hidden");
    document.getElementById("modal-backdrop").classList.add("hidden");
    document.getElementById("modal-backdrop").classList.remove("visible");
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
