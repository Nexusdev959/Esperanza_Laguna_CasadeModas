"use client";

import { Save, Building, Bell, CreditCard, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "",
    supportEmail: "",
    phone: "",
    address: "",
    bannerMessage: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(res => {
      setSettings({
        storeName: res.data.storeName || "",
        supportEmail: res.data.supportEmail || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        bannerMessage: res.data.bannerMessage || ""
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      alert('Configuración guardada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la configuración');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-[var(--muted)]">Cargando configuración...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)]">Configuración de la Tienda</h1>
          <p className="text-sm text-[var(--muted)]">Ajusta los parámetros generales del sistema.</p>
        </div>
        <button disabled={saving} onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
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
                <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--foreground)]">Correo de Contacto (Soporte)</label>
                <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--foreground)]">Teléfono Principal</label>
                  <input type="tel" name="phone" value={settings.phone} onChange={handleChange} className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--foreground)]">Dirección Física (Opcional)</label>
                  <input type="text" name="address" value={settings.address} onChange={handleChange} placeholder="Ej. Calle Central #123" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <h2 className="text-lg font-medium text-[var(--foreground)] mb-4 border-b border-[var(--border-color)] pb-2">Políticas de la Tienda</h2>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--foreground)]">Mensaje de Banner Principal</label>
                <input type="text" name="bannerMessage" value={settings.bannerMessage} onChange={handleChange} placeholder="Ej. Envíos gratis..." className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                <p className="text-xs text-[var(--muted)]">Este mensaje aparecerá en la parte superior de la página principal si está activo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
