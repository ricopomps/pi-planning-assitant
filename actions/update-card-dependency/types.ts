import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { UpdateCardDependency } from "./schema";

export type InputType = z.infer<typeof UpdateCardDependency>;
export type ReturnType = ActionState<InputType, Card>;
