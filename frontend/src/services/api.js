
const API_BASE = "http://127.0.0.1:8000/api/competition";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.detail || `Request failed: ${response.status}`);
    }

    return data;
}

export function getCompetitionState() {
    return request("/state");
}

export function resetQuestion() {
    return request("/start", { method: "POST" });
}

export function activateQuestion() {
    return request("/activate", { method: "POST" });
}

export function evaluateAnswer(correct) {
    return request("/evaluate", {
        method: "POST",
        body: JSON.stringify({ correct }),
    });
}

export function nextQuestion() {
    return request("/next", { method: "POST" });
}
