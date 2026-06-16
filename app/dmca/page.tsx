import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy | CineVault",
  description:
    "Learn how CineVault handles copyright complaints, DMCA notices, and content removal requests.",
  keywords: [
    "DMCA",
    "copyright policy",
    "content removal",
    "DMCA notice",
    "copyright complaint",
    "CineVault DMCA",
  ],
  alternates: {
    canonical: "/dmca",
  },
  openGraph: {
    title: "DMCA Policy | CineVault",
    description:
      "Information about copyright complaints and DMCA takedown requests.",
    url: "/dmca",
    siteName: "CineVault",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DMCA Policy | CineVault",
    description:
      "Learn how CineVault handles DMCA and copyright requests.",
    images: ["/og-image.png"],
  },
};

const dmcaJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "DMCA Policy",
  description:
    "Information about copyright complaints and DMCA takedown requests.",
  url: "https://cinevault-tau-drab.vercel.app/dmca",
};

export default function DmcaPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(dmcaJsonLd),
              }}
      />

      <h1 className="text-3xl font-bold">DMCA Policy</h1>
      <p className="mt-4 text-zinc-300">
        CineVault respects intellectual property rights and responds to
        valid copyright infringement notices. If you believe content
        available through CineVault violates your copyright, you may
        submit a DMCA takedown request containing the required legal
        information. Upon receiving a valid notice, we will review the
        claim and take appropriate action where necessary.
      </p>
    </main>
  );
}