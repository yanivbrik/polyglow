export const THEMES = [
    { id: "system", label: "לפי המערכת" },
    { id: "light", label: "בהיר" },
    { id: "dark", label: "כהה" },
];
const KEY = "polyglow.theme";
export function themeFrom(saved) {
    return saved === "light" || saved === "dark" ? saved : "system";
}
export function readTheme() {
    try {
        return themeFrom(localStorage.getItem(KEY));
    }
    catch {
        return "system";
    }
}
export function applyTheme(theme) {
    if (theme === "system")
        delete document.documentElement.dataset.theme;
    else
        document.documentElement.dataset.theme = theme;
}
export function chooseTheme(theme) {
    applyTheme(theme);
    try {
        localStorage.setItem(KEY, theme);
    }
    catch {
    }
}
