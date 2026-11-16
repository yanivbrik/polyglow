import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useRef, useState } from "../vendor/preact-hooks.js";
import { TargetText } from "../ui/TargetText.js";
import { loadAnswer, saveAnswer } from "./saved.js";
const ACCENTS = { US: "מבטא אמריקאי", GB: "מבטא בריטי" };
const FAVORITE = "voiceFavorite";
export function VoiceSamplesSection({ report }) {
    const [index, setIndex] = useState();
    const [favorite, setFavorite] = useState(() => loadAnswer(FAVORITE));
    const player = useRef();
    useEffect(() => {
        fetch("voices/index.json")
            .then((response) => response.json())
            .then(setIndex)
            .catch(() => undefined);
    }, []);
    useEffect(() => {
        saveAnswer(FAVORITE, favorite ?? "");
        report(FAVORITE, favorite || "none");
    }, [favorite, report]);
    if (index === undefined || index.voices.length === 0)
        return null;
    const play = (file) => {
        player.current?.pause();
        player.current = new Audio(`voices/${file}`);
        void player.current.play().catch(() => undefined);
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D3\u05D5\u05D2\u05DE\u05D0\u05D5\u05EA \u05D4\u05E7\u05E8\u05D0\u05D4" }), _jsx("p", { children: "\u05D0\u05D5\u05EA\u05DD \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD \u05D1\u05E7\u05D5\u05DC\u05D5\u05EA \u05E9\u05D5\u05E0\u05D9\u05DD. \u05DC\u05DC\u05D7\u05D5\u05E5 \u05E2\u05DC \u05DE\u05E1\u05E4\u05E8 \u05DB\u05D3\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E2 \u05D0\u05EA \u05D4\u05DE\u05E9\u05E4\u05D8, \u05D5\u05DC\u05D1\u05D7\u05D5\u05E8 \u05D0\u05EA \u05D4\u05E7\u05D5\u05DC \u05E9\u05E0\u05E9\u05DE\u05E2 \u05D4\u05DB\u05D9 \u05D8\u05D1\u05E2\u05D9." }), _jsx("ol", { children: index.sentences.map((text) => (_jsx("li", { children: _jsx(TargetText, { block: true, value: { text, lang: index.lang, dir: index.dir } }) }, text))) }), index.voices.map((voice) => (_jsxs("div", { class: "card", children: [_jsxs("div", { class: "row", children: [_jsxs("strong", { lang: "en", dir: "ltr", children: [voice.engine, " \u00B7 ", voice.name] }), _jsx("span", { class: "muted", children: ACCENTS[voice.accent] ?? voice.accent })] }), _jsx("div", { class: "row", children: voice.files.map((file, number) => (_jsx("button", { class: "secondary", onClick: () => play(file), children: number + 1 }, file))) }), _jsxs("label", { class: "check", children: [_jsx("input", { type: "radio", name: "voice-favorite", checked: favorite === voice.id, onChange: () => setFavorite(voice.id) }), _jsx("span", { children: "\u05D4\u05E7\u05D5\u05DC \u05D4\u05DB\u05D9 \u05D8\u05D5\u05D1" })] }), _jsxs("p", { class: "muted", children: ["\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF: ", _jsx("span", { lang: "en", dir: "ltr", children: voice.license })] })] }, voice.id)))] }));
}
