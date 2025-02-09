"use client";

import { updateCardDueDate } from "@/actions/update-card-due-date";
import { useAction } from "@/hooks/use-action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DatePicker } from "./ui/date-picker";
import { Label } from "./ui/label";

interface DateTagProps {
  dueDate?: Date;
  cardId: string;
  boardId: string;
}

export const DateTag = ({ dueDate, cardId, boardId }: DateTagProps) => {
  const queryClient = useQueryClient();

  const { execute } = useAction(updateCardDueDate, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      toast.success(
        data.dueDate
          ? `Updated card "${data.title}" due date to "${data.dueDate}"`
          : `Removed card "${data.title}" due date`
      );
    },
  });

  const handleDateSelected = (date?: Date) => {
    execute({ boardId, id: cardId, dueDate: date });
  };
  return (
    <div className="grid">
      <Label className="text-xs font-semibold text-neutral-700">
        Due date:
      </Label>
      <DatePicker selected={dueDate} onSelect={handleDateSelected} />
    </div>
  );
};
