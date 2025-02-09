import { z } from "zod";

export const DeleteCardDependency = z.object({
  id: z.string(),
  boardId: z.string(),
  dependencyCardId: z.string(),
});
