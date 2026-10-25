import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LegalNotice() {
  return (
    <>
      <main className="container max-w-4xl mx-auto px-4 py-20">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a Inicio
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Aviso Legal</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          {/* Quitar este aviso cuando un abogado haya revisado el texto */}
          <p className="rounded-md border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Borrador pendiente de revisión legal:</strong> este texto debe ser revisado por un abogado antes de publicarse.
          </p>
          <p>Última actualización: Octubre 2026</p>

          <p>
            En cumplimiento de la Ley 527 de 1999 sobre comercio electrónico y del artículo 50 de la Ley 1480 de 2011 (Estatuto del Consumidor), informamos los datos de quien ofrece los productos en este sitio web.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Datos del Titular</h2>
          <ul className="list-none pl-0 mt-2 space-y-1">
            <li><strong>Nombre comercial:</strong> Esperanza Laguna Casa de Modas</li>
            <li><strong>Dirección:</strong> Calle 32B 85-24, Medellín, Antioquia, Colombia</li>
            <li><strong>NIT:</strong> 33283538-4</li>
            <li><strong>Teléfono:</strong> 3215028653</li>
            <li><strong>Correo Electrónico:</strong> cdmodaslaguna@gmail.com</li>
          </ul>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Propiedad Intelectual</h2>
          <p>
            El diseño del sitio, sus textos, fotografías y códigos fuente pertenecen a Esperanza Laguna Casa de Modas. Los nombres, logos e insignias de los clubes de Conquistadores, Aventureros y Guías Mayores pertenecen a la Iglesia Adventista del Séptimo Día y se usan únicamente para identificar los productos. Está prohibido reproducir el contenido del sitio sin autorización.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Enlaces a Otros Sitios</h2>
          <p>
            Este sitio puede contener enlaces a sitios de terceros, como la pasarela de pagos o las transportadoras. No somos responsables del contenido ni de las políticas de esos sitios.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Atención al Cliente y Resolución de Conflictos</h2>
          <p>
            Puede presentar peticiones, quejas y reclamos por el formulario de la página de <Link href="/contact" className="text-primary hover:underline">contacto</Link>, al correo o al teléfono indicados arriba. Si no resolvemos su reclamación, puede acudir a la Superintendencia de Industria y Comercio (<a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.sic.gov.co</a>). Este sitio se rige por las leyes de la República de Colombia.
          </p>
        </div>
      </main>
    </>
  );
}
