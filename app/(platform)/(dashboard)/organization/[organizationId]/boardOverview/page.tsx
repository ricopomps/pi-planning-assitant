import { db } from "@/lib/db";
import AppRoutes from "@/util/appRoutes";
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
      {boards.map((board) => (
        <div key={board.id} className="flex gap-2">
          <BoardCard boardTitle={board.title} />
          <ListContainer boardId={board.id} data={board.lists} />
        </div>
      ))}
    </div>
  );
};

export default boardOverviewPage;

interface BoardCardProps {
  boardTitle: string;
}

const BoardCard = ({ boardTitle }: BoardCardProps) => {
  return (
    <div className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md p-2 flex gap-2 items-center">
        <UsersRound className="h-4 w-4" />
        {boardTitle}
      </div>
    </div>
  );
};
