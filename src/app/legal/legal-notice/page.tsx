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
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Aviso Legal (Impressum)</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          <p>Última actualización: Septiembre 2026</p>
          
          <p>
            Para dar cumplimiento a la normativa aplicable en materia de servicios de la sociedad de la información y de comercio electrónico (como la LSSI-CE en España o la directiva de comercio electrónico en la UE), a continuación se indican los datos de información general de este sitio web.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Datos del Titular</h2>
          <ul className="list-none pl-0 mt-2 space-y-1">
            <li><strong>Nombre / Razón Social:</strong> Pilypage S.A.C.</li>
            <li><strong>Domicilio Social:</strong> [Calle Ejemplo 123, Ciudad, País, Código Postal]</li>
            <li><strong>Identificación Fiscal / RUC / NIF:</strong> [Número de Identificación Fiscal]</li>
            <li><strong>Teléfono:</strong> [+00 123 456 789]</li>
            <li><strong>Correo Electrónico:</strong> legal@pilypage.com</li>
          </ul>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Propiedad Intelectual e Industrial</h2>
          <p>
            El diseño del portal y sus códigos fuente, así como los logos, marcas y demás signos distintivos que aparecen en el mismo pertenecen a Pilypage S.A.C. (o en su caso, contamos con la debida autorización de uso por parte de la Iglesia Adventista del Séptimo Día para productos oficiales) y están protegidos por los correspondientes derechos de propiedad intelectual e industrial.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Responsabilidad de los Contenidos</h2>
          <p>
            Pilypage S.A.C. no se hace responsable de la legalidad de otros sitios web de terceros desde los que pueda accederse al portal. Tampoco respondemos por la legalidad de otros sitios web de terceros que pudieran estar vinculados o enlazados desde este portal.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Resolución de Conflictos (Plataforma Europea / Local)</h2>
          <p>
            Conforme al Art. 14.1 del Reglamento (UE) 524/2013, la Comisión Europea facilita una plataforma de resolución de litigios en línea, la cual se encuentra disponible en el siguiente enlace: <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://ec.europa.eu/consumers/odr/</a>. Para otras regiones, nos sometemos a los tribunales del domicilio del consumidor.
          </p>
        </div>
      </main>
    </>
  );
}
