import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B2C]/10 rounded-full blur-[140px] pointer-events-none -z-10"
      />
      <div className="w-full max-w-md text-center space-y-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B2C] via-[#FF7A3D] to-amber-500 text-zinc-950 shadow-lg shadow-[#FF6B2C]/20">
          <Compass className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B2C]">Error 404</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Page not found
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back
            to the portfolio.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-zinc-950 bg-[#FF6B2C] hover:bg-[#FF7A3D] shadow-lg shadow-[#FF6B2C]/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}