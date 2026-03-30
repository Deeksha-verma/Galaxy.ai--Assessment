import Link from 'next/link';
import { MarqueeStrip } from './MarqueeStrip';

export function FooterCTA({ brands }: { brands: string[] }) {
  return (
    <footer className="w-full text-center">
      <div className="mx-auto max-w-5xl px-6">
        <h3 className="mb-4 text-[20px] font-medium tracking-tight text-black/50">A tool suite for pros and beginners alike</h3>
        <h2 className="mb-24 text-[32px] font-bold leading-tight tracking-tight text-black md:text-[40px]">NextFlow powers millions of creatives, enterprises, and everyday people.</h2>

        <MarqueeStrip items={brands} opacity={0.6} isBrands />

        <div className="mt-[100px] flex flex-col items-center justify-center gap-8 pb-10 sm:flex-row">
          <Link href="/sign-up" className="cursor-pointer text-[14px] font-medium text-black border border-black rounded-full px-8 py-3.5">
            Sign up for free
          </Link>
          <Link href="/enterprise" className="flex cursor-pointer items-center justify-center rounded-full bg-[#1c1c1c] px-8 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-black">
            Contact Sales
          </Link>
        </div>
      </div>
    </footer>
  );
}
