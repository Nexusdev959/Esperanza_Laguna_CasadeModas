"use client";

import { useState, useEffect } from "react";
import { QuoteEditor } from "@/components/quotes/quote-editor";
import { QuotePreview } from "@/components/quotes/quote-preview";

export default function QuoteGenerator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    club: "",
    church: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        setIsAuthenticated(true);
        import('@/lib/api').then(({ api }) => {
          api.get('/auth/profile').then(res => {
            const user = res.data;
            setClientInfo({
              name: user.name || "",
              club: user.club || "",
              church: user.church || "", // Assuming church is added or just empty
              email: user.email || "",
              phone: user.phone || "",
              address: user.address || "",
            });
          }).catch(e => console.error(e));
        });
      }
    }
  }, []);

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

  const handlePrint = async () => {
    try {
      const { api } = await import('@/lib/api');
      await api.post('/orders/save-quote', {
        clientInfo,
        items,
        subtotal,
        quoteDetails
      });
    } catch (e) {
      console.error("Error saving quote", e);
    }
    
    // Pequeño timeout para asegurar renderizado final antes de imprimir
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const total = subtotal;

  return (
    <main className="min-h-screen pt-40 pb-12 px-4 relative flex flex-col items-center bg-[var(--background)] overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen print:hidden"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen print:hidden"></div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 print:block print:max-w-none print:m-0 print:p-0">
        
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
