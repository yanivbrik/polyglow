import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { formatReports } from "../exercises/report.js";
import { deleteReports, listReports } from "../storage/store.js";
import { TopBar } from "../ui/TopBar.js";
export function ReportsScreen({ profileId }) {
    const [reports, setReports] = useState();
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const canShare = typeof navigator.share === "function";
    useEffect(() => {
        listReports(profileId).then(setReports).catch((error) => console.error(error));
    }, [profileId]);
    const bar = _jsx(TopBar, { title: "\u05D3\u05D9\u05D5\u05D5\u05D7\u05D9\u05DD \u05E2\u05DC \u05D8\u05E2\u05D5\u05D9\u05D5\u05EA", back: "#/menu" });
    if (reports === undefined) {
        return (_jsxs(_Fragment, { children: [bar, _jsx("p", { class: "muted", children: "\u05D8\u05D5\u05E2\u05DF\u2026" })] }));
    }
    const text = formatReports(reports);
    const copy = () => {
        navigator.clipboard.writeText(text).then(() => setCopied(true), () => setCopied(false));
    };
    const share = () => {
        navigator.share({ title: "Polyglow", text }).catch(() => undefined);
    };
    const clear = () => {
        deleteReports(profileId)
            .then(() => {
            setReports([]);
            setConfirming(false);
        })
            .catch((error) => console.error(error));
    };
    return (_jsxs(_Fragment, { children: [bar, _jsx("section", { children: reports.length === 0 ? (_jsx("p", { children: "\u05D0\u05D9\u05DF \u05D3\u05D9\u05D5\u05D5\u05D7\u05D9\u05DD. \u05D1\u05DB\u05DC \u05EA\u05E8\u05D2\u05D9\u05DC \u05D9\u05E9 \u05E7\u05D9\u05E9\u05D5\u05E8 \"\u05E0\u05E8\u05D0\u05D4 \u05DC\u05D9 \u05E9\u05D9\u05E9 \u05E4\u05D4 \u05D8\u05E2\u05D5\u05EA\"." })) : (_jsxs(_Fragment, { children: [_jsxs("p", { children: [reports.length === 1 ? "דיווח אחד מחכה." : `${reports.length} דיווחים מחכים.`, " \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4 \u05DC\u05D0 \u05E9\u05D5\u05DC\u05D7\u05EA \u05DB\u05DC\u05D5\u05DD \u05DC\u05D1\u05D3, \u05D0\u05D6 \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05E2\u05EA\u05D9\u05E7 \u05D0\u05EA \u05D4\u05D8\u05E7\u05E1\u05D8 \u05D5\u05DC\u05D4\u05E2\u05D1\u05D9\u05E8 \u05D0\u05D5\u05EA\u05D5 \u05DC\u05DE\u05D9 \u05E9\u05DE\u05EA\u05E7\u05DF \u05D0\u05EA \u05D4\u05E7\u05D5\u05E8\u05E1."] }), _jsxs("div", { class: "step-actions", children: [canShare && _jsx("button", { onClick: share, children: "\u05E9\u05D9\u05EA\u05D5\u05E3" }), _jsx("button", { class: canShare ? "secondary" : "", onClick: copy, children: "\u05D4\u05E2\u05EA\u05E7\u05D4" })] }), copied && (_jsx("p", { class: "ok", role: "status", children: "\u05D4\u05D5\u05E2\u05EA\u05E7" })), _jsx("pre", { lang: "en", dir: "ltr", children: text }), confirming ? (_jsxs(_Fragment, { children: [_jsx("p", { class: "bad", children: "\u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05DB\u05DC \u05D4\u05D3\u05D9\u05D5\u05D5\u05D7\u05D9\u05DD? \u05DB\u05D3\u05D0\u05D9 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05E7\u05D5\u05D3\u05DD \u05E9\u05D4\u05DD \u05D4\u05D5\u05E2\u05D1\u05E8\u05D5." }), _jsxs("div", { class: "step-actions", children: [_jsx("button", { class: "danger", onClick: clear, children: "\u05DC\u05DE\u05D7\u05D5\u05E7" }), _jsx("button", { class: "secondary", onClick: () => setConfirming(false), children: "\u05D1\u05D9\u05D8\u05D5\u05DC" })] })] })) : (_jsx("div", { class: "step-actions", children: _jsx("button", { class: "secondary", onClick: () => setConfirming(true), children: "\u05DE\u05D7\u05D9\u05E7\u05EA \u05D4\u05D3\u05D9\u05D5\u05D5\u05D7\u05D9\u05DD \u05E9\u05D4\u05D5\u05E2\u05D1\u05E8\u05D5" }) }))] })) })] }));
}
