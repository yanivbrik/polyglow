import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { shownTranslation, sourceLine, targetLine } from "../course/pack.js";
import { answerPlacement, placementProgress, placementResult, startPlacement } from "../course/placement.js";
import { clip } from "../exercises/generate.js";
import { AudioButtons } from "../ui/AudioButtons.js";
import { say } from "../ui/say.js";
import { TargetText } from "../ui/TargetText.js";
import { Toki } from "../ui/Toki.js";
import { TopBar } from "../ui/TopBar.js";
import { go } from "./route.js";
const SKILLS = { reading: "קריאה", listening: "שמיעה" };
export function PlacementScreen({ pack, profile, enrollment, onSave }) {
    const address = profile.addressAs;
    const [test, setTest] = useState(() => startPlacement(pack, Math.random));
    const [seen, setSeen] = useState(-1);
    const [failed, setFailed] = useState(false);
    const result = placementResult(pack, test);
    useEffect(() => {
        if (result === undefined)
            return;
        onSave({ ...profile, start: "placement" }, { ...enrollment, placement: { unit: result.start, at: Date.now() } }).catch((error) => {
            console.error(error);
            setFailed(true);
        });
    }, [result === undefined]);
    const sentence = (id) => pack.sentences.find((candidate) => candidate.id === id);
    const answer = (chosen) => {
        setTest((current) => answerPlacement(pack, current, chosen, Math.random));
        scrollTo(0, 0);
    };
    if (seen === -1) {
        const parts = test.skills.map((skill) => SKILLS[skill]).join(" ואחריה ");
        return (_jsxs(_Fragment, { children: [_jsx(TopBar, { title: "\u05DE\u05D1\u05D7\u05DF \u05DE\u05D9\u05E7\u05D5\u05DD", back: "#/" }), _jsxs("section", { children: [_jsx(Toki, { size: "big" }), _jsxs("p", { children: [test.skills.length > 1 ? `שני חלקים, ${parts}` : `חלק אחד, ${parts}`, ", \u05D1\u05E2\u05E8\u05DA ", test.skills.length * 10, " \u05E9\u05D0\u05DC\u05D5\u05EA. \u05D1\u05DB\u05DC \u05E9\u05D0\u05DC\u05D4 \u05D1\u05D5\u05D7\u05E8\u05D9\u05DD \u05DE\u05D4 \u05E4\u05D9\u05E8\u05D5\u05E9 \u05D4\u05DE\u05E9\u05E4\u05D8 \u05D1", pack.target.name, "."] }), _jsx("p", { children: say(address, "כשלא בטוחים, לוחצים \"לא יודע\" ולא מנחשים: ניחוש יכול למקם אותך גבוה מדי.", "כשלא בטוחים, לוחצים \"לא יודעת\" ולא מנחשים: ניחוש יכול למקם אותך גבוה מדי.") }), enrollment.completedLessons.length > 0 && _jsx("p", { class: "muted", children: "\u05D4\u05E9\u05D9\u05E2\u05D5\u05E8\u05D9\u05DD \u05E9\u05DB\u05D1\u05E8 \u05D4\u05E1\u05EA\u05D9\u05D9\u05DE\u05D5 \u05E0\u05E9\u05D0\u05E8\u05D9\u05DD, \u05D5\u05D2\u05DD \u05D4\u05D7\u05D6\u05E8\u05D5\u05EA \u05E2\u05DC\u05D9\u05D4\u05DD." }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { onClick: () => setSeen(0), children: "\u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD" }), _jsx("button", { class: "secondary", onClick: () => go("#/"), children: "\u05DC\u05D0 \u05E2\u05DB\u05E9\u05D9\u05D5" })] })] })] }));
    }
    if (result !== undefined) {
        const total = pack.units.length;
        const start = pack.units.find((unit) => unit.id === result.start);
        const level = pack.levels.find((candidate) => candidate.id === start.level);
        const counts = Object.values(result.reached);
        return (_jsxs("section", { class: "summary", children: [_jsx(Toki, { mood: "happy", size: "big", glow: true, pop: true }), _jsx("h2", { children: "\u05E1\u05D9\u05D9\u05DE\u05EA \u05D0\u05EA \u05D4\u05DE\u05D1\u05D7\u05DF" }), _jsx("p", { class: "muted", children: "\u05DB\u05DE\u05D4 \u05D9\u05D7\u05D9\u05D3\u05D5\u05EA \u05DB\u05D1\u05E8 \u05DE\u05D5\u05DB\u05E8\u05D5\u05EA \u05DC\u05DA, \u05D1\u05DB\u05DC \u05D7\u05DC\u05E7:" }), _jsx("dl", { class: "status", children: test.skills.flatMap((skill) => [
                        _jsx("dt", { children: SKILLS[skill] }, `${skill}-name`),
                        _jsxs("dd", { children: [result.reached[skill] ?? 0, " \u05DE\u05EA\u05D5\u05DA ", total] }, `${skill}-count`),
                    ]) }), _jsxs("p", { children: ["\u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD \u05D1\u05D9\u05D7\u05D9\u05D3\u05D4 \"", start.title, "\"", level === undefined ? "" : `, שנמצאת תחת "${level.title}"`, "."] }), counts.length > 1 && new Set(counts).size > 1 && _jsx("p", { class: "muted", children: "\u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD \u05DC\u05E4\u05D9 \u05D4\u05D7\u05DC\u05E7 \u05E9\u05D1\u05D5 \u05DE\u05D5\u05DB\u05E8\u05D5\u05EA \u05E4\u05D7\u05D5\u05EA \u05D9\u05D7\u05D9\u05D3\u05D5\u05EA, \u05DB\u05D9 \u05DB\u05DC \u05E9\u05D9\u05E2\u05D5\u05E8 \u05DE\u05E9\u05DC\u05D1 \u05D0\u05EA \u05E9\u05E0\u05D9\u05D4\u05DD." }), start !== pack.units[0] && _jsx("p", { class: "muted", children: "\u05D4\u05D9\u05D7\u05D9\u05D3\u05D5\u05EA \u05E9\u05DC\u05E4\u05E0\u05D9\u05D4 \u05E0\u05E9\u05D0\u05E8\u05D5\u05EA \u05E4\u05EA\u05D5\u05D7\u05D5\u05EA, \u05D5\u05D0\u05E4\u05E9\u05E8 \u05DC\u05D7\u05D6\u05D5\u05E8 \u05D0\u05DC\u05D9\u05D4\u05DF \u05D1\u05DB\u05DC \u05E8\u05D2\u05E2." }), failed && (_jsx("p", { class: "bad", role: "alert", children: "\u05D4\u05EA\u05D5\u05E6\u05D0\u05D4 \u05DC\u05D0 \u05E0\u05E9\u05DE\u05E8\u05D4. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D8\u05E2\u05D5\u05DF \u05D0\u05EA \u05D4\u05D3\u05E3 \u05DE\u05D7\u05D3\u05E9 \u05D5\u05DC\u05E0\u05E1\u05D5\u05EA \u05E9\u05D5\u05D1." })), _jsx("div", { class: "step-actions", children: _jsx("button", { disabled: failed, onClick: () => go("#/"), children: "\u05DC\u05D4\u05EA\u05D7\u05DC\u05D4" }) })] }));
    }
    const question = test.question;
    const opening = test.part > seen;
    const asked = sentence(question.sentence);
    const sound = clip(pack, asked.text);
    return (_jsxs("div", { class: "sitting", children: [_jsxs("div", { class: "sitting-bar", children: [_jsx("button", { class: "icon", "aria-label": "\u05D9\u05E6\u05D9\u05D0\u05D4", onClick: () => go("#/"), children: "\u2715" }), _jsx("progress", { max: 1, value: placementProgress(pack, test), "aria-label": "\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA" })] }), opening ? (_jsxs("div", { class: "step", children: [_jsxs("h2", { children: ["\u05D4\u05D7\u05DC\u05E7 \u05D4", test.part === 1 ? "שני" : "הבא", ": ", SKILLS[question.skill]] }), question.skill === "listening" && _jsx("p", { children: "\u05E9\u05D5\u05DE\u05E2\u05D9\u05DD \u05DE\u05E9\u05E4\u05D8 \u05D5\u05D1\u05D5\u05D7\u05E8\u05D9\u05DD \u05DE\u05D4 \u05D4\u05E4\u05D9\u05E8\u05D5\u05E9 \u05E9\u05DC\u05D5. \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D4\u05D2\u05D1\u05D9\u05E8 \u05D0\u05EA \u05D4\u05E7\u05D5\u05DC, \u05D5\u05D0\u05E4\u05E9\u05E8 \u05DC\u05D4\u05E9\u05DE\u05D9\u05E2 \u05E9\u05D5\u05D1." }), _jsx("div", { class: "step-actions", children: _jsx("button", { onClick: () => setSeen(test.part), children: "\u05DE\u05DE\u05E9\u05D9\u05DB\u05D9\u05DD" }) })] })) : (_jsxs("div", { class: "step", children: [_jsxs("p", { class: "eyebrow", children: [SKILLS[question.skill], " \u00B7 ", question.skill === "reading" ? "מה פירוש המשפט?" : "מה פירוש המשפט ששמעת?"] }), _jsx("div", { class: "prompt", children: question.skill === "reading" || sound === undefined ? _jsx(TargetText, { block: true, value: targetLine(pack, asked.text), class: "prompt-line" }) : _jsx(AudioButtons, { clip: sound, autoPlay: true, large: true }) }), _jsxs("div", { class: "options", children: [question.options.map((option) => (_jsx("button", { class: "option", onClick: () => answer(option), children: _jsx(TargetText, { value: sourceLine(pack, shownTranslation(sentence(option), address)) }) }, option))), _jsx("button", { class: "secondary", onClick: () => answer(undefined), children: say(address, "לא יודע", "לא יודעת") })] })] }, test.asked.length))] }));
}
