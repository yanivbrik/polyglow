import { jsx as _jsx, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useEffect } from "../../vendor/preact-hooks.js";
import { playClip } from "../../audio/player.js";
import { AudioButtons } from "../../ui/AudioButtons.js";
import { TargetText } from "../../ui/TargetText.js";
export function IntroView({ step, onDone }) {
    useEffect(() => {
        if (step.audio !== undefined)
            playClip(step.audio);
    }, [step.audio]);
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: "\u05DE\u05D9\u05DC\u05D4 \u05D7\u05D3\u05E9\u05D4" }), _jsxs("div", { class: "word-card", children: [step.emoji !== undefined && _jsx("div", { class: "emoji", "aria-hidden": "true", children: step.emoji }), _jsx(TargetText, { block: true, value: step.word, class: "word" }), step.translit !== undefined && _jsx("p", { class: "muted", children: step.translit }), _jsx(TargetText, { block: true, value: step.meaning, class: "meaning" }), step.audio !== undefined && _jsx(AudioButtons, { clip: step.audio })] }), step.example !== undefined && (_jsxs("div", { class: "example", children: [_jsx(TargetText, { block: true, value: step.example.text }), _jsx(TargetText, { block: true, value: step.example.meaning, class: "muted" }), step.example.audio !== undefined && _jsx(AudioButtons, { clip: step.example.audio })] })), step.mnemonic !== undefined && _jsx("p", { class: "tip-note", children: step.mnemonic }), _jsx("div", { class: "step-actions", children: _jsx("button", { onClick: onDone, children: "\u05D4\u05D1\u05E0\u05EA\u05D9" }) })] }));
}
