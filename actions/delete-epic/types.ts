import { ActionState } from "@/lib/create-safe-action";
import { Epic } from "@/types";
import { z } from "zod";
import { DeleteEpic } from "./schema";

export type InputType = z.infer<typeof DeleteEpic>;
export type ReturnType = ActionState<InputType, Epic>;
