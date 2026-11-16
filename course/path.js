import { allLessons } from "./pack.js";
export const DEFAULT_START = "usual";
export function startingUnit(pack, start, placed) {
    if (start === "placement" && pack.units.some((unit) => unit.id === placed))
        return placed;
    return start === "basics" ? pack.units[0]?.id : (pack.start ?? pack.units[0]?.id);
}
function skipped(pack, from) {
    const index = pack.units.findIndex((unit) => unit.id === from);
    return new Set(pack.units.slice(0, Math.max(0, index)).flatMap((unit) => unit.lessons.map((lesson) => lesson.id)));
}
export function nextLesson(pack, completed, from) {
    const optional = skipped(pack, from);
    const open = allLessons(pack).filter((lesson) => !completed.includes(lesson.id));
    return open.find((lesson) => !optional.has(lesson.id)) ?? open[0];
}
export function lessonStates(pack, completed, from) {
    const optional = skipped(pack, from);
    const next = nextLesson(pack, completed, from)?.id;
    return new Map(allLessons(pack).map((lesson) => {
        if (completed.includes(lesson.id))
            return [lesson.id, "done"];
        if (lesson.id === next)
            return [lesson.id, "current"];
        return [lesson.id, optional.has(lesson.id) ? "open" : "ahead"];
    }));
}
function row(lessons, completed, optional, next) {
    const done = lessons.filter((lesson) => completed.includes(lesson.id)).length;
    return {
        done,
        total: lessons.length,
        current: lessons.some((lesson) => lesson.id === next),
        optional: done < lessons.length && lessons.every((lesson) => optional.has(lesson.id)),
    };
}
export function levelGroups(pack, completed, from) {
    const optional = skipped(pack, from);
    const next = nextLesson(pack, completed, from)?.id;
    return pack.levels.map((level) => {
        const units = pack.units.filter((unit) => unit.level === level.id);
        return {
            level,
            units: units.map((unit) => ({ unit, ...row(unit.lessons, completed, optional, next) })),
            ...row(units.flatMap((unit) => unit.lessons), completed, optional, next),
        };
    });
}
