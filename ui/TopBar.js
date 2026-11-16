import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
export function TopBar({ title, back }) {
    return (_jsxs("header", { class: "top-bar", children: [_jsx("a", { class: "icon-link", href: back, "aria-label": "\u05D7\u05D6\u05E8\u05D4", children: "\u2192" }), _jsx("h1", { children: title })] }));
}
