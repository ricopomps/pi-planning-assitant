import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const boards = await db.board.findMany({
      where: {
        orgId,
      },
      include: {
        lists: {
          include: {
            cards: true,
          },
        },
      },
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
