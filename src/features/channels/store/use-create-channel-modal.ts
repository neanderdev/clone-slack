import { atom, useAtom } from "jotai";

const modalState = atom(false);

export function useCreateChannelModal() {
  return useAtom(modalState);
}
