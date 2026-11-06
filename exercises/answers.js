const MIN_LENGTH_FOR_ALMOST = 4;
const dropMarks = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
export function normalize(text, rules) {
    let result = text.normalize("NFC");
    if (rules.marks === "ignore")
        result = dropMarks(result);
    if (rules.ignoreCase)
        result = result.toLowerCase();
    return result
        .replace(/[’‘ʼ׳`´]/g, "'")
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
export function isExactAnswer(answer, accepted, rules) {
    const built = normalize(answer, rules);
    return built !== "" && accepted.some((text) => normalize(text, rules) === built);
}
export function checkTyped(answer, accepted, rules) {
    const expected = accepted[0] ?? "";
    const typed = normalize(answer, rules);
    if (typed === "")
        return { result: "wrong", expected };
    const targets = accepted.map((text) => normalize(text, rules));
    if (targets.includes(typed))
        return { result: "correct" };
    if (rules.marks === "note" && targets.some((target) => dropMarks(target) === dropMarks(typed)))
        return { result: "correct", note: "marks" };
    for (const [index, target] of targets.entries()) {
        if ([...target].length >= MIN_LENGTH_FOR_ALMOST && editDistance(typed, target) === 1)
            return { result: "almost", expected: accepted[index] };
    }
    return { result: "wrong", expected };
}
