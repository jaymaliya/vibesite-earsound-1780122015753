"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer
      style={{
        backgroundColor: "#FAF9F7",
        borderTop: "1px solid rgba(26,26,46,0.08)",
        paddingTop: "64px",
        paddingBottom: "32px",
        fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top grid: 4 columns on desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "56px",
          }}
        >
          {/* Column 1: Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img
              src="/logo.png"
              alt="earsound logo"
              style={{
                height: "32px",
                objectFit: "contain",
                opacity: 0.85,
                alignSelf: "flex-start",
              }}
            />
            <p
              style={{
                color: "#8A9BB5",
                fontSize: "0.9rem",
                lineHeight: "1.6",
                maxWidth: "260px",
                margin: 0,
              }}
            >
              We sell sound. Precision-tuned earphones crafted for audiophiles who know what they want.
            </p>
            <p
              style={{
                color: "#8A9BB5",
                fontSize: "0.8125rem",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <MadeInIndiaIcon />
              Made in India
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <SocialLink
                href="https://instagram.com"
                label="Follow earsound on Instagram"
                icon={<InstagramIcon />}
              />
              <SocialLink
                href="https://twitter.com"
                label="Follow earsound on Twitter"
                icon={<TwitterIcon />}
              />
              <SocialLink
                href="https://wa.me/919999999999"
                label="Chat with earsound on WhatsApp"
                icon={<WhatsAppIcon />}
              />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8A9BB5",
                margin: "0 0 8px 0",
              }}
            >
              Navigate
            </h3>
            <FooterNavButton label="Home" onClick={() => router.push("/")} />
            <FooterNavButton label="Shop" onClick={() => router.push("/shop")} />
            <FooterNavButton
              label="About"
              onClick={() => {
                const el = document.getElementById("about");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>

          {/* Column 3: Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8A9BB5",
                margin: "0 0 8px 0",
              }}
            >
              Get in touch
            </h3>
            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                color: "#1A1A2E",
                fontSize: "0.9375rem",
                fontWeight: 500,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 0",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#4A6FA5")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1A2E")}
            >
              <MailIcon />
              maliyajay77@gmail.com
            </a>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginTop: "8px",
              }}
            >
              <span
                style={{
                  color: "#8A9BB5",
                  fontSize: "0.8125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <TruckIcon />
                Free shipping above ₹1,499
              </span>
              <span
                style={{
                  color: "#8A9BB5",
                  fontSize: "0.8125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <ShieldIcon />
                1-year warranty
              </span>
              <span
                style={{
                  color: "#8A9BB5",
                  fontSize: "0.8125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <UpiIcon />
                UPI &amp; all cards accepted
              </span>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#8A9BB5",
                margin: "0 0 0 0",
              }}
            >
              Stay in the loop
            </h3>
            <p
              style={{
                color: "#1A1A2E",
                fontSize: "0.9375rem",
                lineHeight: "1.5",
                margin: 0,
                fontWeight: 500,
              }}
            >
              New drops, exclusive deals — straight to your inbox.
            </p>

            {status === "success" ? (
              <div
                style={{
                  backgroundColor: "rgba(74,111,165,0.1)",
                  border: "1px solid rgba(74,111,165,0.3)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  color: "#4A6FA5",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Thanks! We&apos;ll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === "loading"}
                  style={{
                    backgroundColor: "#FAF9F7",
                    border: "1.5px solid rgba(26,26,46,0.16)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.9rem",
                    color: "#1A1A2E",
                    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                    outline: "none",
                    transition: "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#4A6FA5")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(26,26,46,0.16)")
                  }
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    backgroundColor: "#1A1A2E",
                    color: "#FAF9F7",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontSize: "0.9375rem",
                    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                    fontWeight: 600,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.7 : 1,
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading")
                      e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (status !== "loading")
                      e.currentTarget.style.transform = "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    if (status !== "loading")
                      e.currentTarget.style.transform = "scale(1.02)";
                  }}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
                {status === "error" && (
                  <p
                    style={{
                      color: "#C0392B",
                      fontSize: "0.8125rem",
                      margin: 0,
                    }}
                  >
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(26,26,46,0.08)",
            marginBottom: "24px",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p
            style={{
              color: "#8A9BB5",
              fontSize: "0.8125rem",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} earsound. All rights reserved.
          </p>
          <p
            style={{
              color: "#8A9BB5",
              fontSize: "0.8125rem",
              margin: 0,
            }}
          >
            Crafted with care in India.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Sub-components ── */

function FooterNavButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid #4A6FA5";
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
        fontSize: "0.9375rem",
        fontWeight: 500,
        color: hovered ? "#4A6FA5" : "#1A1A2E",
        padding: "4px 0",
        textAlign: "left",
        transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
        outline: "none",
      }}
    >
      {label}
    </button>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "38px",
        height: "38px",
        borderRadius: "9999px",
        backgroundColor: hovered ? "#1A1A2E" : "rgba(26,26,46,0.08)",
        color: hovered ? "#FAF9F7" : "#1A1A2E",
        transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        textDecoration: "none",
      }}
    >
      {icon}
    </a>
  );
}

/* ── SVG Icons ── */

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 4v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UpiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function MadeInIndiaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
}