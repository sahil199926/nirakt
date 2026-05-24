"use client";

import { useState } from "react";
import { Phone, MessageCircle, Users } from "lucide-react";
import { EnquiryModal } from "./EnquiryModal";
import { BRAND } from "@/app/lib/constants";

interface PackageEnquiryCTAProps {
  packageTitle: string;
  packageSlug: string;
  packageId: string;
  destinations: string[];
}

export function PackageEnquiryCTA({ packageTitle, packageSlug, packageId, destinations }: PackageEnquiryCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white font-semibold rounded-xl hover:brightness-110 transition-all shadow-button"
        >
          <Phone className="w-4 h-4" /> Book a Call
        </button>
        <a
          href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}?text=Hi, I want to book: ${encodeURIComponent(packageTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:brightness-110 transition-all"
        >
          <MessageCircle className="w-4 h-4" /> Book on WhatsApp
        </a>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-sand text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-all border border-sand"
        >
          <Users className="w-4 h-4" /> Enquire Online
        </button>
      </div>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packageTitle={packageTitle}
        packageSlug={packageSlug}
        packageId={packageId}
        prefillDestination={destinations[0]}
      />
    </>
  );
}

export function PackageEnquiryCTABar({ packageTitle, packageSlug, packageId }: Omit<PackageEnquiryCTAProps, "destinations">) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Book a Call</span>
          <span className="sm:hidden">Book</span>
        </button>
        <a
          href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-full hover:brightness-110 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packageTitle={packageTitle}
        packageSlug={packageSlug}
        packageId={packageId}
      />
    </>
  );
}
