"use client";

import { ListContainer } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container";
import { useEpic } from "@/hooks/use-epic";
import {
  BoardWithListsAndDependencies,
  ListWithCardsAndDependencies,
} from "@/types";
import { UsersRound } from "lucide-react";

interface BoardsOverviewListProps {
  boards: BoardWithListsAndDependencies[];
}

export const BoardsOverviewList = ({ boards }: BoardsOverviewListProps) => {
  const { getSprintNumbers } = useEpic();

  return (
    <div className="space-y-2">
      {boards.map((board) => {
        const sprintLists: ListWithCardsAndDependencies[] = getSprintNumbers()
          .map((num) => num.toString())
          .map((sprint) => ({
            id: sprint,
            title: `Sprint ${sprint}`,
            boardId: board.id,
            cards: board.lists
              .flatMap((list) => list.cards)
              .filter((card) => card.sprint === parseInt(sprint)),
            order: parseInt(sprint),
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
        return (
          <div key={board.id} className="flex gap-2">
            <BoardCard boardTitle={board.title} />
            <ListContainer
              boardId={board.id}
              data={sprintLists}
              hideAddList
              hideAddCard
              dragMode="changeSprint"
            />
          </div>
        );
      })}
    </div>
  );
};

interface BoardCardProps {
  boardTitle: string;
}

const BoardCard = ({ boardTitle }: BoardCardProps) => {
  return (
    <div className="shrink-0 h-full w-[272px] select-none mr-4">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md p-2 flex gap-2 items-center">
        <UsersRound className="h-4 w-4" />
        {boardTitle}
      </div>
    </div>
  );
};
