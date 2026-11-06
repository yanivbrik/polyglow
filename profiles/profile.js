import { startStreak } from "../game/progress.js";
export const AVATARS = ["🦜", "🦊", "🐢", "🐙", "🦉", "🐝", "🦄", "🐳"];
export function newProfile(id, fields, now) {
    return { ...fields, name: fields.name.trim(), id, streak: startStreak(), createdAt: now };
}
export function withoutProgress(profile) {
    const { bestMatch: _record, ...kept } = profile;
    return { ...kept, streak: startStreak() };
}
