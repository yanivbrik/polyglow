import { jsx as _jsx, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useEffect, useRef, useState } from "../../vendor/preact-hooks.js";
import { say } from "../../ui/say.js";
import { TargetText } from "../../ui/TargetText.js";
import { Toki } from "../../ui/Toki.js";
import { rightLine, wrongLine } from "../../ui/toki.js";
const MOOD = { right: "happy", marks: "happy", almost: "calm", order: "calm", wrong: "meh" };
export function Feedback({ outcome, expected, address, onContinue }) {
    const [line] = useState(() => (outcome === "wrong" ? wrongLine(address) : rightLine(address)));
    const button = useRef(null);
    useEffect(() => button.current?.focus(), []);
    const title = {
        right: line,
        marks: say(address, "נכון! שים לב לסימנים מעל האותיות.", "נכון! שימי לב לסימנים מעל האותיות."),
        almost: say(address, "כמעט! שים לב לאיות.", "כמעט! שימי לב לאיות."),
        order: "כמעט! מילה אחת לא במקום.",
        wrong: line,
    }[outcome];
    const good = outcome !== "wrong";
    return (_jsxs("div", { class: `feedback ${good ? "good" : "miss"}`, role: "status", children: [_jsxs("p", { class: "feedback-title", children: [_jsx(Toki, { mood: MOOD[outcome] }), " ", title] }), expected !== undefined && outcome !== "right" && (_jsxs("p", { class: "feedback-answer", children: [_jsx("span", { class: "muted", children: "\u05D4\u05EA\u05E9\u05D5\u05D1\u05D4: " }), _jsx(TargetText, { value: expected })] })), _jsx("button", { ref: button, onClick: onContinue, children: "\u05D4\u05DE\u05E9\u05DA" })] }));
}
