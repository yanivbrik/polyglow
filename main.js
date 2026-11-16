import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "./vendor/preact-jsx-runtime.js";
import { render } from "./vendor/preact.js";
import { useEffect, useState } from "./vendor/preact-hooks.js";
import { Learner } from "./app/Learner.js";
import { parseRoute } from "./app/route.js";
import { registerServiceWorker } from "./app/service-worker.js";
import { buildVersion } from "./stage0/checks.js";
import { Stage0Page } from "./stage0/Stage0Page.js";
import { TopBar } from "./ui/TopBar.js";
import { applyTheme, readTheme } from "./ui/theme.js";
applyTheme(readTheme());
function App() {
    const [applyUpdate, setApplyUpdate] = useState();
    const [route, setRoute] = useState(() => parseRoute(location.hash));
    useEffect(() => {
        registerServiceWorker((apply) => setApplyUpdate(() => apply)).catch((error) => console.error("Offline worker failed", error));
        const onChange = () => {
            setRoute(parseRoute(location.hash));
            scrollTo(0, 0);
        };
        addEventListener("hashchange", onChange);
        return () => removeEventListener("hashchange", onChange);
    }, []);
    return (_jsxs(_Fragment, { children: [applyUpdate !== undefined && (_jsxs("div", { class: "banner", role: "status", children: [_jsx("span", { children: "\u05D9\u05E9 \u05D2\u05E8\u05E1\u05D4 \u05D7\u05D3\u05E9\u05D4" }), _jsx("button", { onClick: applyUpdate, children: "\u05E2\u05D3\u05DB\u05D5\u05DF" })] })), route.name === "check" ? (_jsxs(_Fragment, { children: [_jsx(TopBar, { title: "\u05D1\u05D3\u05D9\u05E7\u05EA \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8", back: "#/menu" }), _jsx(Stage0Page, { version: buildVersion() })] })) : (_jsx(Learner, { route: route }))] }));
}
const root = document.getElementById("app");
if (root !== null)
    render(_jsx(App, {}), root);
