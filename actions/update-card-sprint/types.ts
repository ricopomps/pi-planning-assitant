import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { UpdateCardSprint } from "./schema";

export type InputType = z.infer<typeof UpdateCardSprint>;
export type ReturnType = ActionState<InputType, Card>;
