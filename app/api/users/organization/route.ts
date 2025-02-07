import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await clerkClient();

    const paginatedResult = await client.users.getUserList({
      organizationId: [orgId],
      limit: 500, // TODO:change to paginate later
    });
    const usersFromOrg = paginatedResult.data;

    return NextResponse.json(usersFromOrg);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
