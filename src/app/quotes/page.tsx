"use client";

import { useState, useEffect } from "react";
import { QuoteEditor } from "@/components/quotes/quote-editor";
import { QuotePreview } from "@/components/quotes/quote-preview";

export default function QuoteGenerator() {
  // SIMULACIÓN DE USUARIO LOGUEADO
  const [isAuthenticated] = useState(true); // En el futuro vendrá de useSession() de NextAuth

  const [clientInfo, setClientInfo] = useState({
    name: isAuthenticated ? "Carlos Miranda (Usuario Verificado)" : "",
    club: isAuthenticated ? "Club Orión" : "",
    church: isAuthenticated ? "Iglesia Central Norte" : "",
    email: isAuthenticated ? "carlos.miranda@example.com" : "",
    phone: isAuthenticated ? "300 123 4567" : "",
    address: isAuthenticated ? "Calle 123 # 45-67, Bogotá" : "",
  });

  const [quoteDetails, setQuoteDetails] = useState({
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +15 days
    quoteNumber: `COT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('pilypage_quote_items');
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          setItems(parsedItems.map((item: any, idx: number) => ({
            id: Date.now() + idx,
            description: `${item.name} - ${item.size} | ${item.type}`,
            quantity: item.quantity,
            unitPrice: item.price
          })));
        }
        localStorage.removeItem('pilypage_quote_items');
      } catch (e) {
        console.error("Error reading quote items", e);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const total = subtotal;

  return (
    <main className="min-h-screen pt-28 pb-12 px-4 relative flex flex-col items-center bg-[var(--background)] overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen print:hidden"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen print:hidden"></div>

      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 print:block print:max-w-none print:m-0 print:p-0">
        
        <QuoteEditor 
          clientInfo={clientInfo} 
          setClientInfo={setClientInfo} 
          items={items} 
          setItems={setItems} 
          onPrint={handlePrint} 
          isAuthenticated={isAuthenticated}
        />

        <QuotePreview 
          clientInfo={clientInfo} 
          quoteDetails={quoteDetails} 
          items={items} 
          subtotal={subtotal} 
          total={total} 
        />

      </div>

      {/* CSS para la impresión perfecta */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          nav, header, footer {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}} />

    </main>
  );
}
