"use client";

import { use, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { FileText, ShoppingBag, AlertCircle } from "lucide-react";
import { fetcher } from "@/lib/api";
import { formatCOP } from "@/lib/price";
import { addLinesToCart, type ReorderLine } from "@/lib/reorder";
import { useNotification } from "@/components/ui/notification-provider";

type SavedQuote = {
  quoteNumber: string; validUntil: string; total: number; createdAt: string;
  items: { description: string; quantity: number; unitPrice: number; cartItem: ReorderLine | null }[];
};

/** Retomar una cotización: el líder del club la abre con su número y la convierte en pedido. */
export default function QuoteReorderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const { data: quote, error, isLoading } = useSWR<SavedQuote>(`/orders/quotes/${encodeURIComponent(number.toUpperCase())}`, fetcher);
  const [busy, setBusy] = useState(false);
  const [now] = useState(() => Date.now());
  const { showNotification } = useNotification();

  const lines = (quote?.items ?? []).flatMap((i) => (i.cartItem ? [i.cartItem] : []));
  const expired = quote ? new Date(quote.validUntil).getTime() < now : false;

  const convert = async () => {
    setBusy(true);
    const { added, skipped } = await addLinesToCart(lines);
    setBusy(false);
    if (!added) return showNotification("Los productos de esta cotización ya no están disponibles. Escríbenos por WhatsApp.", "error");
    showNotification(
      skipped
        ? `Agregamos ${added} producto(s). ${skipped} ya no está(n) disponible(s) como se cotizó.`
        : "Listo: tu cotización está en el carrito. Completa los nombres y el RH de cada integrante.",
      skipped ? "warning" : "success",
    );
  };

  return (
    <main className="min-h-screen pt-36 pb-16 px-4 bg-[var(--background)]">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1c785f] dark:text-[#d4af37]">Cotización</p>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl text-[var(--foreground)]">{number.toUpperCase()}</h1>

        {isLoading && <p className="mt-8 text-sm text-[var(--muted)]">Buscando la cotización…</p>}
        {error && (
          <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-[var(--foreground)]">No encontramos esa cotización. Revisa el número que aparece en el documento o <Link href="/contact" className="underline">escríbenos</Link>.</p>
          </div>
        )}

        {quote && (
          <div className="mt-8 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] overflow-hidden">
            <ul className="divide-y divide-[var(--border-color)]">
              {quote.items.map((i, n) => (
                <li key={n} className="flex items-start justify-between gap-4 p-5">
                  <span className="flex items-start gap-3 min-w-0">
                    <FileText className="w-4 h-4 mt-0.5 text-[var(--muted)] shrink-0" />
                    <span className="text-sm text-[var(--foreground)]">{i.quantity} × {i.description}</span>
                  </span>
                  <span className="text-sm font-medium text-[var(--foreground)] shrink-0">{i.unitPrice ? formatCOP(i.unitPrice * i.quantity) : "Regalo"}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between p-5 bg-[var(--background)]">
              <span className="text-sm text-[var(--muted)]">Total cotizado</span>
              <span className="text-xl font-semibold text-[var(--foreground)]">{formatCOP(quote.total)}</span>
            </div>
            <div className="p-5 space-y-3 border-t border-[var(--border-color)]">
              <p className="text-xs text-[var(--muted)]">
                {expired ? "Esta cotización ya venció: al convertirla se aplican los precios de hoy." : `Válida hasta el ${new Date(quote.validUntil).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}.`}
                {" "}En el carrito verás el total final con los beneficios por cantidad vigentes.
              </p>
              {lines.length > 0 ? (
                <button onClick={convert} disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-white disabled:opacity-50">
                  <ShoppingBag className="w-4 h-4" /> {busy ? "Agregando…" : "Convertir en pedido"}
                </button>
              ) : (
                <p className="text-sm text-[var(--foreground)]">Esta cotización se hizo a mano y no se puede convertir sola. <Link href="/contact" className="underline">Escríbenos</Link> y la pasamos a pedido.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
