import { atom, useAtom } from "jotai";

const modalState = atom(false);

export function useCreateWorkspaceModal() {
  return useAtom(modalState);
}
