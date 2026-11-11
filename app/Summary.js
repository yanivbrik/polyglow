import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useRef } from "../vendor/preact-hooks.js";
import { GOAL_XP } from "../game/progress.js";
import { celebrate } from "../ui/confetti.js";
import { Toki } from "../ui/Toki.js";
export function Summary({ changes, goal, onDone }) {
    const reachedGoal = changes.stat.xp >= GOAL_XP[goal];
    const toki = useRef(null);
    useEffect(() => {
        if (toki.current !== null)
            celebrate(toki.current);
    }, []);
    return (_jsxs("section", { class: "summary", children: [_jsx("div", { ref: toki, children: _jsx(Toki, { mood: "happy", size: "big", glow: true, pop: true }) }), _jsx("h2", { children: "\u05DB\u05DC \u05D4\u05DB\u05D1\u05D5\u05D3, \u05E1\u05D9\u05D9\u05DE\u05EA!" }), _jsxs("dl", { class: "status", children: [_jsx("dt", { children: "\u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05E9\u05D4\u05E8\u05D5\u05D5\u05D7\u05EA" }), _jsx("dd", { children: _jsxs("bdi", { dir: "ltr", children: ["+", changes.xp] }) }), _jsx("dt", { children: "\u05D4\u05E8\u05E6\u05E3 \u05E9\u05DC\u05DA" }), _jsx("dd", { children: changes.streak.current === 1 ? "יום אחד" : `${changes.streak.current} ימים` }), _jsx("dt", { children: "\u05D4\u05D9\u05E2\u05D3 \u05E9\u05DC \u05D4\u05D9\u05D5\u05DD" }), _jsx("dd", { class: reachedGoal ? "ok" : "", children: reachedGoal ? "הושג" : `${changes.stat.xp} מתוך ${GOAL_XP[goal]}` })] }), changes.usedFreeze && _jsx("p", { class: "muted", children: "\u05E4\u05E1\u05E4\u05E1\u05EA \u05D9\u05D5\u05DD, \u05D0\u05D1\u05DC \u05D4\u05D4\u05E7\u05E4\u05D0\u05D4 \u05E9\u05DE\u05E8\u05D4 \u05DC\u05DA \u05E2\u05DC \u05D4\u05E8\u05E6\u05E3." }), _jsx("div", { class: "step-actions", children: _jsx("button", { onClick: onDone, children: "\u05D4\u05DE\u05E9\u05DA" }) })] }));
}
