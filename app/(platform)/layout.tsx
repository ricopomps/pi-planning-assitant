import { DependencyProvider } from "@/components/providers/dependency-provider";
import { EpicProvider } from "@/components/providers/epic-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        <DependencyProvider />
        <EpicProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
