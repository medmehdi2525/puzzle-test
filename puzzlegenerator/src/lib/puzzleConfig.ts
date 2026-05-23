import { PUZZLE_DEFINITIONS } from "./puzzleDefinitions";

export const PUZZLE_BUTTONS = PUZZLE_DEFINITIONS.map((d) => ({
  type: d.type,
  label: d.label,
  dialogId: d.type,
  implemented: true,
}));

export const PUZZLE_DISPLAY_NAMES = Object.fromEntries(
  PUZZLE_BUTTONS.map((p) => [p.type, p.label])
);
