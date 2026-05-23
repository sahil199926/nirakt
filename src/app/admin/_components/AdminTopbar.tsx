import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface AdminTopbarProps {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View Site
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {user.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="text-xs">
            <p className="font-semibold text-gray-800">{user.name ?? "Admin"}</p>
            <p className="text-gray-400 capitalize">{user.role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
