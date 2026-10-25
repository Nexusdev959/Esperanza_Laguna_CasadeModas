"use client";

import { ShoppingBag, X, Minus, Plus, Trash2, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";
import { useRouter } from "next/navigation";

import { useCartStore, itemDetails, uniformUnits, LOT_MIN_UNIFORMS, LEAD_DAYS, RH_OPTIONS, INSIGNIA_LABELS, addBusinessDays } from "@/store/cart";

type DeliveryMethod = "NATIONAL_SHIPPING" | "MEDELLIN_DELIVERY" | "STORE_PICKUP";

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; hint: string }[] = [
  { value: "NATIONAL_SHIPPING", label: "Envío fuera de Medellín", hint: "Por transportadora. El flete se paga aparte al recibir o al despachar." },
  { value: "MEDELLIN_DELIVERY", label: "Domicilio en Medellín", hint: "No está incluido: lo cobra la plataforma de domicilios según la distancia." },
  { value: "STORE_PICKUP", label: "Recoger en tienda", hint: "Sin costo. Presentas el código de tu pedido." },
];

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, updateMember, clubName, setClubName, clearCart, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("NATIONAL_SHIPPING");
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Al abrir se relee la sesión: el login ya no recarga la página, así que el carrito puede venir de antes
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem('jwt_token');
    setIsLoggedIn(!!token);
    if (!token) return;
    api.get('/auth/addresses').then(res => {
      setAddresses(res.data);
      const def = res.data.find((a: any) => a.isDefault) ?? res.data[0];
      if (def) setSelectedAddress((current) => current || `${def.street}, ${def.city}, ${def.state}`);
    }).catch(err => console.error(err));
    api.get('/auth/profile').then(res => {
      if (res.data?.phone) setContact((c) => ({ ...c, phone: c.phone || res.data.phone }));
    }).catch(() => {});
  }, [isOpen]);

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

  const subtotal = getTotal();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Todo uniforme lleva insignia de nombre y RH. Desde 3 es lote: además el club y la talla de quien no la tenga
  const uniforms = uniformUnits(items);
  const isLot = uniforms >= LOT_MIN_UNIFORMS;
  const leadDays = uniforms === 0 ? null : isLot ? LEAD_DAYS.lot : LEAD_DAYS.unit;
  const lotRows = items.filter((i) => i.isUniform).flatMap((i) => (i.members ?? []).map((m) => ({ ...m, needsSize: !i.size && (i.sizes?.length ?? 0) > 0 })));
  const completeRows = lotRows.filter((m) => m.name.trim().length >= 2 && m.rh && (!m.needsSize || m.size)).length;

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      if (isLot && clubName.trim().length < 2) {
        showNotification("Escribe el nombre del club para el lote", "error");
        return;
      }
      if (completeRows < lotRows.length) {
        showNotification(isLot
          ? `Completa la lista del club: faltan ${lotRows.length - completeRows} integrante(s) por nombre, RH o talla`
          : "Escribe el nombre y el RH de cada uniforme", "error");
        return;
      }
      setLoading(true);
      // Sin cuenta también se puede comprar: el teléfono (y el correo, si lo deja) sirven para el envío y el recibo
      const payload = {
        items: items.map(i => ({
          productId: i.productId, quantity: i.quantity, size: i.size, personalization: i.personalization,
          union: i.union, association: i.association, insignias: i.insignias, details: i.details,
          members: i.isUniform ? i.members?.map((m) => ({ name: m.name.trim(), rh: m.rh, size: i.size ?? m.size })) : undefined,
        })),
        clubName: isLot ? clubName.trim() : undefined,
        deliveryMethod,
        shippingAddress: deliveryMethod === "STORE_PICKUP" ? undefined : selectedAddress,
        contactName: isLoggedIn ? undefined : contact.name,
        contactPhone: contact.phone,
        contactEmail: isLoggedIn ? undefined : contact.email,
        notes: notes.trim() || undefined
      };
      const res = await api.post('/orders/quote', payload);
      showNotification(`Pedido generado con éxito. Redirigiendo a los detalles...`, 'success');
      clearCart();
      setNotes("");
      setIsOpen(false);
      
      // Redirigir al cliente directamente a la pasarela de pagos (Checkout)
      if (res.data && res.data.id) {
        router.push(`/checkout/${res.data.id}`);
      }
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

  if (!mounted) return null;

  return (
    <>
      <button 
        aria-label="Ver carrito de compras"
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
                    aria-label="Cerrar carrito"
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
                    <>
                    {items.map(item => (
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
                              <button onClick={() => removeItem(item.id)} aria-label={`Quitar ${item.name}`} className="text-[var(--muted)] hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {itemDetails(item) && <p className="text-xs text-[var(--muted)] mt-1">{itemDetails(item)}</p>}
                          </div>
                          
                          <div className="flex items-end justify-between mt-3">
                            <p className="text-sm font-semibold text-[var(--foreground)]">{item.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-[var(--surface)] border border-[var(--border-color)] rounded-lg">
                              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} aria-label="Restar uno" className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Sumar uno" className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Dirección y detalles van en el área con scroll: en pantallas bajas no tapan los productos */}
                    <div className="pt-2 space-y-5">
                      {uniforms > 0 && (
                        <section aria-labelledby="club-list-title" className="space-y-3 p-4 rounded-2xl border border-primary/30 bg-primary/5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                              <div>
                                <h3 id="club-list-title" className="text-sm font-semibold text-[var(--foreground)]">{isLot ? "Lista del club" : "¿Quién usará cada uniforme?"}</h3>
                                <p className="text-xs text-[var(--muted)]">{isLot ? "Pedido por lote: anota quién usará cada uniforme para que la entrega sea exacta." : "El nombre y el RH van bordados en las insignias."}</p>
                              </div>
                            </div>
                            <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${completeRows === lotRows.length ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-[var(--background)] text-[var(--muted)] border border-[var(--border-color)]"}`}>
                              {completeRows}/{lotRows.length}
                            </span>
                          </div>
                          {isLot && <input
                            type="text"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            maxLength={120}
                            placeholder="Nombre del club"
                            aria-label="Nombre del club"
                            className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)] focus:border-primary transition-colors"
                          />}
                          {items.filter((i) => i.isUniform).map((item) => (
                            <div key={item.id} className="space-y-1.5">
                              <p className="text-xs font-medium text-[var(--foreground)]">
                                {item.name.trim()}
                                <span className="font-normal text-[var(--muted)]">{item.size ? ` · Talla ${item.size}` : ""}{item.insignias && item.insignias !== "COMPLETAS" ? ` · ${INSIGNIA_LABELS[item.insignias]}` : ""}</span>
                              </p>
                              {(item.members ?? []).map((m, n) => {
                                const needsSize = !item.size && (item.sizes?.length ?? 0) > 0;
                                return (
                                  <div key={n} className={`grid gap-1.5 items-center ${needsSize ? "grid-cols-[1.25rem_1fr_4.5rem_4.5rem]" : "grid-cols-[1.25rem_1fr_4.5rem]"}`}>
                                    <span className="text-[11px] text-[var(--muted)] text-right">{n + 1}</span>
                                    <input
                                      type="text"
                                      value={m.name}
                                      onChange={(e) => updateMember(item.id, n, { name: e.target.value })}
                                      maxLength={80}
                                      placeholder="Nombre completo"
                                      aria-label={`Nombre del integrante ${n + 1} de ${item.name}`}
                                      className="min-w-0 p-1.5 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-xs outline-none text-[var(--foreground)] focus:border-primary"
                                    />
                                    <select
                                      value={m.rh}
                                      onChange={(e) => updateMember(item.id, n, { rh: e.target.value })}
                                      aria-label={`RH del integrante ${n + 1}`}
                                      className="p-1.5 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-xs outline-none text-[var(--foreground)] focus:border-primary"
                                    >
                                      <option value="">RH</option>
                                      {RH_OPTIONS.map((rh) => <option key={rh} value={rh}>{rh}</option>)}
                                    </select>
                                    {needsSize && (
                                      <select
                                        value={m.size ?? ""}
                                        onChange={(e) => updateMember(item.id, n, { size: e.target.value })}
                                        aria-label={`Talla del integrante ${n + 1}`}
                                        className="p-1.5 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-xs outline-none text-[var(--foreground)] focus:border-primary"
                                      >
                                        <option value="">Talla</option>
                                        {item.sizes!.map((sz) => <option key={sz} value={sz}>{sz}</option>)}
                                      </select>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </section>
                      )}
                      <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-[var(--foreground)] mb-2">¿Cómo recibes tu pedido?</legend>
                        {DELIVERY_OPTIONS.map((opt) => (
                          <label
                            key={opt.value}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${deliveryMethod === opt.value ? "border-primary bg-primary/5" : "border-[var(--border-color)] hover:bg-[var(--foreground)]/5"}`}
                          >
                            <input
                              type="radio"
                              name="delivery"
                              value={opt.value}
                              checked={deliveryMethod === opt.value}
                              onChange={() => setDeliveryMethod(opt.value)}
                              className="mt-0.5 accent-[#2ec4a6]"
                            />
                            <span className="flex flex-col">
                              <span className="text-sm text-[var(--foreground)]">{opt.label}</span>
                              <span className="text-xs text-[var(--muted)]">{opt.hint}</span>
                            </span>
                          </label>
                        ))}
                      </fieldset>

                      <div className="space-y-2">
                        <span className="block text-sm font-medium text-[var(--foreground)]">Datos de contacto</span>
                        {!isLoggedIn && (
                          <input
                            type="text"
                            autoComplete="name"
                            placeholder="Tu nombre completo"
                            aria-label="Tu nombre completo"
                            value={contact.name}
                            onChange={(e) => setContact({ ...contact, name: e.target.value })}
                            className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)] focus:border-primary transition-colors"
                          />
                        )}
                        <input
                          type="tel"
                          autoComplete="tel"
                          placeholder="Teléfono / WhatsApp"
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)] focus:border-primary transition-colors"
                        />
                        {!isLoggedIn && (
                          <>
                            <input
                              type="email"
                              autoComplete="email"
                              placeholder="Correo (opcional, para el recibo)"
                              value={contact.email}
                              onChange={(e) => setContact({ ...contact, email: e.target.value })}
                              className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)] focus:border-primary transition-colors"
                            />
                            <p className="text-xs text-[var(--muted)]">
                              Compras sin cuenta: guarda el código del pedido para rastrearlo.{" "}
                              <button type="button" onClick={() => { setIsOpen(false); router.push('/login'); }} className="underline underline-offset-2 hover:text-primary">Inicia sesión</button> si ya tienes una.
                            </p>
                          </>
                        )}
                      </div>
                      {deliveryMethod !== "STORE_PICKUP" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--foreground)]">Dirección de entrega</label>
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
                          autoComplete="street-address"
                          placeholder={deliveryMethod === "MEDELLIN_DELIVERY" ? "Dirección y barrio en Medellín" : "Dirección, ciudad y departamento"}
                          value={selectedAddress}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)] focus:border-primary transition-colors"
                        />
                      </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="order-notes" className="text-sm font-medium text-[var(--foreground)]">Detalles de tu pedido <span className="text-[var(--muted)] font-normal">(opcional)</span></label>
                        <textarea
                          id="order-notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          maxLength={1000}
                          rows={3}
                          placeholder="Ej: 2 camisas manga larga, nombres de los conquistadores, fecha de la investidura…"
                          className="w-full p-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none text-[var(--foreground)] resize-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    </>
                  )}
                </div>
                
                {/* Footer / Summary */}
                {items.length > 0 && (
                  <div className="p-6 border-t border-[var(--border-color)] bg-[var(--background)]/80 backdrop-blur-md shrink-0">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm text-[var(--muted)]">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[var(--muted)]">
                        <span>Envío</span>
                        <span>{deliveryMethod === "STORE_PICKUP" ? "Sin costo" : "No incluido"}</span>
                      </div>
                      {leadDays && (
                        <div className="flex items-start gap-2 text-xs text-[var(--muted)]">
                          <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>
                            Confección {isLot ? "en lote" : "por unidad"}: ~{leadDays} días hábiles desde el anticipo
                            {" "}(aprox. {addBusinessDays(new Date(), leadDays).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}, sin contar festivos).
                          </span>
                        </div>
                      )}
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
