import { review } from "../srs/schedule.js";
export const GOAL_XP = { light: 10, regular: 20, serious: 40 };
const XP_PER_RIGHT = 1;
const XP_PER_SESSION = 5;
export const MAX_FREEZES = 2;
const START_FREEZES = 1;
const DAYS_PER_FREEZE = 7;
export function startStreak() {
    return { current: 0, best: 0, freezes: START_FREEZES };
}
export function localDate(now) {
    const date = new Date(now);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}
export function daysBetween(from, to) {
    return Math.round((Date.UTC(...parts(to)) - Date.UTC(...parts(from))) / 86_400_000);
}
function parts(date) {
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    return [year, month - 1, day];
}
export function daysAway(streak, today) {
    return streak.lastActive === undefined ? 0 : daysBetween(streak.lastActive, today);
}
export function extendStreak(streak, today) {
    const gap = streak.lastActive === undefined ? undefined : daysBetween(streak.lastActive, today);
    if (gap === 0)
        return { streak, usedFreeze: false };
    const usedFreeze = gap === 2 && streak.freezes > 0;
    const current = gap === 1 || usedFreeze ? streak.current + 1 : 1;
    const earned = current > 0 && current % DAYS_PER_FREEZE === 0 ? 1 : 0;
    return {
        usedFreeze,
        streak: {
            current,
            best: Math.max(streak.best, current),
            lastActive: today,
            freezes: Math.min(MAX_FREEZES, streak.freezes - (usedFreeze ? 1 : 0) + earned),
        },
    };
}
export function streakToday(streak, today) {
    if (streak.lastActive === undefined)
        return 0;
    const gap = daysBetween(streak.lastActive, today);
    if (gap <= 1)
        return streak.current;
    return gap === 2 && streak.freezes > 0 ? streak.current : 0;
}
export function sessionXp(firstTryRight) {
    return firstTryRight * XP_PER_RIGHT + XP_PER_SESSION;
}
export function applySitting(input) {
    const { profileId, courseId, now } = input;
    const today = localDate(now);
    const xp = sessionXp(input.firstTryRight);
    const { streak, usedFreeze } = extendStreak(input.streak, today);
    const cards = Object.entries(input.grades).map(([itemId, grade]) => review(input.cards.get(itemId), { profileId, courseId, itemId }, grade, now));
    const before = input.stat ?? { profileId, date: today, xp: 0, minutes: 0, lessons: 0, reviews: 0, streakFrozen: false };
    const lessonId = input.lessonId;
    const completed = input.enrollment.completedLessons;
    return {
        streak,
        usedFreeze,
        xp,
        cards,
        enrollment: lessonId !== undefined && !completed.includes(lessonId) ? { ...input.enrollment, completedLessons: [...completed, lessonId] } : input.enrollment,
        stat: {
            ...before,
            xp: before.xp + xp,
            lessons: before.lessons + (lessonId === undefined ? 0 : 1),
            reviews: before.reviews + (lessonId === undefined ? cards.length : 0),
            streakFrozen: before.streakFrozen || usedFreeze,
        },
    };
}
