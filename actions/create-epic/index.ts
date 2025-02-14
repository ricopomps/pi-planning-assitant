"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { Epic } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CreateEpic } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, sprints } = data;

  const client = await clerkClient();
  const org = await client.organizations.getOrganization({
    organizationId: orgId,
  });

  const currentEpics: Epic[] = (org.publicMetadata?.epics as Epic[]) || [];

  const order =
    currentEpics.length === 0
      ? 1
      : Math.max(...currentEpics.map((e) => e.order)) + 1;

  const epic: Epic = {
    id: crypto.randomUUID(),
    title,
    sprints,
    order,
  };

  await client.organizations.updateOrganizationMetadata(orgId, {
    publicMetadata: {
      ...org.publicMetadata,
      epics: [...currentEpics, epic],
    },
  });

  return { data: epic };
};

export const createEpic = createSafeAction(CreateEpic, handler);
