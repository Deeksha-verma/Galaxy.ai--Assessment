import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function UseCasesList() {
  const cases = [
    { title: "AI Image Generation", desc: "Create high-fidelity images from detailed text prompts with unprecedented control and speed." },
    { title: "Image Upscaling", desc: "Enhance image resolution up to 22K without losing details or introducing artifacts." },
    { title: "Real-time Rendering", desc: "Draw on the canvas and watch the AI bring your vision to life in real-time." },
    { title: "AI Video Generation", desc: "Turn text or static images into cohesive, cinematic video sequences." },
    { title: "LoRA Fine-tuning", desc: "Train custom models on your own visual datasets in minutes." },
    { title: "Generative Editing", desc: "Inpaint, outpaint, and modify specific elements of any image seamlessly." }
  ];

  return (
    <section className="mx-auto max-w-[800px] px-6 py-[80px]">
      <h2 className="mb-10 text-[32px] font-bold tracking-tight text-white">Everything you need to create.</h2>
      <div className="flex flex-col">
        {cases.map((useCase, idx) => (
          <div key={idx} className="group relative flex flex-col justify-center border-t border-white/10 py-8 transition-colors hover:bg-white/[0.03]">
            <Link href="/workflow" className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-[18px] font-bold text-white transition-colors group-hover:text-white/80">{useCase.title}</h3>
                <p className="max-w-[480px] text-[15px] leading-relaxed text-white/50">{useCase.desc}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white opacity-0 transition-all group-hover:bg-white group-hover:text-black group-hover:opacity-100">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        ))}
        <div className="border-t border-white/10" />
      </div>
    </section>
  );
}
