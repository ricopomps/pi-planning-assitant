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
  const { selectedEpic, setSelectedEpic, epics } = useEpic();

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
            <Badge className="p-2" variant="outline">
              {selectedEpic.title}
            </Badge>
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
      <SprintsBadge />
    </div>
  );
};

const SprintsBadge = () => {
  const { getSprintNumbers } = useEpic();

  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-2 p-2 rounded-lg shadow-md"
    >
      <span className="font-semibold text-sm">Sprints:</span>
      <div className="flex gap-1">
        {getSprintNumbers().map((sprint) => (
          <span
            key={sprint}
            className="bg-gray-200 text-gray-800 px-0.5 py-0.5 rounded-full text-xs font-medium shadow-sm"
          >
            {sprint}
          </span>
        ))}
      </div>
    </Badge>
  );
};
