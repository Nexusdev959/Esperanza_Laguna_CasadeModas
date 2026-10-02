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
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Política de Envíos</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          <p>Última actualización: Septiembre 2026</p>
          
          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Tiempos de Procesamiento</h2>
          <p>
            Todos los pedidos individuales se procesan dentro de 2 a 4 días hábiles (excluyendo fines de semana y días festivos) después de recibir su correo electrónico de confirmación de pedido. Los pedidos al por mayor o personalizados pueden requerir entre 10 a 15 días hábiles adicionales para su confección y preparación.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Tarifas y Tiempos Estimados de Envío</h2>
          <p>
            Las tarifas de envío para su pedido se calcularán y mostrarán al momento del checkout. Ofrecemos las siguientes opciones:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Envío Estándar Nacional:</strong> 3-5 días hábiles.</li>
              <li><strong>Envío Exprés Nacional:</strong> 1-2 días hábiles.</li>
              <li><strong>Envío Internacional:</strong> 7-21 días hábiles, dependiendo del país de destino.</li>
            </ul>
            *Los tiempos son estimados y pueden variar según el transportista.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Envíos Internacionales y Aduanas</h2>
          <p>
            Su pedido puede estar sujeto a aranceles de importación e impuestos (incluido el IVA), que se incurren una vez que el envío llega a su país de destino. Pilypage no es responsable de estos cargos si se aplican; son su responsabilidad como cliente. Recomendamos consultar con su oficina de aduanas local.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Rastreo de Pedidos</h2>
          <p>
            Cuando su pedido haya sido enviado, recibirá una notificación por correo electrónico de nuestra parte que incluirá un número de seguimiento que puede usar para verificar su estado. Por favor, permita 48 horas para que la información de seguimiento esté disponible.
          </p>
        </div>
      </main>
    </>
  );
}
