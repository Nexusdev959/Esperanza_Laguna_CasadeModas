import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ShippingPolicy() {
  return (
    <>
      <main className="container max-w-4xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a Inicio
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Política de Envíos y Entregas</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          {/* Quitar este aviso cuando un abogado haya revisado el texto */}
          <p className="rounded-md border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Borrador pendiente de revisión legal:</strong> este texto debe ser revisado por un abogado antes de publicarse.
          </p>
          <p>Última actualización: Octubre 2026</p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Tiempos de Confección</h2>
          <p>
            Los uniformes y prendas por encargo se confeccionan después de recibir el anticipo. Los tiempos se cuentan en días hábiles (de lunes a viernes, sin festivos) desde la fecha en que se acredita el anticipo:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Por unidad:</strong> hasta 10 días hábiles.</li>
            <li><strong>Por lote (desde 3 uniformes):</strong> hasta 15 días hábiles.</li>
          </ul>
          <p>
            Los productos disponibles en inventario se despachan o entregan sin tiempo de confección. Si por alguna razón no podemos cumplir el plazo, se lo informaremos antes de su vencimiento.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Formas de Entrega</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Envío nacional por transportadora:</strong> enviamos a cualquier ciudad o municipio de Colombia. El flete no está incluido en el valor del pedido y depende de la transportadora, el destino y el peso del paquete.</li>
            <li><strong>Domicilio en Medellín:</strong> se entrega por medio de una plataforma de domicilios. El valor del domicilio no está incluido en el pedido y lo cobra aparte la plataforma.</li>
            <li><strong>Recogida en tienda:</strong> sin costo, en la Calle 32B 85-24, Medellín. Para recibir el pedido debe presentar el código del pedido.</li>
          </ul>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Tiempos de Transporte</h2>
          <p>
            Los tiempos de la transportadora o de la plataforma de domicilios se suman al tiempo de confección y dependen de cada empresa y del destino. Normalmente un envío nacional tarda entre 1 y 5 días hábiles después del despacho.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Seguimiento del Pedido</h2>
          <p>
            Puede consultar el estado de su pedido con su código en la sección de seguimiento del sitio. Cuando despachemos por transportadora, le enviaremos el número de guía para que haga el seguimiento directamente con ella.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">5. Recepción del Pedido</h2>
          <p>
            Al recibir el paquete, revise que esté en buen estado. Si llega abierto o dañado, déjelo anotado en la guía de la transportadora y escríbanos por WhatsApp al 3215028653 o al correo cdmodaslaguna@gmail.com.
          </p>
        </div>
      </main>
    </>
  );
}
