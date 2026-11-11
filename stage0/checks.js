import { deleteDatabase, getValue, openDatabase, putValue } from "../storage/idb.js";
import { clearAnswers } from "./saved.js";
const DATABASE = "polyglow-stage0";
export function openStage0Database() {
    return openDatabase(DATABASE, 1, ["checks", "recordings"]);
}
export async function resetStage0() {
    clearAnswers();
    await deleteDatabase(DATABASE);
}
export function buildVersion() {
    return document.querySelector('meta[name="polyglow-build"]')?.getAttribute("content") ?? "unknown";
}
export function buildDate() {
    const date = document.querySelector('meta[name="polyglow-built"]')?.getAttribute("content") ?? "";
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
}
export function isStandalone() {
    return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}
export async function checkIndexedDb() {
    try {
        const db = await openStage0Database();
        const token = crypto.getRandomValues(new Uint32Array(1))[0];
        await putValue(db, "checks", "roundtrip", token);
        const read = await getValue(db, "checks", "roundtrip");
        db.close();
        return read === token;
    }
    catch {
        return false;
    }
}
export function checkCspBlocksNetwork() {
    return new Promise((resolve) => {
        let blocked = false;
        const onViolation = (event) => {
            if (event.blockedURI.includes("example.invalid"))
                blocked = true;
        };
        document.addEventListener("securitypolicyviolation", onViolation);
        fetch("https://example.invalid/csp-check", { mode: "no-cors", cache: "no-store" })
            .catch(() => undefined)
            .finally(() => {
            setTimeout(() => {
                document.removeEventListener("securitypolicyviolation", onViolation);
                resolve(blocked);
            }, 100);
        });
    });
}
export async function storageStatus() {
    const storage = navigator.storage;
    const persisted = storage?.persisted ? await storage.persisted().catch(() => undefined) : undefined;
    const estimate = storage?.estimate ? await storage.estimate().catch(() => undefined) : undefined;
    return { persisted, quotaMB: estimate?.quota === undefined ? undefined : Math.round(estimate.quota / 1_000_000) };
}
