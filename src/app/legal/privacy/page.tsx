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
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Política de Tratamiento de Datos Personales</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert text-[var(--muted)] space-y-6">
          {/* Quitar este aviso cuando un abogado haya revisado el texto */}
          <p className="rounded-md border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Borrador pendiente de revisión legal:</strong> este texto debe ser revisado por un abogado antes de publicarse.
          </p>
          <p>Última actualización: Octubre 2026</p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">1. Responsable del Tratamiento</h2>
          <p>
            Esperanza Laguna Casa de Modas, NIT 33283538-4, con domicilio en la Calle 32B 85-24, Medellín (Antioquia), teléfono 3215028653 y correo cdmodaslaguna@gmail.com, es la responsable del tratamiento de los datos personales que se recogen en este sitio web, en la tienda y por WhatsApp. Esta política se expide en cumplimiento de la Ley 1581 de 2012 y del Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015).
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">2. Autorización</h2>
          <p>
            Tratamos sus datos personales solo con su autorización previa, expresa e informada, que usted otorga al registrarse, al hacer un pedido o al escribirnos por nuestros canales. Puede revocarla en cualquier momento por los medios indicados en el numeral 7, salvo cuando exista un deber legal o contractual de conservar la información.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">3. Datos que Recopilamos</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Datos de identificación y contacto:</strong> nombre, correo electrónico, teléfono, número de WhatsApp y dirección de entrega.</li>
            <li><strong>Datos para la confección:</strong> tallas, medidas, nombre del club, unión o asociación y los nombres que se bordan o estampan en las prendas.</li>
            <li><strong>Datos de pago:</strong> los pagos con tarjeta o PSE los procesa Wompi; nosotros no almacenamos números de tarjeta. Si paga por transferencia, guardamos el comprobante que nos envíe.</li>
            <li><strong>Datos de navegación:</strong> dirección IP y tipo de navegador, necesarios para la seguridad del sitio.</li>
          </ul>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">4. Datos Sensibles y de Niños, Niñas y Adolescentes</h2>
          <p>
            Algunos uniformes llevan el tipo de sangre (RH), que es un dato sensible relacionado con la salud. Entregarlo es facultativo: usted no está obligado a suministrarlo y el pedido puede hacerse sin él. Muchos de los miembros de los clubes son menores de edad; sus datos solo se reciben de sus padres, representantes legales o del líder del club autorizado por ellos, y se usan únicamente para confeccionar y entregar las prendas, respetando el interés superior del menor.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">5. Finalidades del Tratamiento</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Cotizar, confeccionar, cobrar y entregar sus pedidos.</li>
            <li>Crear y administrar su cuenta, incluido el inicio de sesión con Google.</li>
            <li>Informarle el estado de su pedido por correo, WhatsApp o notificaciones.</li>
            <li>Atender peticiones, quejas, reclamos y solicitudes de garantía o retracto.</li>
            <li>Cumplir obligaciones contables, tributarias y legales.</li>
          </ul>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">6. Encargados y Transmisión de Datos</h2>
          <p>
            No vendemos ni alquilamos sus datos. Los compartimos solo en la medida necesaria con proveedores que nos prestan servicios: la pasarela de pagos (Wompi), las transportadoras y plataformas de domicilios, y los proveedores tecnológicos de alojamiento, correo, mensajería y almacenamiento de imágenes. Algunos de estos proveedores tienen sus servidores fuera de Colombia; en esos casos la transmisión se hace bajo las condiciones que exige la Ley 1581 de 2012.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">7. Derechos del Titular y Cómo Ejercerlos</h2>
          <p>Como titular de los datos, usted tiene derecho a:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Conocer, actualizar y rectificar sus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
            <li>Revocar la autorización y pedir la supresión de sus datos cuando no exista un deber legal o contractual de conservarlos.</li>
            <li>Acceder gratuitamente a sus datos.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio, después de haber agotado el trámite ante nosotros.</li>
          </ul>
          <p>
            Puede ejercer estos derechos escribiendo a cdmodaslaguna@gmail.com, por el formulario de PQRS en nuestra página de <Link href="/contact" className="text-primary hover:underline">contacto</Link> o en la Calle 32B 85-24, Medellín. Las consultas se responden en un máximo de diez (10) días hábiles y los reclamos en un máximo de quince (15) días hábiles, prorrogables en los términos de la ley.
          </p>

          <h2 className="text-xl font-medium text-[var(--foreground)] mt-8">8. Vigencia</h2>
          <p>
            Esta política rige desde su publicación. Conservamos los datos mientras sean necesarios para las finalidades descritas y para cumplir nuestras obligaciones legales. Cualquier cambio sustancial se le informará por los canales habituales.
          </p>
        </div>
      </main>
    </>
  );
}
