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

export const formatPriceByLanguage = (price: number, language: SupportedLanguage): string => {
  let locale = 'en-IE'; // Use Ireland for English Euro formatting
  if (language === 'pt') locale = 'pt-PT';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(price);
};

export const formatPriceByCurrency = (value: number, _currency?: SupportedCurrency): string => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

export const formatPriceAdmin = (price: number): string => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price);
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
  if (combined.includes('watch') || combined.includes('relógio')) return '⌚';
  if (combined.includes('laptop') || combined.includes('portátil') || combined.includes('computer')) return '💻';
  if (combined.includes('tablet') || combined.includes('ipad')) return '📟';
  
  return '🔧';
};

// Translation cache to prevent redundant API calls
const translationCache: Record<string, string> = {};

/**
 * Dynamically translates text.
 * 1) Tries internal /api/translate (RapidAPI).
 * 2) If that fails, falls back to Google Translate endpoint.
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text) return text;

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

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
        translationCache[cacheKey] = data.translated;
        return data.translated;
      }
    } else {
      // Don't warn for rate limits, we have a fallback
      if (response.status !== 429) {
        console.warn('Client translate error status:', response.status);
      }
    }
  } catch (error) {
    // Only warn if not a connection/abort error
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.warn('Client translate error, will fallback to Google:', error);
    }
  }

  // 2. Fallback to Google Translate (free/unofficial)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${apiTarget}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translated = data[0].map((item: any) => item[0]).join('');
      translationCache[cacheKey] = translated;
      return translated;
    }
    return text;
  } catch (error) {
    // Silently return original text if even fallback fails
    return text;
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
