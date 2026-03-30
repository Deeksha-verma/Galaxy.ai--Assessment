"use client";

import { useState } from 'react';

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-[80px]">
      <div className="mb-12 flex flex-col items-center">
        <h2 className="mb-8 text-[12px] font-bold uppercase tracking-[0.06em] text-white/40">Pricing</h2>
        
        <div className="inline-flex h-[52px] items-center rounded-full border border-white/10 bg-white/5 p-1">
          <button 
            className={`flex h-full items-center justify-center rounded-full px-6 text-[14px] font-medium transition-colors ${!yearly ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>
          <button 
            className={`flex h-full items-center justify-center rounded-full px-6 text-[14px] font-medium transition-colors ${yearly ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            onClick={() => setYearly(true)}
          >
            Yearly <span className={`ml-2 text-[12px] font-bold ${yearly ? 'text-black/60' : 'text-white/40'}`}>-20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Free Plan */}
        <div className="flex min-h-[400px] flex-col rounded-[2.5rem] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
          <h3 className="mb-1 text-[16px] font-bold text-white/80">Free</h3>
          <div className="mb-1 text-5xl font-bold tracking-tight text-white">$0</div>
          <div className="mb-6 text-[13px] text-white/40">100 units/day</div>
          <ul className="mb-auto space-y-3 text-[14px] text-white/60">
            <li>Realtime models</li>
            <li>Basic features</li>
          </ul>
          <button className="mt-8 w-full rounded-full border border-white/20 bg-white/5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white hover:text-black">
            Start Free
          </button>
        </div>

        {/* Basic Plan */}
        <div className="flex min-h-[400px] flex-col rounded-[2.5rem] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
          <h3 className="mb-1 text-[16px] font-bold text-white/80">Basic</h3>
          <div className="mb-1 text-5xl font-bold tracking-tight text-white">${yearly ? '7' : '9'}</div>
          <div className="mb-6 text-[13px] text-white/40">5,000 units/mo</div>
          <ul className="mb-auto space-y-3 text-[14px] text-white/60">
            <li>Commercial license</li>
            <li>4K upscaling</li>
          </ul>
          <button className="mt-8 w-full rounded-full border border-white/20 bg-white/5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white hover:text-black">
            Get Basic
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative flex min-h-[400px] flex-col rounded-[2.5rem] border border-white/30 bg-white/10 p-8 shadow-2xl">
          <h3 className="mb-1 text-[16px] font-bold text-white">Pro <span className="ml-1 text-[10px] uppercase tracking-widest text-white/60">★ Popular</span></h3>
          <div className="mb-1 text-5xl font-bold tracking-tight text-white">${yearly ? '28' : '35'}</div>
          <div className="mb-6 text-[13px] text-white/40">20,000 units/mo</div>
          <ul className="mb-auto space-y-3 text-[14px] text-white/80">
            <li>All video models</li>
            <li>8K upscaling</li>
          </ul>
          <button className="mt-8 w-full rounded-full bg-white py-3 text-[14px] font-medium text-black transition-transform hover:scale-105">
            Get Pro
          </button>
        </div>

        {/* Max Plan */}
        <div className="flex min-h-[400px] flex-col rounded-[2.5rem] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
          <h3 className="mb-1 text-[16px] font-bold text-white/80">Max</h3>
          <div className="mb-1 text-5xl font-bold tracking-tight text-white">${yearly ? '84' : '105'}</div>
          <div className="mb-6 text-[13px] text-white/40">60,000 units/mo</div>
          <ul className="mb-auto space-y-3 text-[14px] text-white/60">
            <li>Unlimited LoRA</li>
            <li>22K upscaling</li>
          </ul>
          <button className="mt-8 w-full rounded-full border border-white/20 bg-white/5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white hover:text-black">
            Get Max
          </button>
        </div>
      </div>
    </section>
  );
}
