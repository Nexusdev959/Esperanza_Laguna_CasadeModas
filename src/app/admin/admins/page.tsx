"use client";

import { Shield, Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_ADMINS: any[] = [];

export default function AdminStaff() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)]">Staff Administrador</h1>
          <p className="text-sm text-[var(--muted)]">Gestiona qué usuarios tienen acceso a este panel de control.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Invitar Administrador
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_ADMINS.map(admin => (
          <div key={admin.id} className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              admin.role === 'Super Administrador' ? 'bg-primary/20 text-primary' : 'bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)]'
            }`}>
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-medium text-[var(--foreground)]">{admin.name}</h3>
            <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" /> {admin.email}
            </p>
            <span className="mt-3 px-3 py-1 bg-[var(--background)] border border-[var(--border-color)] rounded-full text-xs font-medium text-[var(--foreground)]">
              {admin.role}
            </span>
            <div className="mt-6 w-full pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
              <span className={`text-xs font-medium flex items-center gap-1 ${admin.status === 'Activo' ? 'text-green-500' : 'text-[var(--muted)]'}`}>
                <span className={`w-2 h-2 rounded-full ${admin.status === 'Activo' ? 'bg-green-500' : 'bg-[var(--muted)]'}`}></span>
                {admin.status}
              </span>
              <button className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors">Revocar Acceso</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
