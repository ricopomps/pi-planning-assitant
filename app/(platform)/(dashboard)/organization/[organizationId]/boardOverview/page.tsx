import { db } from "@/lib/db";
import { ListWithCardsAndDependencies } from "@/types";
import AppRoutes from "@/util/appRoutes";
import Sprints from "@/util/sprints";
import { auth } from "@clerk/nextjs/server";
import { UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import { ListContainer } from "../../../board/[boardId]/_components/list-container";

const boardOverviewPage = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    redirect(AppRoutes.SELECT_ORGANIZATION);
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    include: {
      lists: {
        include: {
          cards: {
            include: {
              dependencies: true,
              dependentOn: true,
              list: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto space-y-2">
      {boards.map((board) => {
        const sprintLists: ListWithCardsAndDependencies[] = Object.values(
          Sprints
        ).map((sprint) => ({
          title: `Sprint ${sprint}`,
          boardId: board.id,
          cards: board.lists
            .flatMap((list) => list.cards)
            .filter((card) => card.sprint === parseInt(sprint)),
          id: sprint,
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

export default boardOverviewPage;

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
