import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../vendor/preact-jsx-runtime.js";
import { useState } from "../vendor/preact-hooks.js";
import { DEFAULT_START } from "../course/path.js";
import { DEFAULT_FOCUS } from "../exercises/types.js";
import { GOAL_XP } from "../game/progress.js";
import { saveProfile } from "../storage/store.js";
import { chooseTheme, readTheme, THEMES } from "../ui/theme.js";
import { TopBar } from "../ui/TopBar.js";
import { FOCUSES, GOALS, STARTS } from "./choices.js";
export function SettingsScreen({ profile, canChooseStart, onChange }) {
    const [failed, setFailed] = useState(false);
    const [theme, setTheme] = useState(readTheme);
    const pickTheme = (choice) => {
        chooseTheme(choice);
        setTheme(choice);
    };
    const update = (change) => {
        const updated = { ...profile, ...change };
        saveProfile(updated)
            .then(() => onChange(updated))
            .catch((error) => {
            console.error(error);
            setFailed(true);
        });
    };
    const focus = profile.focus ?? DEFAULT_FOCUS;
    const start = profile.start ?? DEFAULT_START;
    return (_jsxs(_Fragment, { children: [_jsx(TopBar, { title: "\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA", back: "#/menu" }), canChooseStart && (_jsxs("section", { children: [_jsx("h2", { children: "\u05DE\u05D0\u05D9\u05E4\u05D4 \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC?" }), _jsx("p", { class: "muted", children: "\u05D4\u05E9\u05D9\u05E2\u05D5\u05E8\u05D9\u05DD \u05E9\u05DB\u05D1\u05E8 \u05D4\u05E1\u05EA\u05D9\u05D9\u05DE\u05D5 \u05E0\u05E9\u05D0\u05E8\u05D9\u05DD, \u05D5\u05D2\u05DD \u05D4\u05D7\u05D6\u05E8\u05D5\u05EA \u05E2\u05DC\u05D9\u05D4\u05DD." }), _jsx("div", { class: "options", children: STARTS.map((choice) => (_jsxs("button", { class: `option ${start === choice.id ? "selected" : ""}`, "aria-pressed": start === choice.id, onClick: () => update({ start: choice.id }), children: [choice.label, _jsxs("small", { class: "muted", children: [" \u00B7 ", choice.hint] })] }, choice.id))) })] })), _jsxs("section", { children: [_jsx("h2", { children: "\u05E2\u05DC \u05DE\u05D4 \u05DC\u05D4\u05EA\u05DE\u05E7\u05D3?" }), _jsx("p", { class: "muted", children: "\u05D0\u05E4\u05E9\u05E8 \u05DC\u05E9\u05E0\u05D5\u05EA \u05D1\u05DB\u05DC \u05E8\u05D2\u05E2. \u05D4\u05E9\u05D9\u05E0\u05D5\u05D9 \u05D7\u05DC \u05DE\u05D4\u05E9\u05D9\u05E2\u05D5\u05E8 \u05D4\u05D1\u05D0, \u05D5\u05D4\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05DC\u05D0 \u05E0\u05E4\u05D2\u05E2\u05EA." }), _jsx("div", { class: "options", children: FOCUSES.map((choice) => (_jsxs("button", { class: `option ${focus === choice.id ? "selected" : ""}`, "aria-pressed": focus === choice.id, onClick: () => update({ focus: choice.id }), children: [choice.label, _jsxs("small", { class: "muted", children: [" \u00B7 ", choice.hint] })] }, choice.id))) })] }), _jsxs("section", { children: [_jsx("h2", { children: "\u05D9\u05E2\u05D3 \u05D9\u05D5\u05DE\u05D9" }), _jsx("div", { class: "choices", children: GOALS.map((goal) => (_jsxs("button", { class: `option ${profile.dailyGoal === goal.id ? "selected" : ""}`, "aria-pressed": profile.dailyGoal === goal.id, onClick: () => update({ dailyGoal: goal.id }), children: [goal.label, _jsxs("small", { class: "muted", children: [" \u00B7 ", GOAL_XP[goal.id], " \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA"] })] }, goal.id))) }), failed && (_jsx("p", { class: "bad", role: "alert", children: "\u05D4\u05E9\u05D9\u05E0\u05D5\u05D9 \u05DC\u05D0 \u05E0\u05E9\u05DE\u05E8. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D8\u05E2\u05D5\u05DF \u05D0\u05EA \u05D4\u05D3\u05E3 \u05DE\u05D7\u05D3\u05E9 \u05D5\u05DC\u05E0\u05E1\u05D5\u05EA \u05E9\u05D5\u05D1." }))] }), _jsxs("section", { children: [_jsx("h2", { children: "\u05EA\u05E6\u05D5\u05D2\u05D4" }), _jsx("p", { class: "muted", children: "\u05D4\u05D1\u05D7\u05D9\u05E8\u05D4 \u05D7\u05DC\u05D4 \u05E2\u05DC \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D4\u05D6\u05D4." }), _jsx("div", { class: "choices", children: THEMES.map((choice) => (_jsx("button", { class: `option ${theme === choice.id ? "selected" : ""}`, "aria-pressed": theme === choice.id, onClick: () => pickTheme(choice.id), children: choice.label }, choice.id))) })] })] }));
}
