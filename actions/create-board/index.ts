"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import AppRoutes, { buildRoute } from "@/util/appRoutes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { InputType, ReturnType } from "./types";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title } = data;

  let board;

  try {
    board = await db.board.create({ data: { title } });
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  revalidatePath(
    buildRoute(AppRoutes.BOARD_ID, {
      boardId: board.id,
    })
  );
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
