import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useMemo, useRef, useState } from "../vendor/preact-hooks.js";
import { shuffled } from "../exercises/rng.js";
import { useMatchBoard } from "../exercises/views/useMatchBoard.js";
import { celebrate } from "../ui/confetti.js";
import { TargetText } from "../ui/TargetText.js";
import { Toki } from "../ui/Toki.js";
import { dealRound, GAME_SECONDS } from "./speed-match.js";
const SHAKE_MS = 250;
function Board({ pairs, onMatch, onCleared }) {
    const targets = useMemo(() => shuffled(pairs, Math.random), [pairs]);
    const sources = useMemo(() => shuffled(pairs, Math.random), [pairs]);
    const board = useMatchBoard(onMatch, () => undefined, SHAKE_MS);
    useEffect(() => {
        if (board.matched.length === pairs.length)
            onCleared();
    }, [board.matched]);
    return (_jsxs("div", { class: "match", children: [_jsx("div", { class: "match-column", children: targets.map((pair) => (_jsx("button", { class: `option ${board.targetState(pair.subject)}`, disabled: board.matched.includes(pair.subject) || board.shaking, onClick: () => board.pickTarget(pair.subject), children: _jsx(TargetText, { value: pair.target }) }, pair.subject))) }), _jsx("div", { class: "match-column", children: sources.map((pair) => (_jsx("button", { class: `option ${board.sourceState(pair.subject)}`, disabled: board.matched.includes(pair.subject) || board.shaking, onClick: () => board.pickSource(pair.subject), children: _jsx(TargetText, { value: pair.source }) }, pair.subject))) })] }));
}
export function SpeedMatchScreen({ deck, best, onSave, onExit }) {
    const [phase, setPhase] = useState({ name: "ready" });
    const [left, setLeft] = useState(GAME_SECONDS);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [pairs, setPairs] = useState([]);
    const dealt = useRef({ cards: deck, position: deck.length });
    const scoreNow = useRef(0);
    const toki = useRef(null);
    const isRecord = phase.name === "done" && phase.isRecord;
    useEffect(() => {
        if (isRecord && toki.current !== null)
            celebrate(toki.current);
    }, [isRecord]);
    const deal = () => {
        const next = dealRound(dealt.current, Math.random);
        dealt.current = next.deck;
        setPairs(next.pairs);
        setRound((current) => current + 1);
    };
    const start = () => {
        scoreNow.current = 0;
        setScore(0);
        setLeft(GAME_SECONDS);
        deal();
        setPhase({ name: "playing" });
    };
    useEffect(() => {
        if (phase.name !== "playing")
            return;
        const endsAt = Date.now() + GAME_SECONDS * 1000;
        const timer = setInterval(() => {
            const remaining = (endsAt - Date.now()) / 1000;
            if (remaining > 0) {
                setLeft(remaining);
                return;
            }
            clearInterval(timer);
            const final = scoreNow.current;
            setPhase({ name: "done", score: final, isRecord: final > best, xp: undefined });
            void onSave(final).then((xp) => setPhase({ name: "done", score: final, isRecord: final > best, xp }));
        }, 100);
        return () => clearInterval(timer);
    }, [phase.name]);
    if (phase.name === "ready") {
        return (_jsxs("section", { class: "summary", children: [_jsx("div", { class: "toki-big", "aria-hidden": "true", children: "\u23F1\uFE0F" }), _jsx("h2", { children: "\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DE\u05D4\u05D9\u05E8\u05D4" }), _jsxs("p", { children: [GAME_SECONDS, " \u05E9\u05E0\u05D9\u05D5\u05EA. \u05DB\u05DE\u05D4 \u05D6\u05D5\u05D2\u05D5\u05EA \u05D0\u05E4\u05E9\u05E8 \u05DC\u05D4\u05E1\u05E4\u05D9\u05E7?"] }), best > 0 && _jsxs("p", { class: "muted", children: ["\u05D4\u05E9\u05D9\u05D0 \u05E9\u05DC\u05DA: ", best] }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { onClick: start, children: "\u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD" }), _jsx("button", { class: "secondary", onClick: onExit, children: "\u05D7\u05D6\u05E8\u05D4" })] })] }));
    }
    if (phase.name === "done") {
        return (_jsxs("section", { class: "summary", children: [_jsx("div", { ref: toki, children: _jsx(Toki, { mood: phase.isRecord ? "happy" : "calm", size: "big", glow: phase.isRecord, pop: phase.isRecord }) }), _jsx("h2", { children: phase.isRecord ? "שיא חדש!" : "הזמן נגמר" }), _jsx("p", { class: "game-score", children: phase.score }), _jsx("p", { class: "muted", children: phase.score === 1 ? "זוג אחד" : `זוגות` }), phase.xp !== undefined && phase.xp > 0 && (_jsxs("p", { children: ["\u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05E9\u05D4\u05E8\u05D5\u05D5\u05D7\u05EA: ", _jsxs("bdi", { dir: "ltr", children: ["+", phase.xp] })] })), _jsxs("div", { class: "step-actions", children: [_jsx("button", { disabled: phase.xp === undefined, onClick: start, children: "\u05E2\u05D5\u05D3 \u05E1\u05D9\u05D1\u05D5\u05D1" }), _jsx("button", { class: "secondary", disabled: phase.xp === undefined, onClick: onExit, children: "\u05E1\u05D9\u05D5\u05DD" })] })] }));
    }
    return (_jsxs("div", { class: "sitting", children: [_jsxs("div", { class: "sitting-bar", children: [_jsx("button", { class: "icon", "aria-label": "\u05D9\u05E6\u05D9\u05D0\u05D4", onClick: onExit, children: "\u2715" }), _jsx("progress", { max: GAME_SECONDS, value: left, "aria-label": "\u05D4\u05D6\u05DE\u05DF \u05E9\u05E0\u05E9\u05D0\u05E8" }), _jsx("span", { class: "game-now", children: score })] }), _jsx(Board, { pairs: pairs, onMatch: () => {
                    scoreNow.current += 1;
                    setScore(scoreNow.current);
                }, onCleared: deal }, round)] }));
}
