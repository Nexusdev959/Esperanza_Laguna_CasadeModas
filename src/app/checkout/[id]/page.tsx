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
  const [paymentType, setPaymentType] = useState<"ADVANCE" | "BALANCE" | "FULL">("ADVANCE");
  const [paymentMethod, setPaymentMethod] = useState<"WOMPI" | "TRANSFER">("WOMPI");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const { showNotification } = useNotification();

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
        
        // Determinar qué pago le toca por defecto
        if (res.data.status === 'PENDING_ADVANCE') {
          setPaymentType("ADVANCE");
        } else if (res.data.status === 'PENDING_FINAL_PAY') {
          setPaymentType("BALANCE");
        } else {
          setPaymentType("FULL");
        }
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
      
      const totalAmount = parseFloat(order.totalAmount);
      const amountToPay = (paymentType === "ADVANCE" || paymentType === "BALANCE") 
        ? totalAmount / 2 
        : totalAmount;
      
      const amountInCents = Math.round(amountToPay * 100);

      // Call our robust backend to generate the signature
      const hashRes = await api.post('/payments/wompi/hash', {
        orderId: order.id,
        amountInCents,
        currency: 'COP',
        type: paymentType === "ADVANCE" ? "ADVANCE_50" : (paymentType === "BALANCE" ? "BALANCE_50" : "FULL_100")
      });

      const { reference, signature } = hashRes.data;

      // Initialize Wompi
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents,
        reference,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUB_KEY || 'pub_test_eqVy6s9mTWM0DqwquHj4r3M7z4vw83mt', // Usar public key real en prod
        signature: { integrity: signature },
        redirectUrl: `https://esperanzalaguna.com/track-order?ref=${order.id}` // Regresa al track después del pago
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
      formData.append('proof', proofFile);

      await api.post('/payments/wompi/proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      showNotification('Comprobante enviado exitosamente. Quedará en estado PENDIENTE de aprobación manual (24 a 72 horas). Serás notificado.', 'success');
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
  const amountToPay = (paymentType === "ADVANCE" || paymentType === "BALANCE") ? totalAmount / 2 : totalAmount;
  const alreadyPaid = parseFloat(order.paidAmount) || 0;
  const remaining = totalAmount - alreadyPaid;

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

            <div className="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl p-6 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-medium text-[var(--foreground)] mb-1">Pago 100% Seguro</h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Tus datos de pago están encriptados y procesados de manera segura a través de la pasarela Wompi (Bancolombia). Pilypage no almacena la información de tus tarjetas.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Proceso de Pago */}
          <div className="space-y-6">
            <div className="bg-[var(--surface)] border-2 border-primary/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
              <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">Completar Pago</h3>
              <p className="text-sm text-[var(--muted)] mb-6">Selecciona el monto que vas a cancelar ahora mismo para la orden #{order.id.slice(0,8).toUpperCase()}.</p>
              
              <div className="space-y-3 mb-8">
                {order.status === 'PENDING_ADVANCE' && (
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
                    <span className="font-bold text-primary">{(totalAmount / 2).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                  </label>
                )}

                {order.status === 'PENDING_FINAL_PAY' && (
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === 'BALANCE' ? 'border-primary bg-primary/5' : 'border-[var(--border-color)] bg-[var(--background)] opacity-70'}`} onClick={() => setPaymentType('BALANCE')}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'BALANCE' ? 'border-primary' : 'border-[var(--muted)]'}`}>
                        {paymentType === 'BALANCE' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] text-sm">Saldo Restante (50%)</p>
                        <p className="text-xs text-[var(--muted)]">Para habilitar el envío</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{(totalAmount / 2).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                  </label>
                )}

                {(order.status === 'PENDING_ADVANCE' || order.status === 'PENDING_FINAL_PAY') && (
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === 'FULL' ? 'border-primary bg-primary/5' : 'border-[var(--border-color)] bg-[var(--background)] opacity-70'}`} onClick={() => setPaymentType('FULL')}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'FULL' ? 'border-primary' : 'border-[var(--muted)]'}`}>
                        {paymentType === 'FULL' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] text-sm">Pago Total (100%)</p>
                        <p className="text-xs text-[var(--muted)]">Pagar todo de una vez</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{totalAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                  </label>
                )}
              </div>

              {/* Selector de Método de Pago */}
              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => setPaymentMethod("WOMPI")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === "WOMPI" ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--border-color)] text-[var(--muted)] hover:border-primary/50'}`}
                >
                  Pago Automático (Wompi)
                </button>
                <button 
                  onClick={() => setPaymentMethod("TRANSFER")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${paymentMethod === "TRANSFER" ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--border-color)] text-[var(--muted)] hover:border-primary/50'}`}
                >
                  Transferencia Manual
                </button>
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
                    <img src="https://wompi.com/wp-content/uploads/2021/08/logo-wompi.svg" alt="Wompi" className="h-6" />
                    <span className="text-xl text-[var(--muted)]">|</span>
                    <span className="text-xs text-[var(--muted)] font-medium">Respaldado por Bancolombia</span>
                  </div>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl">
                    <p className="text-sm text-[var(--foreground)] font-medium mb-1">Datos para Transferencia:</p>
                    <p className="text-xs text-[var(--muted)] mb-4">Bancolombia Ahorros: <strong>123-456789-00</strong><br/>Nequi/Daviplata: <strong>3215028653</strong></p>
                    
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
                    Al enviar, tu pedido quedará PENDIENTE y tomará de 24 a 72 horas para su aprobación manual. Se te notificará por correo.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
