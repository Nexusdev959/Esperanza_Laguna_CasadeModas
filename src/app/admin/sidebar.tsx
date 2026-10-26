"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Mailbox, Shirt } from "lucide-react";
import { PanelSidebar } from "@/components/panel/panel-sidebar";

const ADMIN_LINKS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/orders", icon: ShoppingCart, label: "Recepción de Pedidos" },
  { href: "/admin/products", icon: Package, label: "Inventarios" },
  { href: "/admin/uniformes", icon: Shirt, label: "Arma tu uniforme" },
  { href: "/admin/payments", icon: DollarSign, label: "Pagos y Transacciones" },
  { href: "/admin/pqrs", icon: Mailbox, label: "Buzón PQRS" },
  // Trabajadores y Clientes: ocultos hasta conectarlos a la API (ver redirects en next.config.ts)
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <PanelSidebar
      settingsHref="/admin/settings"
      links={ADMIN_LINKS.map((link) => ({
        key: link.href,
        icon: link.icon,
        label: link.label,
        href: link.href,
        active: link.exact ? pathname === link.href : pathname.startsWith(link.href) && pathname !== "/admin",
      }))}
    />
  );
}
