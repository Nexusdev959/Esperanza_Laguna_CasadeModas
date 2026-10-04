"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, DollarSign, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/wompi');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm('¿Estás seguro de aprobar este comprobante manual? Esto actualizará el pedido y le enviará un correo al cliente.')) return;
    try {
      await api.put(`/payments/wompi/proof/${id}/approve`);
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Error al aprobar el comprobante');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Razón del rechazo:');
    if (!reason) return;
    try {
      await api.put(`/payments/wompi/proof/${id}/reject`, { reason });
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Error al rechazar el comprobante');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-medium border border-emerald-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Aprobado</span>;
      case 'PENDING': return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-medium border border-amber-500/20 flex items-center gap-1"><Clock className="w-3 h-3"/> Pendiente</span>;
      case 'DECLINED': return <span className="px-2.5 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-medium border border-red-500/20 flex items-center gap-1"><XCircle className="w-3 h-3"/> Rechazado</span>;
      case 'ERROR': return <span className="px-2.5 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-medium border border-red-500/20 flex items-center gap-1"><XCircle className="w-3 h-3"/> Error</span>;
      default: return <span className="px-2.5 py-1 bg-gray-500/10 text-gray-600 rounded-full text-xs font-medium border border-gray-500/20">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-[var(--foreground)]">Historial de Pagos y Transacciones</h2>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--muted)] border-b border-[var(--border-color)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Referencia</th>
                <th className="px-6 py-4 font-medium">Cliente / Pedido</th>
                <th className="px-6 py-4 font-medium">Monto</th>
                <th className="px-6 py-4 font-medium">Método</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--foreground)]">
              {payments.map(payment => (
                <tr key={payment.id} className="hover:bg-[var(--background)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{payment.reference}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">{payment.transactionId || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{payment.order?.user?.name || 'Cliente Anónimo'}</div>
                    <a href={`/admin/orders`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5" title="Ir a la bandeja de pedidos">
                      Pedido #{payment.order?.id?.slice(0,8).toUpperCase()} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">
                    {((payment.amountInCents || 0) / 100).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                  </td>
                  <td className="px-6 py-4">
                    {payment.paymentMethod || 'Wompi'}
                    {payment.attachmentUrl && (
                      <a href={payment.attachmentUrl} target="_blank" rel="noreferrer" className="block text-xs text-blue-500 hover:underline mt-1">Ver Soporte</a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)] text-xs">
                    {new Date(payment.createdAt).toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === 'PENDING' && payment.paymentMethod === 'MANUAL' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(payment.id)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded">Aprobar</button>
                        <button onClick={() => handleReject(payment.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Rechazar</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No hay pagos registrados aún.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
