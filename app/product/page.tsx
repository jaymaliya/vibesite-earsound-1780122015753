"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Build Best Website", description: "build me the best website for selling this earphones", price: 249 },
  { id: 2, img: "/product-2.jpg", name: "Premium Product", description: "a premium product", price: 200 },
  { id: 3, img: "/product-3.jpg", name: "Premium Product", description: "a premium product", price: 300 },
  { id: 4, img: "/product-4.jpg", name: "Premium Product", description: "a premium product", price: 400 },
];

const reviews = [
  { name: "Arjun Mehta", location: "Mumbai", rating: 5, date: "December 2024", text: "The sound clarity is unreal. I tested a dozen earphones before landing on earsound — nothing compares at this price. The driver tuning is exactly what a discerning listener wants." },
  { name: "Priya Sharma", location: "Bangalore", rating: 5, date: "November 2024", text: "Wore these for a 6-hour flight. Comfort was perfect, noise isolation was everything I needed. Highly recommend to anyone who travels frequently." },
  { name: "Rohit Nair", location: "Delhi", rating: 5, date: "November 2024", text: "Premium build, premium sound. The bass hits hard without muddying the mids. Exactly what an audiophile wants. Will not go back to any other brand." },
  { name: "Meera Iyer", location: "Chennai", rating: 5, date: "October 2024", text: "Unboxing experience was exceptional. Build quality feels like something twice the price. Sound signature is neutral and honest — exactly how music should be heard." },
];

const steps = [
  {
    number: "01",
    title: "Precision Drivers",
    desc: "40mm dynamic drivers, engineered with a custom neodymium magnet assembly. Every frequency reproduced with honesty.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Active Noise Cancellation",
    desc: "Dual-microphone ANC reads ambient sound 1000× per second and cancels it before it reaches your ear canal.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "36-Hour Battery",
    desc: "All-day, all-night listening. 10-minute quick charge delivers 3 more hours when you need it most.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 11v2" /><path d="M7 11l3 3 5-5" />
      </svg>
    ),
  },
];

const features = [
  { label: "Driver Size", value: "40mm Dynamic" },
  { label: "Frequency Response", value: "20Hz – 20kHz" },
  { label: "Battery Life", value: "36 Hours" },
  { label: "Quick Charge", value: "10 min → 3 hrs" },
  { label: "Connectivity", value: "Bluetooth 5.3" },
  { label: "Weight", value: "249g" },
  { label: "ANC", value: "Dual-Mic Active" },
  { label: "Warranty", value: "1 Year" },
];

