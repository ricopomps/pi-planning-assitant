"use client";

import { createEpic as createEpicAction } from "@/actions/create-epic";
import { updateEpic } from "@/actions/update-epic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks/use-action";
import { useEpic } from "@/hooks/use-epic";
import { Epic } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const EpicsForm = () => {
  const {
    epics,
    setEpics,
    selectedEpic,
    setSelectedEpic,
    createEpic,
    setCreateEpic,
  } = useEpic();
  const [title, setTitle] = useState(
    !createEpic ? selectedEpic?.title || "" : ""
  );
  const [sprints, setSprints] = useState(
    !createEpic ? selectedEpic?.sprints || 6 : 6
  );

  const { execute: executeCreateEpic } = useAction(createEpicAction, {
    onSuccess: (newEpic) => {
      toast.success("Epic created!");
      setEpics([...epics, newEpic]);
      setSelectedEpic(newEpic);
      setCreateEpic(false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateEpic } = useAction(updateEpic, {
    onSuccess: (updatedEpic) => {
      toast.success("Epic updated!");

      setEpics(
        epics.map((epic) => (epic.id === updatedEpic.id ? updatedEpic : epic))
      );
      setSelectedEpic(updatedEpic);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setTitle(!createEpic ? selectedEpic?.title || "" : "");
    setSprints(!createEpic ? selectedEpic?.sprints || 6 : 6);
  }, [selectedEpic, createEpic]);

  const handleUpdate = (updatedEpic: Epic) => {
    executeUpdateEpic({ id: updatedEpic.id, title, sprints });
  };

  const handleCreate = () => {
    executeCreateEpic({ title, sprints });
  };

  const update = !createEpic && selectedEpic;

  return (
    <Card className="w-1/2 h-fit">
      <CardHeader>
        <CardTitle>{update ? "Edit Epic" : "Create New Epic"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="mb-2">
          <Label
            htmlFor="title"
            className="text-xs font-semibold text-neutral-700"
          >
            Title
          </Label>
          <Input
            id="title"
            placeholder="Epic title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <Label
            htmlFor="sprint"
            className="text-xs font-semibold text-neutral-700"
          >
            Sprints
          </Label>
          <Input
            id="sprint"
            type="number"
            placeholder="Sprints (1-6)"
            value={sprints}
            min={1}
            max={6}
            onChange={(e) => {
              const sprint = Number(e.target.value);
              if (sprint > 6) setSprints(6);
              else if (sprint < 1) setSprints(1);
              else setSprints(sprint);
            }}
          />
        </div>
        <Button
          onClick={() => {
            if (update) {
              handleUpdate(selectedEpic);
            } else {
              handleCreate();
            }
            setTitle("");
          }}
        >
          {update ? "Update" : "Create"}
        </Button>
      </CardContent>
    </Card>
  );
};
