import React from 'react';

export function MarqueeStrip({ 
  items, 
  opacity = 1.0,
  isBrands = false
}: { 
  items: string[], 
  opacity?: number,
  isBrands?: boolean
}) {
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];
  
  return (
    <div 
      className="w-full overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <div className={`flex w-max animate-marquee ${isBrands ? 'gap-[100px]' : 'gap-[80px]'} py-4`}>
        {duplicatedItems.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-3 whitespace-nowrap font-bold transition-opacity ${isBrands ? 'text-[28px] grayscale' : 'text-[26px] md:text-[32px]'}`}
            style={{ color: `rgba(0,0,0,${opacity})` }}
          >
            {/* Faux icon for non-brand items mapping the screenshot geometry */}
            {!isBrands && <div style={{ opacity: 0.2 }} className="h-6 w-6 rotate-45 rounded-[4px] bg-black" />}
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
