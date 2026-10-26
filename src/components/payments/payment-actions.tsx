"use client";

import { useState } from "react";
import { MessageCircle, Mail, Link2, CheckCircle2 } from "lucide-react";
import { useNotification } from "@/components/ui/notification-provider";

interface PaymentActionsProps {
  orderId: string;
  clientName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  totalAmount: number;
  paidAmount: number;
  deliveryMethod?: string | null;
}

const money = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

// Celulares colombianos de 10 dígitos llevan el 57; si ya trae indicativo se respeta
const whatsappNumber = (phone?: string | null) => {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 7) return null;
  return digits.length === 10 && digits.startsWith("3") ? `57${digits}` : digits;
};

export function PaymentActions({ orderId, clientName, clientPhone, clientEmail, totalAmount, paidAmount, deliveryMethod }: PaymentActionsProps) {
  const { showNotification } = useNotification();
  // Mismas reglas que el servidor (computeChargeInCents): nunca se cobra más del saldo pendiente
  const pending = Math.max(0, Math.round((totalAmount - paidAmount) * 100) / 100);
  const advance = Math.min(totalAmount / 2, pending);
  const hasPaid = paidAmount > 0;
  const [mode, setMode] = useState<"ADVANCE" | "PENDING">(hasPaid ? "PENDING" : "ADVANCE");

  const code = orderId.slice(0, 8).toUpperCase();
  const amountDue = mode === "ADVANCE" ? advance : pending;
  const paymentLink = typeof window !== "undefined" ? `${window.location.origin}/checkout/${orderId}` : "";
  const wa = whatsappNumber(clientPhone);

  // Formato de WhatsApp (*negrita*, _cursiva_); el enlace al final hace que WhatsApp muestre la tarjeta con imagen
  const message = [
    `Hola ${clientName} 👋`,
    ``,
    ...(pending <= 0
      ? [
          `✅ *¡Tu pedido está pagado y listo!*`,
          ``,
          `🧾 *Pedido:* #${code}`,
          deliveryMethod === "STORE_PICKUP"
            ? `🏬 Puedes recogerlo en tienda presentando el código *${code}*.`
            : `🚚 Te enviaremos la guía apenas lo despachemos.`,
        ]
      : [
          mode === "ADVANCE" ? `✂️ *Iniciemos la confección de tu pedido*` : `🎉 *¡Tu pedido está casi listo!*`,
          ``,
          `🧾 *Pedido:* #${code}`,
          `💰 *${mode === "ADVANCE" ? "Anticipo (50%)" : "Saldo pendiente"}:* ${money(amountDue)}`,
          ``,
          `Paga de forma segura aquí 👇`,
          paymentLink,
        ]),
    ``,
    `_Esperanza Laguna · Casa de Modas_`,
  ].join("\n");

  const waLink = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(message)}` : null;
  const mailLink = clientEmail
    ? `mailto:${clientEmail}?subject=${encodeURIComponent(`Tu pedido #${code} - Esperanza Laguna`)}&body=${encodeURIComponent(message)}`
    : null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      showNotification("Enlace de pago copiado", "success");
    } catch {
      showNotification(paymentLink, "info");
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-serif text-[var(--foreground)] mb-1">Gestión de Cobros y Pagos</h3>
      <p className="text-sm text-[var(--muted)] mb-5">
        Se envía al contacto que dejó el cliente: {clientPhone || "sin teléfono"}{clientEmail ? ` · ${clientEmail}` : ""}
      </p>

      {pending <= 0 ? (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Pedido pagado en su totalidad. Avísale al cliente que está listo.
        </div>
      ) : (
        <>
          {/* Con abonos solo queda el saldo real; sin abonos se elige anticipo o total */}
          <div className={`grid gap-2 mb-4 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-color)] ${hasPaid ? "grid-cols-1" : "grid-cols-2"}`}>
            {!hasPaid && (
              <button
                onClick={() => setMode("ADVANCE")}
                aria-pressed={mode === "ADVANCE"}
                className={`py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${mode === "ADVANCE" ? "bg-[var(--surface)] shadow-sm text-primary" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                Anticipo 50% · {money(advance)}
              </button>
            )}
            <button
              onClick={() => setMode("PENDING")}
              aria-pressed={mode === "PENDING"}
              className={`py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${mode === "PENDING" ? "bg-[var(--surface)] shadow-sm text-primary" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
            >
              {hasPaid ? "Saldo pendiente" : "Total"} · {money(pending)}
            </button>
          </div>
          <button
            onClick={copyLink}
            className="w-full mb-5 flex items-center justify-center gap-2 h-11 rounded-xl border border-[var(--border-color)] text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Link2 className="w-4 h-4" /> Copiar enlace de pago
          </button>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-xl font-medium transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> {pending <= 0 ? "Avisar por WhatsApp" : "Cobrar por WhatsApp"}
          </a>
        ) : (
          <span className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--border-color)] text-sm text-[var(--muted)]">
            <MessageCircle className="w-5 h-5" /> Sin teléfono válido
          </span>
        )}
        {mailLink ? (
          <a
            href={mailLink}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--background)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--border-color)] text-[var(--foreground)] rounded-xl font-medium transition-colors"
          >
            <Mail className="w-5 h-5" /> Enviar Correo
          </a>
        ) : (
          <span className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--border-color)] text-sm text-[var(--muted)]">
            <Mail className="w-5 h-5" /> Sin correo
          </span>
        )}
      </div>
    </div>
  );
}
