import { ListContainer } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container";
import {
  BoardWithListsAndDependencies,
  ListWithCardsAndDependencies,
} from "@/types";
import Sprints from "@/util/sprints";
import { UsersRound } from "lucide-react";

interface BoardsOverviewListProps {
  boards: BoardWithListsAndDependencies[];
}

export const BoardsOverviewList = ({ boards }: BoardsOverviewListProps) => {
  return (
    <div>
      {boards.map((board) => {
        const sprintLists: ListWithCardsAndDependencies[] = Object.values(
          Sprints
        ).map((sprint) => ({
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
