import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | CINRYVAN",
  description:
    "Read the CINRYVAN Terms of Use covering access, accounts, community features, intellectual property, third-party services and user responsibilities.",
  keywords: [
    "terms of use",
    "terms and conditions",
    "CINRYVAN terms",
    "user agreement",
    "account terms",
    "copyright",
  ],
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | CINRYVAN",
    description:
      "Read CINRYVAN’s terms covering accounts, community features, intellectual property and platform usage.",
    url: "/terms",
    siteName: "CINRYVAN",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | CINRYVAN",
    description: "Read CINRYVAN’s Terms of Use and platform policies.",
    images: ["/og-image.png"],
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "CINRYVAN Terms of Use",
  description: "Terms governing access to and use of CINRYVAN services.",
  url: "https://cinryvan.vercel.app/terms",
  dateModified: "2026-08-19",
};

const SECTIONS = [
  { number: "01", label: "Agreement & eligibility", href: "#agreement" },
  { number: "02", label: "Accounts", href: "#accounts" },
  { number: "03", label: "Acceptable use", href: "#acceptable-use" },
  { number: "04", label: "Community content", href: "#community-content" },
  { number: "05", label: "Content & ownership", href: "#content-ownership" },
  { number: "06", label: "External services", href: "#external-services" },
  { number: "07", label: "Availability", href: "#availability" },
  { number: "08", label: "Disclaimers & liability", href: "#liability" },
  { number: "09", label: "Suspension & termination", href: "#termination" },
  { number: "10", label: "Changes & contact", href: "#changes" },
];

