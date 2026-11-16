let element;
let upNext = [];
let turn;
export const SLOW_RATE = 0.75;
function endTurn() {
    const ending = turn;
    turn = undefined;
    ending?.onClip?.(undefined);
}
function advance() {
    const [next, ...rest] = upNext;
    upNext = rest;
    if (next === undefined)
        return endTurn();
    if (turn !== undefined) {
        turn.index += 1;
        turn.onClip?.(turn.index);
    }
    start(next, turn?.rate ?? 1);
}
function start(url, rate) {
    if (element === undefined) {
        element = new Audio();
        element.addEventListener("ended", advance);
        element.addEventListener("error", advance);
    }
    element.pause();
    element.src = url;
    element.playbackRate = rate;
    void element.play().catch((error) => {
        if (error instanceof DOMException && error.name === "NotAllowedError") {
            upNext = [];
            endTurn();
        }
    });
}
export function playClip(url, rate = 1) {
    upNext = [];
    endTurn();
    start(url, rate);
}
export function playInTurn(urls, { rate = 1, onClip } = {}) {
    endTurn();
    const [first, ...rest] = urls;
    if (first === undefined)
        return;
    upNext = rest;
    turn = { index: 0, rate, onClip };
    onClip?.(0);
    start(first, rate);
}
export function stopClip() {
    upNext = [];
    endTurn();
    element?.pause();
}
