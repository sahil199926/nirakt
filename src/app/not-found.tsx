import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-6xl md:text-7xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-text-muted mb-8">
          Oops! It looks like you&apos;ve wandered off the beaten path. Let us help
          you find your way back home.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-all"
        >
          <Home className="w-5 h-5" />
          Take Me Home
        </Link>
      </div>
    </div>
  );
}
