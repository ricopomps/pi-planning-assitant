"use client";

import { updateCardAssignedTo } from "@/actions/update-card-assigned-to";
import { useAction } from "@/hooks/use-action";
import { fetcher } from "@/lib/fetcher";
import { AppApiRoutes } from "@/util/appRoutes";
import { User } from "@clerk/nextjs/server";
import { Card } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AssignedToTagProps {
  card: Card;
}

export const AssignedToTag = ({ card }: AssignedToTagProps) => {
  const params = useParams();
  const { data: usersFromOrg } = useQuery<User[]>({
    queryKey: ["organization", params.boardId],
    queryFn: () => fetcher(AppApiRoutes.USERS_ORGANIZATION),
  });

  const assignedUser = usersFromOrg?.find(
    (user) => user.id === card.assignedTo
  );

  return (
    <Badge variant="secondary">
      <AssignedToSelect cardId={card.id} users={usersFromOrg}>
        {!card.assignedTo || !assignedUser ? (
          <User2 className="h-4 w-4" />
        ) : (
          <SelectValue placeholder={<UserAvatar user={assignedUser} />} />
        )}
      </AssignedToSelect>
    </Badge>
  );
};

interface AssignedToSelectProps {
  children: React.ReactNode;
  cardId: string;
  users?: User[];
}

const UserAvatar = ({ user }: { user: User }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <Image
        src={user.imageUrl}
        alt={`${user.firstName} ${user.lastName} profile pic`}
        width={24}
        height={24}
        className="self-center rounded-lg"
      />
      {user.firstName} {user.lastName}
    </div>
  );
};

const AssignedToSelect = ({
  children,
  cardId,
  users,
}: AssignedToSelectProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCardAssignedTo, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success(`Assigned card"`);
    },
  });

  const onChange = (e: string) => {
    const boardId = params.boardId as string;
    console.log("event", e);

    execute({ id: cardId, boardId, assignedTo: e });
  };

  if (!users) return null;

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger minimal>{children}</SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Assigned To</SelectLabel>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <UserAvatar user={user} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
