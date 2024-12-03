import { create } from 'zustand';
import { StudySet } from '../types';

interface StudyStore {
  studySets: StudySet[];
  currentSet: StudySet | null;
  setCurrentSet: (set: StudySet) => void;
  addStudySet: (set: StudySet) => void;
}

export const useStudyStore = create<StudyStore>((set) => ({
  studySets: [],
  currentSet: null,
  setCurrentSet: (studySet) => set({ currentSet: studySet }),
  addStudySet: (studySet) => 
    set((state) => ({ studySets: [...state.studySets, studySet] })),
}));