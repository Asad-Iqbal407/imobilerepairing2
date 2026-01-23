"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface DynamicHTMLProps {
  html: string;
  className?: string;
}

/**
 * A component that dynamically translates HTML content based on the current language.
 * Useful for rich text content from the database.
 */
export default function DynamicHTML({ html, className = '' }: DynamicHTMLProps) {
  const { language, dt } = useLanguage();
  const [translatedHTML, setTranslatedHTML] = useState(html);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function translate() {
      if (!html) {
        setTranslatedHTML(html);
        return;
      }

      setIsLoading(true);
      try {
        // The dt function (via translateText) might not perfectly preserve HTML 
        // but for simple blog tags it usually works okay with Google Translate.
        const result = await dt(html);
        if (isMounted) {
          setTranslatedHTML(result);
        }
      } catch (error) {
        // Silent error, use original HTML
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    translate();

    return () => {
      isMounted = false;
    };
  }, [html, language, dt]);

  return (
    <div 
      className={`${className} ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}
      dangerouslySetInnerHTML={{ __html: translatedHTML }}
    />
  );
}
