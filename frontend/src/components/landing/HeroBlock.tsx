import Link from 'next/link';

export function HeroBlock() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center px-6 pb-[40px] pt-[80px] text-center md:pt-[120px]">
      <h1 className="mb-6 max-w-5xl text-[40px] font-semibold leading-[1] tracking-[-0.03em] text-white sm:text-[64px] md:text-[60px]">
        NextFlow.ai is the world's most <br className="hidden md:block" />powerful creative AI suite.
      </h1>

      <p className="mx-auto mb-10 max-w-2xl text-[18px] text-white/80 md:text-[20px]">
        Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
      </p>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4">
        <Link href="/sign-up" className="inline-flex whitespace-nowrap flex-shrink-0 items-center justify-center rounded-full bg-white px-8 py-3.5 text-[15px] font-medium text-black transition-transform hover:scale-105">
          Start for free
        </Link>
        <Link href="/workflow" className="inline-flex whitespace-nowrap flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#1c1c1c] px-8 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#2c2c2c]">
          Launch App
        </Link>
      </div>
    </section>
  );
}
