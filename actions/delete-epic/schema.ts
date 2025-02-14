import { z } from "zod";

export const DeleteEpic = z.object({
  id: z.string(),
});
