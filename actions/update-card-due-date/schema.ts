import { z } from "zod";

export const UpdateCardDueDate = z.object({
  id: z.string(),
  boardId: z.string(),
  dueDate: z.optional(z.date()),
});
