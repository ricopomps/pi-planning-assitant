"use client";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { useEpic } from "@/hooks/use-epic";

export const EpicSelector = () => {
  const { selectedEpic, setSelectedEpic, epics, getSprintNumbers } = useEpic();

  const onChange = (e: string) => {
    const newSelectedEpic = epics.find((epic) => epic.id === e);
    if (newSelectedEpic) setSelectedEpic(newSelectedEpic);
  };

  if (!selectedEpic) return null;

  return (
    <div className="flex gap-2 items-center">
      <div>
        <Select onValueChange={onChange}>
          <SelectTrigger minimal>
            <Badge variant="outline">{selectedEpic.title}</Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Epics</SelectLabel>
              {epics.map((epic) => (
                <SelectItem key={epic.id} value={epic.id}>
                  {epic.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-1">
        {getSprintNumbers().map((sprint) => (
          <div key={sprint}>{sprint}</div>
        ))}
      </div>
    </div>
  );
};
