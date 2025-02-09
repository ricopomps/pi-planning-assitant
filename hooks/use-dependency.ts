import { BoardWithLists, CardWithListAndDependencies } from "@/types";
import { Card } from "@prisma/client";
import { create } from "zustand";

type DependencyStore = {
  boards: BoardWithLists[];
  selectedCard?: CardWithListAndDependencies;
  dependencies: Card[];
  dependentOn: Card[];
  setBoards: (boards: BoardWithLists[]) => void;
  setSelectedCard: (card?: CardWithListAndDependencies) => void;
};

export const useDependency = create<DependencyStore>((set) => ({
  boards: [],
  selectedCard: undefined,
  dependencies: [],
  dependentOn: [],
  setBoards: (boards) => {
    set({ boards });
  },
  setSelectedCard: (card) => {
    if (card) {
      const dependencies = card.dependencies;
      const dependentOn = card.dependentOn;
      set({ selectedCard: card, dependencies, dependentOn });
    }
  },
}));
