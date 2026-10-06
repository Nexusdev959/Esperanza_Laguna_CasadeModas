"use client";

import {
  TrendingUp,
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

const salesData = [
  { name: "Lun", ventas: 120 },
  { name: "Mar", ventas: 190 },
  { name: "Mié", ventas: 150 },
  { name: "Jue", ventas: 280 },
  { name: "Vie", ventas: 240 },
  { name: "Sáb", ventas: 390 },
  { name: "Dom", ventas: 310 },
];

const categoryData = [
  { name: "Damas", valor: 55 },
  { name: "Caballeros", valor: 30 },
  { name: "Insignias", valor: 15 },
];

// Tooltip adaptativo a light/dark mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-[#0b1210]/95 backdrop-blur-md border border-black/5 dark:border-[#2ec4a6]/20 px-3.5 py-2 rounded-xl shadow-xl">
        <p className="text-[11px] font-sans font-medium text-black/50 dark:text-white/50 tracking-wider uppercase mb-0.5">{label}</p>
        <p className="text-sm font-sans font-semibold text-primary dark:text-[#2ec4a6] tabular-nums">
          {typeof payload[0].value === "number" && payload[0].value > 50
            ? `$${payload[0].value.toLocaleString("es-CO")}`
            : `${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

export function AdminDashboard() {
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
          Actualizado en tiempo real
        </div>
      </div>

      {/* ================= TARJETAS KPI (METRICS) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Ventas */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-primary/40 dark:hover:border-[#2ec4a6]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--muted)] tracking-wide uppercase">
              Ventas del Día
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-[#172521] border border-primary/20 dark:border-[#2ec4a6]/20 flex items-center justify-center text-primary dark:text-[#2ec4a6] group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              $0.00
            </span>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-primary dark:text-[#2ec4a6] font-medium">
              <div className="flex items-center bg-primary/10 dark:bg-[#2ec4a6]/10 px-1.5 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="tabular-nums">0%</span>
              </div>
              <span className="text-[var(--muted)] font-normal">vs ayer</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pedidos Pendientes */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-[#d4af37]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--muted)] tracking-wide uppercase">
              Pedidos en Taller
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-[#1c1c14] border border-amber-200 dark:border-[#d4af37]/25 flex items-center justify-center text-amber-600 dark:text-[#e2c275] group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              0
            </span>
            <span className="text-xs text-[var(--muted)] mt-2.5 font-normal">
              Sin entregas pendientes
            </span>
          </div>
        </div>

        {/* KPI 3: Nuevos Clientes */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-blue-500/30 dark:hover:border-white/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--muted)] tracking-wide uppercase">
              Nuevos Clientes
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-white/[0.04] border border-blue-100 dark:border-white/10 flex items-center justify-center text-blue-500 dark:text-[#c2d1cc] group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              0
            </span>
            <span className="text-xs text-[var(--muted)] mt-2.5 font-normal">
              Registrados esta semana
            </span>
          </div>
        </div>

        {/* KPI 4: Stock Bajo */}
        <div className="group relative bg-gradient-to-b from-white to-gray-50/50 dark:from-[#111a17] dark:to-[#0c1311] p-5 rounded-2xl border border-black/5 dark:border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--muted)] tracking-wide uppercase">
              Alertas de Stock
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-sans font-semibold text-[var(--foreground)] tracking-tight tabular-nums">
              0
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400/90 mt-2.5 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Inventario en nivel óptimo
            </span>
          </div>
        </div>
      </div>

      {/* ================= GRÁFICAS DE RENDIMIENTO ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 1: Rendimiento en Área (Efecto Gradiente Fluido) */}
        <div className="bg-white dark:bg-[#111a17]/90 p-6 rounded-2xl border border-black/5 dark:border-white/[0.06] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-sans font-semibold text-base text-[var(--foreground)] tracking-tight">
                Rendimiento de Ventas
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">Últimos 7 días de facturación</p>
            </div>
            <button className="text-xs text-primary dark:text-[#2ec4a6] hover:text-primary/80 dark:hover:text-[#52e5c7] flex items-center gap-1 transition-colors font-medium">
              Ver reporte <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
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
                  tickFormatter={(val) => `$${val}`}
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
        <div className="bg-white dark:bg-[#111a17]/90 p-6 rounded-2xl border border-black/5 dark:border-white/[0.06] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-sans font-semibold text-base text-[var(--foreground)] tracking-tight">
                Por Categoría
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)] mb-6">Distribución porcentual</p>

            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
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
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/[0.05] flex justify-between text-xs text-[var(--muted)]">
            <span>Categoría líder: <strong className="text-[var(--foreground)] font-medium">Damas (55%)</strong></span>
          </div>
        </div>
      </div>

      {/* ================= TABLA DE ÚLTIMOS PEDIDOS ================= */}
      <div className="bg-white dark:bg-[#111a17]/90 border border-black/5 dark:border-white/[0.06] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/[0.05] flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.01]">
          <div>
            <h3 className="font-sans font-semibold text-base text-[var(--foreground)] tracking-tight">
              Últimos Pedidos
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">Transacciones recientes en tienda</p>
          </div>
          <button className="text-xs text-primary dark:text-[#2ec4a6] hover:text-primary/80 dark:hover:text-[#52e5c7] font-medium inline-flex items-center gap-1 transition-colors">
            Ver catálogo completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-[#0b1210]/60 text-[var(--muted)] uppercase tracking-wider font-medium border-b border-black/5 dark:border-white/[0.04]">
              <tr>
                <th className="px-6 py-3.5">ID Pedido</th>
                <th className="px-6 py-3.5">Cliente</th>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5 text-right">Total</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/[0.04] text-[var(--foreground)]">
              {/* Estado Vacío Elegante */}
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.06] flex items-center justify-center text-[var(--muted)]">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[var(--muted)] font-normal">
                      No hay pedidos recientes para mostrar en este turno.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}