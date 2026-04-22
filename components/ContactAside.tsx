// components/contact/ContactAside.tsx
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function ContactAside() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Contact Info</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Reach us directly via email or phone. We’re available Mon–Fri, 9:00–17:00.
      </p>

      <div className="mt-6 grid gap-4">
        <InfoItem
          icon={<Mail className="h-5 w-5" />}
          title="Email Information"
          value={<Link href="mailto:support@cinevault.app" className="hover:underline">support@cinevault.app</Link>}
        />
        <InfoItem
          icon={<Phone className="h-5 w-5" />}
          title="Calling Support"
          value={<span>+27 83 607 8398</span>}
        />
        <InfoItem
          icon={<MapPin className="h-5 w-5" />}
          title="Office"
          value={<span>Matatiele, South Africa</span>}
        />
      </div>

      <div className="mt-8">
        <p className="text-sm text-zinc-400">Follow us on social media</p>
        <div className="mt-3 flex items-center gap-3">
          <IconBtn href="#" label="Facebook"><Facebook className="h-4 w-4" /></IconBtn>
          <IconBtn href="#" label="Twitter"><Twitter className="h-4 w-4" /></IconBtn>
          <IconBtn href="#" label="Instagram"><Instagram className="h-4 w-4" /></IconBtn>
          <IconBtn href="#" label="LinkedIn"><Linkedin className="h-4 w-4" /></IconBtn>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mt-0.5 shrink-0 rounded-xl bg-amber-400/10 text-amber-300 p-2">{icon}</div>
      <div>
        <div className="text-zinc-300 font-medium">{title}</div>
        <div className="text-zinc-400 text-sm">{value}</div>
      </div>
    </div>
  );
}

function IconBtn({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="rounded-full border border-white/10 bg-white/[0.04] p-2 hover:bg-amber-400 hover:text-zinc-900 transition"
    >
      {children}
    </Link>
  );
}
