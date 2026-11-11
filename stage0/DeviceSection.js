import { jsx as _jsx, jsxs as _jsxs } from "../vendor/preact-jsx-runtime.js";
import { useEffect, useState } from "../vendor/preact-hooks.js";
import { checkCspBlocksNetwork, checkIndexedDb, isStandalone, storageStatus } from "./checks.js";
function YesNo({ value, yes = "כן", no = "לא" }) {
    if (value === undefined)
        return _jsx("dd", { class: "muted", children: "\u05D1\u05D5\u05D3\u05E7\u2026" });
    return _jsx("dd", { class: value ? "ok" : "bad", children: value ? yes : no });
}
const yesNo = (value) => (value === undefined ? "unknown" : value ? "yes" : "no");
export function DeviceSection({ version, report }) {
    const hasWorker = "serviceWorker" in navigator;
    const [standalone] = useState(isStandalone);
    const [offlineReady, setOfflineReady] = useState(hasWorker && navigator.serviceWorker.controller !== null);
    const [online, setOnline] = useState(navigator.onLine);
    const [storage, setStorage] = useState();
    const [indexedDb, setIndexedDb] = useState();
    const [cspBlocks, setCspBlocks] = useState();
    useEffect(() => {
        const onControl = () => setOfflineReady(true);
        const onOnline = () => setOnline(navigator.onLine);
        if (hasWorker)
            navigator.serviceWorker.addEventListener("controllerchange", onControl);
        addEventListener("online", onOnline);
        addEventListener("offline", onOnline);
        void storageStatus().then(setStorage);
        void checkIndexedDb().then(setIndexedDb);
        void checkCspBlocksNetwork().then(setCspBlocks);
        return () => {
            if (hasWorker)
                navigator.serviceWorker.removeEventListener("controllerchange", onControl);
            removeEventListener("online", onOnline);
            removeEventListener("offline", onOnline);
        };
    }, [hasWorker]);
    useEffect(() => report("standalone", yesNo(standalone)), [standalone, report]);
    useEffect(() => report("offlineReady", hasWorker ? yesNo(offlineReady) : "unsupported"), [hasWorker, offlineReady, report]);
    useEffect(() => report("online", yesNo(online)), [online, report]);
    useEffect(() => {
        if (storage === undefined)
            return;
        report("persisted", yesNo(storage.persisted));
        report("quotaMB", String(storage.quotaMB ?? "unknown"));
    }, [storage, report]);
    useEffect(() => report("indexedDB", indexedDb === undefined ? "checking" : indexedDb ? "ok" : "failed"), [indexedDb, report]);
    useEffect(() => report("cspBlocksNetwork", yesNo(cspBlocks)), [cspBlocks, report]);
    const requestPersist = async () => {
        await navigator.storage?.persist?.().catch(() => false);
        setStorage(await storageStatus());
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "\u05D4\u05DE\u05DB\u05E9\u05D9\u05E8" }), _jsxs("dl", { class: "status", children: [_jsx("dt", { children: "\u05E4\u05EA\u05D5\u05D7 \u05DB\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4 \u05DE\u05D5\u05EA\u05E7\u05E0\u05EA" }), _jsx(YesNo, { value: standalone }), _jsx("dt", { children: "\u05E2\u05D5\u05D1\u05D3 \u05D1\u05DC\u05D9 \u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8" }), hasWorker ? _jsx(YesNo, { value: offlineReady, no: "\u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0, \u05E6\u05E8\u05D9\u05DA \u05DC\u05D8\u05E2\u05D5\u05DF \u05E9\u05D5\u05D1" }) : _jsx("dd", { class: "bad", children: "\u05DC\u05D0 \u05E0\u05EA\u05DE\u05DA" }), _jsx("dt", { children: "\u05DE\u05D7\u05D5\u05D1\u05E8 \u05DC\u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8 \u05E2\u05DB\u05E9\u05D9\u05D5" }), _jsx(YesNo, { value: online }), _jsx("dt", { children: "\u05D0\u05D7\u05E1\u05D5\u05DF \u05E7\u05D1\u05D5\u05E2" }), _jsx(YesNo, { value: storage === undefined ? undefined : storage.persisted === true }), _jsx("dt", { children: "\u05DE\u05E7\u05D5\u05DD \u05DC\u05D0\u05D7\u05E1\u05D5\u05DF" }), _jsx("dd", { children: storage?.quotaMB === undefined ? "לא ידוע" : `${storage.quotaMB.toLocaleString("he-IL")} מ"ב` }), _jsx("dt", { children: "\u05DE\u05E1\u05D3 \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05D1\u05DE\u05DB\u05E9\u05D9\u05E8" }), _jsx(YesNo, { value: indexedDb, yes: "\u05EA\u05E7\u05D9\u05DF", no: "\u05DC\u05D0 \u05E2\u05D5\u05D1\u05D3" }), _jsx("dt", { children: "\u05D7\u05E1\u05D9\u05DE\u05EA \u05E9\u05DC\u05D9\u05D7\u05D4 \u05D4\u05D7\u05D5\u05E6\u05D4" }), _jsx(YesNo, { value: cspBlocks, yes: "\u05D7\u05E1\u05D5\u05DD", no: "\u05DC\u05D0 \u05D7\u05E1\u05D5\u05DD" }), _jsx("dt", { children: "\u05D2\u05E8\u05E1\u05D4" }), _jsx("dd", { lang: "en", dir: "ltr", children: version })] }), storage !== undefined && storage.persisted !== true && (_jsx("div", { class: "row", children: _jsx("button", { class: "secondary", onClick: requestPersist, children: "\u05DC\u05D1\u05E7\u05E9 \u05D0\u05D7\u05E1\u05D5\u05DF \u05E7\u05D1\u05D5\u05E2" }) }))] }));
}
