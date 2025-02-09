import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { UpdateCardAssignedTo } from "./schema";

export type InputType = z.infer<typeof UpdateCardAssignedTo>;
export type ReturnType = ActionState<InputType, Card>;
