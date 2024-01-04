import { atom, useAtomValue, useSetAtom } from "jotai";

export const showNegationModalAtom = atom<boolean>(false);
export const useIsNegationModalOpen = () => useAtomValue(showNegationModalAtom);
export const useToggleNegationModal = () => {
  const set = useSetAtom(showNegationModalAtom);
  return () => set((prev) => !prev);
};
