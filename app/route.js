export function parseRoute(hash) {
    const [screen, id] = hash.replace(/^#\/?/, "").split("/");
    switch (screen) {
        case "lesson":
            return id === undefined || id === "" ? { name: "home" } : { name: "lesson", id };
        case "menu":
        case "review":
        case "speed-match":
        case "profiles":
        case "new-profile":
        case "backup":
        case "settings":
        case "reports":
        case "credits":
        case "check":
            return { name: screen };
        default:
            return { name: "home" };
    }
}
export function go(hash) {
    location.hash = hash;
}
