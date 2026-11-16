import { shuffled } from "../exercises/rng.js";
const DECIDES = 2;
const OPTIONS = 4;
function sentencesOf(pack, unit) {
    const ids = new Set(pack.units[unit]?.lessons.flatMap((lesson) => lesson.sentences));
    return pack.sentences.filter((sentence) => ids.has(sentence.id));
}
const isHeard = (pack, sentence) => pack.audio[sentence.text] !== undefined;
function skillsOf(pack) {
    const each = (fits) => pack.units.length > 0 && pack.units.every((_, unit) => sentencesOf(pack, unit).some(fits));
    if (!each(() => true))
        return [];
    return each((sentence) => isHeard(pack, sentence)) ? ["reading", "listening"] : ["reading"];
}
export function canPlace(pack) {
    return pack.units.length > 1 && skillsOf(pack).length > 0;
}
function wrongOptions(pack, unit, right, rng) {
    const nearest = pack.units.map((_, index) => index).filter((index) => index !== unit);
    nearest.sort((a, b) => Math.abs(a - unit) - Math.abs(b - unit) || a - b);
    const chosen = [];
    const shown = new Set([right.translations[0]]);
    for (const index of [unit, ...nearest]) {
        for (const sentence of shuffled(sentencesOf(pack, index), rng)) {
            if (chosen.length === OPTIONS - 1)
                return chosen;
            if (sentence.id === right.id || shown.has(sentence.translations[0]))
                continue;
            shown.add(sentence.translations[0]);
            chosen.push(sentence);
        }
    }
    return chosen;
}
function ask(pack, test, rng) {
    const skill = test.skills[test.part];
    if (skill === undefined)
        return undefined;
    const unit = Math.floor((test.low + test.high) / 2);
    const fitting = sentencesOf(pack, unit).filter((sentence) => skill === "reading" || isHeard(pack, sentence));
    const fresh = fitting.filter((sentence) => !test.asked.includes(sentence.id));
    const sentence = shuffled(fresh.length > 0 ? fresh : fitting, rng)[0];
    const options = shuffled([sentence, ...wrongOptions(pack, unit, sentence, rng)], rng).map((option) => option.id);
    return { skill, unit: pack.units[unit].id, sentence: sentence.id, options };
}
export function startPlacement(pack, rng) {
    const test = { skills: skillsOf(pack), part: 0, low: 0, high: pack.units.length, right: 0, wrong: 0, probes: 0, asked: [], reached: {}, question: undefined };
    return { ...test, question: ask(pack, test, rng) };
}
export function answerPlacement(pack, test, chosen, rng) {
    const { question } = test;
    if (question === undefined)
        return test;
    const isRight = chosen === question.sentence;
    let next = { ...test, asked: [...test.asked, question.sentence], right: test.right + (isRight ? 1 : 0), wrong: test.wrong + (isRight ? 0 : 1) };
    if (next.right === DECIDES || next.wrong === DECIDES) {
        const unit = pack.units.findIndex((candidate) => candidate.id === question.unit);
        const passed = next.right === DECIDES;
        next = { ...next, right: 0, wrong: 0, probes: next.probes + 1, low: passed ? unit + 1 : next.low, high: passed ? next.high : unit };
        if (next.low >= next.high) {
            next = { ...next, reached: { ...next.reached, [question.skill]: next.low }, part: next.part + 1, low: 0, high: pack.units.length, probes: 0 };
        }
    }
    return { ...next, question: ask(pack, next, rng) };
}
export function placementProgress(pack, test) {
    if (test.skills.length === 0)
        return 1;
    const most = Math.ceil(Math.log2(pack.units.length + 1));
    return (test.part * most + Math.min(test.probes, most)) / (test.skills.length * most);
}
export function placementResult(pack, test) {
    if (test.question !== undefined)
        return undefined;
    const counts = Object.values(test.reached);
    const weaker = counts.length === 0 ? 0 : Math.min(...counts, pack.units.length - 1);
    return { start: pack.units[weaker].id, reached: test.reached };
}
