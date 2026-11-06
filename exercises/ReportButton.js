import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useState } from "../vendor/preact-hooks.js";
export function ReportButton({ onReport }) {
    const [phase, setPhase] = useState("closed");
    const [note, setNote] = useState("");
    const save = () => {
        onReport(note).then(() => setPhase("saved"), (error) => {
            console.error(error);
            setPhase("failed");
        });
    };
    if (phase === "closed") {
        return (_jsx("button", { class: "link-button", onClick: () => setPhase("writing"), children: "\u05E0\u05E8\u05D0\u05D4 \u05DC\u05D9 \u05E9\u05D9\u05E9 \u05E4\u05D4 \u05D8\u05E2\u05D5\u05EA" }));
    }
    if (phase === "saved")
        return _jsx("p", { class: "muted report-status", children: "\u05D4\u05D3\u05D9\u05D5\u05D5\u05D7 \u05E0\u05E9\u05DE\u05E8, \u05EA\u05D5\u05D3\u05D4. \u05D4\u05D5\u05D0 \u05DE\u05D7\u05DB\u05D4 \u05D1\u05DE\u05E1\u05DA \u05D4\u05D3\u05D9\u05D5\u05D5\u05D7\u05D9\u05DD." });
    if (phase === "failed")
        return _jsx("p", { class: "bad report-status", children: "\u05D4\u05D3\u05D9\u05D5\u05D5\u05D7 \u05DC\u05D0 \u05E0\u05E9\u05DE\u05E8." });
    return (_jsxs("div", { class: "report-form", children: [_jsxs("label", { class: "field", children: [_jsx("span", { children: "\u05DE\u05D4 \u05E0\u05E8\u05D0\u05D4 \u05DC\u05D0 \u05E0\u05DB\u05D5\u05DF? \u05D0\u05E4\u05E9\u05E8 \u05D2\u05DD \u05DC\u05D4\u05E9\u05D0\u05D9\u05E8 \u05E8\u05D9\u05E7." }), _jsx("textarea", { rows: 2, dir: "auto", value: note, onInput: (event) => setNote(event.currentTarget.value) })] }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { class: "secondary", onClick: save, children: "\u05E9\u05DE\u05D9\u05E8\u05EA \u05D4\u05D3\u05D9\u05D5\u05D5\u05D7" }), _jsx("button", { class: "link-button", onClick: () => setPhase("closed"), children: "\u05D1\u05D9\u05D8\u05D5\u05DC" })] })] }));
}
