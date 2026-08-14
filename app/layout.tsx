import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const viewport: Viewport = {
  themeColor: "#FF6B2C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Adam Radi",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Laravel Developer",
    "IT Support Specialist",
    "Exocad CAD Designer",
    "Dental Technology",
    "Morocco Developer",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: "@adamradi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Remove extension-injected attributes before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  function clean(){
    try{
      var el = document.documentElement;
      Array.from(el.attributes).forEach(function(a){
        if(!['lang','class'].includes(a.name) && /(^crx|^crxlauncher|^extension)/i.test(a.name)){
          el.removeAttribute(a.name);
        }
      });
      Object.keys(el.dataset).forEach(function(k){
        if(/(^crx|^dpl)/i.test(k)){
          try{ delete el.dataset[k]; }catch(e){}
        }
      });
    }catch(e){}
  }
  clean();
  if(typeof window !== 'undefined'){
    window.addEventListener('DOMContentLoaded', clean, { once: true });
    var tries = 0; var id = setInterval(function(){ clean(); tries++; if(tries>6) clearInterval(id); }, 200);
  }
})();`,
          }}
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Adam Radi Portfolio",
              description:
                "Portfolio of Adam Radi, Full Stack Developer specializing in web development, IT support, and Exocad dental CAD design.",
              url: "https://adamradi.vercel.app",
              author: {
                "@type": "Person",
                name: "Adam Radi",
                description:
                  "Full stack developer specializing in web development, IT support, and Exocad dental CAD design.",
                image: "/images/avatar.jpg",
                jobTitle: "Full Stack Developer",
              },
              publisher: {
                "@type": "Organization",
                name: "Adam Radi",
                logo: {
                  "@type": "ImageObject",
                  url: "/images/logo.png",
                },
              },
            }),
          }}
        />
      </head>
      <body className={`${geist.variable} font-sans antialiased min-h-screen bg-background text-text`}>
        {children}
      </body>
    </html>
  );
}
