"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import AppRoutes, { buildRoute } from "@/util/appRoutes";
import { Layout, List, Settings, SquareChartGantt } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export interface Organization {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
}

interface NavItemProps {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export const NavItem = ({
  isActive,
  isExpanded,
  onExpand,
  organization,
}: NavItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: buildRoute(AppRoutes.ORGANIZATION_ID, { id: organization.id }),
    },
    {
      label: "Overview",
      icon: <SquareChartGantt className="h-4 w-4 mr-2" />,
      href: buildRoute(AppRoutes.BOARD_OVERVIEW, {
        organizationId: organization.id,
      }),
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: buildRoute(AppRoutes.SETTINGS, { organizationId: organization.id }),
    },
    {
      label: "Epics",
      icon: <List className="h-4 w-4 mr-2" />,
      href: buildRoute(AppRoutes.EPICS, { organizationId: organization.id }),
    },
  ];

  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="Organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm ">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((route) => (
          <Button
            key={route.href}
            size="sm"
            onClick={() => onClick(route.href)}
            className={cn(
              "w-full font-normal justify-start pl-10 mb-1",
              pathname === route.href && "bg-sky-500/100 text-sky-700"
            )}
            variant="ghost"
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
