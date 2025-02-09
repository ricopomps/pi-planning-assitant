"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithListAndDependencies } from "@/types";
import { AppApiRoutes, buildRoute } from "@/util/appRoutes";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { Actions } from "./actions";
import { CardDependenciesArea } from "./dependencies";
import { Description } from "./description";
import { Header } from "./header";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithListAndDependencies>({
    queryKey: ["card", id],
    queryFn: () =>
      fetcher(buildRoute(AppApiRoutes.CARDS, { cardId: id || "" })),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>
        <DialogContent>
          {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              <div className="w-full space-y-6">
                {!cardData ? (
                  <Description.Skeleton />
                ) : (
                  <Description data={cardData} />
                )}
              </div>
            </div>
            {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
          </div>
          {cardData && (
            <CardDependenciesArea
              cardId={cardData.id}
              boardId={cardData.list.boardId}
              dependencies={cardData.dependencies}
              dependentOn={cardData.dependentOn}
            />
          )}
        </DialogContent>
      </DialogTitle>
    </Dialog>
  );
};
