"use client";

import { useState, useEffect } from "react";
import { PackageSearch, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export function TrackOrderForm({ onTrackSuccess, initialOrderId }: { onTrackSuccess?: (data: any) => void, initialOrderId?: string }) {
  const [orderId, setOrderId] = useState(initialOrderId || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      // Auto-fetch if reference is present
      handleFetch(initialOrderId);
    }
  }, [initialOrderId]);

  const handleFetch = async (idToFetch: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/orders/track/${idToFetch}`);
      
      const order = res.data;
      
      let mappedStatus = 'CONFIRMADO';
      if (order.status === 'IN_CONFECTION') mappedStatus = 'CONFECCION';
      else if (['QUALITY_CONTROL', 'PENDING_FINAL_PAY', 'READY_TO_SHIP'].includes(order.status)) mappedStatus = 'CALIDAD';
      else if (order.status === 'SHIPPED') mappedStatus = 'TRANSITO';
      else if (order.status === 'DELIVERED') mappedStatus = 'ENTREGADO';

      const mockData = {
        id: order.id, // Keep full ID for payment links
        displayId: order.id.slice(0,8).toUpperCase(),
        status: mappedStatus,
        rawStatus: order.status,
        totalAmount: order.totalAmount,
        isLocal: true, 
        courier: order.shippingCarrier || 'Mensajería Express Pilypage',
        trackingNumber: order.trackingNumber || 'En preparación',
        deliveryInstructions: order.shippingAddress || 'Pendiente',
        originCoords: [-74.0817, 4.6097], // Bogotá
        destinationCoords: [-75.5652, 6.2518], // Medellín (si es transito)
        currentCoords: [-74.5, 5.0], // Mitad de camino
        estimatedDate: "Próximamente"
      };

      if (onTrackSuccess) {
        onTrackSuccess(mockData);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Pedido no encontrado o la información es incorrecta.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    handleFetch(orderId);
  };

  return (
    <div className="relative group flex flex-col w-full max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-[#f9fbfaf0] via-white to-[#f4f7f5] dark:from-[#111916]/95 dark:via-[#0a0f0d] dark:to-[#070a09] border border-black/[0.05] dark:border-white/[0.05] hover:border-[#1c785f]/30 dark:hover:border-[#d4af37]/30 p-8 md:p-12 transition-all duration-700 ease-out shadow-2xl shadow-black/[0.03] dark:shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_25px_rgba(46,196,166,0.03)] backdrop-blur-xl overflow-hidden font-sans">
      
      {/* Luz cenital de foco (Spotlight) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% -10%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)"
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1c785f]/10 to-[#1c785f]/5 dark:from-[#d4af37]/10 dark:to-[#d4af37]/5 border border-[#1c785f]/20 dark:border-[#d4af37]/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(28,120,95,0.15)] dark:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-700">
          <PackageSearch className="w-8 h-8 text-[#1c785f] dark:text-[#d4af37] drop-shadow-[0_0_8px_rgba(28,120,95,0.4)] dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1a2b22] dark:text-[#f0f4f2] mb-3 tracking-tight transition-colors duration-700">
          Rastrea tu Pedido
        </h2>
        <p className="text-[#5a6c65] dark:text-[#7a8c85] text-[13px] max-w-sm leading-relaxed transition-colors duration-700">
          Ingresa tu número de orden y correo electrónico asociado para localizar el estado en tiempo real de tu confección.
        </p>
      </div>

      <form onSubmit={handleTrack} className="relative z-10 space-y-6">
        <div className="space-y-2 text-left group/input">
          <label htmlFor="orderId" className="text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#1a2b22] dark:text-[#d4af37]/90 transition-colors duration-700 ml-1">
            Número de Orden
          </label>
          <input 
            type="text" 
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Ej. COT-0001 o PY-10293" 
            className="w-full px-5 py-4 bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm"
            required
          />
        </div>
        
        <div className="space-y-2 text-left group/input">
          <label htmlFor="email" className="text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#1a2b22] dark:text-[#d4af37]/90 transition-colors duration-700 ml-1">
            Correo Electrónico <span className="opacity-60 font-medium normal-case">(Opcional)</span>
          </label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com" 
            className="w-full px-5 py-4 bg-white dark:bg-[#060908] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl text-[14px] text-[#1a2b22] dark:text-[#f0f4f2] placeholder:text-[#5a6c65]/60 dark:placeholder:text-[#7a8c85]/50 focus:outline-none focus:border-[#1c785f] dark:focus:border-[#d4af37] focus:ring-1 focus:ring-[#1c785f]/30 dark:focus:ring-[#d4af37]/30 transition-all duration-300 shadow-sm"
          />
        </div>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-1 px-4 py-3 rounded-xl bg-red-50/50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20">
            <p className="text-red-600 dark:text-red-400 text-xs font-medium text-center">{error}</p>
          </div>
        )}

        <button 
          disabled={loading} 
          type="submit" 
          className="group/btn relative w-full overflow-hidden rounded-2xl p-[1px] mt-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(28,120,95,0.25)] dark:shadow-[0_8px_20px_rgba(212,175,55,0.2)]"
        >
          {/* Borde Animado Gradiente */}
          <span className="absolute inset-0 bg-gradient-to-r from-[#1c785f] via-[#2ec4a6] to-[#1c785f] dark:from-[#d4af37] dark:via-[#f5e1a4] dark:to-[#d4af37] opacity-80" />
          
          <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a6652] to-[#134d3d] dark:from-[#bfa054] dark:to-[#997b2d] px-6 py-4 rounded-[15px] transition-all duration-300 group-hover/btn:opacity-90">
            {loading ? (
              <Loader2 className="w-5 h-5 text-white dark:text-[#070a09] animate-spin" />
            ) : (
              <>
                <span className="text-sm font-bold tracking-wide text-white dark:text-[#070a09]">
                  Rastrear Pedido
                </span>
                <ArrowRight className="w-4 h-4 text-white dark:text-[#070a09] group-hover/btn:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}
