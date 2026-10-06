"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { CustomerList } from "@/components/admin/customer-list";
import { CustomerDetails } from "@/components/admin/customer-details";

const MOCK_CUSTOMERS: any[] = [];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const activeCustomer = customers.find(c => c.id === selectedCustomer);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Directorio de Clientes</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Lleva el control de todos los clientes registrados y su historial completo de compras.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] rounded-xl font-medium hover:border-primary transition-colors shadow-sm">
          <Download className="w-5 h-5" /> Exportar Base de Datos
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        <CustomerList 
          customers={customers} 
          selectedCustomer={selectedCustomer} 
          setSelectedCustomer={setSelectedCustomer} 
        />
        
        <CustomerDetails 
          activeCustomer={activeCustomer} 
        />
      </div>
    </div>
  );
}
