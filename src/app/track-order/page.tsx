"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";
import { TrackOrderForm } from "@/components/orders/track-order-form";
import { TrackOrderResult, OrderTrackData } from "@/components/orders/track-order-result";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

function TrackOrderContent() {
  const [trackData, setTrackData] = useState<OrderTrackData | null>(null);
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <>
      <main className="container max-w-6xl mx-auto px-4 py-32 min-h-screen">
        <AnimateIn delay={0.1}>
          {!trackData ? (
            <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
          ) : (
            <button onClick={() => setTrackData(null)} className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al buscador
            </button>
          )}
          
          {!trackData ? (
            <TrackOrderForm initialOrderId={reference || ""} onTrackSuccess={(data: any) => setTrackData(data)} />
          ) : (
            <TrackOrderResult data={trackData} onBack={() => setTrackData(null)} />
          )}
          
        </AnimateIn>
      </main>
    </>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
