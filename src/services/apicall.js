import { data } from "react-router-dom";

const API_BASE = "https://v3.football.api-sports.io"

function getHeaders() {
    const apikey = import.meta.env.VITE_API_FOOTBALL_KEY;
    if (!apikey)
        throw new Error("Missing API Key in .env file");
    return {"x-apisports-key": apikey};
}

async function FetchData(pathname, query = {}) {

    const url = new URL(`${API_BASE}${pathname}`);
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && `${value}`.length > 0) {
            url.searchParams.set(key, value);
        }
    });

    const response = await fetch(url.toString(), {headers: getHeaders()});

    if (!response.ok){
        const details = await response.text();
        throw new Error(`API error ${response.status}: ${details}`)
    }

    const payload = await response.json();
    return payload.response ?? [];
}

export async function searchPlayers(query) {
    if(!query || query.trim().length < 3) return [];
    
    const response = await FetchData("/players/profiles", {search: query.trim()});

    return response.slice(0,8).map((entry) => ({
        id: entry.player?.id,
        name: entry.player?.name,
        photo: entry.player?.photo,
        age: entry.player?.age,
        nationality: entry.player?.nationality,
    }));
}

export async function getPlayerSeasonStats(playerId, season = "2023") {
  const response = await apiFootballFetch("/players", { id: playerId, season });
  if (!response.length) {
    throw new Error("No stats found for this player");
  }
  return response[0];
}
