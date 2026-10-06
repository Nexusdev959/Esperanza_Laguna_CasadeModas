"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, PackageOpen, Truck, Wallet, Scissors, ClipboardCheck, CreditCard, PackageCheck, CheckCircle2, XCircle, MessageCircle } from "lucide-react";
import { PaymentActions } from "../payments/payment-actions";
import { useState } from "react";
import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onOrderUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onOrderUpdate?: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || '');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [shippingCarrier, setShippingCarrier] = useState(order?.shippingCarrier || '');
  const { showNotification } = useNotification();

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const payload: any = { status: selectedStatus };
      if (selectedStatus === 'SHIPPED') {
        payload.trackingNumber = trackingNumber;
        payload.shippingCarrier = shippingCarrier;
      }
      await api.put(`/orders/${order.id}/status`, payload);
      showNotification('Estado actualizado correctamente', 'success');
      if (onOrderUpdate) onOrderUpdate();
      onClose();
    } catch (error: any) {
      console.error(error);
      showNotification(error.response?.data?.error || 'Error al actualizar', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendShippingWhatsApp = () => {
    const phone = order.user?.phone?.replace(/\D/g, '') || "";
    if (!phone) {
      showNotification('El cliente no tiene teléfono registrado', 'error');
      return;
    }
    const msg = `Hola ${order.user?.name || ''}, te informamos que tu pedido de Esperanza Laguna ha sido despachado 🚚.\n\n*Medio de envío:* ${shippingCarrier}\n*Guía o Datos del conductor:* ${trackingNumber}\n\n¡Muchas gracias por tu compra!`;
    window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--background)]/50 shrink-0">
            <div>
              <h2 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                <PackageOpen className="w-5 h-5 text-primary" /> Detalle de Pedido {order.id}
              </h2>
              <p className="text-sm text-[var(--muted)]">Información financiera y logística de la orden.</p>
            </div>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-full hover:bg-black/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 custom-scrollbar flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda: Detalles del Pedido y Logística */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Datos del Cliente</h3>
                  <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Nombre:</span> {order.user?.name || 'Cliente Anónimo'}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Teléfono:</span> {order.user?.phone || 'No registrado'}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Club:</span> {order.user?.club || 'Sin club'}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Fecha:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Estado Actual:</span> {order.status}</p>
                  </div>
                </div>

                <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Gestión Logística
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[var(--muted)] mb-3">Selecciona el Estado del Pedido</label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'PENDING_ADVANCE', label: 'Pago Inicial', icon: Wallet, colorClass: 'text-amber-500', activeClass: 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20' },
                          { id: 'IN_CONFECTION', label: 'Confección', icon: Scissors, colorClass: 'text-purple-500', activeClass: 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20' },
                          { id: 'QUALITY_CONTROL', label: 'Calidad', icon: ClipboardCheck, colorClass: 'text-blue-500', activeClass: 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20' },
                          { id: 'PENDING_FINAL_PAY', label: 'Pago Final', icon: CreditCard, colorClass: 'text-orange-500', activeClass: 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20' },
                          { id: 'READY_TO_SHIP', label: 'Empacado', icon: PackageCheck, colorClass: 'text-teal-500', activeClass: 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/20' },
                          { id: 'SHIPPED', label: 'Enviado', icon: Truck, colorClass: 'text-indigo-500', activeClass: 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20' },
                          { id: 'DELIVERED', label: 'Entregado', icon: CheckCircle2, colorClass: 'text-green-500', activeClass: 'border-green-500 bg-green-500/10 ring-2 ring-green-500/20' },
                          { id: 'CANCELLED', label: 'Cancelado', icon: XCircle, colorClass: 'text-red-500', activeClass: 'border-red-500 bg-red-500/10 ring-2 ring-red-500/20' }
                        ].map((statusOp) => {
                          const Icon = statusOp.icon;
                          const isSelected = selectedStatus === statusOp.id;
                          return (
                            <button
                              key={statusOp.id}
                              onClick={() => setSelectedStatus(statusOp.id)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                                isSelected 
                                  ? statusOp.activeClass 
                                  : 'border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--background)] hover:border-[var(--muted)]'
                              }`}
                            >
                              <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? statusOp.colorClass : 'text-[var(--muted)]'}`} />
                              <span className={`text-[10px] font-medium text-center leading-tight ${isSelected ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'}`}>
                                {statusOp.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedStatus === 'SHIPPED' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div>
                            <label className="block text-xs text-[var(--muted)] mb-1">Agencia de Transportes o Buses</label>
                            <input 
                              type="text" 
                              value={shippingCarrier}
                              onChange={(e) => setShippingCarrier(e.target.value)}
                              placeholder="Ej: Inter Rapidísimo, Flota Macarena"
                              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg text-sm focus:border-primary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[var(--muted)] mb-1">Número de Guía o Datos del Conductor (Nombre, Celular, Placa)</label>
                            <textarea 
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              placeholder="Ej: Guía 12345 o Conductor Juan Perez, Cel: 3001234567, Placa XYZ-123"
                              rows={2}
                              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg text-sm focus:border-primary outline-none resize-none"
                            />
                          </div>
                          
                          <button 
                            onClick={handleSendShippingWhatsApp}
                            disabled={!shippingCarrier || !trackingNumber}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-2 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-sm font-medium rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MessageCircle className="w-4 h-4" /> Notificar Envío por WhatsApp
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={handleUpdateStatus}
                      disabled={updating || (selectedStatus === order.status && trackingNumber === (order.trackingNumber || '') && shippingCarrier === (order.shippingCarrier || ''))}
                      className="w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {updating ? 'Guardando...' : 'Guardar y Actualizar Estado'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Finanzas y Cobros */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Resumen Financiero</h3>
                  <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--muted)]">Total de la Orden</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">${Number(order.totalAmount).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--muted)]">Abonado hasta ahora</p>
                      <p className="text-sm font-bold text-green-500">${Number(order.paidAmount).toFixed(2)}</p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-[var(--border-color)] flex justify-between">
                      <p className="text-sm font-semibold text-[var(--foreground)]">Saldo Pendiente</p>
                      <p className="text-sm font-bold text-primary">${(Number(order.totalAmount) - Number(order.paidAmount)).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <PaymentActions 
                  orderId={order.id}
                  clientName={order.user?.name || 'Cliente Anónimo'}
                  clientEmail={order.user?.email || "cliente@ejemplo.com"}
                  clientPhone={order.user?.phone || "3000000000"}
                  totalAmount={Number(order.totalAmount)}
                  paidAmount={Number(order.paidAmount)}
                />

                {order.payments && order.payments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Historial de Pagos</h3>
                    <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {order.payments.map((p: any) => (
                        <div key={p.id} className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2 last:border-0 last:pb-0">
                          <div>
                            <span className="font-medium text-[var(--foreground)]">{((p.amountInCents || 0) / 100).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                            <div className="text-[var(--muted)] text-xs mt-0.5">{new Date(p.createdAt).toLocaleString('es-CO')} - {p.paymentMethod || 'Wompi'}</div>
                            <div className="text-[var(--muted)] text-[10px] uppercase">{p.reference}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : p.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
