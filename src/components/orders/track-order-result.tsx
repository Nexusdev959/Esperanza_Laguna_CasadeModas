"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import confetti from "canvas-confetti";
import { CheckCircle2, MapPin, Package, Scissors, Search, Truck, ClipboardCheck } from "lucide-react";
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
  originCoords: [number, number];
  destinationCoords: [number, number];
  currentCoords: [number, number];
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

  // Mapbox initialization
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Fallback token if user hasn't set one yet
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibW9ja2FwaSIsImEiOiJjbTBybXo4bHAwM2MwMndzNnI0bWJjNzF2In0.mock';

    // We only init the map if we have a token (or we use a placeholder that might fail gracefully)
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: data.currentCoords,
        zoom: data.status === 'TRANSITO' ? 12 : 5,
        pitch: 60, // 3D effect
        bearing: -20,
        interactive: false,
      });

      map.current.on('load', () => {
        setMapLoaded(true);

        if (!map.current) return;

        // Add 3D buildings
        map.current.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
          }
        });

        // Add Marker for current position
        new mapboxgl.Marker({ color: 'var(--primary)' })
          .setLngLat(data.currentCoords)
          .addTo(map.current);

        // Add Route if in transit
        if (data.status === 'TRANSITO' || data.status === 'ENTREGADO') {
          map.current.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': [data.originCoords, data.destinationCoords]
              }
            }
          });
          map.current.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': { 'line-join': 'round', 'line-cap': 'round' },
            'paint': { 'line-color': '#C5A859', 'line-width': 4, 'line-dasharray': [2, 2] }
          });
        }
      });
    } catch (e) {
      console.warn("Mapbox initialization skipped or failed. Provide valid token.");
    }

    return () => map.current?.remove();
  }, [data]);

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

        {/* PANEL DERECHO: Mapa 3D e Instrucciones */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* MAPA 3D */}
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-inner bg-stone-900 group">
            <div ref={mapContainer} className="absolute inset-0" />
            
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/80 backdrop-blur-sm z-10">
                <div className="flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-primary animate-bounce mb-2" />
                  <p className="text-sm font-medium">Cargando visualización geográfica...</p>
                  <p className="text-xs text-[var(--muted)] mt-1 max-w-xs text-center">Asegúrate de configurar NEXT_PUBLIC_MAPBOX_TOKEN en el .env</p>
                </div>
              </div>
            )}
            
            {/* Overlay Gradient UI for Map */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 z-10">
              <p className="text-white text-xs font-medium flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                GPS Satelital Activo
              </p>
            </div>
          </div>

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
