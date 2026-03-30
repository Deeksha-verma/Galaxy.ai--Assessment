"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export function PromptBar() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    router.push("/workflow");
  };

  return (
    <div className="relative z-10 mx-auto mb-16 w-full max-w-3xl px-6">
      <div className="flex flex-col rounded-[2rem] border border-white/10 bg-[#1a1a1a]/80 p-4 shadow-2xl backdrop-blur-2xl">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { 
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate(); 
            }
          }}
          placeholder='"Cinematic photo of a person... "'
          className="min-h-[60px] w-full resize-none bg-transparent text-[18px] text-white outline-none focus:ring-0 placeholder:text-white/30"
        />
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/15">
              <Sparkles className="h-3.5 w-3.5" />
              Enhance Prompt
            </button>
          </div>
          <button 
            onClick={handleGenerate}
            className="flex size-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
