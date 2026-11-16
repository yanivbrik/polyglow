const PREFIX = "polyglow.stage0.";
export function loadAnswer(id) {
    try {
        return localStorage.getItem(PREFIX + id) ?? undefined;
    }
    catch {
        return undefined;
    }
}
export function saveAnswer(id, value) {
    try {
        localStorage.setItem(PREFIX + id, value);
    }
    catch {
    }
}
export function clearAnswers() {
    try {
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith(PREFIX))
                localStorage.removeItem(key);
        }
    }
    catch {
    }
}
