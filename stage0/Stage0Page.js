import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../vendor/preact-jsx-runtime.js";
import { useCallback, useEffect, useState } from "../vendor/preact-hooks.js";
import { BidiSection } from "./BidiSection.js";
import { resetStage0 } from "./checks.js";
import { DeviceSection } from "./DeviceSection.js";
import { FormatsSection } from "./FormatsSection.js";
import { ManualCheck } from "./ManualCheck.js";
import { RecordingSection } from "./RecordingSection.js";
import { formatReport } from "./report.js";
import { VoiceSamplesSection } from "./VoiceSamplesSection.js";
import { VoicesSection } from "./VoicesSection.js";
function InstallSection({ report }) {
    const [prompt, setPrompt] = useState();
    useEffect(() => {
        report("installPrompt", "not offered");
        const onPrompt = (event) => {
            event.preventDefault();
            setPrompt(event);
            report("installPrompt", "offered");
        };
        addEventListener("beforeinstallprompt", onPrompt);
        return () => removeEventListener("beforeinstallprompt", onPrompt);
    }, [report]);
    const install = async () => {
        if (prompt === undefined)
            return;
        await prompt.prompt();
        report("installPrompt", (await prompt.userChoice).outcome);
        setPrompt(undefined);
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D4\u05EA\u05E7\u05E0\u05D4" }), _jsxs("ul", { children: [_jsx("li", { children: "\u05D0\u05D9\u05D9\u05E4\u05D5\u05DF: \u05D1\u05E1\u05E4\u05D0\u05E8\u05D9, \u05DB\u05E4\u05EA\u05D5\u05E8 \u05D4\u05E9\u05D9\u05EA\u05D5\u05E3 \u05D5\u05D0\u05D6 \"\u05D4\u05D5\u05E1\u05E4\u05D4 \u05DC\u05DE\u05E1\u05DA \u05D4\u05D1\u05D9\u05EA\"." }), _jsx("li", { children: "\u05D0\u05E0\u05D3\u05E8\u05D5\u05D0\u05D9\u05D3: \u05D1\u05DB\u05E8\u05D5\u05DD, \u05D4\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E9\u05DC \u05E9\u05DC\u05D5\u05E9 \u05D4\u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D5\u05D0\u05D6 \"\u05D4\u05EA\u05E7\u05E0\u05EA \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4\"." }), _jsx("li", { children: "\u05DE\u05D7\u05E9\u05D1 \u05E2\u05DD \u05DB\u05E8\u05D5\u05DD \u05D0\u05D5 \u05D0\u05D3\u05D2': \u05E1\u05DE\u05DC \u05D4\u05D4\u05EA\u05E7\u05E0\u05D4 \u05D1\u05E7\u05E6\u05D4 \u05E9\u05D5\u05E8\u05EA \u05D4\u05DB\u05EA\u05D5\u05D1\u05EA." }), _jsxs("li", { children: ["\u05DE\u05E7 \u05E2\u05DD \u05E1\u05E4\u05D0\u05E8\u05D9: \u05EA\u05E4\u05E8\u05D9\u05D8 \"\u05E7\u05D5\u05D1\u05E5\" \u05D5\u05D0\u05D6 \"\u05D4\u05D5\u05E1\u05E4\u05D4 \u05DC-", _jsx("span", { lang: "en", dir: "ltr", children: "Dock" }), "\"."] }), _jsx("li", { children: "\u05E4\u05D9\u05D9\u05E8\u05E4\u05D5\u05E7\u05E1 \u05D1\u05DE\u05D7\u05E9\u05D1 \u05DC\u05D0 \u05DE\u05EA\u05E7\u05D9\u05DF \u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D5\u05EA. \u05D1\u05D5 \u05D1\u05D5\u05D3\u05E7\u05D9\u05DD \u05E8\u05E7 \u05E9\u05D4\u05D3\u05E3 \u05E2\u05D5\u05D1\u05D3 \u05D1\u05DC\u05D9 \u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8." })] }), prompt !== undefined && (_jsx("div", { class: "row", children: _jsx("button", { onClick: install, children: "\u05D4\u05EA\u05E7\u05E0\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5" }) })), _jsx(ManualCheck, { id: "installed", label: "\u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4 \u05DE\u05D5\u05EA\u05E7\u05E0\u05EA \u05D5\u05E0\u05E4\u05EA\u05D7\u05EA \u05DE\u05D4\u05E1\u05DE\u05DC \u05E9\u05DC\u05D4", report: report })] }));
}
function OfflineSection({ report }) {
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D1\u05DC\u05D9 \u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8" }), _jsxs("ol", { children: [_jsx("li", { children: "\u05DC\u05E4\u05EA\u05D5\u05D7 \u05D0\u05EA \u05D4\u05D3\u05E3 \u05E4\u05E2\u05DD \u05D0\u05D7\u05EA \u05E2\u05DD \u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8, \u05D5\u05DC\u05D7\u05DB\u05D5\u05EA \u05E9\u05DC\u05D9\u05D3 \"\u05E2\u05D5\u05D1\u05D3 \u05D1\u05DC\u05D9 \u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8\" \u05D9\u05D5\u05E4\u05D9\u05E2 \"\u05DB\u05DF\"." }), _jsx("li", { children: "\u05DC\u05E1\u05D2\u05D5\u05E8 \u05D0\u05EA \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4 \u05D0\u05D5 \u05D0\u05EA \u05D4\u05D3\u05E4\u05D3\u05E4\u05DF \u05DC\u05D2\u05DE\u05E8\u05D9." }), _jsx("li", { children: "\u05DC\u05D4\u05E2\u05D1\u05D9\u05E8 \u05D0\u05EA \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8 \u05DC\u05DE\u05E6\u05D1 \u05D8\u05D9\u05E1\u05D4." }), _jsx("li", { children: "\u05DC\u05E4\u05EA\u05D5\u05D7 \u05E9\u05D5\u05D1, \u05D5\u05DC\u05E0\u05E1\u05D5\u05EA \u05D0\u05EA \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4 \u05D5\u05D0\u05EA \u05D4\u05D4\u05E9\u05DE\u05E2\u05D5\u05EA." })] }), _jsx(ManualCheck, { id: "offline", label: "\u05D4\u05D3\u05E3 \u05E0\u05E4\u05EA\u05D7 \u05D1\u05DE\u05E6\u05D1 \u05D8\u05D9\u05E1\u05D4, \u05D5\u05D4\u05D4\u05E9\u05DE\u05E2\u05D5\u05EA \u05E2\u05D5\u05D1\u05D3\u05D5\u05EA", report: report })] }));
}
function ReportSection({ results }) {
    const [notes, setNotes] = useState("");
    const [copied, setCopied] = useState(false);
    const text = formatReport(results, notes);
    const canShare = typeof navigator.share === "function";
    const copy = () => {
        navigator.clipboard.writeText(text).then(() => setCopied(true), () => setCopied(false));
    };
    const share = () => {
        navigator.share({ title: "Polyglow", text }).catch(() => undefined);
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA" }), _jsx("p", { children: "\u05D1\u05E1\u05D5\u05E3 \u05D4\u05D1\u05D3\u05D9\u05E7\u05D4, \u05DC\u05E9\u05EA\u05E3 \u05D0\u05D5 \u05DC\u05D4\u05E2\u05EA\u05D9\u05E7 \u05D0\u05EA \u05D4\u05D8\u05E7\u05E1\u05D8 \u05D5\u05DC\u05E9\u05DC\u05D5\u05D7 \u05D0\u05D5\u05EA\u05D5 \u05DC\u05DE\u05D9 \u05E9\u05D1\u05D9\u05E7\u05E9 \u05D0\u05EA \u05D4\u05D1\u05D3\u05D9\u05E7\u05D4." }), _jsxs("label", { children: [_jsx("span", { children: "\u05D4\u05E2\u05E8\u05D5\u05EA, \u05D0\u05DD \u05D9\u05E9:" }), _jsx("textarea", { rows: 3, dir: "auto", value: notes, onInput: (event) => setNotes(event.currentTarget.value) })] }), _jsxs("div", { class: "row", children: [canShare && _jsx("button", { onClick: share, children: "\u05E9\u05D9\u05EA\u05D5\u05E3" }), _jsx("button", { class: canShare ? "secondary" : "", onClick: copy, children: "\u05D4\u05E2\u05EA\u05E7\u05D4" }), copied && _jsx("span", { class: "ok", children: "\u05D4\u05D5\u05E2\u05EA\u05E7" })] }), _jsx("pre", { lang: "en", dir: "ltr", children: text })] }));
}
function ResetSection() {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState();
    const reset = () => {
        setDeleting(true);
        resetStage0().then(() => location.reload(), (e) => {
            setDeleting(false);
            setError(String(e));
        });
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D0\u05D9\u05E4\u05D5\u05E1" }), _jsx("p", { children: "\u05DE\u05D5\u05D7\u05E7 \u05DE\u05D4\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D4\u05D6\u05D4 \u05D0\u05EA \u05D4\u05E1\u05D9\u05DE\u05D5\u05E0\u05D9\u05DD \u05D5\u05D0\u05EA \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4, \u05DB\u05D3\u05D9 \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D0\u05EA \u05D4\u05D1\u05D3\u05D9\u05E7\u05D4 \u05DE\u05D4\u05D4\u05EA\u05D7\u05DC\u05D4." }), confirming ? (_jsxs(_Fragment, { children: [_jsx("p", { class: "bad", children: "\u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05DB\u05DC \u05D4\u05E1\u05D9\u05DE\u05D5\u05E0\u05D9\u05DD \u05D5\u05D0\u05EA \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4? \u05D0\u05D9 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05E9\u05D7\u05D6\u05E8 \u05D0\u05D5\u05EA\u05DD." }), _jsxs("div", { class: "row", children: [_jsx("button", { class: "danger", onClick: reset, disabled: deleting, children: "\u05DB\u05DF, \u05DC\u05DE\u05D7\u05D5\u05E7" }), _jsx("button", { class: "secondary", onClick: () => setConfirming(false), disabled: deleting, children: "\u05D1\u05D9\u05D8\u05D5\u05DC" })] })] })) : (_jsx("div", { class: "row", children: _jsx("button", { class: "secondary", onClick: () => setConfirming(true), children: "\u05D0\u05D9\u05E4\u05D5\u05E1" }) })), error !== undefined && (_jsxs("p", { class: "bad", children: ["\u05D4\u05DE\u05D7\u05D9\u05E7\u05D4 \u05E0\u05DB\u05E9\u05DC\u05D4: ", _jsx("span", { lang: "en", dir: "ltr", children: error })] }))] }));
}
export function Stage0Page({ version }) {
    const [results, setResults] = useState(() => ({
        build: version,
        date: new Date().toISOString(),
        userAgent: navigator.userAgent,
    }));
    const report = useCallback((key, value) => {
        setResults((current) => (current[key] === value ? current : { ...current, [key]: value }));
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs("header", { children: [_jsx("h1", { children: _jsx("span", { lang: "en", dir: "ltr", children: "Polyglow" }) }), _jsx("p", { class: "muted", children: "\u05D3\u05E3 \u05D1\u05D3\u05D9\u05E7\u05D4: \u05D4\u05D0\u05DD \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4 \u05EA\u05E2\u05D1\u05D5\u05D3 \u05D1\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D4\u05D6\u05D4. \u05E2\u05D5\u05D1\u05E8\u05D9\u05DD \u05E2\u05DC \u05D4\u05E1\u05E2\u05D9\u05E4\u05D9\u05DD \u05DE\u05DC\u05DE\u05E2\u05DC\u05D4 \u05DC\u05DE\u05D8\u05D4, \u05D5\u05D1\u05E1\u05D5\u05E3 \u05E9\u05D5\u05DC\u05D7\u05D9\u05DD \u05D0\u05EA \u05D4\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA." })] }), _jsx(DeviceSection, { version: version, report: report }), _jsx(InstallSection, { report: report }), _jsx(OfflineSection, { report: report }), _jsx(RecordingSection, { report: report }), _jsx(FormatsSection, { report: report }), _jsx(VoiceSamplesSection, { report: report }), _jsx(VoicesSection, { report: report }), _jsx(BidiSection, { report: report }), _jsx(ReportSection, { results: results }), _jsx(ResetSection, {})] }));
}
