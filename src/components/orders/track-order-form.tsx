"use client";

import { useState, useEffect } from "react";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      setError(err.response?.data?.error || "Pedido no encontrado");
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
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-8 md:p-12 shadow-sm w-full max-w-xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif text-[var(--foreground)] mb-2">Rastrea tu Pedido</h2>
        <p className="text-[var(--muted)] text-sm max-w-sm">
          Ingresa tu número de orden y tu correo electrónico para verificar el estado actual de tu envío.
        </p>
      </div>

      <form onSubmit={handleTrack} className="space-y-6">
        <div className="space-y-2 text-left">
          <label htmlFor="orderId" className="text-sm font-medium text-[var(--foreground)]">Número de Orden</label>
          <input 
            type="text" 
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Ej. #COT-0001 o PY-10293" 
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            required
          />
        </div>
        
        <div className="space-y-2 text-left">
          <label htmlFor="email" className="text-sm font-medium text-[var(--foreground)]">Correo Electrónico (Opcional)</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com" 
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button disabled={loading} type="submit" variant="primary" className="w-full py-4 text-sm font-medium rounded-xl mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/30">
          {loading ? "Buscando..." : "Rastrear Pedido"}
        </Button>
      </form>
    </div>
  );
}
