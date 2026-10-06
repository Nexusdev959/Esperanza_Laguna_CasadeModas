"use client";

import { Building, MapPin, Mail, Phone } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";

export function QuotePreview({
  clientInfo,
  quoteDetails,
  items,
  subtotal,
  total
}: any) {
  return (
    <div className="lg:col-span-7 xl:col-span-8 flex justify-center print:block print:w-full overflow-x-auto pt-4 lg:pt-0">
      <AnimateIn delay={0.2} className="w-full flex justify-center print:block print:w-full">
        
        {/* Contenedor A4 (Estilos físicos) */}
        <div className="w-full max-w-[850px] aspect-[1/1.414] bg-white text-black shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border border-stone-200 dark:border-stone-800 ring-1 ring-black/5 rounded-sm p-8 sm:p-12 md:p-16 relative overflow-hidden print:shadow-none print:border-none print:w-[210mm] print:h-[297mm] print:p-[20mm] print:m-0 shrink-0">
          
          {/* Marca de agua elegante */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <img src="/logos/log3.png" alt="Watermark" className="w-[80%] grayscale" />
          </div>

          {/* HEADER DEL DOCUMENTO */}
          <div className="flex justify-between items-start border-b-2 border-stone-200 pb-8 relative z-10">
            <div className="flex flex-col">
              {/* Logos combinados para evitar texto */}
              <div className="flex items-center gap-4 mb-4">
                <img src="/logos/log1.png" alt="Logo Símbolo" className="h-[70px] w-auto object-contain origin-left" />
                <img src="/logos/log2.png" alt="Esperanza Laguna" className="h-[60px] w-auto object-contain origin-left" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-stone-500 font-sans tracking-wide">NIT: 900.123.456-7 | Régimen Común</p>
                <p className="text-xs text-stone-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Bogotá, Colombia</p>
                <p className="text-xs text-stone-500 flex items-center gap-1"><Phone className="w-3 h-3" /> +57 320 123 4567</p>
              </div>
            </div>

            <div className="text-right flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-serif text-stone-800 tracking-tight uppercase">Cotización</h2>
                <p className="text-lg font-bold text-stone-600 font-sans mt-1">N° {quoteDetails.quoteNumber}</p>
              </div>
              <div className="mt-8 space-y-1 text-sm font-sans">
                <p><span className="text-stone-500 font-semibold">Fecha de Emisión:</span> {quoteDetails.date}</p>
                <p><span className="text-stone-500 font-semibold">Válida hasta:</span> {quoteDetails.validUntil}</p>
              </div>
            </div>
          </div>

          {/* DATOS DEL CLIENTE */}
          <div className="mt-8 grid grid-cols-2 gap-8 relative z-10">
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-100">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Preparado para</h3>
              <div className="space-y-2">
                <p className="font-serif text-lg font-bold text-stone-800 leading-tight">{clientInfo.name || "Nombre del Cliente"}</p>
                {clientInfo.club && <p className="text-sm text-stone-600 flex items-center gap-2"><Building className="w-4 h-4 text-stone-400" /> {clientInfo.club}</p>}
                {clientInfo.church && <p className="text-sm text-stone-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-stone-400" /> {clientInfo.church}</p>}
              </div>
            </div>
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-100 flex flex-col justify-center">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Contacto</h3>
              <div className="space-y-2">
                <p className="text-sm text-stone-600 flex items-center gap-2"><Mail className="w-4 h-4 text-stone-400" /> {clientInfo.email || "correo@ejemplo.com"}</p>
                <p className="text-sm text-stone-600 flex items-center gap-2"><Phone className="w-4 h-4 text-stone-400" /> {clientInfo.phone || "+57 ___ ___ ____"}</p>
              </div>
            </div>
          </div>

          {/* TABLA DE ARTÍCULOS */}
          <div className="mt-10 relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-800">
                  <th className="py-3 px-2 text-xs font-bold text-stone-800 uppercase tracking-widest w-12 text-center">Cant.</th>
                  <th className="py-3 px-2 text-xs font-bold text-stone-800 uppercase tracking-widest">Descripción</th>
                  <th className="py-3 px-2 text-xs font-bold text-stone-800 uppercase tracking-widest text-right w-32">Precio Unit.</th>
                  <th className="py-3 px-2 text-xs font-bold text-stone-800 uppercase tracking-widest text-right w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {items.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-2 text-sm text-stone-800 text-center font-medium">{item.quantity}</td>
                    <td className="py-4 px-2 text-sm text-stone-800">{item.description || "—"}</td>
                    <td className="py-4 px-2 text-sm text-stone-600 text-right tabular-nums">{item.unitPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                    <td className="py-4 px-2 text-sm text-stone-800 font-bold text-right tabular-nums">{(item.quantity * item.unitPrice).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-stone-400 text-sm font-medium italic">
                      Añade artículos en el panel izquierdo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TOTALES */}
          <div className="mt-8 flex justify-end relative z-10">
            <div className="w-full max-w-[300px] space-y-3">
              <div className="flex justify-between items-end pt-2">
                <span className="text-base font-bold text-stone-800 uppercase tracking-wider">Total</span>
                <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                  {total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER DEL DOCUMENTO */}
          <div className="absolute bottom-8 inset-x-8 sm:inset-x-12 md:inset-x-16 border-t border-stone-200 pt-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs text-stone-500 font-medium">Términos y Condiciones:</p>
                <p className="text-[10px] text-stone-400 max-w-md leading-relaxed">
                  Esta cotización tiene una validez de 15 días calendario a partir de su emisión. 
                  Para iniciar la confección de los uniformes se requiere un anticipo del 50%. 
                  Los tiempos de entrega están sujetos a disponibilidad de agenda.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-serif italic text-stone-400">Gracias por preferir la calidad de nuestra tierra.</p>
              </div>
            </div>
          </div>

        </div>
      </AnimateIn>
    </div>
  );
}
