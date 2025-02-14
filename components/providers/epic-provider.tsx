"use client";

import { useEpic } from "@/hooks/use-epic";
import { useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const EpicProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <EpicComponent />;
};

const EpicComponent = () => {
  const setSelectedEpic = useEpic((state) => state.setSelectedEpic);
  const setEpics = useEpic((state) => state.setEpics);
  const epics = useEpic((state) => state.epics);
  const selectedEpic = useEpic((state) => state.selectedEpic);
  const { organization: activeOrganization } = useOrganization();

  const epicsFromOrganization = activeOrganization?.publicMetadata?.epics;
  useEffect(() => {
    if (!epics?.length && epicsFromOrganization) {
      const epicsFromOrganizationOrdered = epicsFromOrganization.sort(
        (a, b) => a.order - b.order
      );
      setEpics(epicsFromOrganizationOrdered);
    }
    if (
      !selectedEpic &&
      epicsFromOrganization &&
      epicsFromOrganization.length > 0
    )
      setSelectedEpic(epicsFromOrganization[0]);
  }, [epics, selectedEpic, epicsFromOrganization, setEpics, setSelectedEpic]);

  return null;
};
