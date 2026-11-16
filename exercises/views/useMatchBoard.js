import { useEffect, useState } from "../../vendor/preact-hooks.js";
export function useMatchBoard(onMatch, onMiss, shakeMs) {
    const [target, setTarget] = useState();
    const [source, setSource] = useState();
    const [matched, setMatched] = useState([]);
    const [shaking, setShaking] = useState(false);
    useEffect(() => {
        if (target === undefined || source === undefined)
            return;
        if (target === source) {
            setMatched((all) => [...all, target]);
            setTarget(undefined);
            setSource(undefined);
            onMatch(target);
            return;
        }
        onMiss([target, source]);
        setShaking(true);
        const timer = setTimeout(() => {
            setShaking(false);
            setTarget(undefined);
            setSource(undefined);
        }, shakeMs);
        return () => clearTimeout(timer);
    }, [target, source]);
    const stateOf = (subject, selected) => {
        if (matched.includes(subject))
            return "matched";
        if (selected !== subject)
            return "";
        return shaking ? "selected shake" : "selected";
    };
    return {
        matched,
        shaking,
        pickTarget: setTarget,
        pickSource: setSource,
        targetState: (subject) => stateOf(subject, target),
        sourceState: (subject) => stateOf(subject, source),
    };
}
