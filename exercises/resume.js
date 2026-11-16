import { allLessons } from "../course/pack.js";
import { clip } from "./generate.js";
export const SESSION_FORMAT = 1;
export const sittingKey = (lessonId) => (lessonId === undefined ? "review" : `lesson:${lessonId}`);
function clipsIn(value, prefix, found) {
    if (typeof value === "string") {
        if (value.startsWith(prefix))
            found.add(value);
    }
    else if (Array.isArray(value)) {
        for (const entry of value)
            clipsIn(entry, prefix, found);
    }
    else if (typeof value === "object" && value !== null) {
        for (const entry of Object.values(value))
            clipsIn(entry, prefix, found);
    }
    return found;
}
export function canCarryOn(saved, pack, lessonId) {
    if (saved.format !== SESSION_FORMAT)
        return false;
    if (lessonId !== undefined && !allLessons(pack).some((lesson) => lesson.id === lessonId))
        return false;
    const current = new Set(Object.keys(pack.audio).flatMap((text) => clip(pack, text) ?? []));
    const prefix = `content/${pack.id}/audio/`;
    return [...clipsIn(saved.session.queue, prefix, new Set())].every((path) => current.has(path));
}
