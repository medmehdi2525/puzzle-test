import { create } from "zustand";
import type { PuzzlePage } from "@/types/page.types";
import {
  DEFAULT_BOOK_SETTINGS,
  type BookSettings,
  type TrimSize,
} from "@/types/settings.types";
import { generateId } from "@/lib/utils";

interface BookState {
  settings: BookSettings;
  pages: PuzzlePage[];
  currentPageId: string | null;
  setTrim: (trim: TrimSize) => void;
  toggleBleed: () => void;
  setGutterSize: (size: number) => void;
  setMargins: (margins: number) => void;
  updateSettings: (partial: Partial<BookSettings>) => void;
  addPage: (page?: Partial<PuzzlePage>) => string;
  deletePage: (id: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setCurrentPage: (id: string) => void;
  updatePage: (id: string, updater: (page: PuzzlePage) => PuzzlePage) => void;
  insertPagesAt: (index: number, pages: PuzzlePage[]) => void;
  getCurrentPage: () => PuzzlePage | undefined;
}

function createBlankPage(): PuzzlePage {
  return {
    id: generateId(),
    pageType: "blank",
    puzzles: [],
    layout: "1",
    elements: [],
  };
}

export const useBookStore = create<BookState>((set, get) => ({
  settings: { ...DEFAULT_BOOK_SETTINGS },
  pages: [createBlankPage()],
  currentPageId: null,

  setTrim: (trim) =>
    set((s) => ({ settings: { ...s.settings, trim } })),

  toggleBleed: () =>
    set((s) => ({
      settings: { ...s.settings, bleedEnabled: !s.settings.bleedEnabled },
    })),

  setGutterSize: (gutterSize) =>
    set((s) => ({ settings: { ...s.settings, gutterSize } })),

  setMargins: (m) =>
    set((s) => ({
      settings: {
        ...s.settings,
        marginTop: m,
        marginBottom: m,
        marginInner: m,
        marginOuter: m,
      },
    })),

  updateSettings: (partial) =>
    set((s) => ({ settings: { ...s.settings, ...partial } })),

  addPage: (partial) => {
    const page: PuzzlePage = { ...createBlankPage(), ...partial, id: generateId() };
    set((s) => {
      const pages = [...s.pages, page];
      return { pages, currentPageId: page.id };
    });
    return page.id;
  },

  deletePage: (id) =>
    set((s) => {
      if (s.pages.length <= 1) return s;
      const pages = s.pages.filter((p) => p.id !== id);
      const currentPageId =
        s.currentPageId === id ? pages[0]?.id ?? null : s.currentPageId;
      return { pages, currentPageId };
    }),

  reorderPages: (fromIndex, toIndex) =>
    set((s) => {
      const pages = [...s.pages];
      const [removed] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, removed);
      return { pages };
    }),

  setCurrentPage: (id) => set({ currentPageId: id }),

  updatePage: (id, updater) =>
    set((s) => ({
      pages: s.pages.map((p) => (p.id === id ? updater(p) : p)),
    })),

  insertPagesAt: (index, newPages) =>
    set((s) => {
      const pages = [...s.pages];
      pages.splice(index, 0, ...newPages);
      return { pages, currentPageId: newPages[0]?.id ?? s.currentPageId };
    }),

  getCurrentPage: () => {
    const { pages, currentPageId } = get();
    const id = currentPageId ?? pages[0]?.id;
    return pages.find((p) => p.id === id);
  },
}));

// Initialize current page
useBookStore.setState((s) => ({
  currentPageId: s.pages[0]?.id ?? null,
}));
