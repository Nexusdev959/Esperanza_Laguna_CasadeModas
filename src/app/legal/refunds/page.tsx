import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RefundsPolicy() {
  return (
    <>
      <main className="container max-w-4xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a Inicio
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Política de Devoluciones, Retracto y Garantías</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          {/* Quitar este aviso cuando un abogado haya revisado el texto */}
          <p className="rounded-md border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Borrador pendiente de revisión legal:</strong> este texto debe ser revisado por un abogado antes de publicarse.
          </p>
          <p>Última actualización: Octubre 2026</p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Derecho de Retracto</h2>
          <p>
            De acuerdo con el artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor), en las compras hechas a distancia, por este sitio web o por WhatsApp, usted puede retractarse de la compra dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la entrega del producto, sin tener que explicar el motivo.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Productos Exceptuados del Retracto</h2>
          <p>
            Según la misma norma, el retracto no aplica a los bienes confeccionados conforme a las especificaciones del consumidor o claramente personalizados. Por eso no admiten retracto:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Los uniformes y prendas hechos por encargo, a la talla o medida del cliente.</li>
            <li>Las prendas bordadas o estampadas con nombres, club, unión, asociación o tipo de sangre.</li>
            <li>Las insignias y accesorios personalizados.</li>
          </ul>
          <p>Estos productos conservan siempre la garantía legal descrita en el numeral 4.</p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Cómo Ejercer el Retracto</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Avísenos dentro del plazo por correo a cdmodaslaguna@gmail.com, por WhatsApp al 3215028653 o por el formulario de PQRS de la página de <Link href="/contact" className="text-primary hover:underline">contacto</Link>, indicando el código del pedido.</li>
            <li>Devuelva el producto sin uso, en las mismas condiciones en que lo recibió y con sus etiquetas.</li>
            <li>Los costos de transporte de la devolución corren por su cuenta.</li>
          </ul>
          <p>
            Le reintegraremos el dinero pagado, sin descuentos ni retenciones, dentro de los treinta (30) días calendario siguientes a la fecha en que ejerció el retracto.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Garantía Legal</h2>
          <p>
            Todos nuestros productos, incluidos los personalizados, tienen la garantía legal que establece la Ley 1480 de 2011: respondemos por su calidad, idoneidad y seguridad durante <strong>un (1) año</strong> contado desde la entrega. Si una prenda presenta un defecto de confección o de materiales, o no corresponde a lo que usted pidió (talla, bordado o modelo distintos a los confirmados), escríbanos por los canales indicados. Según el caso, repararemos la prenda, la cambiaremos por otra o le devolveremos el dinero.
          </p>
          <p>
            La garantía no cubre el desgaste normal por el uso, los daños por lavado o planchado inadecuados ni las modificaciones hechas por terceros. Cuando la reclamación sea por garantía, nosotros asumimos los costos de transporte.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">5. Reversión del Pago</h2>
          <p>
            Si pagó con tarjeta, PSE u otro medio electrónico, puede solicitar la reversión del pago en los casos previstos en el artículo 51 de la Ley 1480 de 2011 (por ejemplo, si fue víctima de fraude, si no recibió el producto o si este no corresponde a lo solicitado o es defectuoso). Debe presentar la solicitud dentro de los cinco (5) días hábiles siguientes a la fecha en que tuvo conocimiento de la situación, informándonos a nosotros y a la entidad emisora del medio de pago.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">6. Anticipos de Pedidos por Encargo</h2>
          <p>
            El anticipo de un pedido por encargo se destina a comprar materiales e iniciar la confección. Si usted cancela el pedido después de pagarlo, se descontarán los costos en que ya hayamos incurrido y se le devolverá el excedente.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">7. Quejas</h2>
          <p>
            Si no queda satisfecho con nuestra respuesta, puede acudir a la Superintendencia de Industria y Comercio (SIC), autoridad de protección al consumidor en Colombia.
          </p>
        </div>
      </main>
    </>
  );
}
