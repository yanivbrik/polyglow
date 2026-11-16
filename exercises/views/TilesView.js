import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "../../vendor/preact-jsx-runtime.js";
import { useState } from "../../vendor/preact-hooks.js";
import { AudioButtons } from "../../ui/AudioButtons.js";
import { say } from "../../ui/say.js";
import { TargetText } from "../../ui/TargetText.js";
import { checkTiles } from "../answers.js";
import { Feedback } from "./Feedback.js";
export function TilesView({ step, address, onDone }) {
    const [chosen, setChosen] = useState([]);
    const [checked, setChecked] = useState(false);
    const direction = step.tiles[0]?.dir ?? "ltr";
    const lang = step.tiles[0]?.lang ?? "";
    const verdict = checkTiles(chosen.map((index) => step.tiles[index]?.text ?? ""), step.accepted, step.rules);
    const finish = () => {
        onDone({ right: verdict === "right" ? [step.subject] : [], almost: verdict === "almost" ? [step.subject] : [], wrong: verdict === "wrong" ? [step.subject] : [] });
    };
    return (_jsxs("div", { class: "step", children: [_jsx("p", { class: "eyebrow", children: say(address, "בנה את המשפט", "בני את המשפט") }), _jsx(TargetText, { block: true, value: step.prompt, class: "prompt-line" }), _jsx("div", { class: "tile-answer", dir: direction, lang: lang, children: chosen.map((index) => (_jsx("button", { class: "tile", disabled: checked, onClick: () => setChosen(chosen.filter((other) => other !== index)), children: step.tiles[index]?.text }, index))) }), _jsx("div", { class: "tile-pool", dir: direction, lang: lang, children: step.tiles.map((tile, index) => (_jsx("button", { class: `tile ${chosen.includes(index) ? "used" : ""}`, disabled: checked || chosen.includes(index), onClick: () => setChosen([...chosen, index]), children: tile.text }, index))) }), checked ? (_jsxs(_Fragment, { children: [step.audio !== undefined && verdict !== "wrong" && _jsx(AudioButtons, { clip: step.audio, autoPlay: true }), _jsx(Feedback, { outcome: verdict === "almost" ? "order" : verdict, expected: { text: step.accepted[0] ?? "", lang, dir: direction }, address: address, onContinue: finish })] })) : (_jsx("div", { class: "step-actions", children: _jsx("button", { disabled: chosen.length === 0, onClick: () => setChecked(true), children: "\u05D1\u05D3\u05D9\u05E7\u05D4" }) }))] }));
}
