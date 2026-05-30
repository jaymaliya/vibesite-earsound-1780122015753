"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Earsound Pro Elite", description: "Premium wireless earphones with active noise cancellation and 48-hour battery life", price: 4999, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Earsound Studio Compact", description: "Studio-grade sound quality with touch controls and wireless charging case", price: 3499, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Earsound Sport Burst", description: "Water-resistant sports earphones with secure fit and power bass", price: 2799, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Earsound Classic Pure", description: "Crystal clear audio with noise isolation and 30-hour total playtime", price: 1999, badge: "" }
];

const filters = ["All", "Wireless", "Wired", "Noise Cancelling", "Sports"];

const starSVG = (filled: boolean) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" style={{ color: "#4A6FA5" }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
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
      .reveal { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease, transform 0.6s ease; }
      .will-reveal { opacity: 0; transform: translateY(24px); }
      .visible { opacity: 1 !important; transform: translateY(0) !important; }
      .product-row { border: 1px solid rgba(26,26,46,0.09); border-radius: 20px; padding: 28px; background: #fff; display: flex; gap: 36px; align-items: stretch; cursor: pointer; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 4px 18px -8px rgba(26,26,46,0.10); }
      .product-row:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -12px rgba(74,111,165,0.22); }
      .img-wrap { overflow: hidden; border-radius: 14px; flex-shrink: 0; width: 280px; min-height: 220px; background: var(--bg); }
      .img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; display: block; }
      .img-wrap:hover img { transform: scale(1.05); }
      .filter-pill { border: 1.5px solid rgba(26,26,46,0.14); border-radius: 9999px; padding: 8px 20px; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: transparent; color: var(--muted); font-family: var(--font-body); transition: all 0.2s ease; letter-spacing: 0.04em; }
      .filter-pill.active, .filter-pill:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
      .btn-cart { border: none; border-radius: 12px; padding: 12px 26px; font-size: 0.875rem; font-weight: 700; cursor: pointer; background: var(--accent); color: #fff; font-family: var(--font-body); letter-spacing: 0.04em; transition: transform 0.15s ease; box-shadow: 0 6px 20px -6px rgba(74,111,165,0.40); }
      .btn-cart:hover { transform: scale(1.02); }
      .btn-cart:active { transform: scale(0.98); }
      .btn-detail { border: 1.5px solid rgba(26,26,46,0.16); border-radius: 12px; padding: 12px 26px; font-size: 0.875rem; font-weight: 600; cursor: pointer; background: transparent; color: var(--primary); font-family: var(--font-body); letter-spacing: 0.04em; transition: transform 0.15s ease; }
      .btn-detail:hover { transform: scale(1.02); background: rgba(26,26,46,0.04); }
      .btn-detail:active { transform: scale(0.98); }
      @media (max-width: 768px) {
        .product-row { flex-direction: column; gap: 20px; padding: 20px; }
        .img-wrap { width: 100% !important; min-height: 200px; }
        .shop-hero-grid { grid-template-columns: 1fr !important; }
        .shop-hero-img { display: none; }
        .filter-row { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
        .filter-row::-webkit-scrollbar { display: none; }
      }
      @media (max-width: 480px) {
        .product-row { padding: 16px; }
      }
    `;
    document.head.appendChild(style);

    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach(el => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver((entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove("will-reveal");
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => { io.disconnect(); document.head.removeChild(style); };
  }, []);

  function handleAddToCart(e: React.MouseEvent, p: typeof products[0]) {
    e.stopPropagation();
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [p.id]: false })), 1500);
  }

  function handleCardClick(p: typeof products[0]) {
    router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <Navbar />

      {/* ── SHOP HERO ── */}
      <section style={{ background: "var(--primary)", overflow: "hidden", position: "relative" }}>
        <div
          className="shop-hero-grid"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "80px 48px 72px",
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "64px",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left: editorial text block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              The Collection
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: "#FAF9F7",
                margin: 0,
              }}
            >
              Every
              <br />
              <span style={{ color: "var(--accent)", fontStyle: "italic" }}>sound.</span>
              <br />
              Yours.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "rgba(250,249,247,0.62)",
                maxWidth: "420px",
                margin: 0,
              }}
            >
              Four meticulously engineered earphones. Designed for the listener who doesn't settle — for commutes, studio sessions, workouts, or silence.
            </p>
            {/* Trust row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "8px" }}>
              {[
                { icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ), label: "Free delivery above ₹499" },
                { icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ), label: "30-day returns" },
                { icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ), label: "4.8 / 5 — 2,400 reviews" },
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "0.8rem",
                    color: "rgba(250,249,247,0.55)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ color: "var(--accent)" }}>{t.icon}</span>
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: asymmetric product image */}
          <div
            className="shop-hero-img"
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            {/* Decorative ring */}
            <div
              style={{
                position: "absolute",
                top: "-24px",
                right: "-24px",
                width: "340px",
                height: "340px",
                borderRadius: "50%",
                border: "1.5px solid rgba(74,111,165,0.22)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                border: "1px solid rgba(74,111,165,0.10)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                overflow: "hidden",
                borderRadius: "20px",
                width: "320px",
                height: "380px",
                boxShadow: "0 40px 80px -20px rgba(74,111,165,0.40)",
                position: "relative",
                zIndex: 1,
                marginRight: "8px",
                marginBottom: "8px",
              }}
            >
              <img
                src="/product-1.jpg"
                alt="earsound flagship earphones"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "0",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 18px",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                boxShadow: "0 8px 24px -6px rgba(74,111,165,0.50)",
                zIndex: 2,
                lineHeight: 1.3,
              }}
            >
              <div style={{ opacity: 0.8, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "3px" }}>Starting at</div>
              <div style={{ fontSize: "1.2rem" }}>₹200</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER ROW ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "36px 48px 0",
        }}
      >
        <div
          className="filter-row reveal"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--muted)",
              fontWeight: 600,
              marginRight: "8px",
              whiteSpace: "nowrap",
            }}
          >
            Filter
          </span>
          {filters.map(f => (
            <button
              key={f}
              className={`filter-pill${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: "var(--muted)",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {products.length} products
          </span>
        </div>
      </div>

      {/* ── HORIZONTAL LIST ROWS ── */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 48px 96px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {products.map((p, index) => (
          <div
            key={p.id}
            className="product-row reveal"
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => handleCardClick(p)}
          >
            {/* Left: product image */}
            <div className="img-wrap">
              <img
                src={p.img}
                alt={`earsound ${p.name} earphones`}
              />
            </div>

            {/* Right: product details */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingTop: "4px",
              }}
            >
              {/* Top: badge + name + stars */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      fontWeight: 700,
                      color: "var(--accent)",
                      background: "rgba(74,111,165,0.10)",
                      borderRadius: "9999px",
                      padding: "3px 10px",
                    }}
                  >
                    {index === 0 ? "Bestseller" : index === 1 ? "New Arrival" : index === 2 ? "Editor's Pick" : "Limited"}
                  </span>
                  {index === 0 && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        color: "#fff",
                        background: "var(--primary)",
                        borderRadius: "9999px",
                        padding: "3px 10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      ★ Top Rated
                    </span>
                  )}
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.4rem, 2vw, 1.75rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    margin: "0 0 8px",
                    lineHeight: 1.15,
                  }}
                >
                  {p.name}
                </h2>

                {/* Stars */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "14px" }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s}>{starSVG(true)}</span>
                  ))}
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      color: "var(--muted)",
                      marginLeft: "6px",
                      fontWeight: 500,
                    }}
                  >
                    4.{8 + index % 2} ({200 + index * 83} reviews)
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.925rem",
                    lineHeight: 1.7,
                    color: "var(--muted)",
                    margin: "0 0 20px",
                    maxWidth: "520px",
                  }}
                >
                  {p.description.charAt(0).toUpperCase() + p.description.slice(1)}. Engineered for pure audio fidelity — whether you're on stage or the subway.
                </p>

                {/* Feature chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                  {[
                    ["Bluetooth 5.3", index === 0 || index === 2],
                    ["ANC", index === 2 || index === 3],
                    ["36hr Battery", true],
                    ["IPX5", index === 1 || index === 3],
                    ["10-min Charge", true],
                  ].filter(([, show]) => show).map(([label]) => (
                    <span
                      key={label as string}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--surface)",
                        background: "rgba(58,58,92,0.07)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {label as string}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: price + CTAs */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                  borderTop: "1px solid rgba(26,26,46,0.07)",
                  paddingTop: "20px",
                }}
              >
                {/* Price block */}
                <div style={{ marginRight: "auto" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: "var(--text)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      marginTop: "3px",
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginRight: "6px",
                        opacity: 0.7,
                      }}
                    >
                      ₹{Math.round(p.price * 1.28).toLocaleString("en-IN")}
                    </span>
                    <span style={{ color: "#4A6FA5", fontWeight: 700 }}>Save {Math.round(22 - index * 2)}%</span>
                  </div>
                </div>

                {/* View Details */}
                <button
                  className="btn-detail"
                  onClick={e => { e.stopPropagation(); handleCardClick(p); }}
                >
                  View Details
                </button>

                {/* Add to Cart */}
                <button
                  className="btn-cart"
                  onClick={e => handleAddToCart(e, p)}
                >
                  {addedIds[p.id] ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added ✓
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* ── BOTTOM BANNER — How it works teaser ── */}
      <section
        className="reveal"
        style={{
          background: "var(--primary)",
          padding: "80px 48px",
        }}
      >
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              The Experience
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#FAF9F7",
                margin: "12px 0 0",
                lineHeight: 1.1,
              }}
            >
              How earsound works
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "32px",
            }}
          >
            {[
              {
                step: "01",
                title: "Choose Your Sound",
                desc: "Pick the earphone that matches your listening life — commute, studio, gym, or all three.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "We Ship in 24hrs",
                desc: "Orders placed before 5 PM ship the same day. Delivered to your door in 2–4 business days.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Plug In & Hear the Difference",
                desc: "First listen tells you everything. 40mm drivers, tuned by engineers who actually love music.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                ),
              },
              {
                step: "04",
                title: "30-Day Love It Guarantee",
                desc: "Not blown away? Return it. No questions asked. We back every pair, unconditionally.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(74,111,165,0.18)",
                  borderRadius: "20px",
                  padding: "32px 28px",
                  position: "relative",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(74,111,165,0.30)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    fontFamily: "var(--font-heading)",
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    color: "rgba(74,111,165,0.12)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {item.step}
                </div>
                <div style={{ color: "var(--accent)", marginBottom: "16px" }}>
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#FAF9F7",
                    margin: "0 0 10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    color: "rgba(250,249,247,0.55)",
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}