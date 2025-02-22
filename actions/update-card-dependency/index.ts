"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import AppRoutes, { buildRoute } from "@/util/appRoutes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateCardDependency } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, dependencyCardId } = data;
  let card;

  try {
    const [cardToUpdate, dependencyCard] = await Promise.all([
      db.card.findUnique({
        where: { id },
        select: { sprint: true },
      }),
      db.card.findUnique({
        where: { id: dependencyCardId },
        select: { sprint: true },
      }),
    ]);

    if (!cardToUpdate || !dependencyCard) {
      return { error: "One or both cards not found" };
    }

    if (
      dependencyCard.sprint !== null &&
      cardToUpdate.sprint !== null &&
      dependencyCard.sprint >= cardToUpdate.sprint
    ) {
      return {
        error: "Cannot add a dependency with an equal or greater sprint",
      };
    }

    card = await db.card.update({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
      data: {
        dependencies: {
          connect: { id: dependencyCardId },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Failed to update" };
  }

  revalidatePath(buildRoute(AppRoutes.BOARD_ID, { boardId: boardId }));
  return { data: card };
};

export const updateCardDependency = createSafeAction(
  UpdateCardDependency,
  handler
);
