export type WordListCategory =
  | "animals"
  | "countries"
  | "cities"
  | "food"
  | "sports"
  | "science"
  | "movies"
  | "music"
  | "history"
  | "technology"
  | "nature"
  | "occupations"
  | "quotes"
  | "proverbs";

export async function loadWordList(
  category: WordListCategory
): Promise<string[]> {
  const mod = await import(`@/data/wordlists/${category}.json`);
  return mod.default as string[];
}

export const WORD_LIST_CATEGORIES: { id: WordListCategory; label: string }[] = [
  { id: "animals", label: "Animals" },
  { id: "countries", label: "Countries" },
  { id: "food", label: "Food & Drink" },
  { id: "sports", label: "Sports" },
  { id: "science", label: "Science" },
  { id: "quotes", label: "Famous Quotes" },
];
