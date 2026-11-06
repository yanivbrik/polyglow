import { jsx as _jsx, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { TargetText } from "../../ui/TargetText.js";
export function TipView({ step, onDone }) {
    return (_jsxs("div", { class: "step", children: [_jsxs("p", { class: "eyebrow", children: [_jsx("span", { "aria-hidden": "true", children: "\uD83E\uDD9C" }), " \u05D8\u05D9\u05E4 \u05E9\u05DC \u05D8\u05D5\u05E7\u05D9"] }), step.lines.map((line, index) => "say" in line ? (_jsx(TargetText, { block: true, value: line.say, class: "tip" }, index)) : (_jsxs("div", { class: "tip-example", children: [_jsx(TargetText, { block: true, value: line.target }), line.meaning !== undefined && _jsx(TargetText, { block: true, value: line.meaning, class: "tip-meaning" })] }, index))), _jsx("div", { class: "step-actions", children: _jsx("button", { onClick: onDone, children: "\u05D4\u05D1\u05E0\u05EA\u05D9" }) })] }));
}
