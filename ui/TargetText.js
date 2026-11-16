import { jsx as _jsx } from "../vendor/preact-jsx-runtime.js";
export function TargetText({ value, block = false, class: className }) {
    const Tag = block ? "p" : "span";
    return (_jsx(Tag, { lang: value.lang, dir: value.dir, class: className, children: value.text }));
}
