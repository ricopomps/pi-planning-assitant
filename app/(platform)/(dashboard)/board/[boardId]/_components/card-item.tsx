"use client";

import { UserAvatar } from "@/components/assigned-to-tag";
import { Hint } from "@/components/hint";
import { Badge } from "@/components/ui/badge";
import { useCardModal } from "@/hooks/use-card-modal";
import { useDependency } from "@/hooks/use-dependency";
import { cn } from "@/lib/utils";
import { CardWithListAndDependencies } from "@/types";
import { User } from "@clerk/nextjs/server";
import { Draggable } from "@hello-pangea/dnd";
import { format, isBefore } from "date-fns";

interface CardItemProps {
  data: CardWithListAndDependencies;
  index: number;
  user?: User;
}

export const CardItem = ({ data, index, user }: CardItemProps) => {
  const cardModal = useCardModal();
  const cardDependency = useDependency();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          className={cn(
            "truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-sm shadow-sm",
            cardDependency.selectedCard?.id === data.id && "bg-yellow-300",
            cardDependency.dependencies.some((card) => card.id === data.id) &&
              "bg-green-300",
            cardDependency.dependentOn.some((card) => card.id === data.id) &&
              "bg-red-300"
          )}
          onClick={() => {
            cardModal.onOpen(data.id);
          }}
        >
          <div
            className="grid items-center gap-2 "
            onMouseEnter={() => {
              cardDependency.setSelectedCard(data);
            }}
          >
            <div className="flex justify-between items-center gap-2">
              <div>{data.title}</div>
              <CardUserAvatar user={user} />
            </div>
            <CardDateTag dueDate={data.dueDate} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

interface CardDateTagProps {
  dueDate?: Date | null;
}

const CardDateTag = ({ dueDate }: CardDateTagProps) => {
  if (!dueDate) return null;

  const now = new Date();
  const delayed = isBefore(dueDate, now);
  const formattedDate = format(dueDate, "MMM do");

  return (
    <Badge variant={delayed ? "destructive" : "secondary"} className="w-fit">
      {formattedDate}
    </Badge>
  );
};

interface CardUserAvatarProps {
  user?: User;
}

const CardUserAvatar = ({ user }: CardUserAvatarProps) => {
  if (!user) return null;
  return (
    <Hint
      description={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
      delayDuration={350}
    >
      <UserAvatar user={user} displayName={false} />
    </Hint>
  );
};
