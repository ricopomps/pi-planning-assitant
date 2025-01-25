import AppRoutes from "@/util/appRoutes";
import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl={AppRoutes.ORGANIZATION_ID}
      afterCreateOrganizationUrl={AppRoutes.ORGANIZATION_ID}
    />
  );
}
