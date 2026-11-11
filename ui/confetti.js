const COLORS = ["#6a4fd6", "#9d86ff", "#ffc457", "#ff7a59", "#3dbb6c", "#4fc3f7"];
const PIECES = 110;
const FRAME_MS = 1000 / 60;
const MAX_MS = 5000;
export function celebrate(from) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
    const canvas = document.createElement("canvas");
    canvas.className = "confetti";
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
    const context = canvas.getContext("2d");
    if (context === null)
        return canvas.remove();
    const width = innerWidth;
    const height = innerHeight;
    const ratio = devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const box = from.getBoundingClientRect();
    const pieces = Array.from({ length: PIECES }, (_, index) => {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
        const speed = 6 + Math.random() * 7;
        return {
            x: box.left + box.width / 2,
            y: box.top + box.height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            turn: Math.random() * 6,
            spin: (Math.random() - 0.5) * 0.4,
            width: 6 + Math.random() * 5,
            height: 3 + Math.random() * 4,
            color: COLORS[index % COLORS.length],
        };
    });
    const start = performance.now();
    let last = start;
    const frame = (now) => {
        const steps = Math.min((now - last) / FRAME_MS, 3);
        last = now;
        context.clearRect(0, 0, width, height);
        let visible = false;
        for (const piece of pieces) {
            piece.vy += 0.25 * steps;
            piece.vx *= 0.99 ** steps;
            piece.vy *= 0.99 ** steps;
            piece.x += piece.vx * steps;
            piece.y += piece.vy * steps;
            piece.turn += piece.spin * steps;
            if (piece.y > height + 20)
                continue;
            visible = true;
            context.save();
            context.translate(piece.x, piece.y);
            context.rotate(piece.turn);
            context.scale(1, Math.cos(piece.turn * 2));
            context.fillStyle = piece.color;
            context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
            context.restore();
        }
        if (visible && now - start < MAX_MS)
            requestAnimationFrame(frame);
        else
            canvas.remove();
    };
    requestAnimationFrame(frame);
}
