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
          {/* Quitar este aviso cuando un abogado haya revisado el texto */}
          <p className="rounded-md border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Borrador pendiente de revisión legal:</strong> este texto debe ser revisado por un abogado antes de publicarse.
          </p>
          <p>Última actualización: Octubre 2026</p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. ¿Qué son las Cookies?</h2>
          <p>
            Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos o registros que un sitio web guarda en su computador o celular para poder funcionar y recordar información entre una visita y otra.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Cookies que Utilizamos</h2>
          <p>En el sitio de Esperanza Laguna Casa de Modas usamos:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Cookies necesarias:</strong> mantienen su sesión iniciada, protegen el acceso a su cuenta y conservan los productos de su carrito. Sin ellas el sitio no puede funcionar.</li>
            <li><strong>Cookies de funcionalidad:</strong> recuerdan preferencias como el tema claro u oscuro.</li>
            <li><strong>Cookies de terceros:</strong> el inicio de sesión con Google y la pasarela de pagos Wompi pueden usar sus propias cookies cuando usted utiliza esos servicios, según sus políticas.</li>
          </ul>
          <p>Hoy no usamos cookies publicitarias ni de seguimiento con fines comerciales.</p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Cómo Gestionarlas</h2>
          <p>
            Puede bloquear o borrar las cookies desde la configuración de su navegador. Si bloquea las cookies necesarias, es posible que no pueda iniciar sesión ni completar una compra.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Datos Personales</h2>
          <p>
            La información personal que se obtenga por medio de cookies se trata conforme a la Ley 1581 de 2012 y a nuestra <Link href="/legal/privacy" className="text-primary hover:underline">Política de Tratamiento de Datos Personales</Link>.
          </p>
        </div>
      </main>
    </>
  );
}
