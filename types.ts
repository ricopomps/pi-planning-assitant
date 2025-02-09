import { Board, Card, List } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };
export type ListWithCardsAndDependencies = List & {
  cards: CardWithListAndDependencies[];
};
export type CardWithList = Card & { list: List };
export type CardWithListAndDependencies = CardWithList & {
  dependencies: Card[];
  dependentOn: Card[];
};
export type BoardWithLists = Board & { lists: ListWithCards[] };
