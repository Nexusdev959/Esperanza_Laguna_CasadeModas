import { AdminSidebar } from "./sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--background)]">
        <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-between px-6">
          <h2 className="text-sm font-medium text-[var(--foreground)]">Panel de Control</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                AD
              </div>
              <span className="text-sm font-medium text-[var(--foreground)]">Admin User</span>
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
