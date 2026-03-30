import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextFlow: AI Creative Suite for Images, Video & 3D",
  description: "Generate, edit, and enhance images, videos, and 3D assets with NextFlow's creative AI suite. Start for free with real-time tools, powerful models, and collaborative workflows.",
  openGraph: {
    title: "NextFlow: AI Creative Suite for Images, Video & 3D",
    description: "Generate, edit, and enhance images, videos, and 3D assets with NextFlow's creative AI suite.",
    url: "https://www.NextFlow.ai",
    siteName: "NextFlow.ai Component",
    images: [
      {
        url: "https://www.NextFlow.ai/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NextFlow AI Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextFlow: AI Creative Suite for Images, Video & 3D",
    description: "Generate, edit, and enhance images, videos, and 3D assets.",
    creator: "@NextFlow_ai",
  },
  keywords: ["AI", "Generative AI", "Image Generation", "Video Generation", "Upscaling", "3D Generation", "NextFlow", "Creative Suite"],
  authors: [{ name: "NextFlow Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
