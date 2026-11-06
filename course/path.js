import { allLessons } from "./pack.js";
export const DEFAULT_START = "usual";
function skipped(pack, start) {
    const index = pack.units.findIndex((unit) => unit.id === pack.start);
    if (start === "basics" || index <= 0)
        return new Set();
    return new Set(pack.units.slice(0, index).flatMap((unit) => unit.lessons.map((lesson) => lesson.id)));
}
export function isSkippable(pack, unitId, start) {
    const unit = pack.units.find((candidate) => candidate.id === unitId);
    const lessons = skipped(pack, start);
    return unit !== undefined && unit.lessons.every((lesson) => lessons.has(lesson.id));
}
export function nextLesson(pack, completed, start) {
    const optional = skipped(pack, start);
    const open = allLessons(pack).filter((lesson) => !completed.includes(lesson.id));
    return open.find((lesson) => !optional.has(lesson.id)) ?? open[0];
}
export function lessonStates(pack, completed, start) {
    const optional = skipped(pack, start);
    const next = nextLesson(pack, completed, start)?.id;
    return new Map(allLessons(pack).map((lesson) => {
        if (completed.includes(lesson.id))
            return [lesson.id, "done"];
        if (lesson.id === next)
            return [lesson.id, "current"];
        return [lesson.id, optional.has(lesson.id) ? "open" : "ahead"];
    }));
}
