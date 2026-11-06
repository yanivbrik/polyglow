import { jsx as _jsx, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../../vendor/preact-hooks.js";
import { playClip, stopClip } from "../../audio/player.js";
import { say } from "../../ui/say.js";
import { TargetText } from "../../ui/TargetText.js";
import { Bubble } from "./ConversationView.js";
import { Feedback } from "./Feedback.js";
export function ReplyView({ step, address, onDone }) {
    const [picked, setPicked] = useState();
    const answered = picked !== undefined;
    const isRight = picked === step.correct;
    const last = step.before.at(-1);
    useEffect(() => {
        if (last?.audio !== undefined)
            playClip(last.audio);
        return stopClip;
    }, []);
    const pick = (index) => {
        setPicked(index);
        if (step.line.audio !== undefined)
            playClip(step.line.audio);
    };
    const finish = () => {
        onDone(isRight ? { right: [step.subject], almost: [], wrong: [] } : { right: [], almost: [], wrong: [step.subject] });
    };
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: say(address, `עכשיו אתה במקום ${step.speaker}. מה תענה?`, `עכשיו את במקום ${step.speaker}. מה תעני?`) }), _jsxs("div", { class: "conversation", children: [step.before.map((line, index) => (_jsx(Bubble, { line: line, showText: answered || !step.heardOnly || line !== last, showMeaning: false }, index))), answered && _jsx(Bubble, { line: step.line, showText: true, showMeaning: true })] }), _jsx("div", { class: "options", children: step.options.map((option, index) => {
                    const state = !answered ? "" : index === step.correct ? "right" : index === picked ? "wrong" : "dim";
                    return (_jsx("button", { class: `option ${state}`, disabled: answered, onClick: () => pick(index), children: _jsx(TargetText, { value: option }) }, option.text));
                }) }), answered && _jsx(Feedback, { outcome: isRight ? "right" : "wrong", address: address, onContinue: finish })] }));
}
