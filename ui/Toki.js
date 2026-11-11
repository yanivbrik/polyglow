import { jsx as _jsx } from "../vendor/preact-jsx-runtime.js";
import { tukiShapes } from "./toki-shapes.js";
function draw(shape, key) {
    if (shape.kind === "ellipse") {
        const { cx, cy, rx, ry, fill, opacity, rotate } = shape;
        const turn = rotate === undefined ? undefined : `rotate(${rotate.angle} ${rotate.x} ${rotate.y})`;
        return _jsx("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, fill: fill, opacity: opacity, transform: turn }, key);
    }
    if (shape.kind === "path")
        return _jsx("path", { d: shape.d, fill: shape.fill }, key);
    return _jsx("path", { d: shape.d, fill: "none", stroke: shape.stroke, "stroke-width": shape.width, "stroke-linecap": "round" }, key);
}
export function Toki({ mood = "calm", size = "inline", glow = false, pop = false }) {
    return (_jsx("span", { class: ["toki", size, glow && "glow", pop && "pop"].filter(Boolean).join(" "), "aria-hidden": "true", children: _jsx("svg", { viewBox: "0 0 100 100", focusable: "false", children: tukiShapes(mood).map(draw) }) }));
}
