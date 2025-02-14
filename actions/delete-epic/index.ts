"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { Epic } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { DeleteEpic } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;

  const client = await clerkClient();
  const org = await client.organizations.getOrganization({
    organizationId: orgId,
  });

  const currentEpics: Epic[] = (org.publicMetadata?.epics as Epic[]) || [];

  const epicToDelete = currentEpics.find((epic) => epic.id === id);

  if (!epicToDelete) {
    return {
      error: "Epic not found",
    };
  }

  const updatedEpics = currentEpics.filter((epic) => epic.id !== id);

  await client.organizations.updateOrganizationMetadata(orgId, {
    publicMetadata: {
      ...org.publicMetadata,
      epics: updatedEpics,
    },
  });

  return { data: epicToDelete };
};

export const deleteEpic = createSafeAction(DeleteEpic, handler);
