"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { Epic } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UpdateEpic } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, title, sprints } = data;

  const client = await clerkClient();
  const org = await client.organizations.getOrganization({
    organizationId: orgId,
  });

  const currentEpics: Epic[] = (org.publicMetadata?.epics as Epic[]) || [];

  const updatedEpics = currentEpics.map((epic) =>
    epic.id === id ? { ...epic, title, sprints } : epic
  );

  await client.organizations.updateOrganizationMetadata(orgId, {
    publicMetadata: {
      ...org.publicMetadata,
      epics: updatedEpics,
    },
  });

  const updatedEpic = updatedEpics.find((epic) => epic.id === id);
  return { data: updatedEpic };
};

export const updateEpic = createSafeAction(UpdateEpic, handler);
