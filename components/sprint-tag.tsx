"use client";

import { updateCardSprint } from "@/actions/update-card-sprint";
import { useAction } from "@/hooks/use-action";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
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
}

export const SprintTag = ({ sprintNumber, cardId }: SprintTagProps) => {
  return (
    <Badge variant="secondary">
      <SprintSelect cardId={cardId}>
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
}

const SprintSelect = ({ children, cardId }: SprintSelectProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCardSprint, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      toast.success(`Updated card "${data.title}" to sprint "${data.sprint}"`);
    },
  });

  const onChange = (e: string) => {
    const boardId = params.boardId as string;

    const sprint = Number.parseInt(e);

    execute({ id: cardId, boardId, sprint });
  };

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger minimal>{children}</SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sprints</SelectLabel>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
