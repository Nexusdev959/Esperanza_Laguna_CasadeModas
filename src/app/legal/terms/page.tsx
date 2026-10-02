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
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Términos de Servicio</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          <p>Última actualización: Septiembre 2026</p>
          
          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web de Pilypage, usted acepta cumplir y estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web ni realizar compras.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Descripción del Servicio</h2>
          <p>
            Pilypage es una plataforma de comercio electrónico especializada en la venta de uniformes, prendas y accesorios oficiales para clubes vinculados a la Iglesia Adventista (Conquistadores, Aventureros, Guías Mayores). Nos reservamos el derecho de modificar o descontinuar cualquier producto o servicio sin previo aviso.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Políticas de Compra y Pedidos al por Mayor</h2>
          <p>
            Nuestros productos pueden adquirirse por unidad o por lote. Al realizar un pedido por lote (generalmente múltiplos de 12 unidades), se aplican descuentos especiales. Es responsabilidad del comprador verificar la guía de tallas antes de realizar pedidos grupales. Los tiempos de preparación para pedidos al por mayor pueden ser superiores a los pedidos individuales.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Envíos y Entregas</h2>
          <p>
            Realizamos envíos nacionales e internacionales. Los plazos de entrega estimados se proporcionan al momento de la compra, pero no son garantizados debido a factores externos (aduanas, retrasos de mensajería). El riesgo de pérdida y el título de los artículos pasan al comprador en el momento de nuestra entrega al transportista.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">5. Devoluciones y Reembolsos</h2>
          <p>
            Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del pedido, siempre que los uniformes no hayan sido utilizados, lavados o modificados, y conserven sus etiquetas originales. Los productos personalizados no son elegibles para devolución salvo defecto de fábrica.
          </p>
        </div>
      </main>
    </>
  );
}
