export const DEFAULT_FOCUS = "listening";
export function isGraded(step) {
    return step.kind !== "intro" && step.kind !== "tip" && step.kind !== "conversation";
}
export function isOnlyHere(step) {
    return "onlyHere" in step && step.onlyHere === true;
}
