import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { localDate } from "../game/progress.js";
import { deleteProfileData, readProfileData, replaceProfileData, saveProfile } from "../storage/store.js";
import { TopBar } from "../ui/TopBar.js";
import { backupFileName, serializeBackup, shownDate } from "./backup.js";
import { withoutProgress } from "./profile.js";
import { RestoreFromFile } from "./RestoreFromFile.js";
import { saveJsonFile } from "./save-file.js";
export function BackupScreen({ profile, profiles, onBackedUp, onRestored, onDeleted }) {
    const [prepared, setPrepared] = useState();
    const [saved, setSaved] = useState(false);
    const [failed, setFailed] = useState(false);
    const [confirming, setConfirming] = useState();
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        const at = Date.now();
        readProfileData(profile)
            .then((data) => setPrepared({ at, name: backupFileName(profile, localDate(at)), text: serializeBackup(data, at), reports: data.reports.length }))
            .catch((error) => {
            console.error(error);
            setFailed(true);
        });
    }, [profile.id]);
    const failedTo = (error) => {
        console.error(error);
        setBusy(false);
        setConfirming(undefined);
        setFailed(true);
    };
    const reset = () => {
        setBusy(true);
        const cleared = withoutProgress(profile);
        readProfileData(profile)
            .then(({ reports }) => replaceProfileData({ profile: cleared, enrollments: [], cards: [], stats: [], log: [], reports }))
            .then(() => onRestored(cleared))
            .catch(failedTo);
    };
    const remove = () => {
        setBusy(true);
        deleteProfileData(profile.id)
            .then(() => onDeleted(profile))
            .catch(failedTo);
    };
    const save = () => {
        if (prepared === undefined)
            return;
        saveJsonFile(prepared.name, prepared.text)
            .then((result) => {
            if (result === "cancelled")
                return undefined;
            const updated = { ...profile, lastBackupAt: prepared.at };
            return saveProfile(updated).then(() => {
                setSaved(true);
                onBackedUp(updated);
            });
        })
            .catch((error) => {
            console.error(error);
            setFailed(true);
        });
    };
    const cancel = (_jsx("button", { class: "secondary", disabled: busy, onClick: () => setConfirming(undefined), children: "\u05D1\u05D9\u05D8\u05D5\u05DC" }));
    return (_jsxs(_Fragment, { children: [_jsx(TopBar, { title: "\u05D2\u05D9\u05D1\u05D5\u05D9, \u05D0\u05D9\u05E4\u05D5\u05E1 \u05D5\u05DE\u05D7\u05D9\u05E7\u05D4", back: "#/menu" }), _jsxs("section", { children: [_jsx("h2", { children: "\u05D2\u05D9\u05D1\u05D5\u05D9" }), _jsxs("p", { children: ["\u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05E9\u05DC ", _jsx("bdi", { dir: "auto", children: profile.name }), " \u05E9\u05DE\u05D5\u05E8\u05D4 \u05E8\u05E7 \u05D1\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D4\u05D6\u05D4. \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9 \u05DE\u05D7\u05D6\u05D9\u05E8 \u05D0\u05D5\u05EA\u05D4 \u05D0\u05DD \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05E0\u05DE\u05D7\u05E7\u05D5, \u05D5\u05DE\u05E2\u05D1\u05D9\u05E8 \u05D0\u05D5\u05EA\u05D4 \u05DC\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D0\u05D7\u05E8."] }), _jsx("p", { class: "muted", children: profile.lastBackupAt === undefined ? "עוד לא נעשה גיבוי." : `הגיבוי האחרון: ${shownDate(localDate(profile.lastBackupAt))}` }), _jsx("div", { class: "step-actions", children: _jsx("button", { disabled: prepared === undefined, onClick: save, children: "\u05E9\u05DE\u05D9\u05E8\u05EA \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9" }) }), saved && (_jsx("p", { class: "ok", role: "status", children: "\u05D4\u05E7\u05D5\u05D1\u05E5 \u05E0\u05E9\u05DE\u05E8. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05E2\u05D5\u05EA\u05E7 \u05D2\u05DD \u05DE\u05D7\u05D5\u05E5 \u05DC\u05DE\u05DB\u05E9\u05D9\u05E8, \u05DC\u05DE\u05E9\u05DC \u05D1\u05D4\u05D5\u05D3\u05E2\u05D4 \u05DC\u05E2\u05E6\u05DE\u05DA." })), failed && (_jsx("p", { class: "bad", role: "alert", children: "\u05D4\u05E4\u05E2\u05D5\u05DC\u05D4 \u05DC\u05D0 \u05D4\u05E6\u05DC\u05D9\u05D7\u05D4, \u05D5\u05E9\u05D5\u05DD \u05D3\u05D1\u05E8 \u05DC\u05D0 \u05E0\u05DE\u05D7\u05E7. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D8\u05E2\u05D5\u05DF \u05D0\u05EA \u05D4\u05D3\u05E3 \u05DE\u05D7\u05D3\u05E9 \u05D5\u05DC\u05E0\u05E1\u05D5\u05EA \u05E9\u05D5\u05D1." }))] }), _jsxs("section", { children: [_jsx("h2", { children: "\u05E9\u05D7\u05D6\u05D5\u05E8" }), _jsx("p", { children: "\u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9 \u05DE\u05D7\u05D6\u05D9\u05E8 \u05DC\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D4\u05D6\u05D4 \u05D0\u05EA \u05D4\u05DC\u05D5\u05DE\u05D3 \u05E9\u05D1\u05E7\u05D5\u05D1\u05E5, \u05E2\u05DD \u05DB\u05DC \u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05E9\u05DC\u05D5." }), _jsx(RestoreFromFile, { profiles: profiles, onRestored: onRestored })] }), _jsxs("section", { children: [_jsx("h2", { children: "\u05D0\u05D9\u05E4\u05D5\u05E1" }), _jsxs("p", { children: ["\u05DE\u05D5\u05D7\u05E7 \u05D0\u05EA \u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05E9\u05DC ", _jsx("bdi", { dir: "auto", children: profile.name }), ": \u05E9\u05D9\u05E2\u05D5\u05E8\u05D9\u05DD, \u05D7\u05D6\u05E8\u05D5\u05EA, \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA, \u05E8\u05E6\u05E3 \u05D5\u05E9\u05D9\u05D0. \u05D4\u05E9\u05DD \u05D5\u05D4\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05E0\u05E9\u05D0\u05E8\u05D9\u05DD."] }), confirming === "reset" ? (_jsxs(_Fragment, { children: [_jsx("p", { class: "bad", children: "\u05D0\u05D9 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D1\u05D8\u05DC \u05D0\u05EA \u05D6\u05D4. \u05D0\u05DD \u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D7\u05E9\u05D5\u05D1\u05D4, \u05DB\u05D3\u05D0\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05E7\u05D5\u05D3\u05DD \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9." }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { class: "danger", disabled: busy, onClick: reset, children: "\u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA" }), cancel] })] })) : (_jsx("div", { class: "step-actions", children: _jsx("button", { class: "secondary", disabled: busy, onClick: () => setConfirming("reset"), children: "\u05D0\u05D9\u05E4\u05D5\u05E1 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA" }) }))] }), _jsxs("section", { children: [_jsx("h2", { children: "\u05DE\u05D7\u05D9\u05E7\u05EA \u05D4\u05DC\u05D5\u05DE\u05D3" }), _jsxs("p", { children: ["\u05DE\u05D5\u05D7\u05E7 \u05D0\u05EA ", _jsx("bdi", { dir: "auto", children: profile.name }), " \u05DE\u05D4\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D4\u05D6\u05D4, \u05E2\u05DD \u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D5\u05D4\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA. \u05D0\u05D7\u05E8 \u05DB\u05DA \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D9\u05E6\u05D5\u05E8 \u05DC\u05D5\u05DE\u05D3 \u05D7\u05D3\u05E9 \u05D5\u05DC\u05D1\u05D7\u05D5\u05E8 \u05DE\u05D0\u05D9\u05E4\u05D4 \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC."] }), confirming === "delete" ? (_jsxs(_Fragment, { children: [_jsx("p", { class: "bad", children: "\u05D0\u05D9 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D1\u05D8\u05DC \u05D0\u05EA \u05D6\u05D4. \u05D0\u05DD \u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D7\u05E9\u05D5\u05D1\u05D4, \u05DB\u05D3\u05D0\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05E7\u05D5\u05D3\u05DD \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9." }), prepared !== undefined && prepared.reports > 0 && (_jsx("p", { class: "bad", children: prepared.reports === 1
                                    ? "דיווח אחד על טעות יימחק גם הוא. כדאי להעביר אותו קודם, במסך הדיווחים."
                                    : `${prepared.reports} דיווחים על טעויות יימחקו גם הם. כדאי להעביר אותם קודם, במסך הדיווחים.` })), _jsxs("div", { class: "step-actions", children: [_jsxs("button", { class: "danger", disabled: busy, onClick: remove, children: ["\u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA ", _jsx("bdi", { dir: "auto", children: profile.name })] }), cancel] })] })) : (_jsx("div", { class: "step-actions", children: _jsx("button", { class: "secondary", disabled: busy, onClick: () => setConfirming("delete"), children: "\u05DE\u05D7\u05D9\u05E7\u05EA \u05D4\u05DC\u05D5\u05DE\u05D3" }) }))] })] }));
}
