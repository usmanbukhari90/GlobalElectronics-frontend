import { Mail } from "lucide-react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53c.64-.25 1.37-.42 2.43-.47C8.94.01 9.28 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.25A3.25 3.25 0 1 1 12 8.5a3.25 3.25 0 0 1 0 6.75ZM17.5 4.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.24 2H21.5l-7.3 8.35L22.8 22h-6.72l-5.26-6.88L4.8 22H1.53l7.8-8.92L1 2h6.9l4.76 6.3L18.24 2Zm-1.18 18h1.8L7.02 3.9H5.1L17.06 20Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.05 8.21 11.68.6.11.82-.27.82-.6v-2.1c-3.34.75-4.04-1.67-4.04-1.67-.55-1.44-1.34-1.83-1.34-1.83-1.09-.77.08-.75.08-.75 1.2.09 1.84 1.27 1.84 1.27 1.07 1.87 2.81 1.33 3.5 1.02.11-.79.42-1.33.76-1.64-2.67-.31-5.47-1.38-5.47-6.15 0-1.36.47-2.47 1.24-3.34-.12-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.3 1.28a11.3 11.3 0 0 1 6 0c2.29-1.6 3.3-1.28 3.3-1.28.66 1.71.24 2.97.12 3.28.77.87 1.24 1.98 1.24 3.34 0 4.78-2.81 5.83-5.49 6.14.43.38.82 1.14.82 2.3v3.41c0 .33.22.72.83.6C20.57 22.34 24 17.73 24 12.3 24 5.5 18.63 0 12 0Z" />
    </svg>
  );
}

const SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/syed.usman.bukhari.595612?mibextid=ZbWKwL", Icon: FacebookIcon },
  { name: "Instagram", href: "https://www.instagram.com/iusmanbukhari_?igsh=MW01N3JrZHc2dXJ1dg==", Icon: InstagramIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/usman-bukhari-17b1443a7?utm_source=share_via&utm_content=profile&utm_medium=member_android", Icon: LinkedInIcon },
  { name: "X", href: "https://x.com/iusmanbukhari", Icon: XIcon },
  { name: "GitHub", href: "https://github.com/usmanbukhari90", Icon: GitHubIcon },
  { name: "Email", href: "mailto:mrbukhari90@gmail.com", Icon: Mail },
];

export default function DeveloperPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center lg:px-6">
      <h1 className="text-2xl font-bold text-navy">Syed Muhammad Usman Shah</h1>
      <p className="mt-1 text-sm font-medium text-muted">Software Engineer — NUST, Islamabad, Pakistan</p>

      <p className="mt-6 text-sm text-gray-700 leading-relaxed">
        A software engineer at NUST, Islamabad, building production-grade web platforms for clients across
        education, business, and services. With multiple full-stack projects delivered — from custom admin systems
        to cloud-integrated applications — the focus stays on writing clean, scalable code and shipping solutions
        that clients can rely on long after launch. Currently leading development at Gate Developers.
      </p>

      <div className="mt-8 flex items-center justify-center gap-4">
        {SOCIALS.map(({ name, href, Icon }) => (
           <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-navy hover:bg-navy hover:text-white transition-colors"
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}