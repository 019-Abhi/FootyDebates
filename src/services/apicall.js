const API_BASE = "http://localhost:3001/api";

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