function StarRow({ count }: { count: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < count ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };

  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Studio Wireless Pro";
  const displayPrice = paramPrice ?? 249;

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function handleAddToCart() {
    addItem({ id: String(displayName + displayPrice), name: displayName, price: displayPrice, quantity, image: displayImg });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem({ id: String(displayName + displayPrice), name: displayName, price: displayPrice, quantity, image: displayImg });
    router.push("/checkout");
  }

  const recommendedProducts = products.filter((p) => p.img !== displayImg).slice(0, 3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root {
          --bg: #FAF9F7;
          --surface: #3A3A5C;
          --primary: #1A1A2E;
          --accent: #4A6FA5;
          --text: #1A1A2E;
          --muted: #8A9BB5;
          --font-heading: 'Syne', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
        .will-reveal { opacity: 0; transform: translateY(24px); }
        .visible { opacity: 1; transform: translateY(0); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal { }
        :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        @media (max-width: 768px) {
          .product-hero-grid { grid-template-columns: 1fr !important; }
          .specs-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-row { flex-direction: column !important; gap: 32px !important; }
          .step-connector { display: none !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .reco-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important; }
        }
      `}</style>

      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: "var(--bg)", borderBottom: "1px solid rgba(26,26,46,0.08)", padding: "12px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", display: "flex", gap: "8px", alignItems: "center", fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          <span
            onClick={() => router.push("/")}
            style={{ cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Home
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          <span
            onClick={() => router.push("/shop")}
            style={{ cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Shop
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>{displayName}</span>
        </div>
      </div>

      {/* ── PRODUCT HERO ── */}
      <section style={{ background: "var(--bg)", padding: "64px 0 80px" }}>
        <div
          className="product-hero-grid"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
            display: "grid",
            gridTemplateColumns: "55fr 45fr",
            gap: "80px",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT — Product Image */}
          <div>
            <div
              style={{
                overflow: "hidden",
                borderRadius: "24px",
                background: "var(--surface)",
                boxShadow: "0 40px 80px -20px #4A6FA540",
                position: "relative",
              }}
            >
              <img
                src={displayImg}
                alt={`earsound ${displayName} earphones`}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Best Seller
              </div>
            </div>

            {/* Specs strip under image */}
            <div
              className="specs-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              {features.slice(0, 4).map((f) => (
                <div
                  key={f.label}
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(26,26,46,0.08)",
                    borderRadius: "12px",
                    padding: "16px 12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "4px" }}>{f.label}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-heading)" }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", paddingTop: "8px" }}>
            {/* Eyebrow */}
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              earsound — we sell sound
            </span>

            {/* Name */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              {displayName}
            </h1>

            {/* Rating row */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <StarRow count={5} />
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>4.9 · 1,240 reviews</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "var(--accent)",
                  letterSpacing: "-0.02em",
                }}
              >
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.1rem",
                  color: "var(--muted)",
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}
              >
                ₹{(displayPrice * 1.3).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
              <span
                style={{
                  background: "#e8f4ee",
                  color: "#2d7a4f",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontFamily: "var(--font-body)",
                }}
              >
                23% OFF
              </span>
            </div>

            {/* Trust pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>, text: "30-Day Returns" },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, text: "Free Delivery above ₹499" },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, text: "1-Year Warranty" },
              ].map((pill) => (
                <div
                  key={pill.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#fff",
                    border: "1px solid rgba(74,111,165,0.2)",
                    borderRadius: "9999px",
                    padding: "6px 12px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <span style={{ color: "var(--accent)" }}>{pill.icon}</span>
                  {pill.text}
                </div>
              ))}
            </div>

            {/* Description */}
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", fontFamily: "var(--font-body)", maxWidth: "440px" }}>
              Engineered for listeners who know the difference. Studio-tuned 40mm drivers, active noise cancellation, and 36-hour battery — in a form factor that doesn't compromise.
            </p>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(26,26,46,0.08)" }} />

            {/* Quantity */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--muted)", fontFamily: "var(--font-body)" }}>Quantity</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "44px",
                    height: "44px",
                    border: "1.5px solid rgba(26,26,46,0.15)",
                    borderRight: "none",
                    background: "#fff",
                    borderRadius: "12px 0 0 12px",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  −
                </button>
                <div
                  style={{
                    width: "56px",
                    height: "44px",
                    border: "1.5px solid rgba(26,26,46,0.15)",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: "44px",
                    height: "44px",
                    border: "1.5px solid rgba(26,26,46,0.15)",
                    borderLeft: "none",
                    background: "#fff",
                    borderRadius: "0 12px 12px 0",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleBuyNow}
                style={{
                  width: "100%",
                  padding: "18px 32px",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--primary)",
                  color: "#fff",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px -10px #1A1A2E60",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  padding: "18px 32px",
                  borderRadius: "12px",
                  border: "2px solid var(--accent)",
                  background: added ? "var(--accent)" : "transparent",
                  color: added ? "#fff" : "var(--accent)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, background 0.25s ease, color 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                {added ? "Added ✓" : "Add to Cart"}
              </button>
            </div>

            {/* Colour options placeholder */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--muted)", fontFamily: "var(--font-body)" }}>Colour</span>
              <div style={{ display: "flex", gap: "10px" }}>
                {["#1A1A2E", "#3A3A5C", "#4A6FA5", "#FAF9F7"].map((c, i) => (
                  <div
                    key={c}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "9999px",
                      background: c,
                      border: i === 0 ? "3px solid var(--accent)" : "2px solid rgba(26,26,46,0.2)",
                      cursor: "pointer",
                      boxShadow: i === 0 ? "0 0 0 2px var(--bg), 0 0 0 4px var(--accent)" : "none",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="reveal"
        style={{
          background: "var(--primary)",
          padding: "96px 0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ marginBottom: "64px" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              The Technology
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "#FAF9F7",
                marginTop: "12px",
                maxWidth: "480px",
              }}
            >
              How We Engineer Sound
            </h2>
          </div>

          <div
            className="steps-row"
            style={{
              display: "flex",
              gap: "0",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            {/* Connector line */}
            <div
              className="step-connector"
              style={{
                position: "absolute",
                top: "36px",
                left: "calc(33% / 2 + 32px)",
                right: "calc(33% / 2 + 32px)",
                height: "1px",
                background: "rgba(74,111,165,0.3)",
                zIndex: 0,
              }}
            />

            {steps.map((step, idx) => (
              <div
                key={step.number}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "0 32px",
                  position: "relative",
                  zIndex: 1,
                  borderLeft: idx > 0 ? "1px solid rgba(74,111,165,0.2)" : "none",
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "9999px",
                    background: "rgba(74,111,165,0.15)",
                    border: "1.5px solid rgba(74,111,165,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      letterSpacing: "0.2em",
                      color: "var(--accent)",
                      fontFamily: "var(--font-body)",
                      marginBottom: "8px",
                    }}
                  >
                    {step.number}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "#FAF9F7",
                      letterSpacing: "-0.01em",
                      marginBottom: "12px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(250,249,247,0.6)", fontFamily: "var(--font-body)" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL SPECS TABLE ── */}
      <section className="reveal" style={{ background: "var(--bg)", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ marginBottom: "48px" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              Full Specification
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginTop: "12px",
              }}
            >
              Built to Spec
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0",
              border: "1.5px solid rgba(26,26,46,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 20px 50px -12px #4A6FA520",
            }}
          >
            {features.map((f, i) => (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 28px",
                  borderBottom: i < features.length - 2 ? "1px solid rgba(26,26,46,0.07)" : "none",
                  borderRight: i % 2 === 0 ? "1px solid rgba(26,26,46,0.07)" : "none",
                  background: i % 2 === 0 ? "#fff" : "#FAF9F7",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{f.label}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-heading)" }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="reveal" style={{ background: "#fff", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ marginBottom: "56px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                Verified Reviews
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  marginTop: "12px",
                }}
              >
                What Listeners Say
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="0">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>4.9</span>
              <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>from 1,240 reviews</span>
            </div>
          </div>

          <div
            className="reviews-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {reviews.map((r) => (
              <div
                key={r.name}
                style={{
                  background: "var(--bg)",
                  border: "1.5px solid rgba(26,26,46,0.08)",
                  borderRadius: "16px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  boxShadow: "0 8px 30px -10px #4A6FA530",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px #4A6FA550";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 30px -10px #4A6FA530";
                }}
              >
                <StarRow count={r.rating} />
                <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--text)", fontFamily: "var(--font-body)" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "9999px",
                      background: "var(--surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#FAF9F7",
                      fontFamily: "var(--font-heading)",
                      flexShrink: 0,
                    }}
                  >
                    {r.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>{r.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{r.location} · {r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOU MIGHT ALSO LIKE ── */}
      <section className="reveal" style={{ background: "var(--bg)", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ marginBottom: "48px" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              Explore More
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginTop: "12px",
              }}
            >
              You Might Also Like
            </h2>
          </div>

          <div
            className="reco-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "28px",
            }}
          >
            {recommendedProducts.map((p) => (
              <article
                key={p.id}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                style={{
                  cursor: "pointer",
                  background: "#fff",
                  border: "1.5px solid rgba(26,26,46,0.08)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px -10px #4A6FA530",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px #4A6FA550";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 30px -10px #4A6FA530";
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <img
                    src={p.img}
                    alt={`earsound ${p.name}`}
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "6px" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "16px", lineHeight: 1.6 }}>{p.description}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, color: "var(--accent)" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
                      }}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "1.5px solid var(--accent)",
                        background: "transparent",
                        color: "var(--accent)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "transform 0.15s ease, background 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent)";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--accent)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── STICKY MOBILE BAR ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 24px",
            background: "var(--bg)",
            borderTop: "1px solid rgba(26,26,46,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 50,
            boxShadow: "0 -10px 30px -10px #1A1A2E20",
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.4rem", color: "var(--text)" }}>
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleAddToCart}
              style={{
                padding: "13px 20px",
                borderRadius: "12px",
                border: "2px solid var(--accent)",
                background: added ? "var(--accent)" : "transparent",
                color: added ? "#fff" : "var(--accent)",
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.25s ease, color 0.25s ease",
              }}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                padding: "13px 20px",
                borderRadius: "12px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}