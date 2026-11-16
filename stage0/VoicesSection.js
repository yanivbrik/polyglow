import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { ManualCheck } from "./ManualCheck.js";
import { SAMPLE_SENTENCE } from "./bidi-data.js";
function byLanguage(voices, prefixes) {
    return voices
        .filter((voice) => prefixes.some((prefix) => voice.lang.toLowerCase().startsWith(prefix)))
        .sort((a, b) => Number(b.localService) - Number(a.localService) || a.name.localeCompare(b.name));
}
const summary = (voices) => `${voices.length} (local ${voices.filter((voice) => voice.localService).length})`;
export function VoicesSection({ report }) {
    const supported = "speechSynthesis" in window;
    const [voices, setVoices] = useState([]);
    const [chosen, setChosen] = useState();
    useEffect(() => {
        if (!supported) {
            report("voicesEn", "unsupported");
            return;
        }
        const load = () => setVoices(speechSynthesis.getVoices());
        load();
        speechSynthesis.addEventListener("voiceschanged", load);
        return () => speechSynthesis.removeEventListener("voiceschanged", load);
    }, [supported, report]);
    const english = byLanguage(voices, ["en"]);
    const hebrew = byLanguage(voices, ["he", "iw"]);
    useEffect(() => {
        if (!supported)
            return;
        report("voicesEn", summary(english));
        report("voicesHe", summary(hebrew));
    }, [supported, voices, report]);
    const speak = () => {
        const voice = english.find((v) => v.voiceURI === chosen) ?? english[0];
        if (voice === undefined)
            return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(SAMPLE_SENTENCE.text);
        utterance.voice = voice;
        utterance.lang = voice.lang;
        speechSynthesis.speak(utterance);
    };
    if (!supported) {
        return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D4\u05E7\u05D5\u05DC\u05D5\u05EA \u05E9\u05DC \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8" }), _jsx("p", { class: "bad", children: "\u05D4\u05D3\u05E4\u05D3\u05E4\u05DF \u05D4\u05D6\u05D4 \u05DC\u05D0 \u05D9\u05D5\u05D3\u05E2 \u05DC\u05D4\u05E7\u05E8\u05D9\u05D0 \u05D8\u05E7\u05E1\u05D8." })] }));
    }
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D4\u05E7\u05D5\u05DC\u05D5\u05EA \u05E9\u05DC \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8" }), _jsxs("p", { children: ["\u05E7\u05D5\u05DC\u05D5\u05EA \u05D1\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA: ", english.length, ", \u05DE\u05D4\u05DD ", english.filter((voice) => voice.localService).length, " \u05D1\u05DC\u05D9 \u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8. \u05E7\u05D5\u05DC\u05D5\u05EA \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA: ", hebrew.length, "."] }), _jsx("p", { class: "muted", children: "\u05E7\u05D5\u05DC \u05E9\u05DE\u05E1\u05D5\u05DE\u05DF \"\u05D3\u05E8\u05DA \u05D4\u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8\" \u05E9\u05D5\u05DC\u05D7 \u05D0\u05EA \u05D4\u05D8\u05E7\u05E1\u05D8 \u05DC\u05E9\u05E8\u05EA \u05D7\u05D9\u05E6\u05D5\u05E0\u05D9, \u05D5\u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4 \u05DC\u05D0 \u05EA\u05E9\u05EA\u05DE\u05E9 \u05D1\u05D5." }), english.length > 0 && (_jsxs("div", { class: "row", children: [_jsx("select", { value: chosen ?? english[0]?.voiceURI, onChange: (event) => setChosen(event.currentTarget.value), children: english.map((voice) => (_jsxs("option", { value: voice.voiceURI, children: [voice.name, " (", voice.lang, ")", voice.localService ? "" : " · דרך האינטרנט"] }, voice.voiceURI))) }), _jsx("button", { class: "secondary", onClick: speak, children: "\u05D4\u05E9\u05DE\u05E2\u05D4" })] })), _jsx(ManualCheck, { id: "voiceUsable", label: "\u05D9\u05E9 \u05DC\u05E4\u05D7\u05D5\u05EA \u05E7\u05D5\u05DC \u05D0\u05D7\u05D3 \u05D1\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA, \u05D1\u05DC\u05D9 \u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8, \u05E9\u05E0\u05E9\u05DE\u05E2 \u05E1\u05D1\u05D9\u05E8", report: report })] }));
}