const PROHIBITED_USES = [
  "Accessing accounts, systems or data without permission",
  "Disrupting, overloading or interfering with platform operation",
  "Using automated tools to scrape or copy content without authorisation",
  "Uploading malware, malicious code, spam or deceptive material",
  "Impersonating another person or misrepresenting an affiliation",
  "Using CINRYVAN to infringe intellectual-property or privacy rights",
  "Attempting to bypass security, access controls or usage limits",
  "Using the platform for unlawful, abusive or fraudulent activity",
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#080b12] pb-24 pt-28 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <header className="relative overflow-hidden border border-white/10 bg-[#101722] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
          <div className="absolute -right-16 -top-28 h-80 w-80 rotate-12 border-[42px] border-yellow-400/[0.055]" />
          <div className="absolute right-20 top-16 h-20 w-20 rotate-45 border border-yellow-400/20" />
          <div className="absolute bottom-0 left-0 h-px w-1/3 bg-yellow-400" />

          <div className="relative z-10 max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.3em]">
              <span className="text-yellow-400">CINRYVAN Agreement</span>
              <span className="h-px w-8 bg-white/20" />
              <span className="text-white/35">Effective 19 August 2026</span>
            </div>
            <h1 className="mt-5 text-5xl font-black leading-none tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Terms of Use
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
              These terms define the relationship between you and CINRYVAN
              when you browse, create an account, save titles, join community
              features or use any part of the platform.
            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ["01", "Use it lawfully", "Respect the platform and other people."],
              ["02", "Protect your account", "Keep your credentials private and accurate."],
              ["03", "Respect ownership", "Content remains with its respective rights holders."],
            ].map(([number, title, text]) => (
              <div key={number} className="bg-[#0c121c] p-5 sm:p-6">
                <span className="text-[10px] font-black tracking-[0.25em] text-yellow-400">{number}</span>
                <h2 className="mt-5 text-lg font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-10 py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-white/35">
              Agreement sections
            </p>
            <nav aria-label="Terms of Use sections" className="border-y border-white/10">
              {SECTIONS.map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  className="group flex items-center gap-4 border-b border-white/10 py-3.5 text-sm font-bold text-white/50 transition last:border-b-0 hover:text-yellow-300"
                >
                  <span className="w-5 text-[9px] font-black text-yellow-400/65">{section.number}</span>
                  {section.label}
                </a>
              ))}
            </nav>

            <div className="mt-6 border border-yellow-400/20 bg-yellow-400/[0.06] p-5">
              <p className="text-sm leading-6 text-white/55">
                Privacy and browser storage are explained separately.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm font-black">
                <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300">Privacy Policy →</Link>
                <Link href="/cookies" className="text-yellow-400 hover:text-yellow-300">Cookie Policy →</Link>
              </div>
            </div>
          </aside>

          <article className="min-w-0 space-y-14">
            <section id="agreement" className="scroll-mt-32">
              <SectionLabel number="01" label="Agreement & eligibility" />
              <h2 className="mt-3 text-3xl font-black">Accepting these terms</h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-white/60">
                <p>
                  By accessing or using CINRYVAN, you agree to these Terms of
                  Use and the policies linked from them. If you do not agree,
                  do not use the platform.
                </p>
                <p>
                  You must be legally capable of entering into this agreement.
                  If you use CINRYVAN for an organisation, you confirm that you
                  have authority to bind that organisation to these terms.
                </p>
                <p>
                  A parent or legal guardian should supervise use by anyone who
                  cannot independently consent under the laws that apply to them.
                </p>
              </div>
            </section>

            <section id="accounts" className="scroll-mt-32">
              <SectionLabel number="02" label="Accounts" />
              <h2 className="mt-3 text-3xl font-black">Your CINRYVAN identity</h2>
              <div className="mt-5 space-y-4 leading-8 text-white/60">
                <p>
                  You are responsible for providing accurate account information,
                  protecting your password and controlling access to your account.
                  Tell us promptly if you suspect unauthorised use.
                </p>
                <p>
                  Watchlists, viewing progress, notifications and other personal
                  features may depend on your account. You may not sell, transfer,
                  share or misuse an account in a way that compromises security.
                </p>
              </div>
            </section>

            <section id="acceptable-use" className="scroll-mt-32">
              <SectionLabel number="03" label="Acceptable use" />
              <h2 className="mt-3 text-3xl font-black">Use the platform responsibly</h2>
              <p className="mt-5 leading-8 text-white/60">
                CINRYVAN is provided for lawful entertainment discovery,
                information and community participation. The following conduct
                is prohibited:
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {PROHIBITED_USES.map((item, index) => (
                  <div key={item} className="flex gap-4 border border-white/10 bg-white/[0.025] p-4">
                    <span className="shrink-0 text-[10px] font-black text-yellow-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-6 text-white/55">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="community-content" className="scroll-mt-32">
              <SectionLabel number="04" label="Community content" />
              <h2 className="mt-3 text-3xl font-black">What you contribute</h2>
              <div className="mt-5 space-y-4 leading-8 text-white/60">
                <p>
                  Comments, reviews, room messages or other material you submit
                  remain yours. You confirm that you have the rights needed to
                  share them and that they do not violate law or another person’s
                  rights.
                </p>
                <p>
                  You grant CINRYVAN a non-exclusive, worldwide, royalty-free
                  licence to host, store, reproduce, format and display that
                  material only as reasonably needed to operate, improve and
                  promote the relevant platform features. This licence ends when
                  the material is deleted, except for lawful backups or material
                  others have independently shared.
                </p>
                <p>
                  We may moderate, restrict or remove material that violates these
                  terms, creates risk, or interferes with the community experience.
                </p>
              </div>
            </section>

            <section id="content-ownership" className="scroll-mt-32">
              <SectionLabel number="05" label="Content & ownership" />
              <h2 className="mt-3 text-3xl font-black">Entertainment data and intellectual property</h2>
              <div className="mt-5 space-y-4 leading-8 text-white/60">
                <p>
                  CINRYVAN’s name, original interface, design, software and
                  original written material are protected by applicable
                  intellectual-property laws. These terms do not transfer
                  ownership to you.
                </p>
                <p>
                  Movie, television, animation and game titles, posters, trailers,
                  trademarks, ratings and metadata may belong to studios,
                  publishers, creators or data providers. Their use is subject to
                  the rights and terms of the respective owners and providers.
                </p>
                <p>
                  CINRYVAN is a discovery and information platform. It does not
                  claim ownership of third-party entertainment properties and does
                  not host premium films or episodes unless expressly stated.
                </p>
              </div>
            </section>

            <section id="external-services" className="scroll-mt-32">
              <SectionLabel number="06" label="External services" />
              <h2 className="mt-3 text-3xl font-black">Providers, stores, videos and links</h2>
              <p className="mt-5 leading-8 text-white/60">
                CINRYVAN may display information or links from services such as
                TMDB, YouTube, game-data providers, streaming providers, stores
                and news publishers. Availability, pricing, accuracy and content
                can change without notice. When you follow an external link, that
                service’s terms and privacy practices apply. CINRYVAN does not
                control or endorse every external service or item it displays.
              </p>
            </section>

            <section id="availability" className="scroll-mt-32">
              <SectionLabel number="07" label="Availability" />
              <h2 className="mt-3 text-3xl font-black">A platform that continues to evolve</h2>
              <p className="mt-5 leading-8 text-white/60">
                We may add, change, limit or discontinue features; perform
                maintenance; or respond to security, legal and technical needs.
                We do not promise that every feature, title, provider or
                integration will always be available in every country or on every
                device. We will take reasonable care when operating the platform,
                but interruptions and errors can occur.
              </p>
            </section>

            <section id="liability" className="scroll-mt-32">
              <SectionLabel number="08" label="Disclaimers & liability" />
              <h2 className="mt-3 text-3xl font-black">Important limits</h2>
              <div className="mt-5 space-y-4 leading-8 text-white/60">
                <p>
                  To the extent permitted by law, CINRYVAN is provided on an
                  “as available” basis. We do not guarantee that all metadata,
                  release dates, ratings, provider availability, prices or
                  external links will always be complete, current or error-free.
                </p>
                <p>
                  To the extent permitted by law, CINRYVAN is not responsible for
                  losses caused solely by external services, unauthorised account
                  access resulting from your failure to protect credentials, or
                  events outside our reasonable control.
                </p>
                <div className="border-l-2 border-yellow-400 bg-yellow-400/[0.06] p-5 text-sm leading-7 text-white/65">
                  Nothing in these terms excludes, restricts or modifies any right,
                  remedy, guarantee or liability that cannot lawfully be excluded
                  or limited under applicable consumer-protection law.
                </div>
              </div>
            </section>

            <section id="termination" className="scroll-mt-32">
              <SectionLabel number="09" label="Suspension & termination" />
              <h2 className="mt-3 text-3xl font-black">Protecting CINRYVAN and its users</h2>
              <p className="mt-5 leading-8 text-white/60">
                We may restrict, suspend or terminate access where reasonably
                necessary to address a serious or repeated breach of these terms,
                fraud, abuse, legal requirements, or a threat to users or platform
                security. Where appropriate and lawful, we may provide notice or
                an opportunity to correct the issue. You may stop using CINRYVAN
                at any time.
              </p>
            </section>

            <section id="changes" className="scroll-mt-32 border-t border-white/10 pt-12">
              <SectionLabel number="10" label="Changes & contact" />
              <h2 className="mt-3 text-3xl font-black">Updates to this agreement</h2>
              <p className="mt-5 leading-8 text-white/60">
                We may update these terms when CINRYVAN’s services, legal duties
                or operating practices change. We will update the effective date
                and provide additional notice when a material change reasonably
                requires it. Your continued use after revised terms take effect
                indicates acceptance of those terms.
              </p>
              <p className="mt-4 leading-8 text-white/60">
                If you have questions about this agreement, contact us through
                CINRYVAN Support.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/support" className="bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300">
                  Contact Support
                </Link>
                <Link href="/privacy" className="border border-white/15 bg-white/5 px-5 py-3 text-sm font-black transition hover:border-yellow-400/60 hover:text-yellow-300">
                  Privacy Policy
                </Link>
              </div>
            </section>

            <div className="border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
              These terms are a general operational draft for CINRYVAN and are
              not a substitute for advice from a qualified legal professional.
              Review them before introducing payments, subscriptions, commerce,
              user uploads or services for children.
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
      {number} · {label}
    </p>
  );
}