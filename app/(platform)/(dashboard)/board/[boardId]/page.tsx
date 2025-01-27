import { db } from "@/lib/db";
import AppRoutes from "@/util/appRoutes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: { boardId: string };
}
const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { orgId } = await auth();

  if (!orgId) {
    redirect(AppRoutes.SELECT_ORGANIZATION);
  }

  const { boardId } = params;

  const lists = await db.list.findMany({
    where: {
      boardId: boardId,
      board: { orgId },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
