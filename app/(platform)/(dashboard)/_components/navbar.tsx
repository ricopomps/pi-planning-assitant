import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import AppRoutes from "@/util/appRoutes";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { MobileSidebar } from "./mobile-navbar";

export const Navbar = () => {
  return (
    <div className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <Button
          size="sm"
          variant="primary"
          className="rounded-sm hidden md:block h-auto py-1.5 px-2"
        >
          Create
        </Button>
        <Button
          size="sm"
          variant="primary"
          className="rounded-sm block md:hidden h-auto py-1.5"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl={AppRoutes.ORGANIZATION_ID}
          afterLeaveOrganizationUrl={AppRoutes.SELECT_ORGANIZATION}
          afterSelectOrganizationUrl={AppRoutes.ORGANIZATION_ID}
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
