"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Package, Scissors, Truck, ClipboardCheck, Store, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

// Tipos de estado del pedido
export type OrderStatus = 'CONFIRMADO' | 'CONFECCION' | 'CALIDAD' | 'TRANSITO' | 'ENTREGADO';

export interface OrderTrackData {
  id: string;
  displayId: string;
  status: OrderStatus;
  rawStatus: string;
  totalAmount: string;
  paidAmount: string;
  deliveryMethod: 'NATIONAL_SHIPPING' | 'MEDELLIN_DELIVERY' | 'STORE_PICKUP' | null;
  courier: string | null;
  trackingNumber: string | null;
  leadBusinessDays: number | null;
}

const BASE_STEPS = [
  { id: 'CONFIRMADO', label: 'Pedido Confirmado', icon: Package },
  { id: 'CONFECCION', label: 'Corte y Confección', icon: Scissors },
  { id: 'CALIDAD', label: 'Control de Calidad', icon: ClipboardCheck },
];

const money = (n: number) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function TrackOrderResult({ data, onBack }: { data: OrderTrackData, onBack: () => void }) {

  const pickup = data.deliveryMethod === 'STORE_PICKUP';
  // Recoger en tienda no viaja: en vez de "En tránsito" el paso es "Listo para recoger"
  const STEPS = [
    ...BASE_STEPS,
    pickup ? { id: 'TRANSITO', label: 'Listo para recoger', icon: Store } : { id: 'TRANSITO', label: 'En Tránsito', icon: Truck },
    { id: 'ENTREGADO', label: pickup ? 'Recogido' : 'Entregado', icon: CheckCircle2 },
  ];
  const currentStepIndex = STEPS.findIndex(s => s.id === data.status);
  const { data: store } = useSWR(pickup ? "/settings" : null, async (url) => (await api.get(url)).data);
  // Lo que falta por pagar según los abonos, igual que en el checkout
  const pending = Math.max(0, (parseFloat(data.totalAmount) || 0) - (parseFloat(data.paidAmount) || 0));

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
            <p className="text-sm text-[var(--muted)]">
              {data.leadBusinessDays ? `Confección: ~${data.leadBusinessDays} días hábiles desde el anticipo` : "Te avisaremos cuando esté listo"}
            </p>
          </div>

          {/* Pagos Pendientes */}
          {pending > 0 && data.rawStatus !== 'CANCELLED' && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8">
              <h3 className="text-amber-600 dark:text-amber-400 font-bold mb-2">
                {(parseFloat(data.paidAmount) || 0) > 0 ? 'Saldo pendiente' : 'Anticipo pendiente'}
              </h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                {(parseFloat(data.paidAmount) || 0) > 0
                  ? <>Te falta pagar <strong className="text-[var(--foreground)]">{money(pending)}</strong> para completar tu pedido.</>
                  : <>Para iniciar la confección paga el anticipo del 50% (<strong className="text-[var(--foreground)]">{money(Math.min(pending, (parseFloat(data.totalAmount) || 0) / 2))}</strong>) o el total.</>}
              </p>
              <Button onClick={() => window.open(`/checkout/${data.id}`, '_blank')} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium">
                Pagar o enviar comprobante
              </Button>
            </div>
          )}

          {/* Guía y Logística */}
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-5 mb-8 border border-[var(--border-color)]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Entrega</h3>
            {pickup ? (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[var(--muted)] text-xs mb-1">Forma de entrega</p>
                  <p className="font-medium text-[var(--foreground)]">Recoges en tienda</p>
                </div>
                {store?.address && (
                  <div>
                    <p className="text-[var(--muted)] text-xs mb-1">Dirección</p>
                    <p className="font-medium text-[var(--foreground)]">{store.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-[var(--muted)] text-xs mb-1">Código para reclamar</p>
                  <p className="font-mono font-bold text-primary tracking-widest">{data.displayId}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[var(--muted)] text-xs mb-1">Forma de entrega</p>
                  <p className="font-medium text-[var(--foreground)]">{data.deliveryMethod === 'MEDELLIN_DELIVERY' ? 'Domicilio en Medellín' : 'Envío nacional por transportadora'}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-1">{data.deliveryMethod === 'MEDELLIN_DELIVERY' ? 'Domiciliario' : 'Transportadora'}</p>
                  <p className="font-medium text-[var(--foreground)]">{data.courier || 'Se asigna al despachar'}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)] text-xs mb-1">Guía de rastreo</p>
                  <p className="font-mono font-bold text-primary">{data.trackingNumber || 'Se asigna al despachar'}</p>
                </div>
                {/* El envío no está incluido en el precio: se recuerda en cada consulta */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {data.deliveryMethod === 'MEDELLIN_DELIVERY'
                      ? 'El domicilio corre por tu cuenta: lo cobra la plataforma de domicilios según la distancia.'
                      : 'El envío corre por tu cuenta: el flete se le paga a la transportadora y no está incluido en el valor del pedido.'}
                  </span>
                </div>
              </div>
            )}
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
                <h3 className="font-serif text-lg text-[var(--foreground)] mb-2">{pickup ? 'Cómo recoger tu pedido' : 'Instrucciones de recepción'}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {pickup
                    ? `Te avisaremos cuando esté listo. Acércate${store?.address ? ` a ${store.address}` : ' a la tienda'} y presenta el código ${data.displayId} junto con el nombre o el teléfono con que hiciste el pedido. Si no puedes ir, quien lo recoja debe llevar esos mismos datos.`
                    : 'Al recibir, verifica que el paquete esté sellado y en buen estado. Si presenta alteraciones, no lo recibas y escríbenos de inmediato a soporte. Recuerda que el costo del envío corre por tu cuenta.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
