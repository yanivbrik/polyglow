export const TUKI_COLORS = {
    body: "#3dbb6c",
    wing: "#2a9455",
    belly: "#c3f0b8",
    beak: "#ffb020",
    beakShadow: "#d97c06",
    crest: "#ff7a59",
    cheek: "#ff7a8a",
    ink: "#1d1638",
    white: "#ffffff",
};
const c = TUKI_COLORS;
const circle = (cx, cy, r, fill) => ({ kind: "ellipse", cx, cy, rx: r, ry: r, fill });
export function tukiShapes(mood) {
    const lift = mood === "happy" ? -3 : mood === "meh" ? 3 : 0;
    const wing = mood === "happy" ? 40 : 10;
    const shapes = [
        { kind: "ellipse", cx: 43, cy: 21 + lift, rx: 4, ry: 9, fill: c.crest, rotate: { angle: -28, x: 43, y: 28 + lift } },
        { kind: "ellipse", cx: 50, cy: 17 + lift, rx: 4.5, ry: 10, fill: c.crest },
        { kind: "ellipse", cx: 57, cy: 21 + lift, rx: 4, ry: 9, fill: c.crest, rotate: { angle: 28, x: 57, y: 28 + lift } },
        { kind: "ellipse", cx: 42, cy: 91, rx: 5.5, ry: 3.2, fill: c.beak },
        { kind: "ellipse", cx: 58, cy: 91, rx: 5.5, ry: 3.2, fill: c.beak },
        { kind: "ellipse", cx: 19, cy: 63, rx: 7, ry: 14, fill: c.wing, rotate: { angle: wing, x: 24, y: 52 } },
        { kind: "ellipse", cx: 81, cy: 63, rx: 7, ry: 14, fill: c.wing, rotate: { angle: -wing, x: 76, y: 52 } },
        { kind: "ellipse", cx: 50, cy: 58, rx: 31, ry: 33, fill: c.body },
        { kind: "ellipse", cx: 50, cy: 71, rx: 19, ry: 16, fill: c.belly },
    ];
    if (mood === "happy") {
        shapes.push({ kind: "line", d: "M33 49 Q40 40 47 49 M53 49 Q60 40 67 49", stroke: c.ink, width: 3.6 }, { kind: "ellipse", cx: 29, cy: 58, rx: 5, ry: 3.4, fill: c.cheek, opacity: 0.6 }, { kind: "ellipse", cx: 71, cy: 58, rx: 5, ry: 3.4, fill: c.cheek, opacity: 0.6 });
    }
    else {
        const pupil = mood === "meh" ? 49.5 : 48;
        shapes.push(circle(40, 47, 8.5, c.white), circle(60, 47, 8.5, c.white), circle(41, pupil, 4.8, c.ink), circle(59, pupil, 4.8, c.ink));
        if (mood === "meh") {
            shapes.push({ kind: "path", d: "M31 47.5 A9 9 0 0 1 49 47.5 Z M51 47.5 A9 9 0 0 1 69 47.5 Z", fill: c.body }, { kind: "line", d: "M31.5 47.5 H48.5 M51.5 47.5 H68.5", stroke: c.ink, width: 2.2 });
        }
        else {
            shapes.push(circle(42.8, 45.8, 1.7, c.white), circle(60.8, 45.8, 1.7, c.white));
        }
    }
    shapes.push({ kind: "path", d: "M43 55 Q50 50.5 57 55 Q57.5 63 50 69 Q42.5 63 43 55 Z", fill: c.beak }, { kind: "path", d: "M46 61.5 Q50 64.5 54 61.5 Q53 66.5 50 68.4 Q47 66.5 46 61.5 Z", fill: c.beakShadow });
    return shapes;
}
