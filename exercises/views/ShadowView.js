import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../vendor/preact-jsx-runtime.js";
import { useEffect, useRef, useState } from "../../vendor/preact-hooks.js";
import { playInTurn, stopClip } from "../../audio/player.js";
import { startRecording } from "../../audio/recorder.js";
import { AudioButtons } from "../../ui/AudioButtons.js";
import { say } from "../../ui/say.js";
import { TargetText } from "../../ui/TargetText.js";
export function ShadowView({ step, address, quiet, onQuiet, onDone }) {
    const [active, setActive] = useState();
    const [mine, setMine] = useState();
    const [noMicrophone, setNoMicrophone] = useState(false);
    const urls = useRef([]);
    const finish = (good) => {
        onDone(good ? { right: [step.subject], almost: [], wrong: [] } : { right: [], almost: [step.subject], wrong: [] });
    };
    useEffect(() => {
        if (quiet)
            finish(false);
        return () => {
            for (const url of urls.current)
                URL.revokeObjectURL(url);
        };
    }, []);
    const record = async () => {
        stopClip();
        try {
            setActive(await startRecording());
        }
        catch (error) {
            console.error(error);
            setNoMicrophone(true);
        }
    };
    const stop = async () => {
        if (active === undefined)
            return;
        setActive(undefined);
        const url = URL.createObjectURL(await active.stop());
        urls.current.push(url);
        setMine(url);
        playInTurn([step.audio, url]);
    };
    if (quiet)
        return null;
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: say(address, "חזור אחרי הדובר", "חזרי אחרי הדובר") }), _jsxs("div", { class: "prompt", children: [_jsx(TargetText, { block: true, value: step.meaning, class: "muted" }), _jsx(TargetText, { block: true, value: step.text, class: "prompt-line" }), _jsx(AudioButtons, { clip: step.audio, autoPlay: true })] }), noMicrophone ? (_jsxs(_Fragment, { children: [_jsx("p", { children: "\u05D0\u05D9\u05DF \u05D2\u05D9\u05E9\u05D4 \u05DC\u05DE\u05D9\u05E7\u05E8\u05D5\u05E4\u05D5\u05DF. \u05D0\u05E4\u05E9\u05E8 \u05E4\u05E9\u05D5\u05D8 \u05DC\u05D7\u05D6\u05D5\u05E8 \u05E2\u05DC \u05D4\u05DE\u05E9\u05E4\u05D8 \u05D1\u05E7\u05D5\u05DC." }), _jsx("div", { class: "step-actions", children: _jsx("button", { onClick: () => finish(false), children: "\u05D4\u05DE\u05E9\u05DA" }) })] })) : active !== undefined ? (_jsx("div", { class: "step-actions", children: _jsx("button", { class: "danger", onClick: stop, children: "\u23F9\uFE0F \u05E2\u05E6\u05D9\u05E8\u05D4" }) })) : mine === undefined ? (_jsxs(_Fragment, { children: [_jsx("p", { class: "muted", children: "\u05DC\u05D4\u05E7\u05E9\u05D9\u05D1, \u05DC\u05DC\u05D7\u05D5\u05E5 \u05E2\u05DC \u05D4\u05E7\u05DC\u05D8\u05D4 \u05D5\u05DC\u05D5\u05DE\u05E8 \u05D0\u05EA \u05D4\u05DE\u05E9\u05E4\u05D8 \u05D1\u05E7\u05D5\u05DC. \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4 \u05DC\u05D0 \u05E0\u05E9\u05DE\u05E8\u05EA." }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { onClick: record, children: "\uD83C\uDF99\uFE0F \u05D4\u05E7\u05DC\u05D8\u05D4" }), _jsx("button", { class: "secondary", onClick: onQuiet, children: say(address, "לא יכול לדבר עכשיו", "לא יכולה לדבר עכשיו") })] })] })) : (_jsxs(_Fragment, { children: [_jsx("p", { class: "muted", children: "\u05E7\u05D5\u05D3\u05DD \u05D4\u05D3\u05D5\u05D1\u05E8, \u05D5\u05D0\u05D7\u05E8\u05D9\u05D5 \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4 \u05E9\u05DC\u05DA. \u05D0\u05D9\u05DA \u05D6\u05D4 \u05E0\u05E9\u05DE\u05E2?" }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { class: "secondary", onClick: () => playInTurn([step.audio, mine]), children: "\u05DC\u05D4\u05E9\u05DE\u05D9\u05E2 \u05E9\u05D5\u05D1" }), _jsx("button", { class: "secondary", onClick: record, children: "\u05D4\u05E7\u05DC\u05D8\u05D4 \u05D7\u05D3\u05E9\u05D4" })] }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { onClick: () => finish(true), children: "\u05E0\u05E9\u05DE\u05E2 \u05D3\u05D5\u05DE\u05D4" }), _jsx("button", { class: "secondary", onClick: () => finish(false), children: "\u05E6\u05E8\u05D9\u05DA \u05E2\u05D5\u05D3 \u05EA\u05E8\u05D2\u05D5\u05DC" })] })] }))] }));
}
