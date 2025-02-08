"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import AppRoutes, { buildRoute } from "@/util/appRoutes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateCardDueDate } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, dueDate = null } = data;
  let card;

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
      data: {
        dueDate,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Failed to update" };
  }

  revalidatePath(buildRoute(AppRoutes.BOARD_ID, { boardId: boardId }));
  return { data: card };
};

export const updateCardDueDate = createSafeAction(UpdateCardDueDate, handler);
