"use client";

import useSWR from "swr";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { fetcher } from "@/lib/api";
import { isPanelRoute } from "@/components/panel/panel-user";
import { track } from "@/components/analytics";

// Mismo valor por defecto que StoreSettings.phone en la base
const DEFAULT_PHONE = "3215028653";

/** Enlace wa.me con mensaje precargado. Los celulares colombianos (10 dígitos, empiezan por 3) necesitan el 57 delante. */
export const whatsappLink = (phone: string | null | undefined, text: string) => {
  let digits = (phone || DEFAULT_PHONE).replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("3")) digits = `57${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const useStorePhone = () => {
  const { data } = useSWR("/settings", fetcher);
  return (data as { phone?: string } | undefined)?.phone;
};

// La ficha de producto y el pago ya tienen su propio botón: ahí el flotante solo estorbaría
const HIDDEN = ["/products/", "/checkout"];

/** Botón flotante de WhatsApp en toda la tienda pública. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const phone = useStorePhone();
  if (isPanelRoute(pathname) || HIDDEN.some((p) => pathname?.startsWith(p))) return null;

  return (
    <a
      href={whatsappLink(phone, "Hola, vengo de la tienda web de Esperanza Laguna y quiero hacer un pedido.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onClick={() => track("generate_lead", [], { method: "whatsapp_flotante" })}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white font-sans text-sm font-semibold shadow-[0_10px_30px_rgba(37,211,102,0.35)] hover:bg-[#1ebe5b] hover:scale-105 active:scale-95 transition-transform motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ec4a6]"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Pide por WhatsApp</span>
    </a>
  );
}
