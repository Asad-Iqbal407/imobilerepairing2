import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/db'
import SiteSetting from '@/models/SiteSetting'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const size = {
  width: 180,
  height: 180,
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
          borderRadius: '32px',
        }}
      >
        {logoDataUri && logoDataUri.startsWith('data:image/') ? (
          <img
            src={logoDataUri}
            width={180}
            height={180}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '32px',
              background: 'linear-gradient(to top right, #2563eb, #3b82f6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '52px',
              letterSpacing: '-2px',
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
