import create from "zustand";

export const useProgress = create(set => ({
  percentage: 0,
  message: "",
  updatePercentage: percentage => set(() => ({ percentage })),
  updateMessage: message => set(() => ({ message })),
}));
