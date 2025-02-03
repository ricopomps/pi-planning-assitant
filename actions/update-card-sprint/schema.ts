import { z } from "zod";

export const UpdateCardSprint = z.object({
  id: z.string(),
  boardId: z.string(),
  sprint: z.number(),
});
