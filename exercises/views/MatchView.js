import { jsx as _jsx, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useEffect, useMemo, useState } from "../../vendor/preact-hooks.js";
import { playInTurn, stopClip } from "../../audio/player.js";
import { TargetText } from "../../ui/TargetText.js";
import { shuffled } from "../rng.js";
import { useMatchBoard } from "./useMatchBoard.js";
const SHAKE_MS = 500;
const AFTER_SOUND_MS = 350;
const LONGEST_SOUND_MS = 4000;
export function MatchView({ step, onDone }) {
    const targets = useMemo(() => shuffled(step.pairs, Math.random), [step]);
    const sources = useMemo(() => shuffled(step.pairs, Math.random), [step]);
    const [missed, setMissed] = useState([]);
    const [sounding, setSounding] = useState(false);
    const board = useMatchBoard(() => undefined, (subjects) => setMissed((all) => [...new Set([...all, ...subjects])]), SHAKE_MS);
    const allMatched = board.matched.length === step.pairs.length;
    useEffect(() => stopClip, []);
    useEffect(() => {
        if (!allMatched)
            return;
        const timer = setTimeout(() => {
            onDone({ right: step.pairs.map((pair) => pair.subject).filter((subject) => !missed.includes(subject)), almost: missed, wrong: [] });
        }, sounding ? LONGEST_SOUND_MS : AFTER_SOUND_MS);
        return () => clearTimeout(timer);
    }, [allMatched, sounding]);
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: "\u05DE\u05D4 \u05D4\u05D5\u05DC\u05DA \u05E2\u05DD \u05DE\u05D4?" }), _jsxs("div", { class: "match", children: [_jsx("div", { class: "match-column", children: targets.map((pair) => (_jsx("button", { class: `option ${board.targetState(pair.subject)}`, disabled: board.matched.includes(pair.subject) || board.shaking, onClick: () => {
                                if (pair.audio !== undefined)
                                    playInTurn([pair.audio], { onClip: (index) => setSounding(index !== undefined) });
                                board.pickTarget(pair.subject);
                            }, children: _jsx(TargetText, { value: pair.target }) }, pair.subject))) }), _jsx("div", { class: "match-column", children: sources.map((pair) => (_jsx("button", { class: `option ${board.sourceState(pair.subject)}`, disabled: board.matched.includes(pair.subject) || board.shaking, onClick: () => board.pickSource(pair.subject), children: _jsx(TargetText, { value: pair.source }) }, pair.subject))) })] })] }));
}
