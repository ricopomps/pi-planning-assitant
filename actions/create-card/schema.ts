import { z } from "zod";
const minimumTitleSize = 3;

export const CreateCard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is invalid",
    })
    .min(minimumTitleSize, {
      message: `Minimum length of ${minimumTitleSize} letters is required`,
    }),
  boardId: z.string(),
  listId: z.string(),
});
