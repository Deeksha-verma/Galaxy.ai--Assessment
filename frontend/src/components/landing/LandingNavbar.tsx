import Link from 'next/link';

export function LandingNavbar() {
  return (
    <nav className="relative z-[100] w-full bg-transparent">
      <div className="mx-auto flex h-[80px] w-full items-center justify-between px-6 pt-4">
        <div className="flex items-center gap-2">
          {/* White NextFlow Icon Matrix */}
          <div className="flex flex-col gap-[3px] pr-2">
            <div className="flex gap-[3px] justify-end">
              <div className="size-[6px] rounded-[1px] bg-white" />
              <div className="size-[6px] rounded-[1px] bg-white" />
            </div>
            <div className="flex gap-[3px] justify-end">
              <div className="size-[6px] rounded-[1px] bg-white/50" />
              <div className="size-[6px] rounded-[1px] bg-white" />
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-[14px] font-medium text-white/90 md:flex">
          <Link href="/" className="transition-opacity hover:opacity-70">App</Link>
          <div className="flex cursor-pointer items-center transition-opacity hover:opacity-70">Features <span className="ml-[2px] text-[10px] opacity-60">▼</span></div>
          <Link href="/" className="transition-opacity hover:opacity-70">Image Generator</Link>
          <Link href="/" className="transition-opacity hover:opacity-70">Video Generator</Link>
          <Link href="/" className="transition-opacity hover:opacity-70">Upscaler</Link>
          <Link href="/" className="transition-opacity hover:opacity-70">API</Link>
          <Link href="/" className="transition-opacity hover:opacity-70">Pricing</Link>
          <Link href="/" className="transition-opacity hover:opacity-70">Enterprise</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-up" className="rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-black transition-transform hover:scale-105">
            Sign up for free
          </Link>
          <Link href="/sign-in" className="rounded-full bg-white/10 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/20">
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}
