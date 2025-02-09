"use client";

import { updateCardSprint } from "@/actions/update-card-sprint";
import { useAction } from "@/hooks/use-action";
import Sprints from "@/util/sprints";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SprintTagProps {
  sprintNumber?: number | null;
  cardId: string;
  boardId: string;
}

export const SprintTag = ({
  sprintNumber,
  cardId,
  boardId,
}: SprintTagProps) => {
  return (
    <Badge variant="secondary">
      <SprintSelect cardId={cardId} boardId={boardId}>
        {!sprintNumber ? (
          <>
            Add to sprint <Plus className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            <span className="mr-1">Sprint</span>
            <SelectValue placeholder={sprintNumber} />
          </>
        )}
      </SprintSelect>
    </Badge>
  );
};

interface SprintSelectProps {
  children: React.ReactNode;
  cardId: string;
  boardId: string;
}

const SprintSelect = ({ children, cardId, boardId }: SprintSelectProps) => {
  const queryClient = useQueryClient();

  const { execute } = useAction(updateCardSprint, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      toast.success(`Updated card "${data.title}" to sprint "${data.sprint}"`);
    },
  });

  const onChange = (e: string) => {
    const sprint = Number.parseInt(e);

    execute({ id: cardId, boardId, sprint });
  };

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger minimal>{children}</SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sprints</SelectLabel>
          {Object.values(Sprints).map((sprint) => (
            <SelectItem key={sprint} value={sprint}>
              {sprint}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
