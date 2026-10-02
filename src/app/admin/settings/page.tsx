"use client";

import { Save, Building, Bell, CreditCard, Globe } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)]">Configuración de la Tienda</h1>
          <p className="text-sm text-[var(--muted)]">Ajusta los parámetros generales del sistema.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl text-sm font-medium transition-colors text-left">
            <Building className="w-4 h-4" /> Información General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] rounded-xl text-sm font-medium transition-colors text-left">
            <Globe className="w-4 h-4" /> Moneda y Región
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] rounded-xl text-sm font-medium transition-colors text-left">
            <CreditCard className="w-4 h-4" /> Pagos e Impuestos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] rounded-xl text-sm font-medium transition-colors text-left">
            <Bell className="w-4 h-4" /> Notificaciones del Sistema
          </button>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in-up">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4 border-b border-[var(--border-color)] pb-2">Detalles de la Organización</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--foreground)]">Nombre de la Tienda</label>
                <input type="text" defaultValue="Pilypage Uniformes" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--foreground)]">Correo de Contacto (Soporte)</label>
                <input type="email" defaultValue="soporte@pilypage.com" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--foreground)]">Teléfono Principal</label>
                  <input type="tel" defaultValue="+1 800 123 4567" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--foreground)]">Dirección Física (Opcional)</label>
                  <input type="text" placeholder="Ej. Calle Central #123" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <h2 className="text-lg font-medium text-[var(--foreground)] mb-4 border-b border-[var(--border-color)] pb-2">Políticas de la Tienda</h2>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--foreground)]">Mensaje de Banner Principal</label>
                <input type="text" defaultValue="Envíos gratis a partir de $150.00 en uniformes de Conquistadores." className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                <p className="text-xs text-[var(--muted)]">Este mensaje aparecerá en la parte superior de la página principal si está activo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
