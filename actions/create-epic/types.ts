import { ActionState } from "@/lib/create-safe-action";
import { Epic } from "@/types";
import { z } from "zod";
import { CreateEpic } from "./schema";

export type InputType = z.infer<typeof CreateEpic>;
export type ReturnType = ActionState<InputType, Epic>;
