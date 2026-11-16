import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useRef, useState } from "../vendor/preact-hooks.js";
import { stopClip } from "../audio/player.js";
import { ReportButton } from "./ReportButton.js";
import { currentStep, finishStep, isFinished, progress } from "./session.js";
import { ChoiceView } from "./views/ChoiceView.js";
import { ConversationView } from "./views/ConversationView.js";
import { IntroView } from "./views/IntroView.js";
import { MatchView } from "./views/MatchView.js";
import { ReplyView } from "./views/ReplyView.js";
import { ShadowView } from "./views/ShadowView.js";
import { TilesView } from "./views/TilesView.js";
import { TipView } from "./views/TipView.js";
import { TypeView } from "./views/TypeView.js";
function StepView({ step, address, quiet, onQuiet, onDone }) {
    switch (step.kind) {
        case "shadow":
            return _jsx(ShadowView, { step: step, address: address, quiet: quiet, onQuiet: onQuiet, onDone: onDone });
        case "intro":
            return _jsx(IntroView, { step: step, onDone: () => onDone() });
        case "tip":
            return _jsx(TipView, { step: step, onDone: () => onDone() });
        case "conversation":
            return _jsx(ConversationView, { step: step, onDone: () => onDone() });
        case "reply":
            return _jsx(ReplyView, { step: step, address: address, onDone: onDone });
        case "choice":
            return _jsx(ChoiceView, { step: step, address: address, onDone: onDone });
        case "match":
            return _jsx(MatchView, { step: step, onDone: onDone });
        case "tiles":
            return _jsx(TilesView, { step: step, address: address, onDone: onDone });
        case "type":
            return _jsx(TypeView, { step: step, address: address, onDone: onDone });
    }
}
export function SittingScreen({ start, quietAtStart, address, restart, onKeep, onFinish, onExit, onReport, }) {
    const [session, setSession] = useState(start);
    const [turn, setTurn] = useState(0);
    const [quiet, setQuiet] = useState(quietAtStart);
    const finished = useRef(false);
    const kept = useRef({ session, quiet });
    const step = currentStep(session);
    useEffect(() => {
        if (isFinished(session)) {
            if (!finished.current) {
                finished.current = true;
                onFinish(session);
            }
        }
        else if (kept.current.session !== session || kept.current.quiet !== quiet) {
            kept.current = { session, quiet };
            onKeep(session, quiet);
        }
    }, [session, quiet]);
    useEffect(() => stopClip, []);
    const onDone = (result) => {
        setSession((current) => finishStep(current, result));
        setTurn((current) => current + 1);
        scrollTo(0, 0);
    };
    return (_jsxs("div", { class: "sitting", children: [_jsxs("div", { class: "sitting-bar", children: [_jsx("button", { class: "icon", "aria-label": "\u05D9\u05E6\u05D9\u05D0\u05D4", onClick: onExit, children: "\u2715" }), _jsx("progress", { max: 1, value: progress(session), "aria-label": "\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA" })] }), restart !== undefined && turn === 0 && step !== undefined && (_jsxs("div", { class: "resume-note", children: [_jsx("span", { children: "\u05DE\u05DE\u05E9\u05D9\u05DB\u05D9\u05DD \u05DE\u05D0\u05D9\u05E4\u05D4 \u05E9\u05E2\u05E6\u05E8\u05EA." }), _jsx("button", { class: "link-button", onClick: restart.run, children: restart.label })] })), step !== undefined && (_jsx(StepView, { step: step, address: address, quiet: quiet, onQuiet: () => setQuiet(true), onDone: onDone }, quiet && step.kind === "shadow" ? `quiet-${turn}` : turn)), step !== undefined && (_jsx("div", { class: "report-area", children: _jsx(ReportButton, { onReport: (note) => onReport(step, note) }, turn) }))] }));
}
