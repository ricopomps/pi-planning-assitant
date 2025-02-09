"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/fetcher";
import { BoardWithLists, CardWithListAndDependencies } from "@/types";
import { AppApiRoutes } from "@/util/appRoutes";
import { useOrganization } from "@clerk/nextjs";
import { Card } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Link2, X } from "lucide-react";
import { useState } from "react";

interface LinkComponentProps {
  onLink: (dependencyCardId: string) => void;
  actionLoading: boolean;
  card: CardWithListAndDependencies;
}

export const LinkComponent = ({
  onLink,
  actionLoading,
  card,
}: LinkComponentProps) => {
  const { organization: activeOrganization } = useOrganization();

  const { data: boards } = useQuery<BoardWithLists[]>({
    queryKey: ["organization_boards", activeOrganization?.id],
    queryFn: () => fetcher(AppApiRoutes.ORGANIZATION),
  });

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<BoardWithLists>();
  const [selectedCard, setSelectedCard] = useState<Card>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  if (!boards) return null;

  const onBoardChange = (boardId: string) => {
    if (selectedBoard?.id === boardId) return;

    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    setSelectedBoard(board);

    const isNotCurrentOrLinked = (c: Card) =>
      c.id !== card.id &&
      !card.dependencies.some((dependency) => dependency.id === c.id) &&
      !card.dependentOn.some((dependentOn) => dependentOn.id === c.id);

    const filteredCards = board.lists
      .flatMap((list) => list.cards)
      .filter(isNotCurrentOrLinked);

    setCards(filteredCards);
  };

  const onCardChange = (selectedCardId: string) => {
    const selectedCard = cards.find((c) => c.id === selectedCardId);
    if (!selectedCard) return;
    setSelectedCard(selectedCard);
  };

  const handleLink = () => {
    if (!selectedCard) return;
    onLink(selectedCard.id);
    setIsPopoverOpen(false);
    setSelectedCard(undefined);
    setSelectedBoard(undefined);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-full justify-start"
          variant="gray"
          size="inline"
          disabled={actionLoading}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Link
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Select card to link
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <div className="p-1 px-5">
          <Select onValueChange={onBoardChange}>
            <Label className="text-xs font-semibold text-neutral-700 ml-2">
              Board:
            </Label>
            <SelectTrigger>
              <SelectValue placeholder={selectedBoard?.title}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Boards</SelectLabel>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-1 px-5">
          <Select disabled={!(cards?.length > 0)} onValueChange={onCardChange}>
            <Label className="text-xs font-semibold text-neutral-700 ml-2">
              Card:
            </Label>

            <SelectTrigger>
              <SelectValue placeholder={selectedCard?.title}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cards</SelectLabel>
                {cards.map((card) => (
                  <SelectItem key={card.id} value={card.id}>
                    {card.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className="w-full mt-2"
            variant="gray"
            disabled={!selectedCard || !selectedBoard || actionLoading}
            onClick={handleLink}
          >
            link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
