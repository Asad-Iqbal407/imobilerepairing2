import { NextRequest, NextResponse } from 'next/server';

const base64UrlToUint8 = (input: string) => {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  const raw = atob(padded);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
};

const uint8ToBase64Url = (input: Uint8Array) => {
  let str = '';
  for (let i = 0; i < input.length; i++) str += String.fromCharCode(input[i]);
  const b64 = btoa(str);
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const verifyAdminSessionEdge = async (token: string | undefined | null) => {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  if (!secret || !token) {
    console.log('Middleware: Missing secret or token');
    return null;
  }
  const parts = token.split('.');
  if (parts.length !== 2) {
    console.log('Middleware: Invalid token format');
    return null;
  }
  const [payloadB64, signatureB64] = parts;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
    const expected = uint8ToBase64Url(new Uint8Array(signature));
    if (expected !== signatureB64) {
      console.log('Middleware: Signature mismatch', { expected, provided: signatureB64 });
      return null;
    }

    const payloadJson = new TextDecoder().decode(base64UrlToUint8(payloadB64));
    const payload = JSON.parse(payloadJson) as { email?: unknown; iat?: unknown };
    if (typeof payload.email !== 'string') {
      console.log('Middleware: Invalid email in payload');
      return null;
    }
    if (typeof payload.iat !== 'number') {
      console.log('Middleware: Invalid iat in payload');
      return null;
    }

    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.iat > maxAgeMs) {
      console.log('Middleware: Token expired');
      return null;
    }

    return { email: payload.email };
  } catch (err) {
    console.log('Middleware: Error during verification', err);
    return null;
  }
};

const isAdminApi = (pathname: string) => {
  if (pathname.startsWith('/api/orders')) return true;
  if (pathname.startsWith('/api/site-settings')) return true;
  if (pathname.startsWith('/api/posts')) return true;
  if (pathname.startsWith('/api/quotes')) return true;
  if (pathname.startsWith('/api/contact')) return true;
  if (pathname.startsWith('/api/products')) return true;
  if (pathname.startsWith('/api/services')) return true;
  if (pathname.startsWith('/api/categories')) return true;
  return false;
};

const isAdminApiRequest = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  if (!isAdminApi(pathname)) return false;

  const method = request.method.toUpperCase();
  if (pathname.startsWith('/api/orders')) return true;
  if (pathname.startsWith('/api/contact')) return method !== 'POST';
  if (pathname.startsWith('/api/quotes')) return method !== 'POST';
  if (pathname.startsWith('/api/site-settings')) return method !== 'GET';
  if (pathname.startsWith('/api/posts')) return method !== 'GET';
  if (pathname.startsWith('/api/products')) return method !== 'GET';
  if (pathname.startsWith('/api/services')) return method !== 'GET';
  if (pathname.startsWith('/api/categories')) return method !== 'GET';
  return true;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_session')?.value;
    const session = await verifyAdminSessionEdge(token);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isAdminApiRequest(request)) {
    const token = request.cookies.get('admin_session')?.value;
    const session = await verifyAdminSessionEdge(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};

