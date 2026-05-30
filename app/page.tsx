"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Build Best Website", description: "build me the best website for selling this earphones", price: 249 },
  { id: 2, img: "/product-2.jpg", name: "Premium Product", description: "a premium product", price: 200 },
  { id: 3, img: "/product-3.jpg", name: "Premium Product", description: "a premium product", price: 300 },
  { id: 4, img: "/product-4.jpg", name: "Premium Product", description: "a premium product", price: 400 },
];

const reviews = [
  { name: "Arjun Mehta", location: "Mumbai", rating: 5, text: "The sound clarity is unreal. I tested a dozen earphones before landing on earsound — nothing compares at this price.", avatar: "AM" },
  { name: "Priya Sharma", location: "Bangalore", rating: 5, text: "Wore these for a 6-hour flight. Comfort was perfect, noise isolation was everything I needed. Already recommended to five friends.", avatar: "PS" },
  { name: "Rohit Nair", location: "Delhi", rating: 5, text: "Premium build, premium sound. The bass hits hard without muddying the mids. Exactly what an audiophile wants.", avatar: "RN" },
];

const benefits = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    label: "Studio-Grade Sound",
    desc: "40mm dynamic drivers tuned by engineers who care about audio, not marketing specs.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "36-Hour Battery",
    desc: "All-day listening. Charge once, forget about it for days.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    label: "10-Minute Quick Charge",
    desc: "Flat battery? Plug in for 10 minutes and get 3 more hours of playback.",
  },
];

const guarantees = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    label: "30-Day Returns",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    label: "Free Delivery above ₹499",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
    label: "100% Authentic",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    label: "Made in India",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "24/7 Support",
  },
];

