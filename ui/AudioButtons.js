import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect } from "../vendor/preact-hooks.js";
import { playClip, SLOW_RATE, stopClip } from "../audio/player.js";
export function AudioButtons({ clip, autoPlay = false, large = false }) {
    useEffect(() => {
        if (autoPlay)
            playClip(clip);
        return stopClip;
    }, [clip, autoPlay]);
    return (_jsxs("span", { class: "audio-buttons", children: [_jsx("button", { type: "button", class: `icon ${large ? "large" : ""}`, "aria-label": "\u05D4\u05E9\u05DE\u05E2\u05D4", onClick: () => playClip(clip), children: "\uD83D\uDD0A" }), _jsx("button", { type: "button", class: `icon ${large ? "large" : ""}`, "aria-label": "\u05D4\u05E9\u05DE\u05E2\u05D4 \u05DC\u05D0\u05D8", onClick: () => playClip(clip, SLOW_RATE), children: "\uD83D\uDC22" })] }));
}
