import { ActionState } from "@/lib/create-safe-action";
import { Epic } from "@/types";
import { z } from "zod";
import { UpdateEpic } from "./schema";

export type InputType = z.infer<typeof UpdateEpic>;
export type ReturnType = ActionState<InputType, Epic>;
