"use client";

import { deleteEpic } from "@/actions/delete-epic";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAction } from "@/hooks/use-action";
import { useEpic } from "@/hooks/use-epic";
import { Epic } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EpicCardProps {
  epic: Epic;
  isSelected: boolean;
  onSelect: (epic: Epic) => void;
  onDelete?: (epicId: string) => void;
}

const EpicCard = ({ epic, isSelected, onSelect, onDelete }: EpicCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "border-primary bg-primary/10" : "hover:bg-gray-100"
      }`}
      onClick={() => onSelect(epic)}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {epic.title}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(epic.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export const EpicsList = () => {
  const {
    epics,
    selectedEpic,
    setSelectedEpic,
    createEpic,
    setCreateEpic,
    setEpics,
  } = useEpic();

  const { execute } = useAction(deleteEpic, {
    onSuccess: (removedEpic) => {
      toast.success(`Epic ${removedEpic.title} deleted!`);

      setEpics(epics.filter((epic) => epic.id !== removedEpic.id));
      setSelectedEpic(undefined);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleDelete = (epicId: string) => {
    execute({ id: epicId });
  };

  const handleCreate = () => {
    setCreateEpic(true);
  };

  return (
    <div className="space-y-2 w-1/2">
      {epics.map((epic) => (
        <EpicCard
          key={epic.id}
          epic={epic}
          isSelected={selectedEpic?.id === epic.id && !createEpic}
          onSelect={setSelectedEpic}
          onDelete={handleDelete}
        />
      ))}

      <Card
        className="cursor-pointer flex items-center justify-center py-6 text-gray-500 hover:bg-gray-100"
        onClick={handleCreate}
      >
        <Plus className="w-6 h-6" />
      </Card>
    </div>
  );
};
