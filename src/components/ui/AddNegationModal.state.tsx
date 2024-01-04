import { atom, useAtomValue, useSetAtom } from "jotai";

const negationModalCallback = atom<((negation: string) => void) | null>(null);

export const useIsNegationModalOpen = () =>
  useAtomValue(negationModalCallback) !== null;

export const useNegationModalCallback = () =>
  useAtomValue(negationModalCallback);

export const useTriggerNegationModal = () => {
  const set = useSetAtom(negationModalCallback);

  return (callback: (negation: string) => void) => {
    set(() => callback);
  };
};

export const useDismissNegationModal = () => {
  const set = useSetAtom(negationModalCallback);
  return () => {
    set(null);
  };
};