const howItWorks = [
  { step: "01", title: "Choose Your Sound", body: "Browse earphones built for different listening profiles — bass-forward, balanced, or reference-grade flat response." },
  { step: "02", title: "We Ship Fast", body: "Orders placed before 3 PM ship the same day. Pan-India delivery in 2–4 business days." },
  { step: "03", title: "Plug In. Hear the Difference.", body: "30 days to decide. If earsound doesn't change how you hear music, return it. No questions." },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
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
      .reveal { opacity: 1; transform: none; }
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1); }
      .visible { opacity: 1 !important; transform: translateY(0) !important; }
      .stagger-1 { transition-delay: 0.05s !important; }
      .stagger-2 { transition-delay: 0.12s !important; }
      .stagger-3 { transition-delay: 0.19s !important; }
      .stagger-4 { transition-delay: 0.26s !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
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

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds((prev) => [...prev, p.id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((x) => x !== p.id)), 1500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubState("loading");
    try {
      await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setSubState("done");
      setEmail("");
    } catch {
      setSubState("error");
    }
  };

  const StarRow = ({ count }: { count: number }) => (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#4A6FA5" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>
      <Navbar />

      {/* ─── HERO — EDITORIAL ASYMMETRIC ─── */}
      <section style={{ background: "var(--bg)", minHeight: "92vh", position: "relative", display: "flex", alignItems: "stretch", overflow: "hidden" }}>
        {/* Decorative background element */}
        <div style={{ position: "absolute", right: 0, top: 0, width: "55%", height: "100%", background: "var(--primary)", zIndex: 0, clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />

        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: isMobile ? "80px 24px 64px" : "0 64px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", alignItems: "center", width: "100%", position: "relative", zIndex: 1, gap: 0, minHeight: "92vh" }}>

          {/* LEFT — Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", paddingRight: isMobile ? 0 : "48px", paddingTop: isMobile ? 0 : "0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--accent)" }}>
              we sell sound
            </span>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(3.5rem, 7vw, 7rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.025em", color: "var(--text)", textTransform: "uppercase" }}>
              Hear<br />
              <span style={{ color: "var(--accent)" }}>Every</span><br />
              Detail.
            </h1>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: "420px" }}>
              Earphones engineered for people who are serious about audio. No compromises. No fluff. Just sound.
            </p>

            {/* Trust signals */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", fontSize: "0.8125rem", color: "var(--muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <StarRow count={5} />
                <span>4.9 · 10,000+ reviews</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" /></svg>
                Made in India
              </span>
              <span>Free delivery above ₹499</span>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/shop")}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{ padding: "16px 44px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--accent)", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.05em", textTransform: "uppercase", boxShadow: "0 12px 32px -8px #4A6FA580", transition: "transform 0.15s ease" }}
              >
                Shop Now
              </button>
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{ padding: "16px 32px", borderRadius: "12px", border: "2px solid var(--primary)", cursor: "pointer", background: "transparent", color: "var(--text)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.05em", textTransform: "uppercase", transition: "transform 0.15s ease" }}
              >
                How It Works
              </button>
            </div>
          </div>

          {/* RIGHT — Product image breaking the grid */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: isMobile ? "40px" : "0" }}>
            {/* Large rotated label */}
            <div style={{ position: "absolute", top: isMobile ? "8px" : "40px", left: isMobile ? "8px" : "-24px", zIndex: 10, transform: "rotate(-3deg)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "#FAF9F7", background: "var(--accent)", padding: "6px 14px", borderRadius: "9999px", display: "block" }}>
                New Drop
              </span>
            </div>
            <div style={{ overflow: "hidden", borderRadius: "24px", boxShadow: "0 48px 80px -16px #1A1A2E60", width: "100%", maxWidth: "520px", marginLeft: isMobile ? 0 : "32px" }}>
              <img
                src="/product-1.jpg"
                alt="earsound flagship earphones — studio-grade audio"
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            {/* Price badge */}
            <div style={{ position: "absolute", bottom: isMobile ? "8px" : "32px", right: isMobile ? "8px" : "-8px", background: "#FAF9F7", borderRadius: "16px", padding: "16px 24px", boxShadow: "0 16px 40px -8px #1A1A2E40", zIndex: 10 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--muted)", fontWeight: 600 }}>Starting at</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1.1 }}>₹200</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ROW ─── */}
      <section className="reveal" style={{ background: "var(--bg)", padding: isMobile ? "64px 24px" : "96px 64px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--accent)" }}>Why earsound</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginTop: "12px", textTransform: "uppercase" }}>Built different.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "32px" }}>
            {benefits.map((b, i) => (
              <div
                key={i}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 24px 48px -12px #4A6FA550"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px #1A1A2E20"; }}
                style={{ background: "#fff", borderRadius: "16px", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 24px -8px #1A1A2E20", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", cursor: "default" }}
              >
                <div style={{ color: "var(--accent)", width: "48px", height: "48px", background: "#EEF2F8", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {b.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>{b.label}</h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST / GUARANTEE ROW ─── */}
      <section className="reveal" style={{ background: "var(--primary)", padding: isMobile ? "40px 24px" : "48px 64px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: isMobile ? "24px" : "0" }}>
          {guarantees.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#FAF9F7", padding: isMobile ? "0" : "0 40px", borderRight: (!isMobile && i < guarantees.length - 1) ? "1px solid #ffffff18" : "none" }}>
              <span style={{ color: "var(--accent)", flexShrink: 0 }}>{g.icon}</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{g.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="reveal" style={{ background: "var(--bg)", padding: isMobile ? "64px 24px" : "96px 64px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--accent)" }}>Our Range</span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginTop: "8px", textTransform: "uppercase" }}>Bestsellers.</h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{ padding: "12px 28px", borderRadius: "12px", border: "2px solid var(--primary)", cursor: "pointer", background: "transparent", color: "var(--text)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.8125rem", letterSpacing: "0.08em", textTransform: "uppercase", transition: "transform 0.15s ease" }}
            >
              View All
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "32px" }}>
            {products.map((p) => (
              <article
                key={p.id}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 24px 48px -12px #4A6FA550"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px #1A1A2E20"; }}
                style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 24px -8px #1A1A2E20", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer" }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                <div style={{ overflow: "hidden" }}>
                  <img
                    src={p.img}
                    alt={`${p.name} — earsound earphones`}
                    style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "6px" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "16px" }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--accent)" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      style={{ padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", background: addedIds.includes(p.id) ? "#22c55e" : "var(--accent)", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "uppercase", transition: "transform 0.15s ease, background 0.3s ease" }}
                    >
                      {addedIds.includes(p.id) ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="reveal" style={{ background: "var(--primary)", padding: isMobile ? "64px 24px" : "96px 64px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--accent)" }}>The Process</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginTop: "12px", textTransform: "uppercase", color: "#FAF9F7" }}>How It Works.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "32px", position: "relative" }}>
            {/* Connector line — desktop only */}
            {!isMobile && (
              <div style={{ position: "absolute", top: "36px", left: "calc(16.67% + 16px)", right: "calc(16.67% + 16px)", height: "2px", background: "linear-gradient(90deg, var(--accent), #4A6FA540)", zIndex: 0 }} />
            )}
            {howItWorks.map((h, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", zIndex: 1 }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "9999px", background: i === 0 ? "var(--accent)" : "#ffffff12", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid", borderColor: i === 0 ? "var(--accent)" : "#ffffff20" }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: i === 0 ? "#fff" : "var(--accent)" }}>{h.step}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 700, color: "#FAF9F7", letterSpacing: "-0.01em" }}>{h.title}</h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--muted)" }}>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="reveal" style={{ background: "var(--bg)", padding: isMobile ? "64px 24px" : "96px 64px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--accent)" }}>Social Proof</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginTop: "12px", textTransform: "uppercase" }}>People Are Listening.</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "16px" }}>
              <StarRow count={5} />
              <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>4.9 average · 10,000+ verified reviews</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "32px" }}>
            {reviews.map((r, i) => (
              <div
                key={i}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 24px 48px -12px #4A6FA550"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px #1A1A2E20"; }}
                style={{ background: "#fff", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 8px 24px -8px #1A1A2E20", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)" }}
              >
                <StarRow count={r.rating} />
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--text)", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.75rem", fontWeight: 700, color: "#FAF9F7" }}>{r.avatar}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)" }}>{r.name}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="reveal" style={{ background: "var(--surface)", padding: isMobile ? "64px 24px" : "96px 64px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "24px" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 700, color: "var(--accent)" }}>Stay In The Loop</span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FAF9F7", lineHeight: 1.0 }}>
            First Access.<br />Always.
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)" }}>
            New drops. Limited editions. Exclusive listener offers. Join 50,000+ audiophiles who get it first.
          </p>
          {subState === "done" ? (
            <div style={{ padding: "20px 32px", borderRadius: "12px", background: "#ffffff15", color: "#FAF9F7", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem" }}>
              ✓ You're in. Welcome to earsound.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "12px", width: "100%" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ flex: 1, padding: "16px 20px", borderRadius: "12px", border: "none", background: "#ffffff12", color: "#FAF9F7", fontFamily: "var(--font-body)", fontSize: "0.9375rem", outline: "none", backdropFilter: "blur(4px)" }}
              />
              <button
                type="submit"
                disabled={subState === "loading"}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{ padding: "16px 36px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--accent)", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase", transition: "transform 0.15s ease", boxShadow: "0 10px 28px -8px #4A6FA580", whiteSpace: "nowrap" }}
              >
                {subState === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {subState === "error" && (
            <p style={{ fontSize: "0.875rem", color: "#ff6b6b" }}>Something went wrong. Please try again.</p>
          )}
          <p style={{ fontSize: "0.8125rem", color: "var(--muted)", opacity: 0.7 }}>No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}