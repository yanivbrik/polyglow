const ORDER = [
    "build",
    "date",
    "userAgent",
    "standalone",
    "offlineReady",
    "online",
    "persisted",
    "quotaMB",
    "indexedDB",
    "cspBlocksNetwork",
    "installPrompt",
    "recordingType",
    "recordingBytes",
    "recordingSaved",
    "recordingRestored",
    "voicesEn",
    "voicesHe",
];
export function formatReport(results, notes = "") {
    const known = ORDER.filter((key) => key in results);
    const rest = Object.keys(results).filter((key) => !ORDER.includes(key)).sort();
    const lines = ["Polyglow stage 0 report", ...[...known, ...rest].map((key) => `${key}: ${oneLine(results[key] ?? "")}`)];
    if (notes.trim() !== "")
        lines.push("notes:", notes.trim());
    return lines.join("\n");
}
function oneLine(value) {
    return value.replace(/\s*\n\s*/g, " ");
}
