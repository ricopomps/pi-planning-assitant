"use client";

import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { ListWithCardsAndDependencies } from "@/types";
import { AppApiRoutes } from "@/util/appRoutes";
import { User } from "@clerk/nextjs/server";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { ListHeader } from "./list-header";

interface ListItemProps {
  data: ListWithCardsAndDependencies;
  index: number;
  boardId: string;
  hideAvatar?: boolean;
  isDragDisabled?: boolean;
  hideAddCard?: boolean;
}

export const ListItem = ({
  data,
  boardId,
  index,
  hideAvatar = false,
  isDragDisabled = false,
  hideAddCard = false,
}: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const { data: usersFromOrg } = useQuery<User[]>({
    queryKey: ["organization", boardId],
    queryFn: () => fetcher(AppApiRoutes.USERS_ORGANIZATION),
  });
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  return (
    <Draggable
      draggableId={data.id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards.map((card, index) => {
                    const assignedUser = hideAvatar
                      ? undefined
                      : usersFromOrg?.find(
                          (user) => user.id === card.assignedTo
                        );
                    return (
                      <CardItem
                        key={card.id}
                        index={index}
                        data={card}
                        user={assignedUser}
                      />
                    );
                  })}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            {!hideAddCard && (
              <CardForm
                listId={data.id}
                ref={textareaRef}
                isEditing={isEditing}
                enableEditing={enableEditing}
                disableEditing={disableEditing}
              />
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
};
