const DAY = 24 * 60 * 60 * 1000;
const START_DIFFICULTY = 5;
const MAX_STABILITY = 365;
export const DAILY_CAP = 40;
export const WELCOME_BACK_CAP = 15;
export const WELCOME_BACK_AFTER_DAYS = 7;
export const SESSION_SIZE = 12;
const clampDifficulty = (value) => Math.min(10, Math.max(1, value));
function growth(difficulty) {
    return 3.2 - 0.18 * difficulty;
}
export function review(card, identity, grade, now) {
    const reps = card?.reps ?? 0;
    const lapses = card?.lapses ?? 0;
    const difficulty = card?.difficulty ?? START_DIFFICULTY;
    const stability = card?.stability ?? 0;
    const base = { ...identity, lastReview: now };
    if (grade === "again") {
        return { ...base, reps: 0, lapses: card === undefined ? 0 : lapses + 1, difficulty: clampDifficulty(difficulty + 1), stability: 1, due: now + DAY };
    }
    let next;
    if (reps === 0)
        next = 1;
    else if (reps === 1)
        next = grade === "good" ? 3 : 2;
    else
        next = grade === "good" ? stability * growth(difficulty) : stability * 1.2;
    const nextStability = Math.min(MAX_STABILITY, next);
    return {
        ...base,
        reps: reps + 1,
        lapses,
        difficulty: clampDifficulty(difficulty + (grade === "good" ? -0.2 : 0.3)),
        stability: nextStability,
        due: now + nextStability * DAY,
    };
}
export function planReviews(cards, now, options) {
    const due = cards.filter((card) => card.due <= now);
    const welcomeBack = options.daysAway >= WELCOME_BACK_AFTER_DAYS && due.length > WELCOME_BACK_CAP;
    const cap = welcomeBack ? WELCOME_BACK_CAP : DAILY_CAP;
    const room = Math.max(0, cap - options.reviewedToday);
    const importance = (card) => [-card.lapses, options.rank(card.itemId), card.due];
    const ordered = [...due].sort((a, b) => {
        const [x, y] = [importance(a), importance(b)];
        return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
    });
    return { cards: ordered.slice(0, Math.min(room, SESSION_SIZE)), dueCount: due.length, welcomeBack };
}
