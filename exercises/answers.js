const MIN_LENGTH_FOR_ALMOST = 4;
const dropMarks = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
function letters(text, rules) {
    let result = text.normalize("NFC");
    if (rules.marks === "ignore")
        result = dropMarks(result);
    if (rules.ignoreCase)
        result = result.toLowerCase();
    return result.replace(/[’‘ʼ׳`´]/g, "'");
}
export function normalize(text, rules) {
    return letters(text, rules)
        .replace(/[-־–—]/g, " ")
        .replace(/(?<![\p{L}\p{M}\p{N}])'|'(?![\p{L}\p{M}\p{N}])/gu, " ")
        .replace(/[^\p{L}\p{M}\p{N}'\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
}
export function editDistance(a, b) {
    const x = [...a];
    const y = [...b];
    let before = [];
    let previous = y.map((_, index) => index + 1);
    previous.unshift(0);
    for (let i = 1; i <= x.length; i++) {
        const row = [i];
        for (let j = 1; j <= y.length; j++) {
            const cost = x[i - 1] === y[j - 1] ? 0 : 1;
            let best = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + cost);
            if (i > 1 && j > 1 && x[i - 1] === y[j - 2] && x[i - 2] === y[j - 1])
                best = Math.min(best, before[j - 2] + 1);
            row.push(best);
        }
        before = previous;
        previous = row;
    }
    return previous[y.length];
}
const MIN_TILES_FOR_ALMOST = 4;
function oneMoveAway(tiles) {
    const orders = [];
    for (const [from, tile] of tiles.entries()) {
        const rest = [...tiles.slice(0, from), ...tiles.slice(from + 1)];
        for (let to = 0; to <= rest.length; to++)
            if (to !== from)
                orders.push([...rest.slice(0, to), tile, ...rest.slice(to)]);
    }
    return orders;
}
export function checkTiles(tiles, accepted, rules) {
    const targets = new Set(accepted.map((text) => normalize(text, rules)));
    const matches = (order) => targets.has(normalize(order.join(" "), rules));
    if (tiles.length === 0)
        return "wrong";
    if (matches(tiles))
        return "right";
    if (tiles.length >= MIN_TILES_FOR_ALMOST && oneMoveAway(tiles).some(matches))
        return "almost";
    return "wrong";
}
const contractionTables = new WeakMap();
function contractionsOf(rules) {
    if (rules.contractions === undefined)
        return undefined;
    let table = contractionTables.get(rules);
    if (table === undefined) {
        const { words = {}, endings = {} } = rules.contractions;
        const full = (forms) => forms.map((form) => normalize(form, rules));
        table = {
            words: new Map(Object.entries(words).map(([word, forms]) => [normalize(word, rules), full(forms)])),
            endings: Object.entries(endings)
                .map(([ending, forms]) => [letters(ending, rules), full(forms)])
                .sort(([a], [b]) => b.length - a.length),
        };
        contractionTables.set(rules, table);
    }
    return table;
}
function fullForms(word, table) {
    const listed = table.words.get(word);
    if (listed !== undefined)
        return listed;
    for (const [ending, forms] of table.endings) {
        if (word.length > ending.length && word.endsWith(ending))
            return forms.map((form) => `${word.slice(0, -ending.length)} ${form}`);
    }
    return undefined;
}
const MAX_FORMS = 32;
function writings(text, rules) {
    const normal = normalize(text, rules);
    const table = contractionsOf(rules);
    if (table === undefined || normal === "")
        return [normal];
    let expanded = [[]];
    for (const word of normal.split(" ")) {
        const options = fullForms(word, table) ?? [word];
        expanded = expanded.flatMap((start) => options.map((option) => [...start, option])).slice(0, MAX_FORMS);
    }
    return [...new Set([normal, ...expanded.map((words) => words.join(" "))])];
}
export function checkTyped(answer, accepted, rules) {
    const expected = accepted[0] ?? "";
    const typed = writings(answer, rules);
    if (typed[0] === "")
        return { result: "wrong", expected };
    const targets = accepted.map((text) => writings(text, rules));
    if (targets.some((target) => target.some((form) => typed.includes(form))))
        return { result: "correct" };
    if (rules.marks === "note") {
        const bare = new Set(typed.map(dropMarks));
        if (targets.some((target) => target.some((form) => bare.has(dropMarks(form)))))
            return { result: "correct", note: "marks" };
    }
    for (const [index, target] of targets.entries()) {
        const close = (form) => [...form].length >= MIN_LENGTH_FOR_ALMOST && typed.some((mine) => editDistance(mine, form) === 1);
        if (target.some(close))
            return { result: "almost", expected: accepted[index] };
    }
    return { result: "wrong", expected };
}
