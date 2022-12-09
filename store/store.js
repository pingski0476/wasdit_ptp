import { atom } from "jotai";

export const errorAtom = atom(false);
export const modalEditAtom = atom(false);
export const modalAddAtom = atom(false);
export const modalDeleteAtom = atom(false);
export const editIdModalAtom = atom("");
export const deleteModalAtom = atom("");

export const addModalRealAtom = atom(false);
export const editModalRealAtom = atom(false);
export const editIdModalRealAtom = atom("");
export const deleteModalRealAtom = atom(false);
export const deleteIdModalRealAtom = atom("");

export const successModelAtom = atom(false);
