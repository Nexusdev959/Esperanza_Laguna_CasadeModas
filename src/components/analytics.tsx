"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

// Sin estos IDs en el .env no se carga nada ni se muestra el aviso
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ENABLED = Boolean(GA_ID || PIXEL_ID);
const CONSENT_KEY = "el_cookie_consent"; // "yes" | "no"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
};
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const saveConsent = (value: "yes" | "no") => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
  listeners.forEach((fn) => fn());
};

type Item = { id: string | number; name: string; price: number; quantity?: number };

// Nombres de evento estándar de GA4 y su equivalente en Meta: así los reportes de ambos se arman solos
const META_EVENT: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  generate_lead: "Lead",
};

/** Registra un evento de venta. No hace nada si no hay IDs o el visitante no aceptó la medición. */
export function track(event: keyof typeof META_EVENT, items: Item[] = [], extra: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || readConsent() !== "yes") return;
  const value = items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
  window.gtag?.("event", event, {
    currency: "COP",
    value,
    items: items.map((i) => ({ item_id: String(i.id), item_name: i.name, price: i.price, quantity: i.quantity ?? 1 })),
    ...extra,
  });
  window.fbq?.("track", META_EVENT[event], {
    currency: "COP",
    value,
    content_ids: items.map((i) => String(i.id)),
    content_type: "product",
    ...extra,
  });
}

/** Scripts de GA4 y Meta Pixel (solo con consentimiento) y el aviso para pedirlo. */
export function Analytics() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "pending");
  const pathname = usePathname();
  const [firstPath] = useState(pathname);

  // GA4 cuenta solo los cambios de página (medición mejorada); Meta necesita el PageView manual en cada navegación
  useEffect(() => {
    if (consent === "yes" && pathname !== firstPath) window.fbq?.("track", "PageView");
  }, [pathname, consent, firstPath]);

  if (!ENABLED || pathname?.startsWith("/admin") || pathname?.startsWith("/worker")) return null;

  if (consent === "yes") {
    return (
      <>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)});`}
            </Script>
          </>
        )}
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(PIXEL_ID)});fbq('track','PageView');`}
          </Script>
        )}
      </>
    );
  }

  if (consent !== null) return null; // "no" o aún sin leer (servidor)

  return (
    <div role="dialog" aria-label="Aviso de cookies" className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 rounded-2xl border border-[var(--border-color)] bg-[var(--background)]/95 backdrop-blur-md p-4 shadow-2xl font-sans">
      <p className="text-sm text-[var(--foreground)] leading-relaxed">
        Usamos cookies de medición para saber qué productos interesan y mejorar la tienda. Solo se activan si las aceptas.{" "}
        <Link href="/legal/cookies" className="underline underline-offset-2">Más información</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => saveConsent("yes")} className="flex-1 rounded-xl bg-[#1c785f] hover:bg-[#166450] text-white text-sm font-semibold py-2 transition-colors">
          Aceptar
        </button>
        <button type="button" onClick={() => saveConsent("no")} className="flex-1 rounded-xl border border-[var(--border-color)] text-sm font-medium text-[var(--foreground)] py-2 hover:bg-[var(--surface)] transition-colors">
          Rechazar
        </button>
      </div>
    </div>
  );
}
