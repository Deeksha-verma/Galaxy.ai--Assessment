import { Mic, Box, Loader2, Sparkles, MoveRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

export function FeatureBentoGrid() {
   const { elementRef, revealClass } = useReveal();

   return (
      <section ref={elementRef} className={`w-full max-w-[1280px] px-6 reveal-on-scroll ${revealClass}`}>

         <div className="flex w-full flex-col gap-4">

            {/* ROW 1: 220px Height Lock */}
            <div className="grid grid-cols-12 gap-4 h-auto md:h-[220px]">
               {/* Inference Speed */}
               <div className="col-span-12 md:col-span-5 relative overflow-hidden rounded-2xl bg-[#080808] flex items-center justify-center">
                  {/* Speed Rays Background Faux */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0%,rgba(0,180,255,0.1)_5%,transparent_10%)] transform -skew-x-12 scale-150" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#080808_80%)]" />

                  <div className="relative z-10 text-center tracking-tight">
                     <div className="text-[28px] md:text-[32px] font-bold text-white leading-[1.05] drop-shadow-lg">Industry-leading<br />inference speed</div>
                  </div>
               </div>

               {/* 22K */}
               <div className="col-span-12 md:col-span-4 rounded-2xl bg-[#f4f4f5] border border-black/5 flex flex-col items-center justify-center py-6">
                  <div className="text-[60px] md:text-[80px] font-bold leading-none tracking-tighter text-[#2a2a2a] mb-2">22K</div>
                  <div className="text-sm font-semibold text-[#6a6a6a]">Pixels upscaling</div>
               </div>

               {/* Train */}
               <div className="col-span-12 md:col-span-3 rounded-2xl bg-[#f4f4f5] border border-black/5 flex flex-col items-center justify-center py-6">
                  <div className="text-[50px] md:text-[60px] font-bold leading-none tracking-tighter text-[#2a2a2a] mb-2">Train</div>
                  <div className="text-sm font-semibold text-[#6a6a6a]">Fine-tune models with your own data</div>
               </div>
            </div>


            {/* ROW 2: 380px Height Lock */}
            <div className="grid grid-cols-12 gap-4 h-auto md:h-[380px]">

               {/* Left Stack */}
               <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                  {/* 4K Eye Image */}
                  <div className="flex-1 rounded-2xl bg-[#111] relative overflow-hidden flex flex-col items-center justify-center shadow-inner pt-6 md:h-[200px]">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,100,0,0.2),transparent_70%)] opacity-80" />
                     <div className="relative z-10 text-center">
                        <div className="text-[50px] font-black text-white leading-none tracking-tighter drop-shadow-xl">4K</div>
                        <div className="text-xs font-medium text-white/90 drop-shadow-md">Native image generation</div>
                     </div>
                  </div>
                  {/* Minimalist UI */}
                  <div className="h-auto md:h-[164px] rounded-2xl bg-black relative overflow-hidden flex items-center justify-center py-8">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.1),transparent_50%)]" />
                     <div className="relative z-10 text-[24px] font-bold text-white">Minimalist UI</div>
                  </div>
               </div>

               {/* Center NextFlow 1 (Golden Warrior) */}
               <div className="col-span-12 md:col-span-6 rounded-2xl bg-[#0a1118] relative overflow-hidden flex flex-col justify-center items-center py-12">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,200,100,0.15),transparent_80%)] pointer-events-none" />
                  <div className="relative z-10 text-[70px] md:text-[100px] font-bold text-white tracking-tighter leading-none mb-10 drop-shadow-2xl">NextFlow 1</div>
                  <div className="absolute bottom-6 text-sm font-semibold text-white/90 z-10 text-center w-full">Ultra-realistic flagship model</div>
               </div>

               {/* Right Stack */}
               <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                  {/* Do not train */}
                  <div className="h-auto md:h-[120px] rounded-2xl bg-[#f4f4f5] border border-black/5 flex flex-col items-center justify-center py-6">
                     <div className="text-[20px] font-bold text-[#2a2a2a]">Do not train</div>
                     <div className="text-[10px] font-semibold text-[#6a6a6a]">Safely generate proprietary data</div>
                  </div>
                  {/* 64+ Models */}
                  <div className="flex-1 rounded-2xl bg-[#f4f4f5] border border-black/5 flex flex-col items-center justify-center py-8 md:h-[244px]">
                     <div className="text-[70px] md:text-[80px] font-bold text-[#2a2a2a] leading-none mb-2">64+</div>
                     <div className="text-sm font-bold text-[#222]">Models</div>
                  </div>
               </div>
            </div>


            {/* ROW 3: 240px Height Lock */}
            <div className="grid grid-cols-12 gap-4 h-auto md:h-[240px]">

               {/* Asset Manager */}
               <div className="col-span-12 md:col-span-2 rounded-2xl bg-[#e5e5e5] relative overflow-hidden p-4 py-8">
                  <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2 opacity-50">
                     {Array.from({ length: 40 }).map((_, i) => <div key={i} className="bg-black/20 rounded-sm w-full h-full" />)}
                  </div>
                  <div className="relative z-10 text-white text-[16px] font-bold leading-tight drop-shadow-md">Full-fledged asset<br />manager</div>
               </div>

               {/* Bleeding Edge (Clock) */}
               <div className="col-span-12 md:col-span-2 rounded-2xl bg-[#f4f4f5] border border-black/5 p-4 flex flex-col justify-between items-center py-6">
                  <div className="w-full text-left text-[14px] font-bold text-[#2a2a2a] mb-2">Bleeding Edge</div>
                  <div className="relative size-24 rounded-full border-[3px] border-black/10 bg-white flex items-center justify-center shadow-inner">
                     <div className="absolute w-1 h-10 bg-black rounded-full origin-bottom -translate-y-5 rotate-[45deg]" />
                     <div className="absolute w-1 h-8 bg-[#f5a623] rounded-full origin-bottom -translate-y-4 rotate-[120deg]" />
                     <div className="size-2 rounded-full bg-black z-10" />
                  </div>
                  <div className="text-[10px] font-semibold text-center text-[#6a6a6a] mt-4 leading-tight">Access the latest models directly<br />on release day</div>
               </div>

               {/* 1000+ Styles */}
               <div className="col-span-12 md:col-span-2 rounded-2xl bg-[#111] overflow-hidden p-4 flex flex-col relative py-6">
                  <div className="text-white text-[20px] font-bold leading-tight relative z-20">1000+<br />styles</div>
                  <div className="absolute -bottom-10 -right-4 w-[140%] h-[60%] flex gap-2 rotate-[-15deg] z-10">
                     <div className="w-1/2 h-full bg-orange-500 rounded-xl shadow-2xl" />
                     <div className="w-1/2 h-full bg-cyan-500 rounded-xl shadow-2xl" />
                  </div>
               </div>

               {/* Image Editor */}
               <div className="col-span-12 md:col-span-2 rounded-2xl bg-[#dcdcdc] overflow-hidden relative flex flex-col items-center justify-center py-8 border border-black/5">
                  {/* Dog / hands simulation */}
                  <div className="absolute inset-0 bg-[#e0d6cd] bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.4),transparent)] opacity-60 pointer-events-none" />
                  <div className="relative z-10 text-white text-[28px] font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] text-center">Image<br />Editor</div>
               </div>

               {/* Lipsync */}
               <div className="col-span-12 md:col-span-1 rounded-2xl bg-[#f4f4f5] border border-black/5 p-4 flex flex-col items-center justify-between py-6">
                  <div className="w-full text-left text-[12px] font-bold text-[#2a2a2a]">Lipsync</div>
                  <div className="flex gap-1.5 items-center justify-center h-full w-full">
                     <div className="h-4 w-[3px] bg-black rounded-full" />
                     <div className="h-8 w-[3px] bg-black rounded-full" />
                     <div className="h-12 w-[3px] bg-black rounded-full" />
                     <div className="h-16 w-[3px] bg-black rounded-full" />
                     <div className="h-6 w-[3px] bg-black rounded-full" />
                  </div>
               </div>

               {/* Realtime Canvas & Text to 3D Stack */}
               <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                  <div className="h-[100px] rounded-2xl bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden group border border-white/5">
                     <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(200,100,255,0.2),transparent)]" />
                     <div className="text-white text-[20px] font-bold z-10 drop-shadow-lg">Realtime Canvas</div>
                  </div>
                  <div className="h-[124px] rounded-2xl bg-[#f4f4f5] border border-black/5 flex flex-col items-center justify-center relative overflow-hidden">
                     <div className="text-[#2a2a2a] text-[16px] font-bold mb-4 z-10">Text to 3D</div>
                     <div className="size-10 bg-gradient-to-br from-white to-[#bbb] shadow-xl border border-black/10 transform -skew-y-12 rotate-45" />
                  </div>
               </div>
            </div>

         </div>
      </section>
   );
}
