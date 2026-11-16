import { jsx as _jsx, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../../vendor/preact-hooks.js";
import { playInTurn, stopClip } from "../../audio/player.js";
import { AudioButtons } from "../../ui/AudioButtons.js";
import { TargetText } from "../../ui/TargetText.js";
import { Feedback } from "./Feedback.js";
const INSTRUCTIONS = {
    meaning: "מה הפירוש?",
    word: "איך אומרים את זה?",
    listen: "מה שמעת?",
    blank: "מה חסר במשפט?",
    understand: "מה הבנת מהשיחה?",
};
export function ChoiceView({ step, address, onDone }) {
    const [picked, setPicked] = useState();
    const answered = picked !== undefined;
    const isRight = picked === step.correct;
    const isBlank = step.mode === "blank";
    const shown = answered && step.reveal !== undefined ? step.reveal : step.prompt;
    const audio = isBlank && !answered ? undefined : step.audio;
    const { replay } = step;
    useEffect(() => stopClip, []);
    const finish = () => {
        onDone(isRight ? { right: [step.subject], almost: [], wrong: [] } : { right: [], almost: [], wrong: [step.subject] });
    };
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: INSTRUCTIONS[step.mode] }), _jsxs("div", { class: "prompt", children: [step.hint !== undefined && _jsx(TargetText, { block: true, value: step.hint, class: "muted" }), shown !== undefined && _jsx(TargetText, { block: true, value: shown, class: isBlank || step.mode === "understand" ? "prompt-line" : "word" }), audio !== undefined && _jsx(AudioButtons, { clip: audio, autoPlay: true, large: step.prompt === undefined }), replay !== undefined && (_jsxs("button", { type: "button", class: "secondary", onClick: () => playInTurn(replay), children: [_jsx("span", { "aria-hidden": "true", children: "\uD83D\uDD0A" }), " \u05DC\u05D4\u05E7\u05E9\u05D9\u05D1 \u05E9\u05D5\u05D1 \u05DC\u05E9\u05D9\u05D7\u05D4"] }))] }), _jsx("div", { class: "options", children: step.options.map((option, index) => {
                    const state = !answered ? "" : index === step.correct ? "right" : index === picked ? "wrong" : "dim";
                    return (_jsx("button", { class: `option ${state}`, disabled: answered, onClick: () => setPicked(index), children: _jsx(TargetText, { value: option }) }, option.text));
                }) }), answered && _jsx(Feedback, { outcome: isRight ? "right" : "wrong", address: address, onContinue: finish })] }));
}
