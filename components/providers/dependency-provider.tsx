"use client";

import { useDependency } from "@/hooks/use-dependency";
import { fetcher } from "@/lib/fetcher";
import { BoardWithLists } from "@/types";
import { AppApiRoutes } from "@/util/appRoutes";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const DependencyProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <DependencyComponent />;
};

const DependencyComponent = () => {
  const setBoards = useDependency((state) => state.setBoards);
  const { organization: activeOrganization } = useOrganization();

  const { data: boards } = useQuery<BoardWithLists[]>({
    queryKey: ["organization_boards", activeOrganization?.id],
    queryFn: () => fetcher(AppApiRoutes.ORGANIZATION),
  });

  useEffect(() => {
    if (boards) setBoards(boards);
  }, [boards, setBoards]);

  return null;
};
