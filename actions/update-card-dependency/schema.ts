import { z } from "zod";

export const UpdateCardDependency = z.object({
  id: z.string(),
  boardId: z.string(),
  dependencyCardId: z.string(),
});
