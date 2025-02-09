import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { UpdateCardDueDate } from "./schema";

export type InputType = z.infer<typeof UpdateCardDueDate>;
export type ReturnType = ActionState<InputType, Card>;
