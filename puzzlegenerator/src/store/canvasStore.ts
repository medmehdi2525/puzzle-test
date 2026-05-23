import { create } from "zustand";

interface CanvasState {
  selectedElementId: string | null;
  nudgeDistance: number;
  resizePercent: number;
  zoom: number;
  openDialog: string | null;
  pendingPuzzleType: string | null;
  showProgress: boolean;
  progress: number;
  progressLabel: string;
  setSelectedElement: (id: string | null) => void;
  setNudgeDistance: (d: number) => void;
  setResizePercent: (p: number) => void;
  setZoom: (z: number) => void;
  openDialogById: (id: string | null) => void;
  setPendingPuzzle: (type: string | null) => void;
  setProgress: (show: boolean, progress?: number, label?: string) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  selectedElementId: null,
  nudgeDistance: 0.1,
  resizePercent: 100,
  zoom: 1,
  openDialog: null,
  pendingPuzzleType: null,
  showProgress: false,
  progress: 0,
  progressLabel: "",

  setSelectedElement: (id) => set({ selectedElementId: id }),
  setNudgeDistance: (nudgeDistance) => set({ nudgeDistance }),
  setResizePercent: (resizePercent) => set({ resizePercent }),
  setZoom: (zoom) => set({ zoom }),
  openDialogById: (openDialog) => set({ openDialog }),
  setPendingPuzzle: (pendingPuzzleType) => set({ pendingPuzzleType }),
  setProgress: (showProgress, progress = 0, progressLabel = "") =>
    set({ showProgress, progress, progressLabel }),
}));
