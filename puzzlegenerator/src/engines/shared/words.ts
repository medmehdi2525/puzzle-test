export const WORD_CATEGORIES: Record<string, string[]> = {
  animals: [
    "elephant", "giraffe", "penguin", "dolphin", "kangaroo", "tiger", "lion",
    "zebra", "bear", "wolf", "rabbit", "eagle", "owl", "turtle", "snake",
    "whale", "shark", "butterfly", "camel", "horse", "sheep", "goat",
  ],
  countries: [
    "canada", "brazil", "france", "japan", "egypt", "india", "mexico",
    "norway", "spain", "italy", "kenya", "chile", "peru", "poland",
  ],
  food: [
    "pizza", "pasta", "sushi", "taco", "bread", "cheese", "apple",
    "banana", "orange", "coffee", "honey", "rice", "salad", "soup",
  ],
  sports: [
    "soccer", "tennis", "hockey", "rugby", "cricket", "boxing", "skiing",
    "surfing", "cycling", "rowing", "archery", "fencing",
  ],
  science: [
    "atom", "planet", "gravity", "energy", "laser", "virus", "cell",
    "orbit", "fusion", "quartz", "neuron", "photon",
  ],
  cities: [
    "london", "paris", "tokyo", "sydney", "boston", "denver", "oslo",
    "prague", "vienna", "dublin", "seattle", "austin",
  ],
  music: [
    "guitar", "piano", "violin", "drums", "cello", "flute", "harp",
    "trumpet", "banjo", "organ", "oboe", "clarinet",
  ],
  nature: [
    "forest", "river", "mountain", "ocean", "meadow", "canyon", "glacier",
    "volcano", "desert", "valley", "lagoon", "prairie",
  ],
};

export const QUOTES = [
  "The only way to do great work is to love what you do.",
  "In the middle of difficulty lies opportunity.",
  "Life is what happens when you are busy making other plans.",
  "The future belongs to those who believe in beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
];

export function pickWords(
  category: string,
  count: number,
  rng: () => number
): string[] {
  const pool = [...(WORD_CATEGORIES[category] ?? WORD_CATEGORIES.animals)];
  const out: string[] = [];
  while (out.length < count && pool.length > 0) {
    const i = Math.floor(rng() * pool.length);
    out.push(pool.splice(i, 1)[0].toUpperCase());
  }
  return out;
}

export function pickQuote(rng: () => number): string {
  return QUOTES[Math.floor(rng() * QUOTES.length)];
}
