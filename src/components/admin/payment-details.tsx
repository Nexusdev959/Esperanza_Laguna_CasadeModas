"use client";

import { CheckCircle, XCircle, Search, ExternalLink, Download } from "lucide-react";

export function PaymentDetails({ activePayment, handleApprove, handleReject }: any) {
  if (!activePayment) {
    return (
      <div className="md:col-span-7 lg:col-span-8 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--muted)] p-8 text-center shadow-sm">
        <Search className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Selecciona un pago</p>
        <p className="text-sm">Revisa el comprobante y aprueba el pago para liberar el pedido.</p>
      </div>
    );
  }

  return (
    <div className="md:col-span-7 lg:col-span-8 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden relative">
      {/* Header Details */}
      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start bg-[var(--background)]/50">
        <div>
          <h2 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            Verificación de Pago
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-sans font-bold tracking-wider uppercase">
              {activePayment.orderId}
            </span>
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1">Sujeto a verificación bancaria (24 a 72 hrs).</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--muted)] mb-1">Monto Reportado</p>
          <p className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)] text-green-600 dark:text-green-500">{activePayment.amount}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Client & Method Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Información del Cliente</h3>
            <p className="text-[var(--foreground)] font-medium">{activePayment.clientName}</p>
            <p className="text-sm text-[var(--muted)]">{activePayment.clientDocumentType}: {activePayment.clientDocument}</p>
          </div>
          <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Método de Pago</h3>
            <p className="text-[var(--foreground)] font-medium">{activePayment.method} - {activePayment.bank}</p>
            <p className="text-sm text-[var(--muted)]">Ref: {activePayment.reference}</p>
          </div>
        </div>

        {/* Receipt Verification Area */}
        {activePayment.method === "Manual" ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Comprobante Subido por el Cliente</h3>
              <button className="flex items-center gap-2 text-xs font-medium text-primary hover:underline">
                <Download className="w-4 h-4" /> Descargar Original
              </button>
            </div>
            <div className="border-2 border-dashed border-[var(--border-color)] rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center p-2 relative group cursor-pointer">
              <img 
                src={activePayment.receiptUrl} 
                alt="Comprobante de Pago" 
                className="max-h-[400px] object-contain w-full rounded-xl group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                <span className="flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md font-medium">
                  <ExternalLink className="w-5 h-5" /> Ampliar Imagen
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-[var(--border-color)] rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-blue-500 mx-auto" />
            <h3 className="text-lg font-medium text-[var(--foreground)]">Transacción Wompi Completada</h3>
            <p className="text-sm text-[var(--muted)] max-w-md mx-auto">Este pago fue procesado y verificado automáticamente por la pasarela de pagos Wompi. No requiere revisión manual del comprobante.</p>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-[var(--border-color)] bg-[var(--background)] flex gap-4">
        <button 
          onClick={() => handleApprove(activePayment.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-transform active:scale-[0.98] shadow-sm"
        >
          <CheckCircle className="w-5 h-5" />
          Aprobar Pago (Liberar Pedido)
        </button>
        {activePayment.method === "Manual" && (
          <button 
            onClick={() => handleReject(activePayment.id)}
            className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400 py-3 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Rechazar (Comprobante Inválido)
          </button>
        )}
      </div>
    </div>
  );
}
