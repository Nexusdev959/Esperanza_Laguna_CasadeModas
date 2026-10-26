import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Tarjeta que WhatsApp (y cualquier red) muestra al pegar un enlace del sitio: así los mensajes wa.me llevan imagen
export const alt = 'Esperanza Laguna · Casa de Modas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const logo = (file: string) =>
  readFile(join(process.cwd(), 'public/logos', file), 'base64').then((b) => `data:image/png;base64,${b}`)

export default async function Image() {
  const [monogram, wordmark] = await Promise.all([logo('log1.png'), logo('log2.png')])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafaf9',
          border: '18px solid #292524',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <img src={monogram} height={230} />
          <img src={wordmark} height={190} />
        </div>
        <div style={{ marginTop: 48, fontSize: 30, letterSpacing: 8, color: '#78716c' }}>
          UNIFORMES · CONFECCIÓN A LA MEDIDA
        </div>
      </div>
    ),
    size
  )
}
