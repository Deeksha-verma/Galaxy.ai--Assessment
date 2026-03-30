"use client";

import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';

export function InvestorsBlock() {
   const { elementRef, revealClass } = useReveal();

   return (
      <section
         ref={elementRef}
         className={`w-full py-32 bg-white flex flex-col items-center reveal-on-scroll ${revealClass}`}
      >
         <div className="mx-auto w-full max-w-[1240px] px-6 flex flex-col items-center">

            <div className="w-full text-center md:text-left mb-16">
               <h4 className="text-[12px] font-bold text-[#8a8a8a] uppercase tracking-[0.25em] mb-4">Our Investors</h4>
               <h2 className="text-[36px] md:text-[52px] font-bold tracking-tight text-black leading-[1.05] max-w-3xl mx-auto md:mx-0">
                  We are backed by world-class venture firms. And we are hiring.
               </h2>
            </div>

            {/* Logos Matrix - More polished grid */}
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 items-center mb-20 opacity-60 hover:opacity-100 transition-opacity duration-700">
               <div className="flex justify-center transition-all hover:scale-105">
                  <div className="text-[14px] font-black uppercase tracking-tighter leading-tight text-center md:text-left">ANDREESSEN<br />HOROWITZ</div>
               </div>
               <div className="flex justify-center transition-all hover:scale-105">
                  <div className="text-[24px] font-black text-blue-600 tracking-tight">BCV</div>
               </div>
               <div className="flex justify-center transition-all hover:scale-105">
                  <div className="text-[22px] font-black flex items-center gap-1">
                     <span className="text-red-500 text-[18px]">▼</span> GRADIENT
                  </div>
               </div>
               <div className="flex justify-center transition-all hover:scale-105">
                  <div className="text-[20px] font-semibold tracking-tight">|:| Pebblebed</div>
               </div>
               <div className="flex justify-center transition-all hover:scale-105">
                  <div className="flex items-center gap-2 text-[22px] font-bold">
                     <div className="size-7 rounded-full bg-gradient-to-tr from-black to-gray-400" /> HF0
                  </div>
               </div>
               <div className="flex justify-center transition-all hover:scale-105">
                  <div className="text-[24px] font-bold font-serif italic">Abstract.</div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link href="/sign-up" className="text-[15px] font-bold text-black border border-black rounded-full px-8 py-3.5">
                  Sign up for free
               </Link>
               <Link href="/careers" className="bg-black text-white px-10 py-4 rounded-full text-[15px] font-bold hover:bg-[#222] transition-all shadow-xl hover:shadow-2xl active:scale-95">
                  Browse job listings
               </Link>
            </div>

         </div>
      </section>
   );
}
