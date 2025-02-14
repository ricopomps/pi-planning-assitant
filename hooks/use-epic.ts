import { Epic } from "@/types";
import { create } from "zustand";

type EpicStore = {
  epics: Epic[];
  selectedEpic?: Epic;
  setEpics: (epics: Epic[]) => void;
  setSelectedEpic: (epic?: Epic) => void;
  getSprintNumbers: () => number[];
  getAllSprintNumbers: () => number[];
};

export const useEpic = create<EpicStore>((set, get) => ({
  epics: [],
  selectedEpic: undefined,
  setEpics: (epics) => {
    set({ epics });
  },
  setSelectedEpic: (epic) => {
    if (epic) {
      set({ selectedEpic: epic });
    }
  },
  getSprintNumbers: () => {
    const epics = get().epics;
    const selectedEpic = get().selectedEpic;
    if (!selectedEpic) return [];
    const sortedEpics = [...epics].sort((a, b) => a.order - b.order);

    let sprintStart = 1;

    for (const epic of sortedEpics) {
      if (epic.id === selectedEpic.id) {
        return Array.from({ length: epic.sprints }, (_, i) => sprintStart + i);
      }
      sprintStart += epic.sprints;
    }

    return [];
  },
  getAllSprintNumbers: () => {
    const epics = get().epics;
    const selectedEpic = get().selectedEpic;
    if (!selectedEpic) return [];
    const sortedEpics = [...epics].sort((a, b) => a.order - b.order);

    let sprintStart = 1;

    const allSprints: number[] = [];

    for (const epic of sortedEpics) {
      allSprints.push(
        ...Array.from({ length: epic.sprints }, (_, i) => sprintStart + i)
      );
      sprintStart += epic.sprints;
    }

    return allSprints;
  },
}));
