"use client";

import { useState, useEffect, useRef } from 'react';
import { MousePointer2, Box, Sparkles } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const USE_CASES = [
  {
    id: 'video',
    title: 'AI Video Generation',
    description: 'Access all of the most powerful AI video models including Veo 3, Kling, Haiper, Gen 3, and Runway. Generate viral videos for social media, animate static images, or add new details to existing videos. NextFlow offers the world\'s most intuitive AI video generation interface.',
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: 'lora',
    title: 'LoRA Fine-tuning',
    description: 'Train your own model. Upload just a few images of the same face, product, or visual style and teach NextFlow to generate it on demand.',
    gradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    id: 'upscale',
    title: 'Video Upscaling',
    description: 'Upscale videos up to 8K and interpolate frames to 120fps. The NextFlow and Topaz Video upscalers can restore old videos, turn phone captures into professional footage, or make regular videos ultra-slow-mo.',
    gradient: 'from-green-500/20 to-teal-500/20'
  },
  {
    id: 'edit',
    title: 'Generative Editing',
    description: 'Choose from 10 editing models, including NextFlow Canvas, Flux Control, and Oms to edit images with generative AI. Add or remove objects, merge images, change expressions, or lighting in an exceptionally simple interface.',
    gradient: 'from-yellow-500/20 to-orange-500/20'
  }
];

export function UseCasesBlock() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { elementRef, revealClass } = useReveal();
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current || isManual) return;

      const rect = elementRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the component has scrolled through the viewport
      // percentage from 0 (top enters) to 1 (bottom leaves)
      const componentHeight = rect.height;
      const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + componentHeight);
      
      if (scrollProgress > 0 && scrollProgress < 1) {
        // Map progress (0 to 1) to index (0 to length-1) 
        // We use a slight offset and scale to make it feel centered
        const index = Math.floor(scrollProgress * USE_CASES.length);
        const clampedIndex = Math.max(0, Math.min(index, USE_CASES.length - 1));
        
        setActiveIndex(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef, isManual]);

  return (
    <section
      ref={elementRef}
      className={`w-full py-32 md:py-48 bg-white flex flex-col items-center reveal-on-scroll ${revealClass}`}
    >
      <div className="w-full max-w-[1240px] px-6">

        {/* Header */}
        <div className="mb-20 text-center md:text-left">
          <h4 className="text-[12px] font-bold text-[#8a8a8a] uppercase tracking-[0.2em] mb-10">Use cases</h4>
          <h2 className="text-[30px] md:text-[48px] font-bold tracking-tight text-black leading-[1.05] mx-auto md:mx-0">
            Generate or edit high quality images, videos, and 3D objects with AI
          </h2>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-center">

          {/* Left Tabs Column */}
          <div className="flex flex-col gap-8">
            {USE_CASES.map((useCase, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={useCase.id}
                  className={`group cursor-pointer transition-all duration-500 ease-in-out pl-6 border-l-2 ${isActive ? 'border-black' : 'border-black/5'} py-2 relative`}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsManual(true);
                    // Reset manual mode after some time to allow scroll again
                    setTimeout(() => setIsManual(false), 2000);
                  }}
                >
                  {/* Background highlight on hover */}
                  <div className="absolute inset-0 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-r-xl -ml-6" />

                  <h3 className={`text-[22px] font-bold tracking-tight transition-all duration-500 ${isActive ? 'text-black translate-x-1' : 'text-[#c8c8c8] hover:text-[#999]'}`}>
                    {useCase.title}
                  </h3>

                  <div
                    className={`grid transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                  >
                    <p className={`text-[14px] font-medium leading-relaxed text-[#666] overflow-hidden`}>
                      {useCase.description}
                    </p>
                  </div>

                  {/* Progress Bar for active tab */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-black transition-all duration-500" style={{ height: isActive ? '100%' : '0%' }} />
                </div>
              );
            })}
          </div>

          {/* Right Media Column */}
          <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-[#f8f8f8] overflow-hidden shadow-2xl transition-all duration-1000 group">
            {/* Noise Texture layer */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {USE_CASES.map((useCase, index) => (
              <div
                key={`media-${useCase.id}`}
                className={`absolute inset-0 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-center p-12 ${activeIndex === index ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-105 rotate-1 pointer-events-none'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-40`} />

                {/* Glassmorphic Mockup Container */}
                <div className="relative w-full h-full bg-white/[0.6] backdrop-blur-3xl rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center justify-center text-center p-8 transition-transform duration-700 group-hover:scale-[1.02]">
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/[0.02] to-transparent" />

                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="size-16 rounded-2xl bg-black/5 flex items-center justify-center mb-2">
                      {index === 0 && <Box className="w-8 h-8 text-black/20" />}
                      {index === 1 && <Sparkles className="w-8 h-8 text-black/20" />}
                    </div>
                    <h3 className="text-[28px] md:text-[36px] font-black tracking-tighter text-black leading-tight">
                      {useCase.title.split(' ')[0]}<br />
                      <span className="opacity-30">{useCase.title.split(' ').slice(1).join(' ')}</span>
                    </h3>
                  </div>

                  {index === 0 && (
                    <div className="absolute right-[15%] top-[25%] animate-pulse pointer-events-none transition-all duration-1000" style={{ transform: `translate(${activeIndex * 10}px, ${activeIndex * 5}px)` }}>
                      <MousePointer2 fill="black" stroke="white" className="w-14 h-14 drop-shadow-2xl" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
