import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { loadAnswer, saveAnswer } from "./saved.js";
export function ManualCheck({ id, label, report }) {
    const [checked, setChecked] = useState(() => loadAnswer(id) === "yes");
    useEffect(() => {
        saveAnswer(id, checked ? "yes" : "no");
        report(`manual.${id}`, checked ? "yes" : "no");
    }, [id, checked, report]);
    return (_jsxs("label", { class: "check", children: [_jsx("input", { type: "checkbox", checked: checked, onChange: (event) => setChecked(event.currentTarget.checked) }), _jsx("span", { children: label })] }));
}
