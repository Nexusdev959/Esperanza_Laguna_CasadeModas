"use client";

import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  Users,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Inbox
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";

type Payment = { status: string; amountInCents: number; updatedAt: string };
type Order = {
  id: string; status: string; totalAmount: string | number; createdAt: string; userId?: string | null;
  contactName?: string | null; contactPhone?: string | null; user?: { name?: string; club?: string } | null;
  payments?: Payment[]; items?: { quantity: number; isGift?: boolean; product?: { category?: string } }[];
};
type Product = { stock: number; isCraftable: boolean; isPublished?: boolean };

const IN_WORKSHOP = ["IN_PREPARATION", "IN_CONFECTION", "QUALITY_CONTROL"];
const LOW_STOCK = 3;
const STATUS_LABEL: Record<string, string> = {
  PENDING_ADVANCE: "Esperando abono", IN_PREPARATION: "En preparación", IN_CONFECTION: "En confección",
  QUALITY_CONTROL: "Control de calidad", PENDING_FINAL_PAY: "Saldo pendiente", READY_TO_SHIP: "Listo para envío",
  SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado",
};

const dayKey = (d: Date | string) => new Date(d).toLocaleDateString("en-CA"); // AAAA-MM-DD en hora local
const cop = (n: number) => n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/** Todo sale de los pedidos y pagos reales: sin datos, el panel muestra ceros y gráficas vacías. */
export function dashboardStats(orders: Order[], products: Product[], now = new Date()) {
  const salesByDay = new Map<string, number>();
  for (const o of orders) {
    for (const p of o.payments ?? []) {
      if (p.status !== "APPROVED") continue;
      const k = dayKey(p.updatedAt);
      salesByDay.set(k, (salesByDay.get(k) ?? 0) + p.amountInCents / 100);
    }
  }
  const salesData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const name = d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "");
    return { name: name.charAt(0).toUpperCase() + name.slice(1), ventas: salesByDay.get(dayKey(d)) ?? 0 };
  });
  const today = salesData[6].ventas;
  const yesterday = salesData[5].ventas;
  const change = yesterday > 0 ? Math.round(((today - yesterday) / yesterday) * 100) : null;

  const units = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "CANCELLED") continue;
    for (const it of o.items ?? []) {
      if (it.isGift) continue;
      const c = it.product?.category || "Sin categoría";
      units.set(c, (units.get(c) ?? 0) + it.quantity);
    }
  }
  const totalUnits = [...units.values()].reduce((a, b) => a + b, 0);
  const categoryData = [...units.entries()]
    .map(([name, n]) => ({ name, valor: Math.round((n / totalUnits) * 100) }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  // Cliente nuevo: su primer pedido es de los últimos 7 días
  const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const firstOrder = new Map<string, number>();
  for (const o of orders) {
    const who = o.userId || o.contactPhone;
    if (!who) continue;
    const t = new Date(o.createdAt).getTime();
    firstOrder.set(who, Math.min(firstOrder.get(who) ?? t, t));
  }

  return {
    today, change, salesData, categoryData,
    inWorkshop: orders.filter((o) => IN_WORKSHOP.includes(o.status)).length,
    newClients: [...firstOrder.values()].filter((t) => t >= weekAgo).length,
    lowStock: products.filter((p) => !p.isCraftable && p.isPublished !== false && p.stock <= LOW_STOCK).length,
    recent: orders.slice(0, 5),
  };
}

// Tooltip adaptativo a light/dark mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-[#0b1210]/95 backdrop-blur-md border border-black/5 dark:border-[#2ec4a6]/20 px-3.5 py-2 rounded-xl shadow-xl">
        <p className="text-[11px] font-sans font-medium text-black/50 dark:text-white/50 tracking-wider uppercase mb-0.5">{label}</p>
        <p className="text-sm font-sans font-semibold text-primary dark:text-[#2ec4a6] tabular-nums">
          {payload[0].dataKey === "ventas" ? cop(payload[0].value) : `${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

export function AdminDashboard() {
  const orders = useSWR<Order[]>("/orders", fetcher, { refreshInterval: 60_000 });
  const products = useSWR<Product[]>("/products", fetcher, { refreshInterval: 300_000 });
  const s = dashboardStats(orders.data ?? [], products.data ?? []);
  const leader = s.categoryData[0];

  return (
    <div className="space-y-7 animate-in fade-in duration-500 font-sans pb-10">
      {/* ================= HEADER EDITORIAL ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/[0.05] pb-5">
        <div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight sm:text-3xl text-[var(--foreground)] tracking-tight">
            Resumen de Tienda
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-normal mt-1">
            Monitorea ventas en taller, estado de pedidos e inventario artesanal.
          </p>
        </div>

        {/* Badge de sincronización en vivo */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-[#111a17] border border-emerald-200 dark:border-[#2ec4a6]/20 text-[11px] text-emerald-700 dark:text-[#2ec4a6] font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#2ec4a6] animate-pulse" />
          {orders.error ? "No se pudieron cargar los datos" : "Se actualiza cada minuto"}
        </div>
      </div>

      {/* ================= TARJETAS KPI (METRICS) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* KPI 1: Ventas */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-4 sm:p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-primary/40 dark:hover:border-[#2ec4a6]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-medium text-[var(--muted)] tracking-wide uppercase truncate mr-2">
              Ventas del Día
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-primary/10 dark:bg-[#172521] border border-primary/20 dark:border-[#2ec4a6]/20 flex items-center justify-center text-primary dark:text-[#2ec4a6] group-hover:scale-105 transition-transform">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              {cop(s.today)}
            </span>
            <div className="flex items-center gap-1.5 mt-2 sm:mt-2.5 text-[10px] sm:text-xs text-primary dark:text-[#2ec4a6] font-medium">
              {s.change === null ? (
                <span className="text-[var(--muted)] font-normal">Sin ventas ayer</span>
              ) : (
                <>
                  <div className={`flex items-center px-1.5 py-0.5 rounded-md ${s.change < 0 ? "bg-red-500/10 text-red-500" : "bg-primary/10 dark:bg-[#2ec4a6]/10"}`}>
                    {s.change < 0 ? <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> : <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />}
                    <span className="tabular-nums">{s.change > 0 ? "+" : ""}{s.change}%</span>
                  </div>
                  <span className="text-[var(--muted)] font-normal hidden sm:inline">vs ayer</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* KPI 2: Pedidos Pendientes */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-4 sm:p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-[#d4af37]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-medium text-[var(--muted)] tracking-wide uppercase truncate mr-2">
              Pedidos Taller
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-[#1c1c14] border border-amber-200 dark:border-[#d4af37]/25 flex items-center justify-center text-amber-600 dark:text-[#e2c275] group-hover:scale-105 transition-transform">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              {s.inWorkshop}
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--muted)] mt-2 sm:mt-2.5 font-normal truncate">
              En preparación o confección
            </span>
          </div>
        </div>

        {/* KPI 3: Nuevos Clientes */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-4 sm:p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-blue-500/30 dark:hover:border-white/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-medium text-[var(--muted)] tracking-wide uppercase truncate mr-2">
              Clientes Nuevos
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-white/[0.04] border border-blue-100 dark:border-white/10 flex items-center justify-center text-blue-500 dark:text-[#c2d1cc] group-hover:scale-105 transition-transform">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              {s.newClients}
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--muted)] mt-2 sm:mt-2.5 font-normal truncate">
              Primer pedido esta semana
            </span>
          </div>
        </div>

        {/* KPI 4: Stock Bajo */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-4 sm:p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-medium text-[var(--muted)] tracking-wide uppercase truncate mr-2">
              Alertas Stock
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              {s.lowStock}
            </span>
            {s.lowStock === 0 ? (
              <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400/90 mt-2 sm:mt-2.5 font-medium flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Nivel óptimo
              </span>
            ) : (
              <Link href="/admin/products" className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-2 sm:mt-2.5 font-medium flex items-center gap-1 truncate hover:underline">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-amber-500" />
                Con {LOW_STOCK} o menos unidades
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ================= GRÁFICAS DE RENDIMIENTO ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 1: Rendimiento en Área (Efecto Gradiente Fluido) */}
        <div className="bg-white dark:bg-[#111a17]/90 p-4 sm:p-6 rounded-2xl border border-black/5 dark:border-white/[0.06] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="font-sans font-semibold text-base text-[var(--foreground)] tracking-tight">
                Rendimiento de Ventas
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">Últimos 7 días de facturación</p>
            </div>
            <Link href="/admin/payments" className="text-xs text-primary dark:text-[#2ec4a6] hover:text-primary/80 dark:hover:text-[#52e5c7] flex items-center gap-1 transition-colors font-medium">
              Ver pagos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.salesData}margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="salesGradientLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B4332" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="salesGradientDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2ec4a6" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2ec4a6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-black/5 dark:text-white/5" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  className="text-[var(--muted)]"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-[var(--muted)]"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                  tickFormatter={(val) => (val >= 1000 ? `$${Math.round(val / 1000)}k` : `$${val}`)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  className="dark:stroke-[#2ec4a6] fill-[url(#salesGradientLight)] dark:fill-[url(#salesGradientDark)]"
                  activeDot={{ r: 5, strokeWidth: 2, className: "fill-primary stroke-white dark:fill-[#2ec4a6] dark:stroke-[#070a09]" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Ventas por Categoría (Barras Metálicas Redondeadas) */}
        <div className="bg-white dark:bg-[#111a17]/90 p-4 sm:p-6 rounded-2xl border border-black/5 dark:border-white/[0.06] shadow-sm flex flex-col justify-between mt-6 lg:mt-0">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-sans font-semibold text-base text-[var(--foreground)] tracking-tight">
                Por Categoría
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4 sm:mb-6">Distribución porcentual</p>

            <div className="h-[230px] w-full">
              {s.categoryData.length === 0 ? (
                <p className="h-full flex items-center justify-center text-xs text-[var(--muted)]">Aún no hay productos vendidos.</p>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.categoryData}margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e2c275" />
                      <stop offset="100%" stopColor="#b89246" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-black/5 dark:text-white/5" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    className="text-[var(--muted)]"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-[var(--muted)]"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", className: "text-black/5 dark:text-white/5" }} />
                  <Bar dataKey="valor" fill="url(#barGold)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>

          {leader && (
            <div className="pt-4 border-t border-black/5 dark:border-white/[0.05] flex justify-between text-xs text-[var(--muted)]">
              <span>Categoría líder: <strong className="text-[var(--foreground)] font-medium">{leader.name} ({leader.valor}%)</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* ================= TABLA DE ÚLTIMOS PEDIDOS ================= */}
      <div className="bg-white dark:bg-[#111a17]/90 border border-black/5 dark:border-white/[0.06] rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-black/5 dark:border-white/[0.05] flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.01]">
          <div>
            <h3 className="font-sans font-semibold text-base text-[var(--foreground)] tracking-tight">
              Últimos Pedidos
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">Transacciones recientes en tienda</p>
          </div>
          <Link href="/admin/orders" className="text-[10px] sm:text-xs text-primary dark:text-[#2ec4a6] hover:text-primary/80 dark:hover:text-[#52e5c7] font-medium inline-flex items-center gap-1 transition-colors">
            Ver todo <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[500px]">
            <thead className="bg-gray-50 dark:bg-[#0b1210]/60 text-[var(--muted)] uppercase tracking-wider font-medium border-b border-black/5 dark:border-white/[0.04]">
              <tr>
                <th className="px-4 sm:px-6 py-2.5 sm:py-3.5">ID Pedido</th>
                <th className="px-4 sm:px-6 py-2.5 sm:py-3.5">Cliente</th>
                <th className="px-4 sm:px-6 py-2.5 sm:py-3.5">Fecha</th>
                <th className="px-4 sm:px-6 py-2.5 sm:py-3.5 text-right">Total</th>
                <th className="px-4 sm:px-6 py-2.5 sm:py-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/[0.04] text-[var(--foreground)]">
              {s.recent.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 sm:px-6 py-3 font-medium">{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 sm:px-6 py-3">{o.user?.name || o.contactName || "Cliente sin cuenta"}</td>
                  <td className="px-4 sm:px-6 py-3 text-[var(--muted)]">{new Date(o.createdAt).toLocaleDateString("es-CO")}</td>
                  <td className="px-4 sm:px-6 py-3 text-right tabular-nums">{cop(Number(o.totalAmount))}</td>
                  <td className="px-4 sm:px-6 py-3 text-center text-[var(--muted)]">{STATUS_LABEL[o.status] || o.status}</td>
                </tr>
              ))}
              {s.recent.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.06] flex items-center justify-center text-[var(--muted)]">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[var(--muted)] font-normal">
                      No hay pedidos recientes para mostrar.
                    </p>
                  </div>
                </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}