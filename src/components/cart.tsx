"use client";

import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";
import { useRouter } from "next/navigation";

const MOCK_CART_ITEMS: any[] = [];

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Fetch addresses if logged in
    const token = localStorage.getItem('jwt_token');
    if (token) {
      api.get('/auth/addresses').then(res => {
        setAddresses(res.data);
        const def = res.data.find((a: any) => a.isDefault);
        if (def) setSelectedAddress(`${def.street}, ${def.city}, ${def.state}`);
        else if (res.data.length > 0) setSelectedAddress(`${res.data[0].street}, ${res.data[0].city}, ${res.data[0].state}`);
      }).catch(err => console.error(err));
    }
  }, []);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const payload = {
        items: items.map(i => ({ productId: i.id.toString(), quantity: i.quantity })),
        shippingAddress: selectedAddress
      };
      const res = await api.post('/orders/quote', payload);
      showNotification(`Cotización #${res.data.id} generada con éxito`, 'success');
      setItems([]);
      setIsOpen(false);
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Error al procesar. Intentando de nuevo pronto...", "error");
    } finally {
      setLoading(false);
    }
  };

  const generateQuoteDocument = () => {
    // Save items to localstorage so the Quote page can pick them up
    localStorage.setItem('pilypage_quote_items', JSON.stringify(items));
    setIsOpen(false);
    router.push('/quotes');
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-current hover:text-primary transition-colors relative group"
      >
        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md">
            {totalItems}
          </span>
        )}
      </button>

      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div 
                key="cart-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md"
              />
              
              {/* Cart Drawer */}
              <motion.div 
                key="cart-drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-[var(--surface)]/95 backdrop-blur-2xl border-l border-[var(--border-color)] shadow-2xl flex flex-col h-[100dvh]"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--background)]/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-serif tracking-wide text-[var(--foreground)]">Tu Carrito <span className="text-sm text-[var(--muted)] font-sans">({totalItems})</span></h2>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-[var(--foreground)]/5 text-[var(--muted)] hover:text-[var(--foreground)] rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Items List */}
                <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 scrollbar-hide">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                      <ShoppingBag className="w-12 h-12" />
                      <p className="text-sm">Tu carrito está vacío.</p>
                      <Button onClick={() => setIsOpen(false)} variant="outline" className="mt-4">
                        Volver a la tienda
                      </Button>
                    </div>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] shadow-sm group">
                        {/* Image */}
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-[var(--surface)] shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-sm font-medium text-[var(--foreground)] leading-tight">{item.name}</h3>
                              <button onClick={() => removeItem(item.id)} className="text-[var(--muted)] hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-[var(--muted)] mt-1">Talla: {item.size} | {item.type}</p>
                          </div>
                          
                          <div className="flex items-end justify-between mt-3">
                            <p className="text-sm font-semibold text-[var(--foreground)]">${item.price.toFixed(2)}</p>
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-[var(--surface)] border border-[var(--border-color)] rounded-lg">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Footer / Summary */}
                {items.length > 0 && (
                  <div className="p-6 border-t border-[var(--border-color)] bg-[var(--background)]/80 backdrop-blur-md shrink-0">
                    <div className="space-y-3 mb-6">
                      <div className="mb-4 space-y-2 border-b border-[var(--border-color)] pb-4">
                        <label className="text-sm font-medium text-[var(--foreground)]">Dirección de Envío</label>
                        {addresses.length > 0 ? (
                          <select 
                            value={selectedAddress}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)]"
                          >
                            <option value="">Selecciona una dirección o escríbela</option>
                            {addresses.map(a => (
                              <option key={a.id} value={`${a.street}, ${a.city}, ${a.state}`}>
                                {a.name} - {a.street}, {a.city}
                              </option>
                            ))}
                          </select>
                        ) : null}
                        <input 
                          type="text" 
                          placeholder="Ingresa tu dirección de envío completa"
                          value={selectedAddress}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)]"
                        />
                      </div>

                      <div className="flex justify-between text-sm text-[var(--muted)]">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[var(--muted)]">
                        <span>Envío estimado</span>
                        <span>Calculado en el pago</span>
                      </div>
                      <div className="border-t border-[var(--border-color)] pt-3 flex justify-between items-center">
                        <span className="font-medium text-[var(--foreground)]">Total</span>
                        <span className="text-xl font-bold text-[var(--foreground)]">{subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button disabled={loading} onClick={handleCheckout} variant="primary" className="w-full py-4 text-sm font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2">
                        {loading ? "Procesando..." : "Comprar Ahora"}
                      </Button>
                      <Button disabled={loading} onClick={generateQuoteDocument} variant="outline" className="w-full py-3 text-sm font-medium rounded-xl flex items-center justify-center gap-2 bg-transparent border-[var(--border-color)] hover:bg-[var(--foreground)]/5 transition-colors">
                        Generar Cotización Oficial
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
