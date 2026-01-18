import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/db'
import SiteSetting from '@/models/SiteSetting'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default async function Icon() {
  let logoDataUri = ''
  try {
    await dbConnect()
    const setting = await SiteSetting.findOne({ key: 'site' }).lean()
    logoDataUri = typeof setting?.logoDataUri === 'string' ? setting.logoDataUri : ''
  } catch {
    logoDataUri = ''
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: logoDataUri && logoDataUri.startsWith('data:image/') ? 'transparent' : '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: logoDataUri && logoDataUri.startsWith('data:image/') ? '0' : '8px',
        }}
      >
        {logoDataUri && logoDataUri.startsWith('data:image/') ? (
          <img
            src={logoDataUri}
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(to top right, #2563eb, #3b82f6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              letterSpacing: '-0.5px',
            }}
          >
            TI
          </div>
        )}
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  )
}
