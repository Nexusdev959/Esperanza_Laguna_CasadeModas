"use client";

import { useState } from "react";
import { CreditCard, MessageCircle, Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentActionsProps {
  orderId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  totalAmount: number;
  paidAmount: number;
}

export function PaymentActions({
  orderId,
  clientName,
  clientPhone,
  clientEmail,
  totalAmount,
  paidAmount
}: PaymentActionsProps) {
  const [isWompiLoading, setIsWompiLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"ADVANCE" | "BALANCE" | "FULL">("ADVANCE");

  const amountDue = selectedTemplate === "FULL" ? totalAmount : (totalAmount / 2);
  const formattedAmount = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amountDue);

  const getMessageTemplate = (platform: "WA" | "EMAIL") => {
    let text = "";
    const paymentLink = `https://pilypage.com/checkout/${orderId}?type=${selectedTemplate}`; // URL simulada del frontend
    
    if (selectedTemplate === "ADVANCE") {
      text = `Hola ${clientName}, somos Pilypage. Tu cotización está lista. Para iniciar la confección de tu pedido, requerimos el pago del 50% de anticipo (${formattedAmount}). Puedes realizar el pago de forma segura aquí: ${paymentLink}`;
    } else if (selectedTemplate === "BALANCE") {
      text = `Hola ${clientName}. ¡Buenas noticias! Tu pedido en Pilypage ya casi está listo para ser despachado. Por favor realiza el pago del saldo restante (${formattedAmount}) aquí: ${paymentLink}`;
    } else {
      text = `Hola ${clientName}. Adjuntamos el enlace para el pago total de tu pedido en Pilypage por un valor de ${formattedAmount}. Enlace: ${paymentLink}`;
    }

    if (platform === "WA") {
      return `https://wa.me/57${clientPhone}?text=${encodeURIComponent(text)}`;
    } else {
      const subject = encodeURIComponent(`Pago Pilypage - Orden ${orderId}`);
      return `mailto:${clientEmail}?subject=${subject}&body=${encodeURIComponent(text)}`;
    }
  };

  const handleWompiPay = async () => {
    setIsWompiLoading(true);
    // Simulación de llamada al backend para obtener la firma (hash)
    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/payments/wompi/hash`, { ... })
      // const { reference, signature } = await res.json();
      
      setTimeout(() => {
        setIsWompiLoading(false);
        // Aquí se inyectaría el script de Wompi real usando window.WidgetCheckout
        alert(`Widget de Wompi abierto simulado para pagar ${formattedAmount} (Tipo: ${selectedTemplate})`);
      }, 1000);
    } catch (e) {
      console.error(e);
      setIsWompiLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-serif text-[var(--foreground)] mb-1">Gestión de Cobros y Pagos</h3>
      <p className="text-sm text-[var(--muted)] mb-6">Genera enlaces de pago y envíalos rápidamente por WhatsApp o Correo.</p>

      {/* Selector de Tipo de Cobro */}
      <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-color)]">
        <button 
          onClick={() => setSelectedTemplate("ADVANCE")}
          className={`py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${selectedTemplate === "ADVANCE" ? "bg-[var(--surface)] shadow-sm text-primary" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          Anticipo (50%)
        </button>
        <button 
          onClick={() => setSelectedTemplate("BALANCE")}
          className={`py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${selectedTemplate === "BALANCE" ? "bg-[var(--surface)] shadow-sm text-primary" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          Saldo (50%)
        </button>
        <button 
          onClick={() => setSelectedTemplate("FULL")}
          className={`py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${selectedTemplate === "FULL" ? "bg-[var(--surface)] shadow-sm text-primary" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          Total (100%)
        </button>
      </div>

      <div className="space-y-4">
        {/* Wompi Direct Button */}
        <Button 
          onClick={handleWompiPay}
          disabled={isWompiLoading}
          className="w-full bg-[#0047FF] hover:bg-[#003BCC] text-white flex items-center justify-center gap-2 h-12 shadow-lg shadow-[#0047FF]/20"
        >
          {isWompiLoading ? (
            <span className="animate-pulse flex items-center gap-2"><CreditCard className="w-5 h-5"/> Generando...</span>
          ) : (
            <>
              <CreditCard className="w-5 h-5" /> 
              Pagar {formattedAmount} con Wompi
            </>
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border-color)]"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--surface)] px-2 text-[var(--muted)] font-bold tracking-widest">Compartir Enlace</span>
          </div>
        </div>

        {/* WhatsApp & Email Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a 
            href={getMessageTemplate("WA")} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-xl font-medium transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> Enviar WhatsApp
          </a>
          
          <a 
            href={getMessageTemplate("EMAIL")}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--background)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--border-color)] text-[var(--foreground)] rounded-xl font-medium transition-colors"
          >
            <Mail className="w-5 h-5" /> Enviar Correo
          </a>
        </div>
      </div>
    </div>
  );
}
