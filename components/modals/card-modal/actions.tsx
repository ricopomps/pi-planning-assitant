"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { updateCardDependency } from "@/actions/update-card-dependency";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithListAndDependencies } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Trash } from "lucide-react";
import { toast } from "sonner";
import { LinkComponent } from "./link";

interface ActionsProps {
  data: CardWithListAndDependencies;
}

export const Actions = ({ data }: ActionsProps) => {
  const cardModal = useCardModal();
  const queryClient = useQueryClient();

  const { execute: executeCopyCard, isLoading: isLoadingCopyCard } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" copied`);
        cardModal.onClose();
      },
    }
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDeleteCard } =
    useAction(deleteCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" deleted`);
        cardModal.onClose();
      },
    });

  const {
    execute: executeUpdateCardDependency,
    isLoading: isLoadingUpdateCardDependency,
  } = useAction(updateCardDependency, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success(`Card "${data.title}" linked`);
    },
  });

  const onCopy = () => {
    executeCopyCard({ boardId: data.list.boardId, id: data.id });
  };

  const onDelete = () => {
    executeDeleteCard({ boardId: data.list.boardId, id: data.id });
  };

  const onLink = (dependencyCardId: string) => {
    executeUpdateCardDependency({
      boardId: data.list.boardId,
      id: data.id,
      dependencyCardId,
    });
  };

  const actionLoading =
    isLoadingCopyCard || isLoadingDeleteCard || isLoadingUpdateCardDependency;

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={actionLoading}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={actionLoading}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
      <LinkComponent
        actionLoading={actionLoading}
        onLink={onLink}
        card={data}
      />
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-20 h-8 bg-neutral-200" />
      <Skeleton className="w-20 h-8 bg-neutral-200" />
    </div>
  );
};
