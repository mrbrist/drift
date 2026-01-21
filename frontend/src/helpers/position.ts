import type { CardInterface } from "./interfaces";

export function getNewCardPosition(
  cards: CardInterface[],
  overIndex: number,
): number {
  const prev = cards[overIndex - 1];
  const next = cards[overIndex];

  if (!prev && next) {
    return next.position / 2;
  }

  if (prev && !next) {
    return prev.position + 1024;
  }

  if (prev && next) {
    return (prev.position + next.position) / 2;
  }

  return 1024;
}
