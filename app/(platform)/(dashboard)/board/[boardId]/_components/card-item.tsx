"use client";

import { UserAvatar } from "@/components/assigned-to-tag";
import { Hint } from "@/components/hint";
import { useCardModal } from "@/hooks/use-card-modal";
import { User } from "@clerk/nextjs/server";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

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
          <div className="flex justify-between items-center">
            <div>{data.title}</div>
            {user && (
              <Hint
                description={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                delayDuration={350}
              >
                <UserAvatar user={user} displayName={false} />
              </Hint>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
