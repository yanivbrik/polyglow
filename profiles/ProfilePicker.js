import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
export function ProfilePicker({ profiles, onPick, onAdd }) {
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05DE\u05D9 \u05DC\u05D5\u05DE\u05D3 \u05E2\u05DB\u05E9\u05D9\u05D5?" }), _jsx("div", { class: "profile-list", children: profiles.map((profile) => (_jsxs("button", { class: "option profile", onClick: () => onPick(profile), children: [_jsx("span", { class: "avatar", "aria-hidden": "true", children: profile.avatar }), _jsx("span", { dir: "auto", children: profile.name })] }, profile.id))) }), _jsx("div", { class: "step-actions", children: _jsx("button", { class: "secondary", onClick: onAdd, children: "\u05D4\u05D5\u05E1\u05E4\u05EA \u05DC\u05D5\u05DE\u05D3" }) })] }));
}
