const EDGES = /^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu;
export function splitWords(text) {
    return text
        .split(/\s+/)
        .map((word) => word.replace(EDGES, ""))
        .filter((word) => word !== "");
}
