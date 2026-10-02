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
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Política de Devoluciones y Reembolsos</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          <p>Última actualización: Septiembre 2026</p>
          
          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Derecho de Desistimiento</h2>
          <p>
            De acuerdo con las normativas internacionales de protección al consumidor (incluyendo la directiva europea y leyes locales), usted tiene derecho a desistir de su compra en un plazo de 14 a 30 días naturales sin necesidad de justificación, a partir del día en que usted o un tercero indicado por usted adquiera la posesión material de los bienes. En Pilypage, ampliamos este plazo a <strong>30 días naturales</strong>.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Condiciones para la Devolución</h2>
          <p>
            Para que un producto sea elegible para devolución:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Debe estar sin uso y en las mismas condiciones en que lo recibió.</li>
              <li>Debe conservar su embalaje original y todas sus etiquetas.</li>
              <li>Debe presentar el recibo o comprobante de compra.</li>
            </ul>
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Excepciones</h2>
          <p>
            Por razones de higiene y naturaleza del producto, los siguientes artículos no son retornables:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Prendas íntimas o personalizadas (por ejemplo, uniformes bordados con el nombre del club o la persona).</li>
              <li>Artículos en liquidación final.</li>
            </ul>
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Proceso de Reembolso</h2>
          <p>
            Una vez que recibamos e inspeccionemos su devolución, le enviaremos un correo electrónico para notificarle. Si es aprobado, se procesará su reembolso y se aplicará automáticamente un crédito a su tarjeta de crédito o método de pago original, dentro de un cierto número de días (generalmente 5-10 días hábiles).
          </p>
          
          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">5. Costos de Envío de Devoluciones</h2>
          <p>
            Usted será responsable de pagar sus propios costos de envío para devolver su artículo, a menos que el producto recibido sea defectuoso o incorrecto. Los costos de envío originales no son reembolsables.
          </p>
        </div>
      </main>
    </>
  );
}
