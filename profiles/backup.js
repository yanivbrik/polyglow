import { daysBetween, GOAL_XP } from "../game/progress.js";
const APP = "polyglow";
export const BACKUP_VERSION = 1;
export const REMIND_AFTER_DAYS = 7;
const MAX_FILE_LENGTH = 50_000_000;
const MAX_NAME_LENGTH = 100;
const MAX_AVATAR_LENGTH = 16;
const MAX_SHORT_TEXT = 100;
const MAX_LONG_TEXT = 2000;
export function serializeBackup(data, now) {
    const { profile, enrollments, cards, stats, log, reports } = data;
    return JSON.stringify({
        app: APP,
        version: BACKUP_VERSION,
        exportedAt: now,
        profile: { ...profile, lastBackupAt: now },
        enrollments,
        cards,
        stats,
        log,
        reports,
    });
}
const isFields = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isCount = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
const isWhole = (value) => isCount(value) && Number.isInteger(value);
const isId = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(value);
const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const isGrade = (value) => value === "again" || value === "hard" || value === "good";
const isGoal = (value) => typeof value === "string" && Object.hasOwn(GOAL_XP, value);
const isFocus = (value) => value === "listening" || value === "balanced" || value === "writing";
const isStart = (value) => value === "basics" || value === "usual";
const isText = (value, limit) => typeof value === "string" && value.length <= limit;
function cleanStreak(value) {
    if (!isFields(value) || !isWhole(value.current) || !isWhole(value.best) || !isWhole(value.freezes))
        return undefined;
    if (value.lastActive !== undefined && !isDate(value.lastActive))
        return undefined;
    return {
        current: value.current,
        best: value.best,
        freezes: value.freezes,
        ...(value.lastActive !== undefined && { lastActive: value.lastActive }),
    };
}
function cleanProfile(value) {
    if (!isFields(value) || !isId(value.id))
        return undefined;
    const { name, avatar, addressAs, dailyGoal, createdAt, lastBackupAt, bestMatch, focus, start } = value;
    if (typeof name !== "string" || name.trim() === "" || name.length > MAX_NAME_LENGTH)
        return undefined;
    if (typeof avatar !== "string" || avatar === "" || avatar.length > MAX_AVATAR_LENGTH)
        return undefined;
    if ((addressAs !== "m" && addressAs !== "f") || !isGoal(dailyGoal) || !isCount(createdAt))
        return undefined;
    if (lastBackupAt !== undefined && !isCount(lastBackupAt))
        return undefined;
    if (bestMatch !== undefined && !isWhole(bestMatch))
        return undefined;
    if (focus !== undefined && !isFocus(focus))
        return undefined;
    if (start !== undefined && !isStart(start))
        return undefined;
    const streak = cleanStreak(value.streak);
    if (streak === undefined)
        return undefined;
    return {
        id: value.id,
        name,
        avatar,
        addressAs,
        dailyGoal,
        streak,
        createdAt,
        ...(lastBackupAt !== undefined && { lastBackupAt }),
        ...(bestMatch !== undefined && { bestMatch }),
        ...(focus !== undefined && { focus }),
        ...(start !== undefined && { start }),
    };
}
function cleanEnrollment(value, profileId) {
    if (!isFields(value) || value.profileId !== profileId || !isId(value.courseId) || !isCount(value.startedAt))
        return undefined;
    const { completedLessons } = value;
    if (!Array.isArray(completedLessons) || !completedLessons.every(isId))
        return undefined;
    return { profileId, courseId: value.courseId, completedLessons, startedAt: value.startedAt };
}
function cleanCard(value, profileId) {
    if (!isFields(value) || value.profileId !== profileId || !isId(value.courseId) || !isId(value.itemId))
        return undefined;
    const { stability, difficulty, due, reps, lapses, lastReview } = value;
    if (!isCount(stability) || !isCount(difficulty) || !isCount(due) || !isWhole(reps) || !isWhole(lapses) || !isCount(lastReview))
        return undefined;
    return { profileId, courseId: value.courseId, itemId: value.itemId, stability, difficulty, due, reps, lapses, lastReview };
}
function cleanStat(value, profileId) {
    if (!isFields(value) || value.profileId !== profileId || !isDate(value.date))
        return undefined;
    const { xp, minutes, lessons, reviews, streakFrozen } = value;
    if (!isCount(xp) || !isCount(minutes) || !isWhole(lessons) || !isWhole(reviews) || typeof streakFrozen !== "boolean")
        return undefined;
    return { profileId, date: value.date, xp, minutes, lessons, reviews, streakFrozen };
}
function cleanEntry(value, profileId) {
    if (!isFields(value) || value.profileId !== profileId || !isId(value.itemId) || !isCount(value.ts) || !isGrade(value.grade))
        return undefined;
    return { profileId, itemId: value.itemId, ts: value.ts, grade: value.grade };
}
function cleanReport(value, profileId) {
    if (!isFields(value) || value.profileId !== profileId || !isId(value.courseId) || !isCount(value.ts))
        return undefined;
    const { build, stepKind, subject, shown, note } = value;
    if (!isText(build, MAX_SHORT_TEXT) || !isText(stepKind, MAX_SHORT_TEXT) || !isText(subject, MAX_LONG_TEXT) || !isText(note, MAX_LONG_TEXT))
        return undefined;
    if (!Array.isArray(shown) || !shown.every((line) => isText(line, MAX_LONG_TEXT)))
        return undefined;
    return { profileId, courseId: value.courseId, ts: value.ts, build, stepKind, subject, shown, note };
}
function cleanAll(value, clean) {
    if (!Array.isArray(value))
        return undefined;
    const result = [];
    for (const record of value) {
        const cleaned = clean(record);
        if (cleaned === undefined)
            return undefined;
        result.push(cleaned);
    }
    return result;
}
export function parseBackup(text) {
    if (text.length > MAX_FILE_LENGTH)
        return { ok: false, problem: "not-a-backup" };
    let raw;
    try {
        raw = JSON.parse(text);
    }
    catch {
        return { ok: false, problem: "not-a-backup" };
    }
    if (!isFields(raw) || raw.app !== APP || !isWhole(raw.version) || raw.version === 0)
        return { ok: false, problem: "not-a-backup" };
    if (raw.version > BACKUP_VERSION)
        return { ok: false, problem: "newer-version" };
    const damaged = { ok: false, problem: "damaged" };
    if (!isCount(raw.exportedAt))
        return damaged;
    const profile = cleanProfile(raw.profile);
    if (profile === undefined)
        return damaged;
    const enrollments = cleanAll(raw.enrollments, (record) => cleanEnrollment(record, profile.id));
    const cards = cleanAll(raw.cards, (record) => cleanCard(record, profile.id));
    const stats = cleanAll(raw.stats, (record) => cleanStat(record, profile.id));
    const log = cleanAll(raw.log, (record) => cleanEntry(record, profile.id));
    const reports = raw.reports === undefined ? [] : cleanAll(raw.reports, (record) => cleanReport(record, profile.id));
    if (enrollments === undefined || cards === undefined || stats === undefined || log === undefined || reports === undefined)
        return damaged;
    return { ok: true, backup: { exportedAt: raw.exportedAt, profile, enrollments, cards, stats, log, reports } };
}
export function backupFileName(profile, date) {
    const name = profile.name.trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
    return `polyglow-${name === "" ? "backup" : name}-${date}.json`;
}
export function backupIsDue(profile, hasProgress, today, dateOf) {
    if (!hasProgress)
        return false;
    const since = Math.max(profile.createdAt, profile.lastBackupAt ?? 0, profile.backupPutOffAt ?? 0);
    return daysBetween(dateOf(since), today) >= REMIND_AFTER_DAYS;
}
export function deviceIsNewer(onDevice, inFile) {
    const device = onDevice.streak.lastActive;
    const file = inFile.streak.lastActive;
    return device !== undefined && (file === undefined || device > file);
}
export function shownDate(date) {
    const [year, month, day] = date.split("-");
    return `${Number(day)}.${Number(month)}.${year}`;
}
