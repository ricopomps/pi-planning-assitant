"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import AppRoutes, { buildRoute } from "@/util/appRoutes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CopyCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) {
      return { error: "Card not found" };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      },
    });
  } catch (error) {
    return { error: "Failed to copy" };
  }

  const route = buildRoute(AppRoutes.BOARD_ID, { boardId });
  revalidatePath(route);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
