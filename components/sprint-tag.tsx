"use client";

import { updateCardSprint } from "@/actions/update-card-sprint";
import { useAction } from "@/hooks/use-action";
import { useEpic } from "@/hooks/use-epic";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
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
      <SprintSelect
        cardId={cardId}
        boardId={boardId}
        initialSprint={sprintNumber}
      >
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
  initialSprint?: number | null;
}

const SprintSelect = ({
  children,
  cardId,
  boardId,
  initialSprint,
}: SprintSelectProps) => {
  const queryClient = useQueryClient();
  const { getAllSprintNumbers } = useEpic();
  const [selectedSprint, setSelectedSprint] = useState<string | undefined>(
    initialSprint?.toString()
  );

  const { execute } = useAction(updateCardSprint, {
    onSuccess: (data) => {
      toast.success(`Updated card "${data.title}" to sprint "${data.sprint}"`);
      setSelectedSprint(data.sprint?.toString());
    },
    onError: (error) => {
      toast.error(error);
      setSelectedSprint(initialSprint?.toString());
    },
    onComplete: () => {
      queryClient.invalidateQueries({
        queryKey: ["card", cardId],
      });
    },
  });

  const onChange = (value: string) => {
    setSelectedSprint(value);
    execute({ id: cardId, boardId, sprint: Number(value) });
  };

  return (
    <Select onValueChange={onChange} value={selectedSprint}>
      <SelectTrigger minimal>{children}</SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sprints</SelectLabel>
          {getAllSprintNumbers()
            .map((num) => num.toString())
            .map((sprint) => (
              <SelectItem key={sprint} value={sprint}>
                {sprint}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
