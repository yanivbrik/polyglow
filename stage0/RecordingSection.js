import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { startRecording } from "../audio/recorder.js";
import { getValue, putValue } from "../storage/idb.js";
import { openStage0Database } from "./checks.js";
import { ManualCheck } from "./ManualCheck.js";
const LAST = "last";
export function RecordingSection({ report }) {
    const [active, setActive] = useState();
    const [clip, setClip] = useState();
    const [previous, setPrevious] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        openStage0Database()
            .then(async (db) => {
            const saved = await getValue(db, "recordings", LAST);
            db.close();
            report("recordingRestored", saved === undefined ? "none saved" : "yes");
            if (saved !== undefined)
                setPrevious({ url: URL.createObjectURL(saved.blob), savedAt: saved.savedAt });
        })
            .catch((e) => report("recordingRestored", `failed: ${String(e)}`));
    }, [report]);
    const start = async () => {
        setError(undefined);
        try {
            setActive(await startRecording());
        }
        catch (e) {
            setError(e instanceof DOMException ? e.name : String(e));
            report("recordingType", `no microphone: ${e instanceof DOMException ? e.name : String(e)}`);
        }
    };
    const stop = async () => {
        if (active === undefined)
            return;
        setActive(undefined);
        const blob = await active.stop();
        setClip({ url: URL.createObjectURL(blob), type: blob.type, bytes: blob.size });
        report("recordingType", blob.type || "unknown");
        report("recordingBytes", String(blob.size));
        try {
            const db = await openStage0Database();
            await putValue(db, "recordings", LAST, { blob, savedAt: Date.now() });
            db.close();
            report("recordingSaved", "ok");
        }
        catch (e) {
            report("recordingSaved", `failed: ${String(e)}`);
        }
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D4\u05E7\u05DC\u05D8\u05D4 \u05DE\u05D4\u05DE\u05D9\u05E7\u05E8\u05D5\u05E4\u05D5\u05DF" }), _jsx("p", { children: "\u05DC\u05D4\u05E7\u05DC\u05D9\u05D8 \u05DE\u05E9\u05E4\u05D8 \u05E7\u05E6\u05E8 \u05D1\u05E7\u05D5\u05DC, \u05DC\u05E2\u05E6\u05D5\u05E8 \u05D5\u05DC\u05D4\u05E9\u05DE\u05D9\u05E2. \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4 \u05E0\u05E9\u05DE\u05E8\u05EA \u05D1\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D1\u05DC\u05D1\u05D3." }), _jsxs("div", { class: "row", children: [active === undefined ? _jsx("button", { onClick: start, children: "\u05D4\u05E7\u05DC\u05D8\u05D4" }) : _jsx("button", { onClick: stop, children: "\u05E2\u05E6\u05D9\u05E8\u05D4" }), active !== undefined && _jsx("span", { children: "\u05DE\u05E7\u05DC\u05D9\u05D8\u2026" })] }), error !== undefined && (_jsxs("p", { class: "bad", children: ["\u05D0\u05D9\u05DF \u05D2\u05D9\u05E9\u05D4 \u05DC\u05DE\u05D9\u05E7\u05E8\u05D5\u05E4\u05D5\u05DF: ", _jsx("span", { lang: "en", dir: "ltr", children: error })] })), clip !== undefined && (_jsxs("div", { children: [_jsx("audio", { controls: true, src: clip.url }), _jsxs("p", { class: "muted", children: ["\u05E4\u05D5\u05E8\u05DE\u05D8: ", _jsx("span", { lang: "en", dir: "ltr", children: clip.type || "unknown" }), ", ", Math.round(clip.bytes / 1000), " \u05E7\"\u05D1"] })] })), previous !== undefined && (_jsxs("div", { children: [_jsxs("p", { children: ["\u05D4\u05D4\u05E7\u05DC\u05D8\u05D4 \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D4 \u05E9\u05E0\u05E9\u05DE\u05E8\u05D4, \u05DE-", new Date(previous.savedAt).toLocaleString("he-IL"), ":"] }), _jsx("audio", { controls: true, src: previous.url })] })), _jsx("p", { class: "muted", children: "\u05D0\u05D7\u05E8\u05D9 \u05D8\u05E2\u05D9\u05E0\u05D4 \u05DE\u05D7\u05D3\u05E9 \u05E9\u05DC \u05D4\u05D3\u05E3, \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4 \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D4 \u05D0\u05DE\u05D5\u05E8\u05D4 \u05DC\u05D4\u05D5\u05E4\u05D9\u05E2 \u05DB\u05D0\u05DF." }), _jsx(ManualCheck, { id: "recordingHeard", label: "\u05E9\u05DE\u05E2\u05EA\u05D9 \u05D0\u05EA \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4 \u05E9\u05DC\u05D9 \u05D1\u05D1\u05D9\u05E8\u05D5\u05E8", report: report })] }));
}
