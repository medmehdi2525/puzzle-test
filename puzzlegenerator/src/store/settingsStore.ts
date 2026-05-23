import { create } from "zustand";
import {
  DEFAULT_FONT_SETTINGS,
  DEFAULT_PAGE_NUMBER_SETTINGS,
  type FontSettings,
  type PageNumberSettings,
} from "@/types/settings.types";
import { useBookStore } from "./bookStore";

interface SettingsState {
  fonts: FontSettings;
  pageNumbers: PageNumberSettings;
  setFonts: (fonts: FontSettings) => void;
  setPageNumbers: (pn: Partial<PageNumberSettings>) => void;
  syncToBook: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  fonts: { ...DEFAULT_FONT_SETTINGS },
  pageNumbers: { ...DEFAULT_PAGE_NUMBER_SETTINGS },

  setFonts: (fonts) => set({ fonts: { ...fonts } }),

  setPageNumbers: (partial) =>
    set((s) => ({ pageNumbers: { ...s.pageNumbers, ...partial } })),

  syncToBook: () => {
    const { fonts, pageNumbers } = get();
    useBookStore.getState().updateSettings({ fonts, pageNumbers });
  },
}));
