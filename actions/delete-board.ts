"use server";

import { db } from "@/lib/db";
import AppRoutes, { buildRoute } from "@/util/appRoutes";
import { revalidatePath } from "next/cache";

export async function deleteBoard(id: string) {
  await db.board.delete({
    where: { id },
  });

  revalidatePath(
    buildRoute(AppRoutes.ORGANIZATION_ID, {
      id: "org_2s6AYSt5tmEYLpGzWpbEal9Ld7L",
    })
  );
}
