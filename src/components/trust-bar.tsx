// Mini escenas con luz y profundidad. Las animaciones viven en globals.css y se apagan con "reducir movimiento".
// Los ids de los degradados se repiten en cada copia del carrusel: son idénticos, así que da igual cuál use el navegador.

function FlagScene() {
  const slices = 22;
  return (
    <div className="relative flex items-start pt-2" aria-hidden="true">
      <div className="absolute left-6 top-3 h-10 w-16 rounded-full bg-[#FCD116]/20 blur-xl" />
      <div className="relative flex flex-col items-center">
        <span className="h-2 w-2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff6d0,#d4af37_45%,#7a5e17)] shadow-[0_0_8px_rgba(233,207,122,0.8)]" />
        <span className="h-12 w-[2.5px] rounded-full bg-gradient-to-r from-[#7a5e17] via-[#f5dc8c] to-[#7a5e17]" />
      </div>
      <div className="relative mt-1 flex drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]">
        {Array.from({ length: slices }, (_, i) => (
          <span
            key={i}
            className="trust-flag-slice block h-9 w-[2.5px]"
            style={{
              animationDelay: `${-i * 0.07}s`,
              background: "linear-gradient(#FCD116 0 50%, #003893 50% 75%, #CE1126 75%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TruckScene() {
  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-b from-[#1a2420] to-[#0a0f0d]" />
      <div className="trust-road absolute bottom-2 inset-x-0 h-[1.5px]" />
      <div className="trust-truck absolute bottom-[9px] left-0">
        <svg viewBox="0 0 90 40" className="trust-truck-body h-9 w-[81px] overflow-visible">
          <defs>
            <linearGradient id="trust-beam-g" x1="0" x2="1">
              <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="trust-box-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a9877" />
              <stop offset="1" stopColor="#0c3a2d" />
            </linearGradient>
            <linearGradient id="trust-cab-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f5dc8c" />
              <stop offset="1" stopColor="#8a6d1f" />
            </linearGradient>
          </defs>
          <polygon className="trust-beam" points="62,22 92,14 92,34" fill="url(#trust-beam-g)" />
          {[10, 18, 26].map((y, i) => (
            <rect key={y} className="trust-streak" style={{ animationDelay: `${i * 0.3}s` }} x="-6" y={y} width="12" height="0.8" rx="0.4" fill="#e9cf7a" />
          ))}
          <rect x="4" y="6" width="40" height="22" rx="2" fill="url(#trust-box-g)" />
          <rect x="4" y="6" width="40" height="3" rx="1.5" fill="#fff" opacity="0.18" />
          <rect x="4" y="21" width="40" height="1.5" fill="#d4af37" />
          <path d="M46 12h9l6 7v9H46z" fill="url(#trust-cab-g)" />
          <path d="M49 14h5.5l4 5H49z" fill="#0b1410" opacity="0.85" />
          <circle cx="60.5" cy="24" r="1.4" fill="#fff8dc" />
          <rect x="2" y="28" width="60" height="2" rx="1" fill="#05080a" />
          {[14, 34, 54].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="31" r="4.5" fill="#05080a" />
              <g className="trust-wheel">
                <circle cx={cx} cy="31" r="2.6" fill="none" stroke="#b8912b" strokeWidth="0.9" />
                <path d={`M${cx - 2.6} 31h5.2M${cx} 28.4v5.2`} stroke="#e9cf7a" strokeWidth="0.7" />
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function PayScene() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="absolute h-10 w-16 rounded-full bg-[#d4af37]/25 blur-xl" />
      <div className="trust-card3d relative h-9 w-14 overflow-hidden rounded-md bg-[linear-gradient(135deg,#f8e6a0_0%,#c9a23a_35%,#8a6d1f_60%,#e9cf7a_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.6)] ring-1 ring-white/30">
        <span className="absolute left-2 top-2.5 h-2.5 w-3.5 rounded-[2px] bg-[linear-gradient(135deg,#fff3c4,#a8862a)] ring-1 ring-black/20" />
        <span className="absolute left-2 bottom-2 h-[2px] w-8 rounded bg-black/30" />
        <span className="trust-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      </div>
      <svg viewBox="0 0 24 28" className="absolute right-1 bottom-0.5 h-7 w-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]">
        <defs>
          <linearGradient id="trust-shield-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a9877" />
            <stop offset="1" stopColor="#0c3a2d" />
          </linearGradient>
        </defs>
        <circle className="trust-glow" cx="12" cy="14" r="11" fill="#4ade80" opacity="0.35" />
        <path d="M12 2l9 3.5v7c0 6-4 10-9 12.5C7 22.5 3 18.5 3 12.5v-7z" fill="url(#trust-shield-g)" stroke="#e9cf7a" strokeWidth="1" />
        <path className="trust-check" d="M7.5 13.5l3 3 6-6" fill="none" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const JERSEY = "M8 3L3.5 5.5 1 10l3.5 2.5L6 11v11h12V11l1.5 1.5L23 10l-2.5-4.5L16 3c-1 2-2.4 3-4 3s-3-1-4-3z";

function ClubScene() {
  return (
    <div className="relative flex h-full w-full items-end justify-center pb-1.5" aria-hidden="true">
      <div className="trust-spot absolute top-0 h-full w-20 bg-[radial-gradient(ellipse_at_top,rgba(255,243,196,0.35),transparent_70%)]" />
      <svg viewBox="0 0 72 34" className="relative h-10 w-[84px] overflow-visible">
        <defs>
          <linearGradient id="trust-jersey-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a9877" />
            <stop offset="1" stopColor="#0a3328" />
          </linearGradient>
        </defs>
        <ellipse cx="36" cy="32" rx="30" ry="2" fill="#000" opacity="0.5" />
        {[
          { x: 2, s: 0.95, d: 0 },
          { x: 46, s: 0.95, d: 0.5 },
          { x: 21, s: 1.25, d: 0.25 },
        ].map(({ x, s, d }) => (
          <g key={x} transform={`translate(${x} ${s > 1 ? 1 : 8}) scale(${s})`}>
            <g className="trust-reveal" style={{ animationDelay: `${d}s` }}>
              <path d={JERSEY} fill="url(#trust-jersey-g)" stroke="#d4af37" strokeWidth="0.8" strokeLinejoin="round" />
              <path d="M8 3c1 2 2.4 3 4 3s3-1 4-3" fill="none" stroke="#e9cf7a" strokeWidth="1.2" />
              <path d="M6 15h12" stroke="#d4af37" strokeWidth="0.8" opacity="0.7" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Solo promesas que el negocio ya cumple (ver /legal/shipping y el pago con Wompi): nada inventado
const TRUST = [
  { Scene: FlagScene, title: "Hecho en Colombia", text: "Confección nacional, pieza por pieza" },
  { Scene: TruckScene, title: "Envíos a toda Colombia", text: "Por transportadora, con guía de rastreo" },
  { Scene: PayScene, title: "Pago seguro", text: "En línea con Wompi o transferencia" },
  { Scene: ClubScene, title: "Pedidos para tu club", text: "Cotiza por cantidad y en lote" },
];

function Item({ Scene, title, text, copy }: (typeof TRUST)[number] & { copy: boolean }) {
  return (
    <li data-copy={copy || undefined} aria-hidden={copy || undefined} className="mx-3 flex w-[330px] shrink-0 items-center gap-4">
      {/* Cuadro de cine: fondo oscuro con viñeta en ambos temas para que la luz de la escena luzca */}
      <div className="relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_center,#13241d_0%,#070d0a_75%)] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_24px_-12px_rgba(0,0,0,0.6)] ring-1 ring-[#d4af37]/20">
        <Scene />
        <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent" />
      </div>
      <div className="min-w-0 font-sans leading-tight">
        <p className="text-sm md:text-[15px] font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-1 text-xs text-[var(--muted)] leading-snug">{text}</p>
      </div>
    </li>
  );
}

/** Zona de confianza: carrusel infinito sin marco (se pausa al pasar el mouse). */
export function TrustBar() {
  return (
    <section aria-label="Por qué comprar con nosotros" className="container mx-auto px-4 pt-6 relative z-20">
      <div className="trust-marquee relative overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {/* 4 vueltas (2 por mitad, más anchas que una pantalla grande): al llegar a -50% vuelve al inicio sin salto. Solo la primera la leen los lectores de pantalla */}
        <ul className="trust-track flex w-max">
          {[0, 1, 2, 3].flatMap((round) => TRUST.map((t) => <Item key={`${round}-${t.title}`} {...t} copy={round > 0} />))}
        </ul>
      </div>
    </section>
  );
}
