import { localDate } from "../game/progress.js";
import { getValue, listValues, openDatabase, putAll, putValue } from "./idb.js";
const DATABASE = "polyglow";
const VERSION = 3;
const PROFILES = "profiles";
const ENROLLMENTS = "enrollments";
const CARDS = "cards";
const STATS = "dailyStats";
const LOG = "reviewLog";
const REPORTS = "contentReports";
const SITTINGS = "sittings";
let opened;
function database() {
    opened ??= openDatabase(DATABASE, VERSION, [PROFILES, ENROLLMENTS, CARDS, STATS, LOG, REPORTS, SITTINGS]);
    return opened;
}
export async function listProfiles() {
    return listValues(await database(), PROFILES);
}
export async function saveProfile(profile) {
    await putValue(await database(), PROFILES, profile.id, profile);
}
export async function loadProgress(profileId, courseId, now) {
    const db = await database();
    const enrollment = await getValue(db, ENROLLMENTS, [profileId, courseId]);
    const cards = await listValues(db, CARDS, IDBKeyRange.bound([profileId, courseId], [profileId, courseId, []]));
    const today = await getValue(db, STATS, [profileId, localDate(now)]);
    return {
        enrollment: enrollment ?? { profileId, courseId, completedLessons: [], startedAt: now },
        cards: new Map(cards.map((card) => [card.itemId, card])),
        today,
    };
}
const enrollmentWrite = (enrollment) => ({ store: ENROLLMENTS, key: [enrollment.profileId, enrollment.courseId], value: enrollment });
const cardWrite = (card) => ({ store: CARDS, key: [card.profileId, card.courseId, card.itemId], value: card });
const statWrite = (stat) => ({ store: STATS, key: [stat.profileId, stat.date], value: stat });
const logWrite = (entry) => ({ store: LOG, key: [entry.profileId, entry.ts, entry.itemId], value: entry });
const reportWrite = (report) => ({ store: REPORTS, key: [report.profileId, report.ts, report.subject], value: report });
const keptKey = (profileId, courseId, key) => [profileId, courseId, key];
export async function loadSavedSitting(profileId, courseId, key) {
    return getValue(await database(), SITTINGS, keptKey(profileId, courseId, key));
}
export async function keepSitting(saved) {
    await putValue(await database(), SITTINGS, keptKey(saved.profileId, saved.courseId, saved.key), saved);
}
export async function forgetSitting(profileId, courseId, key) {
    await putAll(await database(), [], [{ store: SITTINGS, range: IDBKeyRange.only(keptKey(profileId, courseId, key)) }]);
}
export async function saveSitting(profile, changes, grades, now, key) {
    const updated = { ...profile, streak: changes.streak };
    const writes = [
        { store: PROFILES, key: profile.id, value: updated },
        enrollmentWrite(changes.enrollment),
        statWrite(changes.stat),
        ...changes.cards.map(cardWrite),
        ...Object.entries(grades).map(([itemId, grade]) => logWrite({ profileId: profile.id, itemId, ts: now, grade })),
    ];
    const kept = key === undefined ? [] : [{ store: SITTINGS, range: IDBKeyRange.only(keptKey(profile.id, changes.enrollment.courseId, key)) }];
    await putAll(await database(), writes, kept);
    return updated;
}
const ofProfile = (profileId) => IDBKeyRange.bound([profileId], [profileId, []]);
export async function readProfileData(profile) {
    const db = await database();
    const range = ofProfile(profile.id);
    return {
        profile,
        enrollments: await listValues(db, ENROLLMENTS, range),
        cards: await listValues(db, CARDS, range),
        stats: await listValues(db, STATS, range),
        log: await listValues(db, LOG, range),
        reports: await listValues(db, REPORTS, range),
    };
}
export async function replaceProfileData(data) {
    const { profile, enrollments, cards, stats, log, reports } = data;
    const range = ofProfile(profile.id);
    const writes = [
        { store: PROFILES, key: profile.id, value: profile },
        ...enrollments.map(enrollmentWrite),
        ...cards.map(cardWrite),
        ...stats.map(statWrite),
        ...log.map(logWrite),
        ...reports.map(reportWrite),
    ];
    await putAll(await database(), writes, [ENROLLMENTS, CARDS, STATS, LOG, REPORTS, SITTINGS].map((store) => ({ store, range })));
}
export async function deleteProfileData(profileId) {
    const range = ofProfile(profileId);
    const removals = [ENROLLMENTS, CARDS, STATS, LOG, REPORTS, SITTINGS].map((store) => ({ store, range }));
    await putAll(await database(), [], [{ store: PROFILES, range: IDBKeyRange.only(profileId) }, ...removals]);
}
export async function saveReport(report) {
    await putAll(await database(), [reportWrite(report)]);
}
export async function listReports(profileId) {
    return listValues(await database(), REPORTS, ofProfile(profileId));
}
export async function deleteReports(profileId) {
    await putAll(await database(), [], [{ store: REPORTS, range: ofProfile(profileId) }]);
}
