import { Epic } from "@/types";

declare global {
  interface OrganizationPublicMetadata {
    epics: Epic[];
  }
}
