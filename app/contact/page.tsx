// app/contact/page.tsx
import FAQ from "../../components/FAQ";
import ContactForm from "../../components/ContactForm";
import ContactAside from "../../components/ContactAside";

export const metadata = {
  title: "Contact • CineVault",
  description: "Get in touch with CineVault",
};

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-b from-[#0b1020] via-[#0b0f1c] to-[#0b0f1c] text-zinc-100">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="mt-2 text-zinc-400">Home <span className="mx-2">/</span> Contact</p>
          <p className="mt-4 text-[15px] leading-7 text-zinc-300/90">
            Hey! We’re glad you’re here. Whether you’ve found a bug, want to collaborate,
            or just have an idea to make CineVault better, drop us a message. We usually
            reply within 24 hours (Mon–Fri).
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/10">
              <h2 className="text-xl font-semibold">Let’s Get In Touch</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Leave your contact information and a short message. We’ll get back to you shortly.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <ContactAside />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl overflow-hidden border border-white/10 bg-white/[0.04] shadow-xl shadow-black/40">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              title="CineVault Map"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=28.792%2C-30.362%2C28.832%2C-30.332&layer=mapnik&marker=-30.347%2C28.812"
            />
          </div>
        </div>

        <div className="mt-10">
          <FAQ />
        </div>
      </section>
    </main>
  );
}
