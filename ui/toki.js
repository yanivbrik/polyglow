const RIGHT = {
    m: ["נכון!", "יפה מאוד!", "בדיוק ככה.", "טוקי מרוצה.", "אתה בכיוון."],
    f: ["נכון!", "יפה מאוד!", "בדיוק ככה.", "טוקי מרוצה.", "את בכיוון."],
};
const WRONG = {
    m: ["לא נורא, זה יחזור בסוף השיעור.", "טוקי לא כועס. טוקי רק מאוכזב.", "כמעט כל אחד טועה בזה.", "עוד רגע תנסה שוב."],
    f: ["לא נורא, זה יחזור בסוף השיעור.", "טוקי לא כועס. טוקי רק מאוכזב.", "כמעט כל אחת טועה בזה.", "עוד רגע תנסי שוב."],
};
const pick = (lines) => lines[Math.floor(Math.random() * lines.length)] ?? "";
export const rightLine = (address) => pick(RIGHT[address]);
export const wrongLine = (address) => pick(WRONG[address]);
