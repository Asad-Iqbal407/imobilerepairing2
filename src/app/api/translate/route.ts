import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, target } = body as { text?: string; texts?: string[]; target?: string };

    if ((!text && !texts) || !target) {
      return NextResponse.json({ error: 'Missing text(s) or target language' }, { status: 400 });
    }

    const rapidKey = process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    if (!rapidKey) {
      return NextResponse.json({ error: 'RapidAPI key not configured' }, { status: 500 });
    }

    const response = await fetch('https://ai-translate.p.rapidapi.com/translate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'ai-translate.p.rapidapi.com',
        'x-rapidapi-key': rapidKey,
      },
      body: JSON.stringify(
        texts && texts.length > 0
          ? {
              texts,
              tl: target,
              sl: 'auto',
            }
          : {
              texts: [text],
              tl: target,
              sl: 'auto',
            }
      ),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RapidAPI error:', response.status, errorText);
      return NextResponse.json(
        { error: 'RapidAPI translate failed', status: response.status },
        { status: 500 }
      );
    }

    const data = (await response.json()) as { texts?: string[] };
    const all = data?.texts ?? [];

    if (texts && texts.length > 0) {
      return NextResponse.json({ translations: all });
    }

    const translated = all[0] ?? text;
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Server translate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
