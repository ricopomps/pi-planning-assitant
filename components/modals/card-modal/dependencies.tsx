import { deleteCardDependency } from "@/actions/delete-card-dependency";
import { Hint } from "@/components/hint";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import { Card } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link2Off } from "lucide-react";
import { toast } from "sonner";

interface CardDependenciesAreaProps {
  cardId: string;
  boardId: string;
  dependencies: Card[];
  dependentOn: Card[];
}

export const CardDependenciesArea = ({
  cardId,
  boardId,
  dependencies,
  dependentOn,
}: CardDependenciesAreaProps) => {
  return (
    <div>
      <DependenciesAccordion
        title="Dependencies"
        cards={dependencies}
        boardId={boardId}
        cardId={cardId}
        dependencies
      />
      <DependenciesAccordion
        title="Dependent on"
        cards={dependentOn}
        boardId={boardId}
        cardId={cardId}
      />
    </div>
  );
};

interface DependenciesAccordionProps {
  cardId: string;
  boardId: string;
  title: string;
  cards: Card[];
  dependencies?: boolean;
}

const DependenciesAccordion = ({
  cardId,
  boardId,
  title,
  cards,
  dependencies,
}: DependenciesAccordionProps) => {
  return (
    <Accordion type="multiple" className="space-y-2">
      <AccordionItem value={"1"} className="border-none">
        <AccordionTrigger
          className={cn(
            "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline"
          )}
        >
          <div className="flex items-center gap-x-2">
            <span className="font-medium text-sm ">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-1 text-neutral-700 p-2 px-6 space-y-2 mb-4 max-h-[180px] overflow-auto">
          {cards.map((card) => (
            <DependencieItem
              title={card.title}
              key={card.id}
              boardId={boardId}
              cardId={dependencies ? cardId : card.id}
              dependencyCardId={dependencies ? card.id : cardId}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

interface DependencieItem {
  cardId: string;
  title: string;
  dependencyCardId: string;
  boardId: string;
}

const DependencieItem = ({
  title,
  cardId,
  dependencyCardId,
  boardId,
}: DependencieItem) => {
  const queryClient = useQueryClient();
  const { execute } = useAction(deleteCardDependency, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", cardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["card", dependencyCardId],
      });
      toast.success(`Card "${data.title}" unlinked`);
    },
  });

  const handleUnlink = () => {
    execute({ id: cardId, dependencyCardId, boardId });
  };

  return (
    <div className="flex justify-between items-center">
      <div>{title}</div>
      <Hint description="Unlink" delayDuration={400} side="top">
        <Button asChild variant="ghost" onClick={handleUnlink}>
          <div>
            <Link2Off className="h-4 w-4 text-destructive" />
          </div>
        </Button>
      </Hint>
    </div>
  );
};
