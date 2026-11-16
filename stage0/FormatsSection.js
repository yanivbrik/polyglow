import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { ManualCheck } from "./ManualCheck.js";
const FORMATS = {
    wav: { label: "WAV", type: "audio/wav" },
    mp3: { label: "MP3", type: "audio/mpeg" },
    m4a: { label: "AAC (M4A)", type: 'audio/mp4; codecs="mp4a.40.2"' },
    webm: { label: "Opus (WebM)", type: 'audio/webm; codecs="opus"' },
    ogg: { label: "Opus (Ogg)", type: 'audio/ogg; codecs="opus"' },
    caf: { label: "Opus (CAF)", type: 'audio/x-caf; codecs="opus"' },
};
const SUPPORT_LABEL = { probably: "כן", maybe: "כנראה", "": "לא" };
let audioContext;
async function decode(url) {
    try {
        const Context = window.AudioContext ?? window.webkitAudioContext;
        if (Context === undefined)
            return "no web audio";
        audioContext ??= new Context();
        const buffer = await audioContext.decodeAudioData(await (await fetch(url)).arrayBuffer());
        return `ok ${buffer.duration.toFixed(1)}s`;
    }
    catch (e) {
        return `failed ${e instanceof DOMException ? e.name : String(e)}`;
    }
}
function extension(file) {
    return file.slice(file.lastIndexOf(".") + 1).toLowerCase();
}
export function FormatsSection({ report }) {
    const [files, setFiles] = useState();
    const [results, setResults] = useState({});
    const update = (file, change) => {
        setResults((all) => ({ ...all, [file]: { ...(all[file] ?? { canPlay: "" }), ...change } }));
    };
    useEffect(() => {
        for (const [file, result] of Object.entries(results)) {
            report(`format.${extension(file)}`, `canPlay=${result.canPlay || "no"} decode=${result.decoded ?? "pending"} play=${result.played ?? "not tried"}`);
        }
    }, [results, report]);
    useEffect(() => {
        const probe = document.createElement("audio");
        fetch("samples/index.json")
            .then((response) => response.json())
            .then((list) => {
            const known = list.filter((file) => FORMATS[extension(file)] !== undefined);
            setFiles(known);
            for (const file of known) {
                update(file, { canPlay: probe.canPlayType(FORMATS[extension(file)].type) });
                void decode(`samples/${file}`).then((decoded) => update(file, { decoded }));
            }
        })
            .catch(() => setFiles([]));
    }, []);
    const play = (file) => {
        const audio = new Audio(`samples/${file}`);
        audio.addEventListener("error", () => update(file, { played: "error" }), { once: true });
        audio.addEventListener("ended", () => update(file, { played: "ok" }), { once: true });
        audio.play().catch((e) => update(file, { played: `failed ${e instanceof DOMException ? e.name : String(e)}` }));
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05E4\u05D5\u05E8\u05DE\u05D8\u05D9\u05DD \u05E9\u05DC \u05E9\u05DE\u05E2" }), _jsx("p", { children: "\u05DB\u05DC \u05E9\u05D5\u05E8\u05D4 \u05D4\u05D9\u05D0 \u05D0\u05D5\u05EA\u05D5 \u05DE\u05E9\u05E4\u05D8 \u05D1\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA \u05D1\u05E4\u05D5\u05E8\u05DE\u05D8 \u05D0\u05D7\u05E8. \u05DC\u05DC\u05D7\u05D5\u05E5 \u05E2\u05DC \u05D4\u05E9\u05DE\u05E2\u05D4 \u05D1\u05DB\u05DC \u05E9\u05D5\u05E8\u05D4, \u05D5\u05DC\u05E1\u05DE\u05DF \u05DB\u05DC \u05E4\u05D5\u05E8\u05DE\u05D8 \u05E9\u05E0\u05E9\u05DE\u05E2 \u05D8\u05D5\u05D1." }), files === undefined && _jsx("p", { class: "muted", children: "\u05D8\u05D5\u05E2\u05DF\u2026" }), files?.map((file) => {
                const format = FORMATS[extension(file)];
                const result = results[file];
                return (_jsxs("div", { class: "card", children: [_jsxs("div", { class: "row", children: [_jsx("strong", { lang: "en", dir: "ltr", children: format.label }), _jsxs("span", { class: "muted", children: ["\u05D4\u05D3\u05E4\u05D3\u05E4\u05DF: ", SUPPORT_LABEL[result?.canPlay ?? ""] ?? result?.canPlay, ", \u05E4\u05E2\u05E0\u05D5\u05D7:", " ", result?.decoded === undefined ? "בודק…" : result.decoded.startsWith("ok") ? "תקין" : "נכשל", result?.played === "error" || result?.played?.startsWith("failed") ? ", לא התנגן" : ""] }), _jsx("button", { class: "secondary", onClick: () => play(file), children: "\u05D4\u05E9\u05DE\u05E2\u05D4" })] }), _jsx(ManualCheck, { id: `heard.${extension(file)}`, label: "\u05E0\u05E9\u05DE\u05E2 \u05D8\u05D5\u05D1", report: report })] }, file));
            })] }));
}
