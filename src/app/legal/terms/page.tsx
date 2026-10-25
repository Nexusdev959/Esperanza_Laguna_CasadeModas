import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <>
      <main className="container max-w-4xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a Inicio
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Términos y Condiciones</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          {/* Quitar este aviso cuando un abogado haya revisado el texto */}
          <p className="rounded-md border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Borrador pendiente de revisión legal:</strong> este texto debe ser revisado por un abogado antes de publicarse.
          </p>
          <p>Última actualización: Octubre 2026</p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Aceptación</h2>
          <p>
            Estos términos regulan el uso del sitio web y las compras hechas a Esperanza Laguna Casa de Modas, NIT 33283538-4, con domicilio en Medellín, Colombia. Al hacer un pedido, usted declara que los ha leído y los acepta. Se rigen por las leyes de la República de Colombia, en especial la Ley 1480 de 2011 (Estatuto del Consumidor) y la Ley 527 de 1999 (comercio electrónico).
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Productos</h2>
          <p>
            Vendemos uniformes, prendas, insignias y accesorios para clubes de Conquistadores, Aventureros y Guías Mayores. La mayoría de las prendas se confeccionan por encargo, según las tallas y datos que usted indique. Es su responsabilidad revisar la guía de tallas y confirmar que los nombres y datos del pedido estén correctos antes de pagar el anticipo. Las fotos son ilustrativas y pueden presentarse pequeñas variaciones de color propias de la tela.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Precios</h2>
          <p>
            Los precios se expresan en pesos colombianos (COP). El valor del envío por transportadora o del domicilio no está incluido en el precio de los productos, salvo que se indique lo contrario.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Pedidos, Anticipo y Pagos</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Los pedidos por encargo requieren un <strong>anticipo del 50 %</strong> de su valor para iniciar la confección. El 50 % restante debe pagarse antes de la entrega o el despacho.</li>
            <li>También puede pagar el total del pedido desde el inicio.</li>
            <li>Los pagos se reciben por <strong>Wompi</strong> (tarjeta, PSE y demás medios que ofrezca la pasarela) o por <strong>transferencia bancaria</strong>. Las transferencias se acreditan cuando verificamos el comprobante.</li>
            <li>Un pedido sin anticipo reserva su lugar en la producción solo por 48 horas; después de ese plazo la reserva se libera.</li>
          </ul>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">5. Cupo Mensual de Uniformes</h2>
          <p>
            Para cumplir los tiempos de entrega, confeccionamos una cantidad limitada de uniformes cada mes. Cuando el cupo del mes se completa, el sitio no permite nuevos pedidos de uniformes por encargo hasta el mes siguiente; los productos en inventario no ocupan cupo. El cupo se reinicia el primer día de cada mes.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">6. Tiempos de Confección y Entrega</h2>
          <p>
            Los tiempos de confección y las formas de entrega se explican en nuestra <Link href="/legal/shipping" className="text-primary hover:underline">Política de Envíos y Entregas</Link>.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">7. Retracto, Devoluciones y Garantías</h2>
          <p>
            El derecho de retracto, sus excepciones para prendas personalizadas y la garantía legal se explican en nuestra <Link href="/legal/refunds" className="text-primary hover:underline">Política de Devoluciones, Retracto y Garantías</Link>.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">8. Peticiones, Quejas y Reclamos</h2>
          <p>
            Puede presentar sus PQRS por el formulario de la página de <Link href="/contact" className="text-primary hover:underline">contacto</Link>, al correo cdmodaslaguna@gmail.com o al teléfono 3215028653. Si su reclamación no es atendida, puede acudir a la Superintendencia de Industria y Comercio.
          </p>
        </div>
      </main>
    </>
  );
}
