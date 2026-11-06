import { isGraded, isOnlyHere } from "./types.js";
const MAX_TRIES = 3;
export function startSession(steps) {
    return { queue: steps, done: 0, grades: {}, firstTryRight: 0, mistakes: 0, retries: [] };
}
export const currentStep = (session) => session.queue[0];
export const isFinished = (session) => session.queue.length === 0;
export const progress = (session) => {
    const total = session.done + session.queue.length;
    return total === 0 ? 1 : session.done / total;
};
const RANK = { good: 0, hard: 1, again: 2 };
function worse(current, next) {
    return current === undefined || RANK[next] > RANK[current] ? next : current;
}
export function finishStep(session, result) {
    const step = session.queue[0];
    if (step === undefined)
        return session;
    const rest = session.queue.slice(1);
    if (!isGraded(step) || result === undefined)
        return { ...session, queue: rest, done: session.done + 1 };
    if (isOnlyHere(step)) {
        const missed = result.wrong.length > 0;
        return {
            ...session,
            queue: rest,
            done: session.done + 1,
            firstTryRight: missed ? session.firstTryRight : session.firstTryRight + 1,
            mistakes: missed ? session.mistakes + 1 : session.mistakes,
        };
    }
    const grades = { ...session.grades };
    for (const subject of result.right)
        grades[subject] = worse(grades[subject], "good");
    for (const subject of result.almost)
        grades[subject] = worse(grades[subject], "hard");
    for (const subject of result.wrong)
        grades[subject] = worse(grades[subject], "again");
    const failures = session.retries.filter((other) => other === step).length;
    const failed = result.wrong.length > 0;
    const comesBack = failed && failures + 1 < MAX_TRIES;
    return {
        ...session,
        grades,
        queue: comesBack ? [...rest, step] : rest,
        done: comesBack ? session.done : session.done + 1,
        firstTryRight: failures === 0 && !failed ? session.firstTryRight + 1 : session.firstTryRight,
        mistakes: failed ? session.mistakes + 1 : session.mistakes,
        retries: failed ? [...session.retries, step] : session.retries,
    };
}
