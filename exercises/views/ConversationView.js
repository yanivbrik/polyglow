import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../../vendor/preact-hooks.js";
import { playClip, playInTurn, SLOW_RATE, stopClip } from "../../audio/player.js";
import { TargetText } from "../../ui/TargetText.js";
export function Bubble({ line, showText, showMeaning, playing = false }) {
    const { audio } = line;
    const body = (_jsxs(_Fragment, { children: [_jsx("span", { class: "bubble-speaker", children: line.speaker }), showText ? _jsx(TargetText, { value: line.text, class: "bubble-text" }) : _jsx("span", { class: "bubble-hidden", "aria-label": "\u05D4\u05D8\u05E7\u05E1\u05D8 \u05DE\u05D5\u05E1\u05EA\u05E8", children: "\u2022 \u2022 \u2022" }), showMeaning && _jsx(TargetText, { value: line.meaning, class: "bubble-text muted" })] }));
    const classes = `bubble ${line.mine ? "mine" : ""} ${playing ? "playing" : ""} ${showText ? "" : "closed"}`;
    return audio === undefined ? (_jsx("div", { class: classes, children: body })) : (_jsx("button", { type: "button", class: classes, onClick: () => playClip(audio), children: body }));
}
export function ConversationView({ step, onDone }) {
    const voiced = step.lines.filter((line) => line.audio !== undefined);
    const clips = voiced.flatMap((line) => line.audio ?? []);
    const isFirst = step.stage === "first";
    const [showText, setShowText] = useState(!isFirst || clips.length === 0);
    const [playing, setPlaying] = useState();
    const play = (rate) => playInTurn(clips, { ...(rate !== undefined && { rate }), onClip: setPlaying });
    useEffect(() => {
        if (isFirst)
            play();
        return stopClip;
    }, []);
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: isFirst ? "מקשיבים לשיחה" : "השיחה המלאה" }), _jsx(TargetText, { block: true, value: step.scene, class: "scene" }), clips.length > 0 && (_jsxs("div", { class: "conversation-controls", children: [_jsxs("button", { type: "button", class: "secondary", onClick: () => play(), children: [_jsx("span", { "aria-hidden": "true", children: "\uD83D\uDD0A" }), " \u05DC\u05D4\u05E9\u05DE\u05D9\u05E2"] }), _jsxs("button", { type: "button", class: "secondary", onClick: () => play(SLOW_RATE), children: [_jsx("span", { "aria-hidden": "true", children: "\uD83D\uDC22" }), " \u05DC\u05D0\u05D8"] }), isFirst && (_jsx("button", { type: "button", class: "secondary", onClick: () => setShowText((current) => !current), children: showText ? "להסתיר את הטקסט" : "להציג את הטקסט" }))] })), _jsx("div", { class: "conversation", children: step.lines.map((line, index) => (_jsx(Bubble, { line: line, showText: showText, showMeaning: !isFirst, playing: playing !== undefined && voiced[playing] === line }, index))) }), _jsx("div", { class: "step-actions", children: _jsx("button", { onClick: onDone, children: isFirst ? "המשך" : "סיום" }) })] }));
}
