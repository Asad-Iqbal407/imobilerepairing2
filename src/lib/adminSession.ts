import crypto from 'crypto';

type SessionPayload = {
  email: string;
  iat: number;
};

const base64UrlEncode = (input: Buffer | string) => {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const base64UrlDecodeToBuffer = (input: string) => {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64');
};

const sign = (payloadB64Url: string, secret: string) => {
  return base64UrlEncode(crypto.createHmac('sha256', secret).update(payloadB64Url).digest());
};

export const createAdminSessionToken = (email: string) => {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  if (!secret) return '';
  const payload: SessionPayload = { email, iat: Date.now() };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signatureB64 = sign(payloadB64, secret);
  return `${payloadB64}.${signatureB64}`;
};

export const verifyAdminSessionToken = (token: string | undefined | null) => {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  if (!secret) {
    console.log('Session: Missing secret');
    return null;
  }
  if (!token) {
    // No log here to avoid noise for unauthenticated requests
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    console.log('Session: Invalid token format');
    return null;
  }
  const [payloadB64, signatureB64] = parts;

  const expected = sign(payloadB64, secret);
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(signatureB64);
  
  if (expectedBuf.length !== providedBuf.length) {
    console.log('Session: Signature length mismatch');
    return null;
  }
  if (!crypto.timingSafeEqual(expectedBuf, providedBuf)) {
    console.log('Session: Signature mismatch');
    return null;
  }

  try {
    const payloadJson = base64UrlDecodeToBuffer(payloadB64).toString('utf8');
    const payload = JSON.parse(payloadJson) as Partial<SessionPayload>;
    if (!payload?.email || typeof payload.email !== 'string') {
      console.log('Session: Invalid email in payload');
      return null;
    }
    if (!payload?.iat || typeof payload.iat !== 'number') {
      console.log('Session: Invalid iat in payload');
      return null;
    }

    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.iat > maxAgeMs) {
      console.log('Session: Token expired');
      return null;
    }

    return { email: payload.email };
  } catch (err) {
    console.log('Session: Error during verification', err);
    return null;
  }
};

