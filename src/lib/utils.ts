import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SupportedLanguage = 'en' | 'pt';
export type SupportedCurrency = 'usd' | 'eur';

export const isValidUrl = (url: string) => {
  if (!url || typeof url !== 'string') return false;
  
  // Base64 images are valid
  if (url.startsWith('data:image')) return true;
  
  // Local uploads are valid
  if (url.startsWith('/uploads/') || url.startsWith('http://localhost') || url.startsWith('https://localhost')) return true;
  
  try {
    // If it's a relative path starting with /, assume it's valid
    if (url.startsWith('/')) return true;
    
    // Check if it's a valid absolute URL
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    // If it doesn't start with http/https but looks like a domain, try adding https
    if (url.includes('.') && !url.startsWith('http')) {
      try {
        new URL(`https://${url}`);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

export const getCurrencyForLanguage = (language: SupportedLanguage): SupportedCurrency =>
  language === 'pt' ? 'eur' : 'usd';

export const getUsdToEurRate = (): number => {
  const raw = process.env.NEXT_PUBLIC_USD_TO_EUR_RATE;
  const parsed = raw ? Number(raw) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return 0.92;
  return parsed;
};

export const convertPriceByLanguage = (priceUsd: number, language: SupportedLanguage): number => {
  if (!Number.isFinite(priceUsd)) return 0;
  if (language !== 'pt') return priceUsd;
  return priceUsd * getUsdToEurRate();
};

export const formatPriceByLanguage = (priceUsd: number, language: SupportedLanguage): string => {
  const currency = getCurrencyForLanguage(language);
  const value = convertPriceByLanguage(priceUsd, language);
  let locale = 'en-US';
  if (language === 'pt') locale = 'pt-PT';
  
  const currencyCode = currency === 'eur' ? 'EUR' : 'USD';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(value);
};

export const formatPriceByCurrency = (value: number, currency: SupportedCurrency): string => {
  const locale = currency === 'eur' ? 'pt-PT' : 'en-US';
  const currencyCode = currency === 'eur' ? 'EUR' : 'USD';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(value);
};

export const formatPriceAdmin = (priceUsd: number): string => {
  const rate = getUsdToEurRate();
  const value = priceUsd * rate;
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

export const getServiceEmoji = (title: string, description: string = '') => {
  const combined = (title + ' ' + description).toLowerCase();
  
  if (combined.includes('screen') || combined.includes('display') || combined.includes('tela') || combined.includes('visor')) return '📱';
  if (combined.includes('battery') || combined.includes('bateria') || combined.includes('power')) return '🔋';
  if (combined.includes('water') || combined.includes('liquid') || combined.includes('água') || combined.includes('líquido')) return '💧';
  if (combined.includes('charge') || combined.includes('port') || combined.includes('carreg') || combined.includes('porta')) return '🔌';
  if (combined.includes('camera') || combined.includes('lens') || combined.includes('câmera') || combined.includes('lente')) return '📸';
  if (combined.includes('speaker') || combined.includes('sound') || combined.includes('audio') || combined.includes('som') || combined.includes('falante')) return '🔊';
  if (combined.includes('button') || combined.includes('home') || combined.includes('power') || combined.includes('botão')) return '🔘';
  if (combined.includes('software') || combined.includes('unlock') || combined.includes('update') || combined.includes('desbloqueio')) return '💻';
  if (combined.includes('back') || combined.includes('glass') || combined.includes('traseira') || combined.includes('vidro')) return '📲';
  if (combined.includes('network') || combined.includes('signal') || combined.includes('wifi') || combined.includes('rede') || combined.includes('sinal')) return '📶';
  
  return '🔧';
};

/**
 * Dynamically translates text.
 * 1) Tries internal /api/translate (RapidAPI).
 * 2) If that fails, falls back to Google Translate endpoint.
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || targetLang === 'en') return text;

  // Ensure Portugal Portuguese instead of Brazilian
  const apiTarget = targetLang === 'pt' ? 'pt-PT' : targetLang;

  // 1. Try internal API (RapidAPI)
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ text, target: apiTarget }),
    });

    if (response.ok) {
      const data = (await response.json()) as { translated?: string };
      if (data.translated && typeof data.translated === 'string') {
        return data.translated;
      }
    } else {
      console.warn('Client translate error status:', response.status);
    }
  } catch (error) {
    console.warn('Client translate error, will fallback to Google:', error);
  }

  // 2. Fallback to Google Translate (free/unofficial)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${apiTarget}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0].map((item: any) => item[0]).join('');
    }
    return text;
  } catch (error) {
    console.error('Google Translate fallback error:', error);
    return text;
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
