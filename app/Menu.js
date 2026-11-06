import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../vendor/preact-jsx-runtime.js";
import { useState } from "../vendor/preact-hooks.js";
import { shownDate } from "../profiles/backup.js";
import { TopBar } from "../ui/TopBar.js";
import { checkForUpdate } from "./service-worker.js";
const LINKS = [
    { href: "#/profiles", icon: "👥", label: "החלפת לומד" },
    { href: "#/settings", icon: "⚙️", label: "הגדרות" },
    { href: "#/backup", icon: "💾", label: "גיבוי, איפוס ומחיקה" },
    { href: "#/reports", icon: "🚩", label: "דיווחים על טעויות" },
    { href: "#/credits", icon: "📜", label: "קרדיטים" },
];
const CHECKED = {
    ready: { text: "יש גרסה חדשה שמחכה. אפשר לעבור אליה בהודעה שלמעלה.", tone: "ok" },
    found: { text: "נמצאה גרסה חדשה. כשהיא תסיים לרדת, למעלה תופיע ההודעה \"יש גרסה חדשה\".", tone: "ok" },
    none: { text: "זו הגרסה העדכנית.", tone: "ok" },
    failed: { text: "הבדיקה לא הצליחה. אולי אין כרגע חיבור לאינטרנט.", tone: "bad" },
};
export function MenuScreen({ version, built }) {
    const [checking, setChecking] = useState(false);
    const [checked, setChecked] = useState();
    const check = () => {
        setChecking(true);
        setChecked(undefined);
        void checkForUpdate().then((result) => {
            setChecked(result);
            setChecking(false);
        });
    };
    const shown = checked === undefined ? undefined : CHECKED[checked];
    return (_jsxs(_Fragment, { children: [_jsx(TopBar, { title: "\u05EA\u05E4\u05E8\u05D9\u05D8", back: "#/" }), _jsx("nav", { class: "menu", children: LINKS.map((link) => (_jsxs("a", { href: link.href, children: [_jsx("span", { "aria-hidden": "true", children: link.icon }), _jsx("span", { children: link.label })] }, link.href))) }), _jsxs("section", { children: [_jsx("h2", { children: "\u05D2\u05E8\u05E1\u05D4" }), _jsxs("dl", { class: "status", children: [_jsx("dt", { children: "\u05DE\u05EA\u05D0\u05E8\u05D9\u05DA" }), _jsx("dd", { children: built === undefined ? "לא ידוע" : shownDate(built) }), _jsx("dt", { children: "\u05E7\u05D5\u05D3" }), _jsx("dd", { lang: "en", dir: "ltr", children: version })] }), _jsx("div", { class: "step-actions", children: _jsx("button", { class: "secondary", disabled: checking, onClick: check, children: "\u05D1\u05D3\u05D9\u05E7\u05EA \u05E2\u05D3\u05DB\u05D5\u05DF" }) }), checking && (_jsx("p", { class: "muted", role: "status", children: "\u05DE\u05D7\u05E4\u05E9\u05D9\u05DD \u05D2\u05E8\u05E1\u05D4 \u05D7\u05D3\u05E9\u05D4\u2026" })), shown !== undefined && (_jsx("p", { class: shown.tone, role: "status", children: shown.text })), _jsx("p", { class: "muted", children: _jsx("a", { href: "#/check", children: "\u05D1\u05D3\u05D9\u05E7\u05EA \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8" }) })] })] }));
}
