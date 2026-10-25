"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, CreditCard, Loader2, Package, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/components/ui/notification-provider";

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wompiLoading, setWompiLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"ADVANCE" | "FULL">("ADVANCE");
  const [paymentMethod, setPaymentMethod] = useState<"WOMPI" | "TRANSFER">("WOMPI");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [storeAddress, setStoreAddress] = useState("");
  const [bankTransferInfo, setBankTransferInfo] = useState("");
  const { showNotification } = useNotification();

  useEffect(() => {
    api.get('/settings').then((res) => {
      setStoreAddress(res.data?.address || "");
      setBankTransferInfo(res.data?.bankTransferInfo || "");
    }).catch(() => {});
  }, []);

  useEffect(() => {
    // Load Wompi script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/track/${orderId}`);
        setOrder(res.data);

        // Sin abonos se sugiere el anticipo; con abonos solo queda pagar el saldo (FULL_100 = saldo pendiente en el servidor)
        setPaymentType((parseFloat(res.data.paidAmount) || 0) > 0 ? "FULL" : "ADVANCE");
      } catch (err: any) {
        setError(err.response?.data?.error || "No se pudo cargar el pedido");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePay = async () => {
    if (!window.WidgetCheckout) {
      showNotification("El widget de Wompi aún no ha cargado. Por favor, espera un momento.", "error");
      return;
    }

    try {
      setWompiLoading(true);

      // El backend calcula el monto y lo firma; el widget debe usar exactamente ese monto
      const hashRes = await api.post('/payments/wompi/hash', {
        orderId: order.id,
        type: paymentType === "ADVANCE" ? "ADVANCE_50" : "FULL_100"
      });

      const { reference, signature, amountInCents, publicKey } = hashRes.data;

      // Initialize Wompi
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents,
        reference,
        publicKey, // la entrega el backend junto con la firma
        signature: { integrity: signature },
        redirectUrl: `${window.location.origin}/track-order?ref=${order.id}` // Regresa al track después del pago
      });

      checkout.open((result: any) => {
        const transaction = result.transaction;
        if (transaction.status === 'APPROVED') {
          showNotification('¡Pago aprobado exitosamente! Tu pedido comenzará a procesarse.', 'success');
          window.location.href = `/track-order?ref=${order.id}`;
        } else if (transaction.status === 'DECLINED') {
          showNotification('El pago fue rechazado. Por favor, intenta de nuevo o con otro método.', 'error');
        } else if (transaction.status === 'ERROR') {
          showNotification('Hubo un error al procesar el pago.', 'error');
        }
      });

    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.error || "Error al conectar con Wompi", "error");
    } finally {
      setWompiLoading(false);
    }
  };

  const handleUploadProof = async () => {
    if (!proofFile) {
      showNotification("Por favor, selecciona el archivo o foto de tu comprobante.", "error");
      return;
    }
    try {
      setUploadingProof(true);
      const formData = new FormData();
      formData.append('orderId', order.id);
      // El servidor registra el monto de este tipo (anticipo, saldo o total), el mismo que se le mostró al cliente
      formData.append('type', paymentType === "ADVANCE" ? "ADVANCE_50" : "FULL_100");
      formData.append('proof', proofFile);

      await api.post('/payments/wompi/proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showNotification('Comprobante recibido. Verificamos el pago en 24 a 72 horas hábiles y te notificaremos cuando confirmemos el ingreso.', 'success');
      window.location.href = `/track-order?ref=${order.id}`;
    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.error || "Error al subir el comprobante", "error");
    } finally {
      setUploadingProof(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <h2 className="text-2xl font-serif mb-2">Pedido no encontrado</h2>
        <p className="text-[var(--muted)] mb-6">{error}</p>
        <Button onClick={() => window.location.href = '/track-order'} variant="outline">Regresar</Button>
      </div>
    );
  }

  const totalAmount = parseFloat(order.totalAmount);
  const alreadyPaid = parseFloat(order.paidAmount) || 0;
  const remaining = Math.max(0, totalAmount - alreadyPaid);
  // Mismas cuentas que computeChargeInCents en el servidor: el monto mostrado es el que se cobra
  const advanceAmount = Math.min(totalAmount / 2, remaining);
  const amountToPay = paymentType === "ADVANCE" ? advanceAmount : remaining;

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Columna Izquierda: Detalles del Pedido */}
          <div className="space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-[var(--border-color)]">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[var(--background)] rounded-lg overflow-hidden border border-[var(--border-color)]">
                        <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=100&q=80'} className="w-full h-full object-cover" alt="Producto"/>
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] text-sm">{item.product?.name || 'Producto'}</p>
                        <p className="text-[var(--muted)] text-xs">Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium text-[var(--foreground)] text-sm">
                      {(item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[var(--muted)]">
                  <span>Subtotal de productos</span>
                  <span>{totalAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                </div>
                <div className="flex justify-between text-[var(--muted)]">
                  <span>Abonos anteriores</span>
                  <span className="text-emerald-500">- {alreadyPaid.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                </div>
                <div className="flex justify-between text-[var(--foreground)] font-bold pt-3 border-t border-[var(--border-color)] text-lg">
                  <span>Saldo Pendiente</span>
                  <span>{remaining.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                </div>
              </div>
            </div>

            {/* El código sirve para rastrear (sobre todo sin cuenta) y para reclamar en tienda */}
            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--muted)]">Código del pedido</span>
                <span className="font-mono text-lg font-bold tracking-widest text-[var(--foreground)]">{order.id.slice(0, 8).toUpperCase()}</span>
              </div>
              {order.deliveryMethod === 'STORE_PICKUP' && (
                <p className="text-sm text-[var(--foreground)]">
                  <span className="font-semibold">Recoges en tienda</span>{storeAddress && <> en <span className="font-medium">{storeAddress}</span></>}. Presenta este código cuando te avisemos que está listo.
                </p>
              )}
              {order.deliveryMethod === 'MEDELLIN_DELIVERY' && (
                <p className="text-sm text-[var(--muted)]">Domicilio en Medellín: el costo lo cobra la plataforma de domicilios al momento de la entrega y no está incluido en este total.</p>
              )}
              {order.deliveryMethod === 'NATIONAL_SHIPPING' && (
                <p className="text-sm text-[var(--muted)]">Envío por transportadora: el flete no está incluido en este total. Te enviaremos la guía cuando despachemos.</p>
              )}
              {order.leadBusinessDays && (
                <p className="text-sm text-[var(--foreground)]">
                  <span className="font-semibold">Confección:</span> ~{order.leadBusinessDays} días hábiles desde el pago del anticipo.
                </p>
              )}
              {order.status === 'PENDING_ADVANCE' && order.items?.some((i: any) => i.isUniform) && (
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Paga el anticipo antes del{" "}
                  <strong>{new Date(new Date(order.createdAt).getTime() + 48 * 3600_000).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })}</strong>{" "}
                  para asegurar tu cupo de confección.
                </p>
              )}
              <p className="text-xs text-[var(--muted)]">Guárdalo: con él puedes consultar tu pedido en Rastrear.</p>
            </div>

            <div className="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl p-6 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-medium text-[var(--foreground)] mb-1">Pago 100% Seguro</h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Tus datos de pago están encriptados y procesados de manera segura a través de la pasarela Wompi (Bancolombia). Esperanza Laguna no almacena la información de tus tarjetas.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Proceso de Pago */}
          <div className="space-y-6">
            <div className="bg-[var(--surface)] border-2 border-primary/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
              <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">Completar Pago</h3>
              {remaining <= 0 ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-[var(--foreground)]">Este pedido ya está pagado en su totalidad. Te avisaremos cuando esté listo.</p>
                </div>
              ) : (<>
              <p className="text-sm text-[var(--muted)] mb-6">Selecciona el monto que vas a cancelar ahora mismo para la orden #{order.id.slice(0,8).toUpperCase()}.</p>

              <div className="space-y-3 mb-8">
                {alreadyPaid <= 0 && (
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === 'ADVANCE' ? 'border-primary bg-primary/5' : 'border-[var(--border-color)] bg-[var(--background)] opacity-70'}`} onClick={() => setPaymentType('ADVANCE')}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'ADVANCE' ? 'border-primary' : 'border-[var(--muted)]'}`}>
                        {paymentType === 'ADVANCE' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] text-sm">Anticipo (50%)</p>
                        <p className="text-xs text-[var(--muted)]">Para iniciar la confección</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{advanceAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                  </label>
                )}

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType !== 'ADVANCE' ? 'border-primary bg-primary/5' : 'border-[var(--border-color)] bg-[var(--background)] opacity-70'}`} onClick={() => setPaymentType('FULL')}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType !== 'ADVANCE' ? 'border-primary' : 'border-[var(--muted)]'}`}>
                      {paymentType !== 'ADVANCE' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)] text-sm">{alreadyPaid > 0 ? "Saldo pendiente" : "Pago Total (100%)"}</p>
                      <p className="text-xs text-[var(--muted)]">{alreadyPaid > 0 ? "Lo que falta después de tus abonos" : "Pagar todo de una vez"}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{remaining.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                </label>
              </div>

              {/* Selector de Método de Pago */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPaymentMethod("WOMPI")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === "WOMPI" ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--border-color)] text-[var(--muted)] hover:border-primary/50'}`}
                >
                  Pago Automático (Wompi)
                </button>
                {bankTransferInfo && <button
                  onClick={() => setPaymentMethod("TRANSFER")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === "TRANSFER" ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--border-color)] text-[var(--muted)] hover:border-primary/50'}`}
                >
                  Transferencia Manual
                </button>}
              </div>

              {paymentMethod === "WOMPI" ? (
                <>
                  <Button
                    onClick={handlePay}
                    disabled={wompiLoading}
                    className="w-full bg-[#0047FF] hover:bg-[#003BCC] text-white flex items-center justify-center gap-2 h-14 rounded-xl shadow-[0_4px_20px_rgba(0,71,255,0.3)] hover:shadow-[0_4px_25px_rgba(0,71,255,0.4)] text-lg font-bold transition-all"
                  >
                    {wompiLoading ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Conectando...</span>
                    ) : (
                      <>Pagar {amountToPay.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</>
                    )}
                  </Button>

                  <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-60">
                    <span className="text-sm font-semibold tracking-wide text-[var(--muted)]">Wompi</span>
                    <span className="text-xl text-[var(--muted)]">|</span>
                    <span className="text-xs text-[var(--muted)] font-medium">Respaldado por Bancolombia</span>
                  </div>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl">
                    <p className="text-sm text-[var(--foreground)] font-medium mb-1">Datos para Transferencia:</p>
                    <p className="text-xs text-[var(--muted)] mb-3 whitespace-pre-line">{bankTransferInfo}</p>
                    <p className="text-sm text-[var(--foreground)] mb-4">Transfiere exactamente <strong>{amountToPay.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong> y adjunta el comprobante.</p>

                    <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">Adjuntar Comprobante (Imagen o PDF)</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-[var(--muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                    />
                  </div>

                  <Button
                    onClick={handleUploadProof}
                    disabled={uploadingProof || !proofFile}
                    className="w-full h-14 rounded-xl text-lg font-bold transition-all"
                  >
                    {uploadingProof ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Subiendo...</span>
                    ) : (
                      "Enviar Comprobante"
                    )}
                  </Button>
                  <p className="text-xs text-center text-amber-600 dark:text-amber-400">
                    Al enviar el comprobante, tu pago queda PENDIENTE: la verificación con el banco tarda de 24 a 72 horas hábiles. Te notificaremos por correo o WhatsApp cuando confirmemos el ingreso del pago.
                  </p>
                </div>
              )}
              </>)}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
