import { z } from "zod";

export const UpdateCardAssignedTo = z.object({
  id: z.string(),
  boardId: z.string(),
  assignedTo: z.string(),
});
