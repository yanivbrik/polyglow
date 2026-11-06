const MAX_NOTE_LENGTH = 1000;
export function describeStep(step) {
    switch (step.kind) {
        case "intro":
            return { stepKind: "intro", subject: step.subject, shown: [step.word.text, step.meaning.text, ...(step.example === undefined ? [] : [step.example.text.text, step.example.meaning.text])] };
        case "tip":
            return { stepKind: "tip", subject: step.subject, shown: step.lines.flatMap((line) => ("say" in line ? [line.say.text] : [line.target.text, ...(line.meaning === undefined ? [] : [line.meaning.text])])) };
        case "conversation":
            return { stepKind: `conversation/${step.stage}`, subject: step.subject, shown: [step.scene.text, ...step.lines.map((line) => `${line.speaker}: ${line.text.text} = ${line.meaning.text}`)] };
        case "reply":
            return {
                stepKind: "reply",
                subject: step.subject,
                shown: [...step.before.map((line) => `${line.speaker}: ${line.text.text}`), ...step.options.map((option, index) => (index === step.correct ? `[${option.text}]` : option.text)), step.line.meaning.text],
            };
        case "choice": {
            const lines = [step.prompt, step.hint, step.reveal].filter((line) => line !== undefined).map((line) => line.text);
            const options = step.options.map((option, index) => (index === step.correct ? `[${option.text}]` : option.text));
            return { stepKind: `choice/${step.mode}`, subject: step.subject, shown: [...lines, ...options] };
        }
        case "match":
            return { stepKind: "match", subject: step.pairs.map((pair) => pair.subject).join(","), shown: step.pairs.map((pair) => `${pair.target.text} = ${pair.source.text}`) };
        case "tiles":
            return { stepKind: "tiles", subject: step.subject, shown: [step.prompt.text, step.accepted[0] ?? "", step.tiles.map((tile) => tile.text).join(" ")] };
        case "type":
            return { stepKind: `type/${step.mode}`, subject: step.subject, shown: [...(step.prompt === undefined ? [] : [step.prompt.text]), ...step.accepted] };
        case "shadow":
            return { stepKind: "shadow", subject: step.subject, shown: [step.text.text, step.meaning.text] };
    }
}
export function cleanNote(note) {
    return note.trim().slice(0, MAX_NOTE_LENGTH);
}
export function formatReports(reports) {
    const lines = ["Polyglow content reports", `count: ${reports.length}`];
    for (const report of reports) {
        lines.push("", `date: ${new Date(report.ts).toISOString()}`, `build: ${report.build}`, `course: ${report.courseId}`, `step: ${report.stepKind}`, `subject: ${report.subject}`, ...report.shown.map((line) => `shown: ${line}`), `note: ${report.note === "" ? "(none)" : report.note.replace(/\s*\n\s*/g, " ")}`);
    }
    return lines.join("\n");
}
