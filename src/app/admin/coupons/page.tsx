"use client";

import { useState } from "react";
import useSWR from "swr";
import { Ticket, Plus, Trash2, Pause, Play } from "lucide-react";
import { api, fetcher } from "@/lib/api";
import { formatCOP } from "@/lib/price";
import { useNotification } from "@/components/ui/notification-provider";

type Coupon = {
  id: string; code: string; type: "PERCENT" | "AMOUNT"; value: number; minSubtotal: number;
  maxUses: number | null; uses: number; expiresAt: string | null; active: boolean;
};

const input = "w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";
const empty = { code: "", type: "PERCENT" as Coupon["type"], value: "", minSubtotal: "", maxUses: "", expiresAt: "" };
const errorOf = (e: unknown, fallback: string) => (e as { response?: { data?: { error?: string } } }).response?.data?.error || fallback;

/** Cupones para líderes de club, temporadas o referidos */
export default function CouponsPage() {
  const { data: coupons, mutate } = useSWR<Coupon[]>("/coupons", fetcher);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [now] = useState(() => Date.now());
  const { showNotification, confirm } = useNotification();

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/coupons", {
        code: form.code, type: form.type, value: Number(form.value), minSubtotal: Number(form.minSubtotal) || 0,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        // Vence al final del día elegido, hora de Colombia
        expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59-05:00`).toISOString() : null,
      });
      setForm(empty);
      showNotification("Cupón creado", "success");
      mutate();
    } catch (err) {
      showNotification(errorOf(err, "No se pudo crear el cupón"), "error");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: Coupon) => {
    try { await api.patch(`/coupons/${c.id}`, { active: !c.active }); mutate(); }
    catch (err) { showNotification(errorOf(err, "No se pudo actualizar"), "error"); }
  };

  const remove = async (c: Coupon) => {
    if (!(await confirm({ title: `¿Borrar el cupón ${c.code}?`, message: 'Ya no se podrá usar en nuevos pedidos.', confirmText: 'Borrar', danger: true }))) return;
    try { await api.delete(`/coupons/${c.id}`); mutate(); }
    catch (err) { showNotification(errorOf(err, "No se pudo borrar"), "error"); }
  };

  const status = (c: Coupon) =>
    !c.active ? "Pausado"
      : c.expiresAt && new Date(c.expiresAt).getTime() < now ? "Vencido"
        : c.maxUses !== null && c.uses >= c.maxUses ? "Agotado" : "Activo";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)] flex items-center gap-2"><Ticket className="w-6 h-6" /> Cupones</h1>
        <p className="text-sm text-[var(--muted)] mt-1">El cliente escribe el código en el carrito. El descuento se resta del total antes del anticipo y no se suma con otro cupón.</p>
      </div>

      <form onSubmit={create} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 items-end p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]">
        <label className="text-xs text-[var(--muted)] lg:col-span-2">Código
          <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} maxLength={30} placeholder="INVESTIDURA10" className={`${input} mt-1 uppercase`} />
        </label>
        <label className="text-xs text-[var(--muted)]">Tipo
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon["type"] })} className={`${input} mt-1`}>
            <option value="PERCENT">Porcentaje</option>
            <option value="AMOUNT">Valor fijo</option>
          </select>
        </label>
        <label className="text-xs text-[var(--muted)]">{form.type === "PERCENT" ? "Porcentaje" : "Valor en pesos"}
          <input required type="number" min={1} max={form.type === "PERCENT" ? 90 : undefined} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={`${input} mt-1`} />
        </label>
        <label className="text-xs text-[var(--muted)]">Compra mínima
          <input type="number" min={0} step={1000} value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} placeholder="0" className={`${input} mt-1`} />
        </label>
        <label className="text-xs text-[var(--muted)]">Usos máximos
          <input type="number" min={1} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Sin límite" className={`${input} mt-1`} />
        </label>
        <label className="text-xs text-[var(--muted)] lg:col-span-2">Vence (opcional)
          <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={`${input} mt-1`} />
        </label>
        <button disabled={saving} className="lg:col-span-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50">
          <Plus className="w-4 h-4" /> {saving ? "Creando…" : "Crear cupón"}
        </button>
      </form>

      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-[var(--muted)] border-b border-[var(--border-color)]">
            <tr><th className="px-5 py-3">Código</th><th className="px-5 py-3">Descuento</th><th className="px-5 py-3">Condiciones</th><th className="px-5 py-3">Usos</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {coupons?.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-[var(--muted)]">Aún no hay cupones.</td></tr>}
            {coupons?.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 font-mono font-semibold text-[var(--foreground)]">{c.code}</td>
                <td className="px-5 py-3">{c.type === "PERCENT" ? `${c.value}%` : formatCOP(c.value)}</td>
                <td className="px-5 py-3 text-xs text-[var(--muted)]">
                  {c.minSubtotal > 0 ? `Desde ${formatCOP(c.minSubtotal)}` : "Sin mínimo"}
                  {c.expiresAt && ` · vence ${new Date(c.expiresAt).toLocaleDateString("es-CO")}`}
                </td>
                <td className="px-5 py-3">{c.uses}{c.maxUses !== null && ` / ${c.maxUses}`}</td>
                <td className="px-5 py-3"><span className={`px-2 py-1 rounded-md text-xs font-medium ${status(c) === "Activo" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-stone-500/15 text-[var(--muted)]"}`}>{status(c)}</span></td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button onClick={() => toggle(c)} title={c.active ? "Pausar" : "Activar"} aria-label={`${c.active ? "Pausar" : "Activar"} ${c.code}`} className="p-2 text-[var(--muted)] hover:text-primary">{c.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
                  {c.uses === 0 && <button onClick={() => remove(c)} aria-label={`Borrar ${c.code}`} className="p-2 text-[var(--muted)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
