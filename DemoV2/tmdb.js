const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzhjZGYxMmUwZmI1MTkxYzE3YjZiMTBkZDM4NTFlNCIsIm5iZiI6MTc3MTk0MTQzNC41NTYsInN1YiI6IjY5OWRhZTNhYTAyOWI1ODZhODFmOGZlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IBKT1daKvVAAbCAvLn2rDTN2xkMAcd1t-8rS1qzziJc";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_POSTER = "https://image.tmdb.org/t/p/w342";
const TMDB_PROFILE = "https://image.tmdb.org/t/p/w185";

const tmdbVisualCache = new Map();

async function tmdbFetch(path) {
    const res = await fetch(`${TMDB_BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
}

async function tmdbFindMediaVisual(title, typeHint = "movies") {
    const key = `media:${typeHint}:${String(title || "").toLowerCase()}`;
    if (tmdbVisualCache.has(key)) return tmdbVisualCache.get(key);

    const paths = typeHint === "tvshows"
        ? [
            `/search/tv?language=en-US&query=${encodeURIComponent(title)}&include_adult=false`,
            `/search/movie?language=en-US&query=${encodeURIComponent(title)}&include_adult=false`,
          ]
        : [
            `/search/movie?language=en-US&query=${encodeURIComponent(title)}&include_adult=false`,
            `/search/tv?language=en-US&query=${encodeURIComponent(title)}&include_adult=false`,
          ];

    let match = null;
    for (const path of paths) {
        try {
            const data = await tmdbFetch(path);
            if (data.results && data.results.length) {
                match = data.results[0];
                break;
            }
        } catch {
            // ignore and fall through
        }
    }

    const result = {
        poster: match?.poster_path ? `${TMDB_POSTER}${match.poster_path}` : "",
        backdrop: match?.backdrop_path ? `${TMDB_POSTER}${match.backdrop_path}` : "",
    };
    tmdbVisualCache.set(key, result);
    return result;
}

async function tmdbFindPersonVisual(name) {
    const key = `person:${String(name || "").toLowerCase()}`;
    if (tmdbVisualCache.has(key)) return tmdbVisualCache.get(key);

    let match = null;
    try {
        const data = await tmdbFetch(`/search/person?language=en-US&query=${encodeURIComponent(name)}&include_adult=false`);
        if (data.results && data.results.length) match = data.results[0];
    } catch {
        // ignore
    }

    const result = {
        profile: match?.profile_path ? `${TMDB_PROFILE}${match.profile_path}` : "",
        department: match?.known_for_department || "",
    };
    tmdbVisualCache.set(key, result);
    return result;
}
