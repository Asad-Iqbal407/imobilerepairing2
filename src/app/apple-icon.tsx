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

  if (!logoDataUri) {
    logoDataUri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6kZ6P-mf5e-FrkXf0ziW6U4uffKgKJfRyPQ&s'
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '32px',
        }}
      >
        <img
          src={logoDataUri}
          alt="Apple Icon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '32px',
          }}
        />
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
