"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface DynamicTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * A component that dynamically translates text based on the current language.
 * Useful for content from the database (Services, Products, etc.)
 */
export default function DynamicText({ text, className = '', as: Component = 'span' }: DynamicTextProps) {
  const { language, dt } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function translate() {
      setIsLoading(true);
      try {
        const result = await dt(text);
        if (isMounted) {
          setTranslatedText(result);
        }
      } catch (error) {
        // Silent error, use original text
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
  }, [text, language, dt]);

  return (
    <Component className={`${className} ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}>
      {translatedText}
    </Component>
  );
}
