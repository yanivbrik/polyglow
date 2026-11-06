import { allLessons, gendered, lineAudioKey, shownTranslation, sourceLine, targetLine } from "../course/pack.js";
import { splitWords } from "../course/words.js";
import { shuffled } from "./rng.js";
export const BLANK = "_____";
const OPTIONS = 4;
const MATCH_MIN = 3;
const MATCH_MAX = 5;
const EXTRA_TILES = 3;
const WORDS_AT_A_TIME = 2;
const TYPED_WORDS = { listening: 0, balanced: 1, writing: 3 };
const SPOKEN_LINES = { listening: 3, balanced: 1, writing: 0 };
const TYPED_LINES = { listening: 0, balanced: 1, writing: 2 };
const LINES_BEFORE_REPLY = 3;
const uniqueTexts = (texts) => [...new Set(texts)];
function metFirst(ctx, entries) {
    const met = ctx.met;
    if (met === undefined)
        return entries;
    return [...entries.filter((entry) => met.has(entry.id)), ...entries.filter((entry) => !met.has(entry.id))];
}
function clip(pack, text) {
    const file = pack.audio[text];
    return file === undefined ? undefined : `content/${pack.id}/audio/${file}`;
}
function distractorItems(ctx, item) {
    const others = shuffled(ctx.pack.items.filter((other) => other.id !== item.id), ctx.rng);
    return metFirst(ctx, [...others.filter((other) => other.pos === item.pos), ...others.filter((other) => other.pos !== item.pos)]);
}
function withOptions(ctx, right, wrong, line) {
    const picked = uniqueTexts(wrong).filter((text) => text !== right.text).slice(0, OPTIONS - 1);
    const options = shuffled([right, ...picked.map(line)], ctx.rng);
    return { options, correct: options.findIndex((option) => option.text === right.text) };
}
function meaningOfWord(ctx, item) {
    const { pack, address } = ctx;
    const wrong = distractorItems(ctx, item)
        .filter((other) => !item.translations.some((t) => other.translations.includes(t)))
        .map((other) => shownTranslation(other, address));
    const audio = clip(pack, item.text);
    return {
        kind: "choice",
        mode: "meaning",
        subject: item.id,
        prompt: targetLine(pack, item.text),
        ...(audio !== undefined && { audio }),
        ...withOptions(ctx, sourceLine(pack, shownTranslation(item, address)), wrong, (text) => sourceLine(pack, text)),
    };
}
function wordFromMeaning(ctx, item) {
    const { pack, address } = ctx;
    return {
        kind: "choice",
        mode: "word",
        subject: item.id,
        prompt: sourceLine(pack, shownTranslation(item, address)),
        ...withOptions(ctx, targetLine(pack, item.text), distractorItems(ctx, item).map((other) => other.text), (text) => targetLine(pack, text)),
    };
}
function listenWord(ctx, item) {
    const { pack } = ctx;
    const audio = clip(pack, item.text);
    if (audio === undefined)
        return undefined;
    return {
        kind: "choice",
        mode: "listen",
        subject: item.id,
        audio,
        ...withOptions(ctx, targetLine(pack, item.text), distractorItems(ctx, item).map((other) => other.text), (text) => targetLine(pack, text)),
    };
}
function listenSentence(ctx, sentence) {
    const { pack, address, rng } = ctx;
    const audio = clip(pack, sentence.text);
    if (audio === undefined)
        return undefined;
    const wrong = metFirst(ctx, shuffled(pack.sentences.filter((other) => other.id !== sentence.id), rng)).map((other) => shownTranslation(other, address));
    return {
        kind: "choice",
        mode: "listen",
        subject: sentence.id,
        audio,
        ...withOptions(ctx, sourceLine(pack, shownTranslation(sentence, address)), wrong, (text) => sourceLine(pack, text)),
    };
}
function shadowSentence(ctx, sentence) {
    const { pack, address } = ctx;
    const audio = clip(pack, sentence.text);
    if (audio === undefined)
        return undefined;
    return {
        kind: "shadow",
        subject: sentence.id,
        text: targetLine(pack, sentence.text),
        meaning: sourceLine(pack, shownTranslation(sentence, address)),
        audio,
    };
}
function pairsOf(ctx, items) {
    const { pack, address } = ctx;
    const seen = new Set();
    const pairs = [];
    for (const item of items) {
        const meaning = shownTranslation(item, address);
        if (seen.has(meaning))
            continue;
        seen.add(meaning);
        const audio = clip(pack, item.text);
        pairs.push({
            subject: item.id,
            target: targetLine(pack, item.text),
            source: sourceLine(pack, meaning),
            ...(audio !== undefined && { audio }),
        });
    }
    return pairs;
}
function match(ctx, items) {
    return { kind: "match", pairs: pairsOf(ctx, items) };
}
export function findWord(text, word, ignoreCase) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const found = new RegExp(`(?<![\\p{L}\\p{M}\\p{N}'])${escaped}(?![\\p{L}\\p{M}\\p{N}'])`, ignoreCase ? "iu" : "u").exec(text);
    return found === null ? undefined : { before: text.slice(0, found.index), after: text.slice(found.index + found[0].length) };
}
const formsOfItem = (item) => [item.text, ...(item.forms ?? [])].sort((a, b) => b.length - a.length);
function fillBlank(ctx, sentence, preferred) {
    const { pack, address } = ctx;
    const { ignoreCase } = pack.target.rules;
    for (const item of [...preferred, ...pack.items]) {
        for (const form of formsOfItem(item)) {
            const place = findWord(sentence.text, form, ignoreCase);
            if (place === undefined)
                continue;
            const wrong = distractorItems(ctx, item)
                .filter((other) => !formsOfItem(other).some((word) => findWord(sentence.text, word, ignoreCase) !== undefined))
                .map((other) => other.text);
            if (wrong.length === 0)
                return undefined;
            const audio = clip(pack, sentence.text);
            return {
                kind: "choice",
                mode: "blank",
                subject: sentence.id,
                prompt: targetLine(pack, `${place.before}${BLANK}${place.after}`),
                hint: sourceLine(pack, shownTranslation(sentence, address)),
                reveal: targetLine(pack, sentence.text),
                ...(audio !== undefined && { audio }),
                ...withOptions(ctx, targetLine(pack, form), wrong, (text) => targetLine(pack, text)),
            };
        }
    }
    return undefined;
}
function tiles(ctx, sentence) {
    const { pack, address, rng } = ctx;
    const own = sentence.tokens ?? splitWords(sentence.text);
    const ownLower = new Set(own.map((word) => word.toLowerCase()));
    const wordsOf = (sentences) => shuffled(sentences.flatMap((other) => other.tokens ?? splitWords(other.text)), rng);
    const rest = pack.sentences.filter((other) => other.id !== sentence.id);
    const met = ctx.met === undefined ? [] : rest.filter((other) => ctx.met?.has(other.id));
    const others = uniqueTexts([...wordsOf(met), ...wordsOf(rest.filter((other) => !met.includes(other)))]).filter((word) => !ownLower.has(word.toLowerCase()));
    const audio = clip(pack, sentence.text);
    return {
        kind: "tiles",
        subject: sentence.id,
        prompt: sourceLine(pack, shownTranslation(sentence, address)),
        tiles: shuffled([...own, ...others.slice(0, EXTRA_TILES)], rng).map((word) => targetLine(pack, word)),
        accepted: [sentence.text, ...(sentence.alternatives ?? [])],
        rules: pack.target.rules,
        ...(audio !== undefined && { audio }),
    };
}
function translateToTarget(ctx, entry) {
    const { pack, address } = ctx;
    return {
        kind: "type",
        mode: "translate",
        subject: entry.id,
        prompt: sourceLine(pack, shownTranslation(entry, address)),
        accepted: [entry.text, ...(entry.alternatives ?? [])],
        answer: { lang: pack.target.lang, dir: pack.target.dir },
        rules: pack.target.rules,
    };
}
function translateToSource(ctx, sentence) {
    const { pack, address } = ctx;
    const shown = shownTranslation(sentence, address);
    const audio = clip(pack, sentence.text);
    return {
        kind: "type",
        mode: "translate",
        subject: sentence.id,
        prompt: targetLine(pack, sentence.text),
        ...(audio !== undefined && { audio }),
        accepted: [shown, ...sentence.translations.filter((text) => text !== shown)],
        answer: { lang: pack.source.lang, dir: pack.source.dir },
        rules: pack.source.rules,
    };
}
function dictation(ctx, entry) {
    const { pack } = ctx;
    const audio = clip(pack, entry.text);
    if (audio === undefined)
        return undefined;
    return {
        kind: "type",
        mode: "dictation",
        subject: entry.id,
        audio,
        accepted: [entry.text],
        answer: { lang: pack.target.lang, dir: pack.target.dir },
        rules: pack.target.rules,
    };
}
function intro(ctx, item, sentences) {
    const { pack, address } = ctx;
    const audio = clip(pack, item.text);
    const example = item.example === undefined ? undefined : sentences.get(item.example);
    const exampleAudio = example === undefined ? undefined : clip(pack, example.text);
    return {
        kind: "intro",
        subject: item.id,
        word: targetLine(pack, item.text),
        meaning: sourceLine(pack, shownTranslation(item, address)),
        ...(item.emoji !== undefined && { emoji: item.emoji }),
        ...(item.translit !== undefined && { translit: item.translit }),
        ...(item.mnemonic !== undefined && { mnemonic: item.mnemonic }),
        ...(audio !== undefined && { audio }),
        ...(example !== undefined && {
            example: {
                text: targetLine(pack, example.text),
                meaning: sourceLine(pack, shownTranslation(example, address)),
                ...(exampleAudio !== undefined && { audio: exampleAudio }),
            },
        }),
    };
}
const present = (value) => value !== undefined;
function recognizeWord(ctx, item, index) {
    const listen = listenWord(ctx, item) ?? wordFromMeaning(ctx, item);
    const turn = index % 3;
    if (ctx.focus === "listening")
        return turn === 2 ? meaningOfWord(ctx, item) : listen;
    if (turn === 0)
        return wordFromMeaning(ctx, item);
    return turn === 1 ? listen : meaningOfWord(ctx, item);
}
function sentencePractice(ctx, items) {
    const build = (sentence) => tiles(ctx, sentence);
    const blank = (sentence) => fillBlank(ctx, sentence, items) ?? tiles(ctx, sentence);
    const listen = (sentence) => listenSentence(ctx, sentence) ?? blank(sentence);
    const speak = (sentence) => shadowSentence(ctx, sentence) ?? blank(sentence);
    const write = (sentence) => dictation(ctx, sentence) ?? blank(sentence);
    const translate = (sentence) => translateToTarget(ctx, sentence);
    switch (ctx.focus) {
        case "listening":
            return [speak, listen, speak, build, speak, blank];
        case "balanced":
            return [build, blank, speak, listen, build, write];
        case "writing":
            return [build, translate, blank, write, build, translate];
    }
}
function tipLines({ pack, address }, tip) {
    return tip.lines.map((line) => {
        if ("say" in line)
            return { say: sourceLine(pack, gendered(line.say, address)) };
        return { target: targetLine(pack, line.target), ...(line.meaning !== undefined && { meaning: sourceLine(pack, gendered(line.meaning, address)) }) };
    });
}
function conversationSteps(ctx, lesson, dialogue) {
    const { pack, focus } = ctx;
    const speakers = new Map(dialogue.speakers.map((speaker) => [speaker.id, speaker]));
    const lines = dialogue.lines.map((line) => {
        const speaker = speakers.get(line.speaker);
        const audio = clip(pack, lineAudioKey(speaker, line.text));
        return {
            speaker: speaker?.name ?? "",
            mine: line.speaker === dialogue.learner,
            text: targetLine(pack, line.text),
            meaning: sourceLine(pack, line.translation),
            ...(audio !== undefined && { audio }),
        };
    });
    const scene = sourceLine(pack, dialogue.scene);
    const replay = lines.flatMap((line) => line.audio ?? []);
    const lineId = (index) => `${lesson.id}-line-${index + 1}`;
    const questions = dialogue.questions.map((question, index) => {
        const [right = "", ...wrong] = question.options;
        return {
            kind: "choice",
            mode: "understand",
            subject: `${lesson.id}-question-${index + 1}`,
            prompt: sourceLine(pack, question.prompt),
            ...(replay.length > 0 && { replay }),
            onlyHere: true,
            ...withOptions(ctx, sourceLine(pack, right), wrong, (text) => sourceLine(pack, text)),
        };
    });
    const turns = dialogue.lines.flatMap((line, index) => {
        const shown = lines[index];
        if (line.speaker !== dialogue.learner || shown === undefined)
            return [];
        const before = lines.slice(Math.max(0, index - LINES_BEFORE_REPLY), index);
        return [
            {
                kind: "reply",
                subject: lineId(index),
                speaker: shown.speaker,
                before,
                heardOnly: focus === "listening" && before.at(-1)?.audio !== undefined,
                line: shown,
                onlyHere: true,
                ...withOptions(ctx, shown.text, line.wrong ?? [], (text) => targetLine(pack, text)),
            },
        ];
    });
    const mine = turns.flatMap(({ subject, line }) => (line.audio === undefined ? [] : [{ subject, line, audio: line.audio }]));
    const spoken = mine.slice(Math.max(0, mine.length - SPOKEN_LINES[focus])).map(({ subject, line, audio }) => ({ kind: "shadow", subject, text: line.text, meaning: line.meaning, audio, onlyHere: true }));
    const typed = mine.slice(0, TYPED_LINES[focus]).map(({ subject, line, audio }) => ({
        kind: "type",
        mode: "dictation",
        subject,
        audio,
        accepted: [line.text.text],
        answer: { lang: pack.target.lang, dir: pack.target.dir },
        rules: pack.target.rules,
        onlyHere: true,
    }));
    return [
        { kind: "conversation", stage: "first", subject: lesson.id, scene, lines },
        ...questions,
        ...turns,
        ...spoken,
        ...typed,
        { kind: "conversation", stage: "last", subject: lesson.id, scene, lines },
    ];
}
export function lessonSteps(given, lesson) {
    const lessons = allLessons(given.pack);
    const upTo = lessons.slice(0, lessons.indexOf(lesson) + 1).flatMap((earlier) => [...earlier.items, ...earlier.sentences]);
    const ctx = { ...given, met: new Set([...(given.met ?? []), ...upTo]) };
    const { pack, rng, focus } = ctx;
    const itemsById = new Map(pack.items.map((item) => [item.id, item]));
    const sentencesById = new Map(pack.sentences.map((sentence) => [sentence.id, sentence]));
    const items = lesson.items.map((id) => itemsById.get(id)).filter(present);
    const sentences = lesson.sentences.map((id) => sentencesById.get(id)).filter(present);
    const steps = [];
    if (lesson.tip !== undefined)
        steps.push({ kind: "tip", subject: lesson.id, lines: tipLines(ctx, lesson.tip) });
    let asked = 0;
    for (let start = 0; start < items.length; start += WORDS_AT_A_TIME) {
        const group = items.slice(start, start + WORDS_AT_A_TIME);
        for (const item of group)
            steps.push(intro(ctx, item, sentencesById));
        for (const item of shuffled(group, rng))
            steps.push(recognizeWord(ctx, item, asked++));
    }
    if (items.length >= MATCH_MIN)
        steps.push(match(ctx, shuffled(items, rng).slice(0, MATCH_MAX)));
    const practice = sentencePractice(ctx, items);
    sentences.forEach((sentence, index) => {
        steps.push(practice[index % practice.length](sentence));
    });
    for (const item of shuffled(items, rng).slice(0, TYPED_WORDS[focus]))
        steps.push(translateToTarget(ctx, item));
    if (lesson.dialogue !== undefined)
        steps.push(...conversationSteps(ctx, lesson, lesson.dialogue));
    return steps;
}
function reviewWord(ctx, item, reps) {
    if (reps <= 2)
        return listenWord(ctx, item) ?? wordFromMeaning(ctx, item);
    if (ctx.focus === "listening")
        return reps <= 4 ? (listenWord(ctx, item) ?? meaningOfWord(ctx, item)) : meaningOfWord(ctx, item);
    if (reps <= 4)
        return translateToTarget(ctx, item);
    return dictation(ctx, item) ?? translateToTarget(ctx, item);
}
function reviewSentence(ctx, sentence, reps) {
    const blank = fillBlank(ctx, sentence, []) ?? tiles(ctx, sentence);
    if (reps === 0)
        return tiles(ctx, sentence);
    if (reps === 1)
        return blank;
    if (ctx.focus === "listening")
        return reps === 2 ? (listenSentence(ctx, sentence) ?? blank) : (shadowSentence(ctx, sentence) ?? blank);
    if (reps === 2)
        return listenSentence(ctx, sentence) ?? translateToSource(ctx, sentence);
    if (reps <= 4)
        return translateToTarget(ctx, sentence);
    return dictation(ctx, sentence) ?? translateToTarget(ctx, sentence);
}
export function reviewSteps(ctx, cards) {
    const { pack, rng } = ctx;
    const itemsById = new Map(pack.items.map((item) => [item.id, item]));
    const sentencesById = new Map(pack.sentences.map((sentence) => [sentence.id, sentence]));
    const steps = [];
    const easyItems = [];
    for (const card of cards) {
        const item = itemsById.get(card.itemId);
        if (item !== undefined) {
            if (card.reps <= 1 && cards.length >= MATCH_MIN)
                easyItems.push(item);
            else
                steps.push(reviewWord(ctx, item, card.reps));
            continue;
        }
        const sentence = sentencesById.get(card.itemId);
        if (sentence !== undefined)
            steps.push(reviewSentence(ctx, sentence, card.reps));
    }
    if (easyItems.length >= MATCH_MIN) {
        for (let start = 0; start < easyItems.length; start += MATCH_MAX) {
            const group = easyItems.slice(start, start + MATCH_MAX);
            if (group.length >= MATCH_MIN)
                steps.push(match(ctx, group));
            else
                steps.push(...group.map((item) => meaningOfWord(ctx, item)));
        }
    }
    else {
        steps.push(...easyItems.map((item) => meaningOfWord(ctx, item)));
    }
    return shuffled(steps, rng);
}
export function importanceRank(pack) {
    const ranks = new Map(pack.items.map((item) => [item.id, item.freqRank ?? Number.MAX_SAFE_INTEGER]));
    return (itemId) => ranks.get(itemId) ?? Number.MAX_SAFE_INTEGER;
}
export function cardsInPack(pack, cards) {
    const ids = new Set([...pack.items, ...pack.sentences].map((entry) => entry.id));
    return [...cards].filter((card) => ids.has(card.itemId));
}
export function learnedPairs(ctx, cards) {
    const learned = new Set([...cards].map((card) => card.itemId));
    return pairsOf(ctx, ctx.pack.items.filter((item) => learned.has(item.id)));
}
