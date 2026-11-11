import { allLessons, lineAudioKey } from "./pack.js";
import { splitWords } from "./words.js";
const ID = /^[a-z0-9][a-z0-9-]*$/;
const isFields = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isText = (value) => typeof value === "string" && value.trim() !== "";
const isTexts = (value) => Array.isArray(value) && value.every(isText);
const isFilled = (value) => isTexts(value) && value.length > 0;
const isId = (value) => typeof value === "string" && ID.test(value);
const isOptional = (value, check) => value === undefined || check(value);
const isBothForms = (value) => isFields(value) && isText(value.m) && isText(value.f);
const isGendered = (value) => isText(value) || isBothForms(value);
const isTipLine = (line) => isFields(line) && (line.target === undefined ? isGendered(line.say) : line.say === undefined && isText(line.target) && isOptional(line.meaning, isGendered));
const isTip = (value) => isFields(value) && Array.isArray(value.lines) && value.lines.length > 0 && value.lines.every(isTipLine);
const isFormTable = (value) => isFields(value) && Object.entries(value).every(([short, full]) => isText(short) && !/\s/.test(short) && isFilled(full));
const isContractions = (value) => isFields(value) && isOptional(value.endings, isFormTable) && isOptional(value.words, isFormTable);
function isRules(value) {
    return isFields(value) && typeof value.ignoreCase === "boolean" && (value.marks === "ignore" || value.marks === "note" || value.marks === "strict") && isOptional(value.contractions, isContractions);
}
function isLanguage(value) {
    return isFields(value) && isText(value.lang) && (value.dir === "ltr" || value.dir === "rtl") && isText(value.name) && isRules(value.rules);
}
function displayProblem(where, entry) {
    if (entry.display === undefined)
        return undefined;
    if (!isBothForms(entry.display))
        return `${where}: display needs both forms`;
    const { m, f } = entry.display;
    const accepted = entry.translations;
    return accepted.includes(m) && accepted.includes(f) ? undefined : `${where}: display forms must also be accepted translations`;
}
function dialogueProblems(where, value) {
    if (!isFields(value))
        return [`${where}: bad dialogue`];
    if (!isText(value.scene))
        return [`${where}: dialogue needs a scene`];
    if (!Array.isArray(value.speakers) || !value.speakers.every((speaker) => isFields(speaker) && isId(speaker.id) && isText(speaker.name) && isOptional(speaker.voice, isText) && isOptional(speaker.language, isText)))
        return [`${where}: bad speakers`];
    if (!Array.isArray(value.lines) || !Array.isArray(value.questions))
        return [`${where}: dialogue needs lines and questions`];
    const speakers = new Set(value.speakers.map((speaker) => speaker.id));
    const problems = [];
    if (!speakers.has(value.learner))
        problems.push(`${where}: unknown learner ${String(value.learner)}`);
    let learnerLines = 0;
    value.lines.forEach((line, index) => {
        const at = `${where}: line ${index + 1}`;
        if (!isFields(line) || !isText(line.text) || !isText(line.translation))
            return void problems.push(`${at}: needs text and a translation`);
        if (!speakers.has(line.speaker))
            problems.push(`${at}: unknown speaker ${String(line.speaker)}`);
        if (!isOptional(line.source, (source) => isFields(source) && typeof source.tatoeba === "number"))
            problems.push(`${at}: bad source`);
        if (line.speaker === value.learner) {
            learnerLines += 1;
            if (!isFilled(line.wrong))
                problems.push(`${at}: the learner's line needs wrong replies`);
        }
        else if (line.wrong !== undefined) {
            problems.push(`${at}: only the learner's lines have wrong replies`);
        }
    });
    if (learnerLines === 0)
        problems.push(`${where}: the learner has no lines`);
    value.questions.forEach((question, index) => {
        if (!isFields(question) || !isText(question.prompt) || !isFilled(question.options) || question.options.length < 2)
            problems.push(`${where}: question ${index + 1} needs a prompt and at least two options`);
    });
    return problems;
}
export function packProblems(raw) {
    if (!isFields(raw))
        return ["pack: not an object"];
    const problems = [];
    const need = (ok, message) => {
        if (!ok)
            problems.push(message);
    };
    need(isId(raw.id), "pack: bad id");
    need(isText(raw.title), "pack: missing title");
    need(isLanguage(raw.source), "pack: bad source language");
    need(isLanguage(raw.target), "pack: bad target language");
    need(isOptional(raw.voice, (voice) => isFields(voice) && voice.engine === "kokoro" && isText(voice.voice) && isText(voice.language)), "pack: bad voice");
    need(isTexts(raw.assumed), "pack: assumed must be a list of words");
    need(isFields(raw.audio) && Object.values(raw.audio).every((file) => typeof file === "string" && /^[a-z0-9]+\.mp3$/.test(file)), "pack: bad audio index");
    if (!Array.isArray(raw.items) || !Array.isArray(raw.sentences) || !Array.isArray(raw.units)) {
        return [...problems, "pack: items, sentences and units must be lists"];
    }
    const ids = new Set();
    const claim = (where, id) => {
        if (!isId(id))
            problems.push(`${where}: bad id`);
        else if (ids.has(id))
            problems.push(`${where}: duplicate id ${id}`);
        else
            ids.add(id);
    };
    const items = new Set();
    raw.items.forEach((item, index) => {
        const where = `item ${isFields(item) && isText(item.id) ? item.id : index}`;
        if (!isFields(item))
            return need(false, `${where}: not an object`);
        claim(where, item.id);
        items.add(String(item.id));
        need(isText(item.text), `${where}: missing text`);
        need(isFilled(item.translations), `${where}: needs at least one translation`);
        if (isFilled(item.translations)) {
            const problem = displayProblem(where, item);
            if (problem !== undefined)
                problems.push(problem);
        }
        for (const field of ["pos", "emoji", "translit", "mnemonic", "example"])
            need(isOptional(item[field], isText), `${where}: bad ${field}`);
        for (const field of ["alternatives", "forms", "tags"])
            need(isOptional(item[field], isTexts), `${where}: bad ${field}`);
        need(isOptional(item.freqRank, (rank) => typeof rank === "number" && rank > 0), `${where}: bad freqRank`);
    });
    const sentences = new Set();
    raw.sentences.forEach((sentence, index) => {
        const where = `sentence ${isFields(sentence) && isText(sentence.id) ? sentence.id : index}`;
        if (!isFields(sentence))
            return need(false, `${where}: not an object`);
        claim(where, sentence.id);
        sentences.add(String(sentence.id));
        need(isText(sentence.text), `${where}: missing text`);
        need(isFilled(sentence.translations), `${where}: needs at least one translation`);
        if (isFilled(sentence.translations)) {
            const problem = displayProblem(where, sentence);
            if (problem !== undefined)
                problems.push(problem);
        }
        need(isOptional(sentence.alternatives, isTexts), `${where}: bad alternatives`);
        need(isOptional(sentence.tokens, isFilled), `${where}: bad tokens`);
        need(isOptional(sentence.source, (source) => isFields(source) && typeof source.tatoeba === "number" && isOptional(source.translation, (t) => typeof t === "number")), `${where}: bad source`);
    });
    for (const item of raw.items) {
        if (isFields(item) && item.example !== undefined)
            need(sentences.has(String(item.example)), `item ${String(item.id)}: unknown example ${String(item.example)}`);
    }
    raw.units.forEach((unit, index) => {
        const where = `unit ${isFields(unit) && isText(unit.id) ? unit.id : index}`;
        if (!isFields(unit))
            return need(false, `${where}: not an object`);
        claim(where, unit.id);
        need(isText(unit.title), `${where}: missing title`);
        need(isText(unit.level), `${where}: missing level`);
        if (!Array.isArray(unit.lessons) || unit.lessons.length === 0)
            return need(false, `${where}: needs lessons`);
        for (const lesson of unit.lessons) {
            const lessonWhere = `lesson ${isFields(lesson) && isText(lesson.id) ? lesson.id : "?"}`;
            if (!isFields(lesson)) {
                need(false, `${lessonWhere}: not an object`);
                continue;
            }
            claim(lessonWhere, lesson.id);
            need(isText(lesson.title), `${lessonWhere}: missing title`);
            need(isOptional(lesson.tip, isTip), `${lessonWhere}: bad tip`);
            if (!isTexts(lesson.items) || !isTexts(lesson.sentences)) {
                need(false, `${lessonWhere}: items and sentences must be lists`);
                continue;
            }
            if (lesson.dialogue !== undefined)
                problems.push(...dialogueProblems(lessonWhere, lesson.dialogue));
            need(lesson.items.length + lesson.sentences.length > 0 || lesson.dialogue !== undefined, `${lessonWhere}: is empty`);
            for (const id of lesson.items)
                need(items.has(id), `${lessonWhere}: unknown item ${id}`);
            for (const id of lesson.sentences)
                need(sentences.has(id), `${lessonWhere}: unknown sentence ${id}`);
        }
    });
    const units = raw.units;
    need(isOptional(raw.start, (start) => units.some((unit) => isFields(unit) && unit.id === start)), "pack: start must name a unit");
    return problems;
}
export function parsePack(raw) {
    const problems = packProblems(raw);
    if (problems.length > 0)
        throw new Error(`Bad content pack:\n${problems.join("\n")}`);
    return raw;
}
function formsOf(item, ignoreCase) {
    const all = [item.text, ...(item.forms ?? [])].flatMap(splitWords);
    return ignoreCase ? all.map((form) => form.toLowerCase()) : all;
}
export function contentProblems(pack) {
    const problems = [];
    const ignoreCase = pack.target.rules.ignoreCase;
    const fold = (word) => (ignoreCase ? word.toLowerCase() : word);
    const items = new Map(pack.items.map((item) => [item.id, item]));
    const sentences = new Map(pack.sentences.map((sentence) => [sentence.id, sentence]));
    const known = new Set(pack.assumed.map(fold));
    const taught = new Set();
    for (const lesson of allLessons(pack)) {
        for (const id of lesson.items) {
            taught.add(id);
            const item = items.get(id);
            if (item !== undefined)
                for (const form of formsOf(item, ignoreCase))
                    known.add(form);
        }
        for (const id of lesson.sentences) {
            taught.add(id);
            const sentence = sentences.get(id);
            if (sentence === undefined)
                continue;
            for (const word of sentence.tokens ?? splitWords(sentence.text)) {
                if (!/^\p{N}+$/u.test(word) && !known.has(fold(word)))
                    problems.push(`sentence ${id}: "${word}" is not taught by lesson ${lesson.id}`);
            }
        }
        if (lesson.dialogue !== undefined) {
            const speakers = new Map(lesson.dialogue.speakers.map((speaker) => [speaker.id, speaker]));
            for (const line of lesson.dialogue.lines) {
                for (const text of [line.text, ...(line.wrong ?? [])]) {
                    for (const word of splitWords(text)) {
                        if (!/^\p{N}+$/u.test(word) && !known.has(fold(word)))
                            problems.push(`lesson ${lesson.id}: "${word}" is not taught yet, in "${text}"`);
                    }
                }
                if (pack.voice !== undefined && pack.audio[lineAudioKey(speakers.get(line.speaker), line.text)] === undefined)
                    problems.push(`lesson ${lesson.id}: no recording for "${line.text}"`);
            }
        }
    }
    for (const entry of [...pack.items, ...pack.sentences]) {
        if (!taught.has(entry.id))
            problems.push(`${entry.id}: not in any lesson`);
        if (pack.voice !== undefined && pack.audio[entry.text] === undefined)
            problems.push(`${entry.id}: no recording for "${entry.text}"`);
    }
    const seen = new Map();
    for (const entry of pack.sentences) {
        const earlier = seen.get(entry.text);
        if (earlier !== undefined)
            problems.push(`${entry.id}: same text as ${earlier}`);
        seen.set(entry.text, entry.id);
    }
    return [...problems, ...difficultyProblems(pack)];
}
function medianRank(unit, items) {
    const ranks = unit.lessons
        .flatMap((lesson) => lesson.items)
        .map((id) => items.get(id))
        .filter((item) => item !== undefined && item.pos !== "phrase")
        .map((item) => item?.freqRank)
        .filter((rank) => rank !== undefined)
        .sort((a, b) => a - b);
    return ranks[ranks.length >> 1];
}
function difficultyProblems(pack) {
    if (!pack.items.some((item) => item.freqRank !== undefined))
        return [];
    const problems = pack.items.filter((item) => item.freqRank === undefined).map((item) => `${item.id}: no freqRank`);
    const items = new Map(pack.items.map((item) => [item.id, item]));
    let previous;
    for (const unit of pack.units) {
        const rank = medianRank(unit, items);
        if (rank === undefined)
            continue;
        if (previous !== undefined && rank <= previous.rank)
            problems.push(`unit ${unit.id}: median rank ${rank} is not rarer than ${previous.rank} in ${previous.id}`);
        previous = { id: unit.id, rank };
    }
    return problems;
}
