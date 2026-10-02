"use client";

import { TrendingUp, Package, AlertCircle, Users, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const salesData = [
  { name: 'Lun', ventas: 400 },
  { name: 'Mar', ventas: 300 },
  { name: 'Mié', ventas: 550 },
  { name: 'Jue', ventas: 450 },
  { name: 'Vie', ventas: 700 },
  { name: 'Sáb', ventas: 950 },
  { name: 'Dom', ventas: 1250 },
];

const categoryData = [
  { name: 'Damas', valor: 65 },
  { name: 'Caballeros', valor: 25 },
  { name: 'Insignias', valor: 10 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[var(--foreground)]">Resumen de Tienda</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Monitorea tus ventas, inventario y rendimiento general.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--surface)] p-6 border border-[var(--border-color)] rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-[var(--muted)] mb-2 flex items-center gap-2">
            Ventas del Día
          </h3>
          <p className="text-3xl font-serif text-[var(--foreground)] relative z-10">$1,250.00</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-medium relative z-10">
            <TrendingUp className="w-3 h-3" />
            <span>+12% vs ayer</span>
          </div>
        </div>

        <div className="bg-[var(--surface)] p-6 border border-[var(--border-color)] rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-16 h-16 text-secondary" />
          </div>
          <h3 className="text-sm font-medium text-[var(--muted)] mb-2">Pedidos Pendientes</h3>
          <p className="text-3xl font-serif text-[var(--foreground)] relative z-10">14</p>
          <span className="text-xs text-secondary mt-2 inline-block font-medium relative z-10">Requieren acción</span>
        </div>

        <div className="bg-[var(--surface)] p-6 border border-[var(--border-color)] rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-[var(--muted)] mb-2">Nuevos Clientes</h3>
          <p className="text-3xl font-serif text-[var(--foreground)] relative z-10">42</p>
          <span className="text-xs text-[var(--muted)] mt-2 inline-block relative z-10">Esta semana</span>
        </div>

        <div className="bg-[var(--surface)] p-6 border border-[var(--border-color)] rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h3 className="text-sm font-medium text-[var(--muted)] mb-2">Stock Bajo</h3>
          <p className="text-3xl font-serif text-[var(--foreground)] relative z-10">3</p>
          <span className="text-xs text-red-500 mt-2 inline-block font-medium relative z-10">Productos a reponer</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica de Ventas */}
        <div className="bg-[var(--surface)] p-6 border border-[var(--border-color)] rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="font-medium text-[var(--foreground)] mb-6">Rendimiento de Ventas (Últimos 7 días)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Line type="monotone" dataKey="ventas" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica de Categorías */}
        <div className="bg-[var(--surface)] p-6 border border-[var(--border-color)] rounded-2xl shadow-sm">
          <h3 className="font-medium text-[var(--foreground)] mb-6">Ventas por Categoría</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--foreground)' }}
                  cursor={{ fill: 'var(--background)' }}
                />
                <Bar dataKey="valor" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de Últimos Pedidos */}
      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="font-medium text-[var(--foreground)]">Últimos Pedidos</h3>
          <button className="text-sm text-primary hover:underline font-medium">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--muted)] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">ID Pedido</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--foreground)]">
              <tr className="hover:bg-[var(--background)]/50 transition-colors">
                <td className="px-6 py-4 font-medium">#ORD-0921</td>
                <td className="px-6 py-4">María López</td>
                <td className="px-6 py-4">Hoy, 10:42 AM</td>
                <td className="px-6 py-4">$345.00</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 rounded-full text-xs font-medium border border-yellow-200 dark:border-yellow-900">Pendiente</span>
                </td>
              </tr>
              <tr className="hover:bg-[var(--background)]/50 transition-colors">
                <td className="px-6 py-4 font-medium">#ORD-0920</td>
                <td className="px-6 py-4">Carlos Ruiz</td>
                <td className="px-6 py-4">Ayer, 16:15 PM</td>
                <td className="px-6 py-4">$120.00</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-900">Enviado</span>
                </td>
              </tr>
              <tr className="hover:bg-[var(--background)]/50 transition-colors">
                <td className="px-6 py-4 font-medium">#ORD-0919</td>
                <td className="px-6 py-4">Elena Gómez</td>
                <td className="px-6 py-4">Ayer, 09:30 AM</td>
                <td className="px-6 py-4">$550.00</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 rounded-full text-xs font-medium border border-green-200 dark:border-green-900">Entregado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
