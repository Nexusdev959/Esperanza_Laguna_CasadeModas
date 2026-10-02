import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <main className="container max-w-4xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a Inicio
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Política de Privacidad</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          <p>Última actualización: Septiembre 2026</p>
          
          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Introducción</h2>
          <p>
            En Pilypage, respetamos su privacidad y nos comprometemos a proteger sus datos personales de acuerdo con las leyes internacionales de protección de datos, incluyendo el Reglamento General de Protección de Datos (GDPR) y la California Consumer Privacy Act (CCPA). Esta política explica cómo recopilamos, usamos y salvaguardamos su información cuando visita nuestro sitio web o realiza compras de uniformes y equipamiento para el Club de Conquistadores, Aventureros y Guías Mayores.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Datos que Recopilamos</h2>
          <p>
            Recopilamos varios tipos de información, incluyendo:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Información de contacto:</strong> Nombre, dirección de correo electrónico, número de teléfono y dirección de envío.</li>
              <li><strong>Datos de pago:</strong> Procesados de forma segura a través de nuestros proveedores de pago (ej. Stripe o PayPal). No almacenamos números de tarjetas de crédito.</li>
              <li><strong>Información de uso:</strong> Datos sobre cómo interactúa con nuestro sitio, dirección IP y tipo de navegador para mejorar nuestra experiencia de usuario.</li>
            </ul>
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Uso de la Información</h2>
          <p>
            Utilizamos su información personal exclusivamente para:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Procesar y gestionar sus pedidos y devoluciones.</li>
              <li>Autenticación segura a través de Google (OAuth).</li>
              <li>Comunicarnos con usted sobre actualizaciones de pedidos o soporte técnico.</li>
              <li>Cumplir con obligaciones legales e impositivas aplicables.</li>
            </ul>
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Compartir Información</h2>
          <p>
            No vendemos ni alquilamos su información personal a terceros. Podemos compartir información con proveedores de servicios de confianza (empresas de logística, procesadores de pago) únicamente en la medida necesaria para cumplir con los servicios solicitados.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">5. Sus Derechos</h2>
          <p>
            Dependiendo de su jurisdicción, usted tiene derecho a:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Acceder a sus datos personales almacenados en nuestro sistema.</li>
              <li>Solicitar la corrección o eliminación de sus datos (Derecho al Olvido).</li>
              <li>Oponerse al procesamiento de datos con fines de marketing.</li>
            </ul>
            Para ejercer estos derechos, contáctenos a través de nuestro centro de soporte.
          </p>
        </div>
      </main>
    </>
  );
}
