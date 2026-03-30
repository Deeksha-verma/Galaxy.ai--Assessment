import Link from 'next/link';
import { Book } from 'lucide-react';

const FOOTER_LINKS = {
  NextFlow: [
    { label: "Log In", href: "/sign-in" },
    { label: "Pricing", href: "/pricing" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Gallery", href: "/gallery" },
  ],
  Products: [
    { label: "Image Generator", href: "/" },
    { label: "Video Generator", href: "/" },
    { label: "Enhancer", href: "/" },
    { label: "Realtime", href: "/" },
    { label: "Edit", href: "/" },
  ],
  Resources: [
    { label: "Pricing", href: "/pricing" },
    { label: "Careers", href: "/careers" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "API", href: "/api" },
    { label: "Documentation", href: "/docs" },
  ],
  About: [
    { label: "Blog", href: "/blog" },
    { label: "Discord", href: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full bg-[#f4f4f5] pt-16 pb-8 text-[#222]">
      <div className="mx-auto w-full max-w-[1240px] px-6">

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="text-[13px] font-bold text-black">{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-semibold text-[#8a8a8a] hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 gap-4">
          <div className="text-[12px] font-semibold text-[#8a8a8a]">
            © {new Date().getFullYear()} NextFlow
          </div>

          <div className="flex items-center gap-4 text-[#8a8a8a]">
            <Link href="/" className="hover:text-black transition-colors">
              <Book className="w-4 h-4" />
            </Link>
            <Link href="/" className="hover:text-black transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </Link>
            <Link href="/" className="hover:text-black transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </Link>
            <Link href="/" className="hover:text-black transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
