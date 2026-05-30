"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevTotalItems, setPrevTotalItems] = React.useState(totalItems);
  const [badgePulse, setBadgePulse] = React.useState(false);

  // Scroll shadow
  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cart badge pulse animation on change
  React.useEffect(() => {
    if (totalItems !== prevTotalItems) {
      setPrevTotalItems(totalItems);
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 400);
      return () => clearTimeout(t);
    }
  }, [totalItems, prevTotalItems]);

  // Lock body scroll when mobile menu open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function scrollToAbout() {
    setMobileOpen(false);
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function goTo(path: string) {
    setMobileOpen(false);
    router.push(path);
  }

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#FAF9F7",
          boxShadow: scrolled
            ? "0 2px 16px 0 rgba(26,26,46,0.10)"
            : "none",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
          borderBottom: scrolled ? "none" : "1px solid rgba(26,26,46,0.06)",
        }}
      >
        <nav
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <img
            src="/logo.png"
            alt="earsound logo"
            style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
            onClick={() => router.push("/")}
          />

          {/* Desktop nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            className="nav-desktop-links"
          >
            <NavButton
              label="Shop"
              onClick={() => goTo("/shop")}
            />
            <NavButton
              label="About"
              onClick={scrollToAbout}
            />
            <NavButton
              label="Contact"
              onClick={scrollToAbout}
            />

            {/* Divider */}
            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "rgba(26,26,46,0.12)",
                margin: "0 4px",
              }}
            />

            {/* Cart Icon */}
            <CartButton
              totalItems={totalItems}
              pulse={badgePulse}
              onClick={() => goTo("/checkout")}
            />
          </div>

          {/* Mobile: cart + hamburger */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
            className="nav-mobile-controls"
          >
            <CartButton
              totalItems={totalItems}
              pulse={badgePulse}
              onClick={() => goTo("/checkout")}
            />
            <button
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A1A2E",
                borderRadius: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(26,26,46,0.06)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <HamburgerIcon />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "#FAF9F7",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Overlay header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              height: "68px",
              borderBottom: "1px solid rgba(26,26,46,0.08)",
            }}
          >
            <img
              src="/logo.png"
              alt="earsound logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => goTo("/")}
            />
            <button
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A1A2E",
                borderRadius: "8px",
              }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Overlay nav links */}
          <nav
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 32px",
              gap: "8px",
            }}
          >
            {[
              { label: "Home", action: () => goTo("/") },
              { label: "Shop", action: () => goTo("/shop") },
              { label: "About", action: scrollToAbout },
              { label: "Contact", action: scrollToAbout },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#1A1A2E",
                  textAlign: "left",
                  padding: "12px 0",
                  letterSpacing: "-0.02em",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  outline: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#4A6FA5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#1A1A2E")
                }
                onFocus={(e) =>
                  (e.currentTarget.style.color = "#4A6FA5")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.color = "#1A1A2E")
                }
              >
                {label}
              </button>
            ))}

            <div style={{ marginTop: "24px" }}>
              <button
                onClick={() => goTo("/checkout")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#1A1A2E",
                  color: "#FAF9F7",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 24px",
                  fontSize: "1rem",
                  fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
              >
                <CartIconSVG />
                View Cart
                {totalItems > 0 && (
                  <span
                    style={{
                      backgroundColor: "#4A6FA5",
                      color: "#FAF9F7",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "1px 7px",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        .nav-desktop-links { display: flex !important; }
        .nav-mobile-controls { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-mobile-controls { display: flex !important; }
        }
      `}</style>
    </>
  );
}

/* ── Sub-components ── */

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
        fontSize: "0.9375rem",
        fontWeight: 500,
        color: hovered ? "#4A6FA5" : "#1A1A2E",
        padding: "8px 12px",
        borderRadius: "8px",
        backgroundColor: hovered ? "rgba(74,111,165,0.08)" : "transparent",
        transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
        outline: "none",
        letterSpacing: "0.01em",
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid #4A6FA5";
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {label}
    </button>
  );
}

function CartButton({
  totalItems,
  pulse,
  onClick,
}: {
  totalItems: number;
  pulse: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
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
      onMouseDown={(e) =>
        (e.currentTarget.style.transform = "scale(0.98)")
      }
      onMouseUp={(e) =>
        (e.currentTarget.style.transform = hovered ? "scale(1.02)" : "scale(1)")
      }
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: hovered ? "rgba(26,26,46,0.06)" : "transparent",
        color: "#1A1A2E",
        transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        outline: "none",
      }}
    >
      <CartIconSVG />
      {totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            backgroundColor: "#E8524A",
            color: "#FAF9F7",
            borderRadius: "9999px",
            fontSize: "0.6875rem",
            fontWeight: 700,
            minWidth: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
            transform: pulse ? "scale(1.3)" : "scale(1)",
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 0 0 2px #FAF9F7",
          }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

function CartIconSVG() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}