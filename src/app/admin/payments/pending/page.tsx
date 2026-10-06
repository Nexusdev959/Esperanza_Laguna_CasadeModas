"use client";

import { useState } from "react";
import { PaymentList } from "@/components/admin/payment-list";
import { PaymentDetails } from "@/components/admin/payment-details";

const MOCK_PAYMENTS: any[] = [];

export default function PendingPaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const activePayment = payments.find(p => p.id === selectedPayment);

  const handleApprove = (id: string) => {
    // In a real app, this would hit the API to mark payment as verified
    // which in turn updates the Order status to 'Paid'/'Preparation'
    setPayments(payments.filter(p => p.id !== id));
    if (selectedPayment === id) setSelectedPayment(payments[0]?.id || null);
  };

  const handleReject = (id: string) => {
    // In a real app, this alerts the user that their receipt was invalid
    setPayments(payments.filter(p => p.id !== id));
    if (selectedPayment === id) setSelectedPayment(payments[0]?.id || null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Pagos Pendientes de Aprobación</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Verifica los comprobantes manuales para liberar los pedidos correspondientes a preparación.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        <PaymentList 
          payments={payments} 
          selectedPayment={selectedPayment} 
          setSelectedPayment={setSelectedPayment} 
        />
        
        <PaymentDetails 
          activePayment={activePayment} 
          handleApprove={handleApprove} 
          handleReject={handleReject} 
        />
      </div>
    </div>
  );
}
