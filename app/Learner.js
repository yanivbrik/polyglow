import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useMemo, useState } from "../vendor/preact-hooks.js";
import { loadPack } from "../course/load.js";
import { allLessons } from "../course/pack.js";
import { DEFAULT_START } from "../course/path.js";
import { cardsInPack, importanceRank, learnedPairs, lessonSteps, reviewSteps } from "../exercises/generate.js";
import { cleanNote, describeStep } from "../exercises/report.js";
import { SittingScreen } from "../exercises/SittingScreen.js";
import { DEFAULT_FOCUS } from "../exercises/types.js";
import { applySitting, daysAway, localDate } from "../game/progress.js";
import { MIN_WORDS, scoredPairs } from "../game/speed-match.js";
import { SpeedMatchScreen } from "../game/SpeedMatchScreen.js";
import { BackupScreen } from "../profiles/BackupScreen.js";
import { NewProfile } from "../profiles/NewProfile.js";
import { ProfilePicker } from "../profiles/ProfilePicker.js";
import { ReportsScreen } from "../profiles/ReportsScreen.js";
import { RestoreFromFile } from "../profiles/RestoreFromFile.js";
import { SettingsScreen } from "../profiles/SettingsScreen.js";
import { planReviews } from "../srs/schedule.js";
import { buildDate, buildVersion } from "../stage0/checks.js";
import { listProfiles, loadProgress, saveProfile, saveReport, saveSitting } from "../storage/store.js";
import { TopBar } from "../ui/TopBar.js";
import { Credits } from "./Credits.js";
import { Home } from "./Home.js";
import { MenuScreen } from "./Menu.js";
import { go } from "./route.js";
import { Summary } from "./Summary.js";
const COURSE = "he-en";
const ACTIVE_PROFILE = "polyglow.activeProfile";
function readActive() {
    try {
        return localStorage.getItem(ACTIVE_PROFILE) ?? undefined;
    }
    catch {
        return undefined;
    }
}
function writeActive(id) {
    try {
        if (id === undefined)
            localStorage.removeItem(ACTIVE_PROFILE);
        else
            localStorage.setItem(ACTIVE_PROFILE, id);
    }
    catch {
    }
}
function askToKeepData() {
    const storage = navigator.storage;
    void storage
        ?.persisted?.()
        .then((kept) => (kept ? true : storage.persist()))
        .catch(() => false);
}
function contextFor(pack, profile, met) {
    return { pack, address: profile.addressAs, rng: Math.random, focus: profile.focus ?? DEFAULT_FOCUS, ...(met !== undefined && { met }) };
}
function plannedReviews(pack, profile, progress, now) {
    return planReviews(cardsInPack(pack, progress.cards.values()), now, {
        reviewedToday: progress.today?.reviews ?? 0,
        daysAway: daysAway(profile.streak, localDate(now)),
        rank: importanceRank(pack),
    });
}
function Sitting({ pack, profile, progress, lessonId, onSaved }) {
    const address = profile.addressAs;
    const steps = useMemo(() => {
        const ctx = contextFor(pack, profile, new Set(progress.cards.keys()));
        const lesson = lessonId === undefined ? undefined : allLessons(pack).find((candidate) => candidate.id === lessonId);
        if (lesson !== undefined)
            return lessonSteps(ctx, lesson);
        if (lessonId !== undefined)
            return [];
        return reviewSteps(ctx, plannedReviews(pack, profile, progress, Date.now()).cards);
    }, [pack, address, lessonId]);
    useEffect(() => {
        if (steps.length === 0)
            go("#/");
    }, [steps]);
    const finish = (session) => {
        const now = Date.now();
        const changes = applySitting({
            profileId: profile.id,
            courseId: pack.id,
            streak: profile.streak,
            enrollment: progress.enrollment,
            stat: progress.today,
            cards: progress.cards,
            grades: session.grades,
            firstTryRight: session.firstTryRight,
            ...(lessonId !== undefined && { lessonId }),
            now,
        });
        void saveSitting(profile, changes, session.grades, now).then((updated) => onSaved(updated, changes));
    };
    const report = (step, note) => saveReport({ profileId: profile.id, courseId: pack.id, ts: Date.now(), build: buildVersion(), ...describeStep(step), note: cleanNote(note) });
    if (steps.length === 0)
        return null;
    return _jsx(SittingScreen, { steps: steps, address: address, onFinish: finish, onExit: () => go("#/"), onReport: report });
}
export function Learner({ route }) {
    const [profiles, setProfiles] = useState();
    const [activeId, setActiveId] = useState(readActive);
    const [pack, setPack] = useState();
    const [progress, setProgress] = useState();
    const [finished, setFinished] = useState();
    const [failure, setFailure] = useState();
    const fail = (error) => {
        console.error(error);
        setFailure(String(error));
    };
    useEffect(() => {
        listProfiles().then(setProfiles).catch(fail);
        loadPack(COURSE).then(setPack).catch(fail);
        askToKeepData();
    }, []);
    const profile = profiles?.find((candidate) => candidate.id === activeId);
    useEffect(() => {
        setProgress(undefined);
        if (profile !== undefined)
            loadProgress(profile.id, COURSE, Date.now()).then(setProgress).catch(fail);
    }, [profile?.id]);
    const refresh = (updated) => {
        setProfiles((all) => all?.map((candidate) => (candidate.id === updated.id ? updated : candidate)));
        return loadProgress(updated.id, COURSE, Date.now()).then(setProgress);
    };
    const choose = (chosen) => {
        writeActive(chosen.id);
        setActiveId(chosen.id);
        go("#/");
    };
    const create = (created) => {
        saveProfile(created)
            .then(() => {
            setProfiles((all) => [...(all ?? []), created]);
            choose(created);
        })
            .catch(fail);
    };
    const restored = (chosen) => {
        Promise.all([listProfiles(), loadProgress(chosen.id, COURSE, Date.now())])
            .then(([all, loaded]) => {
            setProfiles(all);
            setProgress(loaded);
            choose(chosen);
        })
            .catch(fail);
    };
    const deleted = (gone) => {
        const left = (profiles ?? []).filter((candidate) => candidate.id !== gone.id);
        writeActive(undefined);
        setActiveId(undefined);
        setProfiles(left);
        go(left.length === 0 ? "#/new-profile" : "#/profiles");
    };
    if (failure !== undefined) {
        return (_jsxs("section", { children: [_jsx("h2", { children: "\u05DE\u05E9\u05D4\u05D5 \u05D4\u05E9\u05EA\u05D1\u05E9" }), _jsx("p", { children: "\u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05E9\u05DC\u05DA \u05DC\u05D0 \u05E0\u05E4\u05D2\u05E2\u05D5. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D8\u05E2\u05D5\u05DF \u05D0\u05EA \u05D4\u05D3\u05E3 \u05DE\u05D7\u05D3\u05E9." }), _jsx("pre", { lang: "en", dir: "ltr", children: failure }), _jsx("button", { onClick: () => location.reload(), children: "\u05D8\u05E2\u05D9\u05E0\u05D4 \u05DE\u05D7\u05D3\u05E9" })] }));
    }
    if (profiles === undefined || pack === undefined)
        return _jsx("p", { class: "muted", children: "\u05D8\u05D5\u05E2\u05DF\u2026" });
    const restoreSection = (_jsxs("section", { children: [_jsx("h2", { children: "\u05D9\u05E9 \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9?" }), _jsx(RestoreFromFile, { profiles: profiles, onRestored: restored })] }));
    if (route.name === "new-profile" || profiles.length === 0) {
        const canCancel = profiles.length > 0;
        return (_jsxs(_Fragment, { children: [canCancel && _jsx(TopBar, { title: "\u05D4\u05D5\u05E1\u05E4\u05EA \u05DC\u05D5\u05DE\u05D3", back: "#/profiles" }), _jsx(NewProfile, { canCancel: canCancel, canChooseStart: pack.start !== undefined, onCreate: create, onCancel: () => go("#/profiles") }), restoreSection] }));
    }
    if (route.name === "credits")
        return _jsx(Credits, { pack: pack });
    if (route.name === "profiles" || profile === undefined) {
        return (_jsxs(_Fragment, { children: [profile !== undefined && _jsx(TopBar, { title: "\u05D4\u05D7\u05DC\u05E4\u05EA \u05DC\u05D5\u05DE\u05D3", back: "#/menu" }), _jsx(ProfilePicker, { profiles: profiles, onPick: choose, onAdd: () => go("#/new-profile") }), restoreSection] }));
    }
    if (route.name === "menu")
        return _jsx(MenuScreen, { version: buildVersion(), built: buildDate() });
    const updated = (changed) => setProfiles((all) => all?.map((candidate) => (candidate.id === changed.id ? changed : candidate)));
    if (route.name === "settings")
        return _jsx(SettingsScreen, { profile: profile, canChooseStart: pack.start !== undefined, onChange: updated });
    if (route.name === "reports")
        return _jsx(ReportsScreen, { profileId: profile.id });
    if (route.name === "backup") {
        return _jsx(BackupScreen, { profile: profile, profiles: profiles, onBackedUp: updated, onRestored: restored, onDeleted: deleted });
    }
    if (progress === undefined)
        return _jsx("p", { class: "muted", children: "\u05D8\u05D5\u05E2\u05DF\u2026" });
    if (finished !== undefined) {
        return (_jsx(Summary, { changes: finished, goal: profile.dailyGoal, onDone: () => {
                setFinished(undefined);
                go("#/");
            } }));
    }
    const deck = learnedPairs(contextFor(pack, profile), progress.cards.values());
    if (route.name === "speed-match") {
        if (deck.length < MIN_WORDS) {
            go("#/");
            return null;
        }
        return (_jsx(SpeedMatchScreen, { deck: deck, best: profile.bestMatch ?? 0, onSave: (score) => {
                if (score === 0)
                    return Promise.resolve(0);
                const now = Date.now();
                const changes = applySitting({
                    profileId: profile.id,
                    courseId: pack.id,
                    streak: profile.streak,
                    enrollment: progress.enrollment,
                    stat: progress.today,
                    cards: progress.cards,
                    grades: {},
                    firstTryRight: scoredPairs(score),
                    now,
                });
                return saveSitting({ ...profile, bestMatch: Math.max(score, profile.bestMatch ?? 0) }, changes, {}, now)
                    .then(refresh)
                    .then(() => changes.xp);
            }, onExit: () => go("#/") }));
    }
    if (route.name === "lesson" || route.name === "review") {
        return (_jsx(Sitting, { pack: pack, profile: profile, progress: progress, ...(route.name === "lesson" && { lessonId: route.id }), onSaved: (updated, changes) => {
                setFinished(changes);
                refresh(updated).catch(fail);
            } }, route.name === "lesson" ? route.id : "review"));
    }
    const now = Date.now();
    const completed = progress.enrollment.completedLessons;
    return (_jsx(Home, { pack: pack, profile: profile, completed: completed, start: profile.start ?? DEFAULT_START, xpToday: progress.today?.xp ?? 0, reviews: plannedReviews(pack, profile, progress, now), canPlay: deck.length >= MIN_WORDS, now: now }));
}
