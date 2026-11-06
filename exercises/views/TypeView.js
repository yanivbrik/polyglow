import { jsx as _jsx, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useEffect, useRef, useState } from "../../vendor/preact-hooks.js";
import { AudioButtons } from "../../ui/AudioButtons.js";
import { say } from "../../ui/say.js";
import { TargetText } from "../../ui/TargetText.js";
import { checkTyped } from "../answers.js";
import { Feedback } from "./Feedback.js";
function outcomeOf(verdict) {
    if (verdict.result === "correct")
        return verdict.note === "marks" ? "marks" : "right";
    return verdict.result;
}
export function TypeView({ step, address, onDone }) {
    const [typed, setTyped] = useState("");
    const [verdict, setVerdict] = useState();
    const input = useRef(null);
    useEffect(() => input.current?.focus(), []);
    const check = (event) => {
        event.preventDefault();
        if (typed.trim() !== "")
            setVerdict(checkTyped(typed, step.accepted, step.rules));
    };
    const finish = () => {
        if (verdict === undefined)
            return;
        if (verdict.result === "correct")
            onDone({ right: [step.subject], almost: [], wrong: [] });
        else if (verdict.result === "almost")
            onDone({ right: [], almost: [step.subject], wrong: [] });
        else
            onDone({ right: [], almost: [], wrong: [step.subject] });
    };
    const instruction = step.mode === "dictation" ? say(address, "כתוב מה ששמעת", "כתבי מה ששמעת") : say(address, "תרגם", "תרגמי");
    const expected = verdict !== undefined && verdict.result !== "correct" ? verdict.expected : (step.accepted[0] ?? "");
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: instruction }), _jsxs("div", { class: "prompt", children: [step.prompt !== undefined && _jsx(TargetText, { block: true, value: step.prompt, class: "prompt-line" }), step.audio !== undefined && _jsx(AudioButtons, { clip: step.audio, autoPlay: true, large: step.mode === "dictation" })] }), _jsxs("form", { onSubmit: check, children: [_jsx("input", { ref: input, type: "text", class: "answer", lang: step.answer.lang, dir: step.answer.dir, value: typed, readOnly: verdict !== undefined, autocomplete: "off", autocapitalize: "off", spellcheck: false, "aria-label": instruction, onInput: (event) => setTyped(event.currentTarget.value) }), verdict === undefined && (_jsx("div", { class: "step-actions", children: _jsx("button", { type: "submit", disabled: typed.trim() === "", children: "\u05D1\u05D3\u05D9\u05E7\u05D4" }) }))] }), verdict !== undefined && _jsx(Feedback, { outcome: outcomeOf(verdict), expected: { text: expected, lang: step.answer.lang, dir: step.answer.dir }, address: address, onContinue: finish })] }));
}
