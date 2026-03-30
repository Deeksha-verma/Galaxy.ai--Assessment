"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

export function ProprietaryModelsBlock() {
  const { elementRef, revealClass } = useReveal();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const slides = [
    {
      title: "Dreamy, vivid, weird. Artistic and expressive rendering",
      gradient: "from-orange-600/40 to-indigo-900/40"
    },
    {
      title: "Hyper-realistic textures. Perfect skin and lighting",
      gradient: "from-emerald-600/40 to-slate-900/40"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev: number) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      ref={elementRef}
      className={`w-full py-32 bg-white flex flex-col items-center reveal-on-scroll ${revealClass}`}
    >
      <div className="mx-auto w-full max-w-[1240px] px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-12">
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-[12px] font-bold text-[#8a8a8a] mb-4 uppercase tracking-[0.25em]">Powerful proprietary models</h4>
            <h2 className="text-[36px] md:text-[52px] font-bold tracking-tight text-black leading-[1.05] max-w-xl mx-auto md:mx-0">
              NextFlow 1 - Our ultra-realistic image model
            </h2>
          </div>

          <div className="flex-1 text-center md:text-right">
            <p className="text-[15px] font-medium text-[#666] max-w-md md:ml-auto leading-relaxed">
              NextFlow 1 is our proprietary image model. Unlike traditional models, it offers accurate skin textures, dynamic camera angles, and expressive styles. Discover an exceptionally artistic latent space.
            </p>
          </div>
        </div>

        {/* Carousel Card with Auto-play transition */}
        <div className="relative w-full h-[450px] md:h-[600px] rounded-[3rem] bg-[#0c0c0c] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] group transition-all duration-700">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${activeSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} mix-blend-screen opacity-60`} />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

              {/* Gradient Overlay for Text Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Text Overlay */}
              <div className="absolute bottom-16 left-12 md:bottom-[80px] md:left-[80px] max-w-2xl">
                <div className="h-12 w-[3px] bg-white/20 rounded-full overflow-hidden mb-6 relative">
                  <div className="absolute inset-x-0 top-0 w-full bg-white rounded-full transition-all duration-[6000ms] linear" style={{ height: activeSlide === index ? '100%' : '0%' }} />
                </div>
                <h3 className="text-[28px] md:text-[44px] font-bold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
                  {slide.title.split('.').map((s, i) => (
                    <span key={i} className="block">{s}{i === 0 && slides.length > 1 ? '.' : ''}</span>
                  ))}
                </h3>
              </div>
            </div>
          ))}

          {/* Arrow Controls */}
          <div className="absolute bottom-16 right-12 md:bottom-[80px] md:right-[80px] flex items-center gap-4">
            <button
              onClick={() => setActiveSlide((prev: number) => (prev - 1 + slides.length) % slides.length)}
              className="flex items-center justify-center size-12 rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveSlide((prev: number) => (prev + 1) % slides.length)}
              className="flex items-center justify-center size-12 rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
