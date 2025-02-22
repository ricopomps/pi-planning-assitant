"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import AppRoutes, { buildRoute } from "@/util/appRoutes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateCardSprint } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, sprint } = data;
  let updatedCard;

  try {
    const card = await db.card.findUnique({
      where: { id },
      include: {
        dependencies: { select: { id: true, sprint: true } },
        dependentOn: { select: { id: true, sprint: true } },
      },
    });

    if (!card) {
      return { error: "Card not found" };
    }

    const invalidDependencies = card.dependencies.some(
      (dep) => dep.sprint !== null && dep.sprint >= sprint
    );
    if (invalidDependencies) {
      return { error: "Cannot assign sprint before all dependencies" };
    }

    const invalidDependents = card.dependentOn.some(
      (dep) => dep.sprint !== null && dep.sprint <= sprint
    );
    if (invalidDependents) {
      return { error: "Cannot assign sprint after dependents" };
    }

    updatedCard = await db.card.update({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
      data: {
        sprint,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Failed to update" };
  }

  revalidatePath(buildRoute(AppRoutes.BOARD_ID, { boardId: boardId }));
  return { data: updatedCard };
};

export const updateCardSprint = createSafeAction(UpdateCardSprint, handler);
