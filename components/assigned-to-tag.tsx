"use client";

import { updateCardAssignedTo } from "@/actions/update-card-assigned-to";
import { useAction } from "@/hooks/use-action";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { AppApiRoutes } from "@/util/appRoutes";
import { User } from "@clerk/nextjs/server";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import Image from "next/image";
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
  card: CardWithList;
}

export const AssignedToTag = ({ card }: AssignedToTagProps) => {
  const boardId = card.list.boardId;
  const { data: usersFromOrg } = useQuery<User[]>({
    queryKey: ["organization", boardId],
    queryFn: () => fetcher(AppApiRoutes.USERS_ORGANIZATION),
  });

  const assignedUser = usersFromOrg?.find(
    (user) => user.id === card.assignedTo
  );

  return (
    <Badge variant="secondary">
      <AssignedToSelect cardId={card.id} boardId={boardId} users={usersFromOrg}>
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
  boardId: string;
}

interface UserAvatarProps {
  user: User;
  displayName?: boolean;
}

export const UserAvatar = ({ user, displayName = true }: UserAvatarProps) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <Image
        src={user.imageUrl}
        alt={`${user.firstName} ${user.lastName} profile pic`}
        width={24}
        height={24}
        className="self-center rounded-lg"
      />
      {displayName && (
        <>
          {user.firstName} {user.lastName}
        </>
      )}
    </div>
  );
};

const AssignedToSelect = ({
  children,
  cardId,
  users,
  boardId,
}: AssignedToSelectProps) => {
  const queryClient = useQueryClient();

  const { execute } = useAction(updateCardAssignedTo, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success(`Assigned card "${data.title}"`);
    },
  });

  const onChange = (e: string) => {
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
