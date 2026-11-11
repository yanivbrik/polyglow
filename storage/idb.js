function settle(request) {
    return new Promise((resolve, reject) => {
        request.addEventListener("success", () => resolve(request.result));
        request.addEventListener("error", () => reject(request.error));
    });
}
export function openDatabase(name, version, stores) {
    const request = indexedDB.open(name, version);
    request.addEventListener("upgradeneeded", () => {
        for (const store of stores) {
            if (!request.result.objectStoreNames.contains(store))
                request.result.createObjectStore(store);
        }
    });
    request.addEventListener("success", () => request.result.addEventListener("versionchange", () => request.result.close()));
    return settle(request);
}
export async function deleteDatabase(name) {
    await settle(indexedDB.deleteDatabase(name));
}
export async function getValue(db, store, key) {
    return (await settle(db.transaction(store, "readonly").objectStore(store).get(key)));
}
export function putValue(db, store, key, value) {
    return putAll(db, [{ store, key, value }]);
}
export async function listValues(db, store, range) {
    return (await settle(db.transaction(store, "readonly").objectStore(store).getAll(range)));
}
export function putAll(db, writes, removals = []) {
    const stores = [...writes, ...removals].map((change) => change.store);
    const transaction = db.transaction([...new Set(stores)], "readwrite");
    for (const { store, range } of removals)
        transaction.objectStore(store).delete(range);
    for (const { store, key, value } of writes)
        transaction.objectStore(store).put(value, key);
    return new Promise((resolve, reject) => {
        transaction.addEventListener("complete", () => resolve());
        transaction.addEventListener("error", () => reject(transaction.error));
        transaction.addEventListener("abort", () => reject(transaction.error));
    });
}
