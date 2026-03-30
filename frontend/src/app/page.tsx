"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/Spinner";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroBlock } from "@/components/landing/HeroBlock";
import { MarqueeStrip } from "@/components/landing/MarqueeStrip";
import { FeatureBentoGrid } from "@/components/landing/FeatureBentoGrid";
import { UseCasesBlock } from "@/components/landing/UseCasesBlock";
import { ProprietaryModelsBlock } from "@/components/landing/ProprietaryModelsBlock";
import { InvestorsBlock } from "@/components/landing/InvestorsBlock";
import { Footer } from "@/components/landing/Footer";

const MODELS = ["Runway", "Luma", "Flux", "Gemini", "NextFlow 1", "Veo 3.1", "Ideogram"];
const BRANDS = ["Lego", "Samsung", "Nike", "Microsoft", "Shopify", "Adidas", "Apple", "Google"];

export default function HomePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/workflow");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-canvas)",
        }}
      >
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">

      {/* Dark Theme Header Section */}
      <div className="relative flex flex-col items-center justify-start bg-[#0c0c0c] pb-[120px] text-white">
        {/* Ambient Glow matching Hero screenshots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[100%] bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/80 to-transparent mix-blend-multiply" />

        <div className="relative z-10 w-full mb-4">
          <LandingNavbar />
          <HeroBlock />
        </div>

        {/* The Dashboard Mockup Image Layer - Inserted organically below the CTA */}
        <div className="relative z-30 mx-auto w-full max-w-5xl px-6 outline-none mt-10">
          <div className="relative w-full overflow-hidden rounded-t-[2.5rem] bg-[#050505] p-2 shadow-2xl shadow-black/80 ring-1 ring-white/10 backdrop-blur-md md:p-3 pb-0">
            {/* Inner Dashboard macOS-like Window */}
            <div className="relative flex h-[300px] w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#0c0c0c] md:h-[400px]">

              {/* Embedded gradient image replacement */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/20 via-orange-500/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/50 to-transparent" />

              {/* Mockup Window Header */}
              <div className="relative z-10 flex h-14 w-full items-center gap-2 border-b border-white/5 bg-black/40 px-6 backdrop-blur-md">
                <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-sm" />
              </div>

              {/* Mockup App Interface Payload */}
              <div className="relative z-10 flex flex-1 items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-black/40 px-[60px] py-[40px] shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
                  <span className="text-[18px] font-medium tracking-tight text-white/90 md:text-[24px]">Let's create something</span>
                  <div className="h-10 w-[200px] rounded-full border border-white/10 bg-white/5 md:w-[300px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light Theme Body Section */}
      <main className="relative z-20 flex min-h-screen w-full flex-col items-center rounded-t-[2.5rem] bg-white text-black shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:rounded-t-[3.5rem]">

        {/* Model Marquee Space */}
        <div className="flex w-full flex-col items-center overflow-hidden pb-[60px] pt-[80px] md:pb-[80px] md:pt-[120px]">
          <div className="w-full max-w-[1240px] px-6">
            <h2 className="mb-12 text-[42px] font-bold leading-[1.05] tracking-tight text-black sm:text-[56px] md:text-[68px]">
              The industry's best AI models. <br className="hidden md:block" />In one subscription.
            </h2>
            <MarqueeStrip items={MODELS} opacity={0.6} />
          </div>
        </div>

        {/* Feature Bento grid spacer */}
        <div className="flex w-full justify-center py-[40px]">
          <FeatureBentoGrid />
        </div>

        {/* Interactive Use Cases block with animations */}
        <UseCasesBlock />

        {/* NextFlow Proprietary Models Showcase */}
        <ProprietaryModelsBlock />

        {/* Investors and Hiring CTA Block */}
        <InvestorsBlock />

        {/* Dense Footer */}
        <Footer />
      </main>
    </div>
  );
}
