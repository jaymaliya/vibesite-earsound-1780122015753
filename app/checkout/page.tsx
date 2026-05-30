"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CheckoutPage() {
  const { items = [], clearCart } = useCart() ?? {};
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) errs.pin = "Enter a valid 6-digit PIN code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    if (items.length === 0) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch (e) {
      setPaying(false);
    }
  }

  async function payNow() {
    if (!payData) return;
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [{ supportedMethods: "https://tez.google.com/pay", data: { pa: payData.upiId, tr: payData.orderId, am: String(payData.amount), cu: "INR" } }],
          { total: { label: "Total", amount: { currency: "INR", value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function handleConfirm() {
    if (!payData) return;
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "earsound",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart?.();
    } catch (e) {
      setConfirming(false);
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${hasError ? "#e53935" : "rgba(26,26,46,0.15)"}`,
    background: "#fff",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "6px",
    display: "block",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: "var(--font-body)",
  };

  const errorStyle: React.CSSProperties = {
    color: "#e53935",
    fontSize: "12px",
    marginTop: "4px",
    fontFamily: "var(--font-body)",
  };

  if (items.length === 0 && !paid) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "80px 24px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(74,111,165,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--text)", textAlign: "center" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", fontFamily: "var(--font-body)", textAlign: "center", maxWidth: "360px", lineHeight: 1.7 }}>
            Add some products to your cart before checking out.
          </p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{ padding: "16px 40px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "16px", cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "0 10px 30px -10px #4A6FA580" }}
          >
            Start Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", fontFamily: "var(--font-body)" }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "64px 24px 96px" }}>
        {/* Page heading */}
        <div style={{ marginBottom: "48px" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", display: "block", marginBottom: "8px" }}>
            Final Step
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, color: "var(--text)" }}>
            Complete Your Order
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: "48px", alignItems: "start" }}>
          {/* LEFT: Form */}
          <div>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", boxShadow: "0 8px 30px -10px #1A1A2E20" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px", letterSpacing: "-0.01em" }}>
                Delivery Details
              </h2>

              {/* Full Name */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
                  placeholder="Arjun Mehta"
                  style={inputStyle(!!errors.name)}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.name ? "#e53935" : "rgba(26,26,46,0.15)")}
                />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
                  placeholder="arjun@email.com"
                  style={inputStyle(!!errors.email)}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#e53935" : "rgba(26,26,46,0.15)")}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(prev => ({ ...prev, phone: "" })); }}
                  placeholder="9876543210"
                  style={inputStyle(!!errors.phone)}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.phone ? "#e53935" : "rgba(26,26,46,0.15)")}
                />
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>

              {/* Address */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Street Address</label>
                <textarea
                  value={address}
                  onChange={e => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: "" })); }}
                  placeholder="Flat 4B, Sunrise Apartments, MG Road"
                  rows={3}
                  style={{ ...inputStyle(!!errors.address), resize: "none", lineHeight: 1.6 }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.address ? "#e53935" : "rgba(26,26,46,0.15)")}
                />
                {errors.address && <p style={errorStyle}>{errors.address}</p>}
              </div>

              {/* City + State */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => { setCity(e.target.value); setErrors(prev => ({ ...prev, city: "" })); }}
                    placeholder="Mumbai"
                    style={inputStyle(!!errors.city)}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.city ? "#e53935" : "rgba(26,26,46,0.15)")}
                  />
                  {errors.city && <p style={errorStyle}>{errors.city}</p>}
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => { setState(e.target.value); setErrors(prev => ({ ...prev, state: "" })); }}
                    placeholder="Maharashtra"
                    style={inputStyle(!!errors.state)}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.state ? "#e53935" : "rgba(26,26,46,0.15)")}
                  />
                  {errors.state && <p style={errorStyle}>{errors.state}</p>}
                </div>
              </div>

              {/* PIN */}
              <div style={{ marginBottom: "8px" }}>
                <label style={labelStyle}>PIN Code</label>
                <input
                  type="text"
                  value={pin}
                  onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setErrors(prev => ({ ...prev, pin: "" })); }}
                  placeholder="400001"
                  style={inputStyle(!!errors.pin)}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.pin ? "#e53935" : "rgba(26,26,46,0.15)")}
                />
                {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
              </div>
            </div>

            {/* Payment Method badge */}
            <div style={{ marginTop: "20px", background: "rgba(74,111,165,0.06)", border: "1.5px solid rgba(74,111,165,0.2)", borderRadius: "16px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(74,111,165,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px", marginBottom: "2px" }}>Pay via UPI</p>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>Google Pay · PhonePe · Paytm · Any UPI app</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div style={{ position: "sticky", top: "96px" }}>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", boxShadow: "0 8px 30px -10px #1A1A2E20" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px", letterSpacing: "-0.01em" }}>
                Order Summary
              </h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", background: "var(--bg)", flexShrink: 0 }}>
                      <img
                        src={item.image || "/product-1.jpg"}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </p>
                      <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "2px" }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)", flexShrink: 0 }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(26,26,46,0.08)", marginBottom: "20px" }} />

              {/* Pricing breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--muted)", fontSize: "14px" }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--muted)", fontSize: "14px" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span style={{ fontWeight: 600, color: "#2e7d32", fontSize: "14px" }}>FREE</span>
                  ) : (
                    <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px" }}>₹{shipping}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p style={{ fontSize: "12px", color: "var(--muted)", background: "rgba(74,111,165,0.06)", padding: "8px 12px", borderRadius: "8px", lineHeight: 1.5 }}>
                    Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for free delivery
                  </p>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(26,26,46,0.08)", marginBottom: "20px" }} />

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>Total</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={paying}
                onMouseEnter={e => { if (!paying) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: paying ? "var(--muted)" : "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: paying ? "not-allowed" : "pointer",
                  transition: "transform 0.15s ease",
                  boxShadow: paying ? "none" : "0 10px 30px -10px #4A6FA580",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {paying ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                    </svg>
                    Pay via UPI
                  </>
                )}
              </button>

              {/* Trust micro-signals */}
              <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                {["256-bit SSL", "30-Day Returns", "Secure UPI"].map(label => (
                  <span key={label} style={{ fontSize: "11px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px", letterSpacing: "0.03em" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* PAYMENT OVERLAY */}
      {payData && !paid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,20,0.75)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 40px 80px -20px rgba(10,10,20,0.5)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>earsound</span>
              <button
                onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", background: "rgba(26,26,46,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(26,26,46,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(26,26,46,0.08)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Amount */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Amount Due</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.02em" }}>
                ₹{payData.amount?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Mobile: big button */}
            {isMobile ? (
              <div style={{ marginBottom: "24px" }}>
                {!paymentLaunched ? (
                  <>
                    <button
                      onClick={payNow}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      style={{ width: "100%", padding: "18px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "17px", cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "0 10px 30px -10px #4A6FA580" }}
                    >
                      Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                    </button>
                    <p style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>Opens Google Pay · PhonePe · Paytm</p>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "16px", background: "rgba(46,125,50,0.08)", borderRadius: "12px", border: "1px solid rgba(46,125,50,0.2)" }}>
                    <p style={{ color: "#2e7d32", fontWeight: 600, fontSize: "14px", lineHeight: 1.6 }}>
                      Payment app opened — confirm below once paid
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Desktop: QR */
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ display: "inline-block", padding: "12px", background: "#fff", borderRadius: "12px", border: "1.5px solid rgba(26,26,46,0.1)", boxShadow: "0 4px 16px rgba(26,26,46,0.08)" }}>
                  {payData.qrBase64 ? (
                    <img src={`data:image/png;base64,${payData.qrBase64}`} width={200} height={200} alt="UPI QR Code" style={{ display: "block" }} />
                  ) : (
                    <div style={{ width: "200px", height: "200px", background: "rgba(74,111,165,0.05)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ color: "var(--muted)", fontSize: "13px", textAlign: "center", padding: "16px" }}>QR loading…</p>
                    </div>
                  )}
                </div>
                <p style={{ marginTop: "10px", fontSize: "13px", color: "var(--muted)" }}>Scan with any UPI app</p>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(26,26,46,0.08)", marginBottom: "20px" }} />

            {/* Confirm section */}
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                After Payment
              </p>
              <input
                type="text"
                placeholder="UPI Transaction ID (optional)"
                value={upiTxnId}
                onChange={e => setUpiTxnId(e.target.value)}
                style={{ ...inputStyle(false), marginBottom: "12px", fontSize: "14px" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(26,26,46,0.15)")}
              />
              <button
                onClick={handleConfirm}
                disabled={confirming}
                onMouseEnter={e => { if (!confirming) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{ width: "100%", padding: "16px", background: confirming ? "var(--muted)" : "var(--primary)", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "15px", cursor: confirming ? "not-allowed" : "pointer", transition: "transform 0.15s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                {confirming ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Confirming…
                  </>
                ) : (
                  "I've Paid — Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {paid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,20,0.8)", backdropFilter: "blur(8px)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 36px", width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 40px 80px -20px rgba(10,10,20,0.5)" }}>
            {/* Green check */}
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(46,125,50,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)", marginBottom: "12px", letterSpacing: "-0.02em" }}>
              Order Confirmed!
            </h2>

            {payData && (
              <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "8px", fontFamily: "var(--font-body)" }}>
                Order #{payData.orderId?.slice(-8)}
              </p>
            )}

            <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px", fontFamily: "var(--font-body)" }}>
              We'll ship soon! You'll receive an update on your registered email.
            </p>

            <button
              onClick={() => router.push("/")}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{ width: "100%", padding: "16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "16px", cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "0 10px 30px -10px #4A6FA580" }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <Footer />
    </div>
  );
}