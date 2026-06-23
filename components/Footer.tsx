import { Logo } from "./Logo";
import { Mail } from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.4a4 4 0 1 1-8 .8 4 4 0 0 1 8-.8Z" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
  </svg>
);
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23 7s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-.9C16.7 3.5 12 3.5 12 3.5s-4.7 0-8.1.3c-.4 0-1.3 0-2.1.9C1.2 5.4 1 7 1 7S.8 8.9.8 10.8v1.5C.8 14.2 1 16 1 16s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.8.3 7.8.3s4.7 0 8.1-.3c.4 0 1.3 0 2.1-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.8v-1.5C23.2 8.9 23 7 23 7zM9.7 14.6V8.4l6.2 3.1-6.2 3.1z" />
  </svg>
);

const cols = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Download App", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Contact", "Careers"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Refund Policy", "Security"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ink-800 mt-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-ink-400 max-w-xs leading-relaxed">
              The complete turf management platform. Built in Bangladesh, for Bangladesh.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[FacebookIcon, InstagramIcon, YoutubeIcon, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-ink-800 border border-ink-700 hover:border-lime-500/40 hover:text-lime-400 text-ink-300 flex items-center justify-center transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold uppercase tracking-wider text-paper mb-4">
                {col.title}
              </div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-ink-400 hover:text-lime-400 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-ink-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">
            © 2026 HatTrick · Made with{" "}
            <span className="text-lime-400">💚</span> in Sylhet, Bangladesh
          </p>
          <p className="text-xs text-ink-500">
            Empowering 50+ turfs across Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
