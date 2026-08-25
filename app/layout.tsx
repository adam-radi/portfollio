import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_CONFIG } from "@/lib/constants";
import { buildWebsiteSchema } from "@/lib/seo/structured-data";
import JsonLd from "@/components/seo/JsonLd";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const viewport: Viewport = {
  themeColor: "#FF6B2C",
  colorScheme: "dark",
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
  applicationName: `${SITE_CONFIG.name} Portfolio`,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.name} Portfolio`,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="YoIS_Cyi8HUiyELT15o5lprOBtDvAmCTBjGE2J4qXzA" />
        {/* Site-wide WebSite JSON-LD Structured Data */}
        <JsonLd data={buildWebsiteSchema()} />
      </head>
      <body className={`${geist.variable} font-sans antialiased min-h-screen bg-background text-text`}>
        {/* Remove extension-injected attributes before React hydrates */}
        <Script
          id="clean-extension-attrs"
          strategy="beforeInteractive"
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
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}