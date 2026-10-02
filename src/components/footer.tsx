"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-border bg-background py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-5 group">
            <img src="/logos/log1.png" alt="Logo" className="h-[90px] w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md" />
            <div className="flex flex-col justify-center">
              <img src="/logos/log2.png" alt="Logotipo" className="h-[60px] w-auto object-contain dark:hidden" />
              <img src="/logos/log3.png" alt="Logotipo" className="h-[60px] w-auto object-contain hidden dark:block" />
            </div>
          </Link>
          <p className="text-sm text-[var(--muted)] pr-4">
            Proveyendo uniformes oficiales y equipamiento para clubes de Conquistadores, Aventureros y Guías Mayores con calidad excepcional.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Navegación</h4>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
            <li><Link href="/track-order" className="hover:text-primary transition-colors">Rastrear Pedido</Link></li>
            <li><Link href="/quotes" className="hover:text-primary transition-colors">Cotizaciones</Link></li>
            <li><Link href="/admin" className="hover:text-primary transition-colors">Panel de Administrador</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Soporte y Ayuda</h4>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/contact" className="hover:text-primary transition-colors">Centro de Soporte / Contacto</Link></li>
            <li><Link href="/legal/shipping" className="hover:text-primary transition-colors">Política de Envíos</Link></li>
            <li><Link href="/legal/refunds" className="hover:text-primary transition-colors">Devoluciones y Reembolsos</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Legales y Privacidad</h4>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
            <li><Link href="/legal/terms" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
            <li><Link href="/legal/cookies" className="hover:text-primary transition-colors">Política de Cookies</Link></li>
            <li><Link href="/legal/legal-notice" className="hover:text-primary transition-colors">Aviso Legal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Síguenos</h4>
          <div className="flex space-x-4">
            <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border flex flex-col items-center gap-4 text-center text-xs text-[var(--muted)]">
        <p>&copy; 2026 Esperanza Laguna Casa de Modas. Diseñado para servir. Todos los derechos reservados.</p>
        <div className="flex items-center justify-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <span>Designed by</span>
          <img src="/logos/log4.png" alt="Designer Logo" className="h-6 w-auto object-contain" />
        </div>
      </div>
    </footer>
  );
}
