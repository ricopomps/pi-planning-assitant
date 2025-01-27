import { z } from "zod";
const minimumTitleSize = 3;

export const UpdateCard = z.object({
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is invalid",
      })
      .min(minimumTitleSize, {
        message: `Minimum length of ${minimumTitleSize} letters is required`,
      })
  ),
  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description is invalid",
      })
      .min(minimumTitleSize, {
        message: `Minimum length of ${minimumTitleSize} letters is required`,
      })
  ),
  id: z.string(),
  boardId: z.string(),
});
