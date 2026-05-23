import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.jpeg";

export function StaticHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Image
                src={Logo}
                alt="Logo of Nirakt Travels"
                height={100}
                width={100}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-bold text-primary leading-tight tracking-tight">NIRAKT</span>
              <span className="text-[9px] text-text-muted leading-none tracking-[0.15em] uppercase font-medium">Travels</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            <Link href="/" className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors">Home</Link>
            <Link href="/#destinations" className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors">Destinations</Link>
            <Link href="/#services" className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors">Services</Link>
            <Link href="/packages" className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors">Packages</Link>
            <Link href="/about" className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors">About</Link>
            <Link href="/#contact" className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/#contact" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all shadow-button">
              Plan My Trip
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
