export const CHECK_EVERY_MS = 60 * 60 * 1000;
let registered;
let lastCheck = 0;
export async function checkUpdate(registration) {
    if (registration === undefined)
        return "failed";
    try {
        await registration.update();
    }
    catch {
        return "failed";
    }
    if (registration.waiting !== null)
        return "ready";
    return registration.installing !== null ? "found" : "none";
}
export function checkForUpdate(now = Date.now()) {
    lastCheck = now;
    return checkUpdate(registered);
}
export function checkIsDue(last, now) {
    return now - last >= CHECK_EVERY_MS;
}
function checkOnReturn() {
    if (document.visibilityState === "visible" && checkIsDue(lastCheck, Date.now()))
        void checkForUpdate();
}
export async function registerServiceWorker(onUpdateReady) {
    if (!("serviceWorker" in navigator))
        return undefined;
    const container = navigator.serviceWorker;
    const hadController = container.controller !== null;
    let reloading = false;
    container.addEventListener("controllerchange", () => {
        if (hadController && !reloading) {
            reloading = true;
            location.reload();
        }
    });
    const registration = await container.register("./sw.js");
    const offer = (waiting) => onUpdateReady(() => waiting.postMessage("skip-waiting"));
    if (registration.waiting !== null && hadController)
        offer(registration.waiting);
    registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing?.addEventListener("statechange", () => {
            if (installing.state === "installed" && container.controller !== null)
                offer(installing);
        });
    });
    registered = registration;
    lastCheck = Date.now();
    document.addEventListener("visibilitychange", checkOnReturn);
    return registration;
}
