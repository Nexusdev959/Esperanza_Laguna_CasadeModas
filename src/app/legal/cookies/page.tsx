import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CookiePolicy() {
  return (
    <>
      <main className="container max-w-4xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a Inicio
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Política de Cookies</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          <p>Última actualización: Septiembre 2026</p>
          
          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. ¿Qué son las Cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web que usted visita colocan en su ordenador o dispositivo móvil. Son ampliamente utilizadas para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Cómo Utilizamos las Cookies</h2>
          <p>
            En Pilypage, utilizamos cookies para los siguientes propósitos:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Cookies Estrictamente Necesarias:</strong> Esenciales para que usted pueda navegar por el sitio web y utilizar sus funciones, como acceder a áreas seguras o mantener los artículos en su carrito de compras.</li>
              <li><strong>Cookies de Rendimiento y Analíticas:</strong> Nos ayudan a entender cómo interactúan los visitantes con nuestro sitio web al recopilar y reportar información de forma anónima.</li>
              <li><strong>Cookies de Funcionalidad:</strong> Permiten que el sitio web recuerde las elecciones que usted hace (como su nombre de usuario, idioma o la región en la que se encuentra) y proporcionan características mejoradas y más personales.</li>
            </ul>
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Sus Opciones Respecto a las Cookies</h2>
          <p>
            Usted tiene el derecho de decidir si acepta o rechaza las cookies. Puede configurar las preferencias de su navegador web para rechazar todas o algunas cookies, o para alertarle cuando los sitios web configuren o accedan a cookies. Tenga en cuenta que si desactiva o rechaza las cookies necesarias, es posible que algunas partes de nuestro sitio, como el proceso de compra, no funcionen correctamente.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Consentimiento (Cumplimiento GDPR/CCPA)</h2>
          <p>
            De acuerdo con las normativas internacionales, al visitar nuestro sitio por primera vez, se le presentará un banner informativo sobre el uso de cookies, donde podrá otorgar su consentimiento explícito o gestionar sus preferencias de manera detallada.
          </p>
        </div>
      </main>
    </>
  );
}
