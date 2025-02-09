"use client";

import { UserAvatar } from "@/components/assigned-to-tag";
import { Hint } from "@/components/hint";
import { Badge } from "@/components/ui/badge";
import { useCardModal } from "@/hooks/use-card-modal";
import { User } from "@clerk/nextjs/server";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import { format, isBefore } from "date-fns";

interface CardItemProps {
  data: Card;
  index: number;
  user?: User;
}

export const CardItem = ({ data, index, user }: CardItemProps) => {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-sm shadow-sm"
          onClick={() => {
            cardModal.onOpen(data.id);
          }}
        >
          <div className="grid items-center gap-2">
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
