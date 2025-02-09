import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { DeleteCardDependency } from "./schema";

export type InputType = z.infer<typeof DeleteCardDependency>;
export type ReturnType = ActionState<InputType, Card>;
