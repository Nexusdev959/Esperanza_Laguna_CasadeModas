import { AdminSidebar } from "./sidebar";
import { PanelHeader } from "@/components/panel/panel-header";
import { PanelUserProvider } from "@/components/panel/panel-user";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Nada del panel se muestra hasta que el backend confirme que el usuario es administrador
    <PanelUserProvider allowedRoles={["ADMIN", "SUPERADMIN"]}>
      <div className="flex h-screen bg-[var(--background)] overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--background)]">
          <PanelHeader title="Panel de Control" />
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </PanelUserProvider>
  );
}
