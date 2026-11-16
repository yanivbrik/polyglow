import { parsePack } from "./validate.js";
const loaded = new Map();
export function loadPack(id) {
    let pack = loaded.get(id);
    if (pack === undefined) {
        pack = fetch(`content/${id}/pack.json`)
            .then((response) => {
            if (!response.ok)
                throw new Error(`Pack ${id}: ${response.status}`);
            return response.json();
        })
            .then(parsePack);
        loaded.set(id, pack);
    }
    return pack;
}
