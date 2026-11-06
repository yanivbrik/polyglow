const en = (text) => ({ text, lang: "en", dir: "ltr" });
const ar = (text) => ({ text, lang: "ar", dir: "rtl" });
export const COURSE = { lang: "en", dir: "ltr" };
export const SAMPLE_SENTENCE = en("Hello! This short sentence checks how this voice sounds.");
export const BIDI = {
    answer: en("I'm 25 years old, and I live in Tel Aviv."),
    wrongAnswer: en("I have 25 years, and I live in Tel Aviv."),
    word: en("apple"),
    question: en("Where's the bus stop?"),
    tiles: ["I'm", "going", "to", "the", "beach", "tomorrow."].map(en),
    mistake: en("I has a dog."),
    lesson: en("Lesson 3 of 10 (85%)"),
    arabic: ar("مرحبا، كيف حالك؟"),
};
