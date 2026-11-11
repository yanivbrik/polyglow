import { shuffled } from "../exercises/rng.js";
export const GAME_SECONDS = 60;
export const ROUND_PAIRS = 5;
export const MIN_WORDS = 5;
const MAX_GAME_RIGHT = 10;
export function dealRound(deck, rng) {
    const size = Math.min(ROUND_PAIRS, deck.cards.length);
    const cards = deck.position + size > deck.cards.length ? shuffled(deck.cards, rng) : deck.cards;
    const position = cards === deck.cards ? deck.position : 0;
    return { pairs: cards.slice(position, position + size), deck: { cards, position: position + size } };
}
export function scoredPairs(score) {
    return Math.min(score, MAX_GAME_RIGHT);
}
