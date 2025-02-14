import { db } from "@/lib/db";
import AppRoutes from "@/util/appRoutes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BoardsOverviewList } from "./_components/boards";
import { EpicSelector } from "./_components/epic-selector";

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
      <EpicSelector />
      <BoardsOverviewList boards={boards} />
    </div>
  );
};

export default boardOverviewPage;
