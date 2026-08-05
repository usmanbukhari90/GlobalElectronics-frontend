import { create } from "zustand";

interface SearchOverlayState {
  open: boolean;
  query: string;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
}

export const useSearchOverlayStore = create<SearchOverlayState>((set) => ({
  open: false,
  query: "",
  setOpen: (open) => set({ open }),
  setQuery: (query) => set({ query }),
}));