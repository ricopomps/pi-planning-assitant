import { z } from "zod";
const minimumTitleSize = 3;

export const CreateEpic = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is invalid",
    })
    .min(minimumTitleSize, {
      message: `Minimum length of ${minimumTitleSize} letters is required`,
    }),
  sprints: z
    .number({
      required_error: "Image is required",
      invalid_type_error: "Image is invalid",
    })
    .min(1)
    .max(6),
});
