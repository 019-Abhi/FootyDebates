const API_BASE =     import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function apiFetch(pathname, query = {}) {
    const url = new URL(`${API_BASE}${pathname}`);
    Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && `${v}`.length > 0) {
            url.searchParams.set(k, v);
        }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
        const details = await response.text();
        throw new Error(`API error ${response.status}: ${details}`);
    }
    return response.json();
}

export async function searchPlayers(query) {
    if (!query || query.trim().length < 2) return [];
    const players = await apiFetch("/players/search", { q: query.trim() });
    return players.map((p) => ({
        id: p.id,
        name: p.name,
        photo: p.photo,
        age: p.age,
        nationality: p.nationality,
    }));
}

export async function getPlayerSeasonStats(playerId) {
    const player = await apiFetch(`/players/${playerId}`);
    return player;
}