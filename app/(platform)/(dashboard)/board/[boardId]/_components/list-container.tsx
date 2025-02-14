"use client";

import { updateCardOrder } from "@/actions/update-card-order";
import { updateCardSprint } from "@/actions/update-card-sprint";
import { updateListOrder } from "@/actions/update-list-order";
import { useAction } from "@/hooks/use-action";
import { ListWithCardsAndDependencies } from "@/types";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
interface ListContainerProps {
  data: ListWithCardsAndDependencies[];
  boardId: string;
  hideAddList?: boolean;
  hideAddCard?: boolean;
  disableActions?: boolean;
  dragMode?: "reorder" | "changeSprint";
}

export const ListContainer = ({
  data,
  boardId,
  hideAddList = false,
  hideAddCard = false,
  disableActions = false,
  dragMode = "reorder",
}: ListContainerProps) => {
  const queryClient = useQueryClient();
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success(
        dragMode === "reorder" ? "Card reordered" : "Sprint updated"
      );
    },
  });

  const { execute: executeUpdateCardSprint } = useAction(updateCardSprint, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      toast.success(`Updated card "${data.title}" to sprint "${data.sprint}"`);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    //if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // User moves a card
    if (type === "card") {
      const newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      // Check if cards exists on the sourceList
      if (!sourceList.cards) sourceList.cards = [];

      // Check if cards exists on the destinationList
      if (!destinationList.cards) destinationList.cards = [];

      if (dragMode === "reorder") {
        // Moving within the same list
        if (source.droppableId === destination.droppableId) {
          const reorderedCards = reorder(
            sourceList.cards,
            source.index,
            destination.index
          );

          reorderedCards.forEach((card, idx) => {
            card.order = idx;
          });

          sourceList.cards = reorderedCards;

          setOrderedData(newOrderedData);
          executeUpdateCardOrder({ boardId, items: reorderedCards });
          // User moves the card to another list
        } else {
          // Remove card From the source list
          const [movedCard] = sourceList.cards.splice(source.index, 1);

          // Assugn the new listId to the moved card
          movedCard.listId = destination.droppableId;

          // Add card to the destination list
          destinationList.cards.splice(destination.index, 0, movedCard);

          sourceList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          // Update the order for each card in the destination list
          destinationList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          setOrderedData(newOrderedData);
          executeUpdateCardOrder({ boardId, items: destinationList.cards });
        }
      } else if (dragMode === "changeSprint") {
        // Instead of changing the order, update sprint property
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assugn the new listId to the moved card
        movedCard.sprint = parseInt(destination.droppableId);

        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list
        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);

        executeUpdateCardSprint({
          boardId,
          id: movedCard.id,
          sprint: parseInt(destination.droppableId),
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => (
              <ListItem
                key={list.id}
                index={index}
                data={list}
                boardId={boardId}
                hideAddCard={hideAddCard}
                isDragDisabled={dragMode === "changeSprint"}
                disableActions={disableActions}
              />
            ))}
            {provided.placeholder}
            {!hideAddList && <ListForm />}
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
