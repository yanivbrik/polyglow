export function gendered(value, address) {
    return typeof value === "string" ? value : value[address];
}
export function targetLine(pack, text) {
    return { text, lang: pack.target.lang, dir: pack.target.dir };
}
export function sourceLine(pack, text) {
    return { text, lang: pack.source.lang, dir: pack.source.dir };
}
export function shownTranslation(entry, address) {
    return entry.display?.[address] ?? entry.translations[0] ?? "";
}
export function allLessons(pack) {
    return pack.units.flatMap((unit) => unit.lessons);
}
export function allDialogues(pack) {
    return allLessons(pack).flatMap((lesson) => lesson.dialogue ?? []);
}
export function lineAudioKey(speaker, text) {
    return speaker?.voice === undefined ? text : `${speaker.voice}\n${text}`;
}
