"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Package, Scissors, Truck, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Tipos de estado del pedido
export type OrderStatus = 'CONFIRMADO' | 'CONFECCION' | 'CALIDAD' | 'TRANSITO' | 'ENTREGADO';

export interface OrderTrackData {
  id: string;
  displayId: string;
  status: OrderStatus;
  rawStatus: string;
  totalAmount: string;
  isLocal: boolean;
  courier: string;
  trackingNumber: string;
  deliveryInstructions: string;
  estimatedDate: string;
}

const STEPS = [
  { id: 'CONFIRMADO', label: 'Pedido Confirmado', icon: Package },
  { id: 'CONFECCION', label: 'Corte y Confección', icon: Scissors },
  { id: 'CALIDAD', label: 'Control de Calidad', icon: ClipboardCheck },
  { id: 'TRANSITO', label: 'En Tránsito', icon: Truck },
  { id: 'ENTREGADO', label: 'Entregado', icon: CheckCircle2 },
];

export function TrackOrderResult({ data, onBack }: { data: OrderTrackData, onBack: () => void }) {

  const currentStepIndex = STEPS.findIndex(s => s.id === data.status);

  // Confetti effect on delivered
  useEffect(() => {
    if (data.status === 'ENTREGADO') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [data.status]);


  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL IZQUIERDO: Timeline y Detalles */}
        <div className="lg:col-span-1 bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm flex flex-col h-[600px] overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-1">Pedido {data.displayId}</h2>
            <p className="text-sm text-[var(--muted)]">Entrega estimada: {data.estimatedDate}</p>
          </div>

          {/* Pagos Pendientes */}
          {(data.rawStatus === 'PENDING_ADVANCE' || data.rawStatus === 'PENDING_FINAL_PAY') && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8">
              <h3 className="text-amber-600 dark:text-amber-400 font-bold mb-2">
                {data.rawStatus === 'PENDING_ADVANCE' ? 'Abono Inicial Pendiente (50%)' : 'Pago Final Pendiente (50%)'}
              </h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                Tu pedido ha sido registrado. Para continuar con {data.rawStatus === 'PENDING_ADVANCE' ? 'la confección' : 'el envío'}, debes realizar el pago correspondiente de <strong className="text-[var(--foreground)]">${(parseFloat(data.totalAmount) / 2).toLocaleString('es-CO')} COP</strong>.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => window.open(`https://pilypage.com/checkout/${data.id}`, '_blank')} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium">
                  Pagar por Wompi
                </Button>
                <Button variant="outline" onClick={() => window.open(`https://wa.me/573215028653?text=Hola, quiero reportar el pago de mi pedido ${data.displayId}`, '_blank')} className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
                  Reportar Transferencia
                </Button>
              </div>
            </div>
          )}

          {/* Guía y Logística */}
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-5 mb-8 border border-[var(--border-color)]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Logística</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)] text-xs mb-1">Tipo de Envío</p>
                <p className="font-medium text-[var(--foreground)]">{data.isLocal ? 'Mensajería Local Expresa' : 'Despacho Nacional'}</p>
              </div>
              <div>
                <p className="text-[var(--muted)] text-xs mb-1">Transportadora</p>
                <p className="font-medium text-[var(--foreground)]">{data.courier}</p>
              </div>
              <div>
                <p className="text-[var(--muted)] text-xs mb-1">Guía de Rastreo</p>
                <p className="font-mono font-bold text-primary">{data.trackingNumber}</p>
              </div>
            </div>
          </div>

          {/* Timeline de Producción */}
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-6">Estado Actual</h3>
            <div className="relative pl-4 border-l-2 border-[var(--border-color)] space-y-8 pb-4">
              {STEPS.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={step.id} 
                    className="relative"
                  >
                    <div className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center border-2 
                      ${isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-[var(--surface)] border-[var(--border-color)] text-[var(--muted)]'}
                      ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                      transition-all duration-300
                    `}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="pl-4">
                      <p className={`text-sm font-bold ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-primary mt-1">Fase actual en proceso...</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: Instrucciones (sin mapa: no hay GPS real del envío) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Instrucciones de Recepción */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm flex-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[var(--foreground)] mb-2">Instrucciones de Recepción y Envío</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {data.deliveryInstructions || "Por favor verifica que el paquete esté sellado con la cinta de seguridad oficial de Pilypage. Si el paquete presenta alteraciones, no lo recibas y contáctanos inmediatamente a soporte."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
