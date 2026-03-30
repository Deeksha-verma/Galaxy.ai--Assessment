"use client";

import { useEffect, useRef, useState } from 'react';

export function useReveal() {
  const elementRef = useRef<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const current = elementRef.current;
    if (!current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(current);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return { elementRef, isRevealed, revealClass: isRevealed ? 'revealed' : '' };
}
