import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../vendor/preact-jsx-runtime.js";
import { useRef, useState } from "../vendor/preact-hooks.js";
import { replaceProfileData } from "../storage/store.js";
import { deviceIsNewer, parseBackup, shownDate } from "./backup.js";
const PROBLEMS = {
    "not-a-backup": "הקובץ הזה הוא לא גיבוי של האפליקציה.",
    "newer-version": "הגיבוי נוצר בגרסה חדשה יותר של האפליקציה. צריך קודם לעדכן אותה.",
    damaged: "הקובץ פגום, ולכן שום דבר לא השתנה.",
};
const lastLearned = (profile) => (profile.streak.lastActive === undefined ? "עדיין לא" : shownDate(profile.streak.lastActive));
export function RestoreFromFile({ profiles, onRestored }) {
    const [pending, setPending] = useState();
    const [problem, setProblem] = useState();
    const [busy, setBusy] = useState(false);
    const input = useRef(null);
    const restore = (backup) => {
        setBusy(true);
        replaceProfileData(backup)
            .then(() => onRestored(backup.profile))
            .catch((error) => {
            console.error(error);
            setPending(undefined);
            setBusy(false);
            setProblem("השחזור לא הצליח, ושום דבר לא השתנה.");
        });
    };
    const onFile = async (event) => {
        const file = event.currentTarget.files?.[0];
        if (input.current !== null)
            input.current.value = "";
        if (file === undefined)
            return;
        setProblem(undefined);
        const parsed = parseBackup(await file.text());
        if (!parsed.ok) {
            setProblem(PROBLEMS[parsed.problem]);
            return;
        }
        if (profiles.some((profile) => profile.id === parsed.backup.profile.id))
            setPending(parsed.backup);
        else
            restore(parsed.backup);
    };
    const onDevice = pending === undefined ? undefined : profiles.find((profile) => profile.id === pending.profile.id);
    if (pending !== undefined && onDevice !== undefined) {
        return (_jsxs("div", { class: "restore-confirm", children: [_jsxs("p", { children: ["\u05D1\u05DE\u05DB\u05E9\u05D9\u05E8 \u05DB\u05D1\u05E8 \u05D9\u05E9 \u05DC\u05D5\u05DE\u05D3 \u05D1\u05E9\u05DD ", _jsx("bdi", { dir: "auto", children: onDevice.name }), ". \u05D4\u05E9\u05D7\u05D6\u05D5\u05E8 \u05D9\u05D7\u05DC\u05D9\u05E3 \u05D0\u05EA \u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05E9\u05DC\u05D5 \u05D1\u05D6\u05D5 \u05E9\u05D1\u05E7\u05D5\u05D1\u05E5."] }), _jsxs("dl", { class: "status", children: [_jsx("dt", { children: "\u05DC\u05DE\u05D9\u05D3\u05D4 \u05D0\u05D7\u05E8\u05D5\u05E0\u05D4 \u05D1\u05DE\u05DB\u05E9\u05D9\u05E8" }), _jsx("dd", { children: lastLearned(onDevice) }), _jsx("dt", { children: "\u05DC\u05DE\u05D9\u05D3\u05D4 \u05D0\u05D7\u05E8\u05D5\u05E0\u05D4 \u05D1\u05E7\u05D5\u05D1\u05E5" }), _jsx("dd", { children: lastLearned(pending.profile) })] }), deviceIsNewer(onDevice, pending.profile) && _jsx("p", { class: "bad", children: "\u05D1\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D9\u05E9 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D7\u05D3\u05E9\u05D4 \u05D9\u05D5\u05EA\u05E8 \u05DE\u05D4\u05E7\u05D5\u05D1\u05E5, \u05D5\u05D4\u05D9\u05D0 \u05EA\u05D9\u05DE\u05D7\u05E7." }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { class: "danger", disabled: busy, onClick: () => restore(pending), children: "\u05DC\u05D4\u05D7\u05DC\u05D9\u05E3" }), _jsx("button", { class: "secondary", disabled: busy, onClick: () => setPending(undefined), children: "\u05D1\u05D9\u05D8\u05D5\u05DC" })] })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx("input", { ref: input, class: "file-input", type: "file", accept: ".json,application/json", onChange: onFile, "aria-label": "\u05D1\u05D7\u05D9\u05E8\u05EA \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9" }), _jsx("div", { class: "step-actions", children: _jsx("button", { class: "secondary", disabled: busy, onClick: () => input.current?.click(), children: "\u05D1\u05D7\u05D9\u05E8\u05EA \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9" }) }), problem !== undefined && (_jsx("p", { class: "bad", role: "alert", children: problem }))] }));
}
