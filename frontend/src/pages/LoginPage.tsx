import { useState, useEffect } from "react"

interface LoginForm {
  registerNumber: string
  dateOfBirth: string
}

const BG_IMAGES = ["/siet-building.jpg", "/siet-campus.webp"]

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { width: 100%; height: 100%; }
  body { margin: 0; padding: 0; overflow-x: hidden; width: 100vw; min-height: 100vh; }
  #root { width: 100vw; min-height: 100vh; }

  @keyframes kenBurns {
    0%   { transform: scale(1.0) translateX(0px); }
    50%  { transform: scale(1.08) translateX(-15px); }
    100% { transform: scale(1.0) translateX(0px); }
  }
  @keyframes starFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.55; }
    50%       { transform: translateY(-22px) rotate(180deg); opacity: 0.9; }
  }
  @keyframes shimmer {
    0%   { background-position: -400% center; }
    100% { background-position: 400% center; }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.5); }
    50%       { box-shadow: 0 0 0 14px rgba(255,215,0,0); }
  }
  @keyframes borderGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3), 0 30px 80px rgba(0,0,0,0.6); }
    50%       { box-shadow: 0 0 40px rgba(255,215,0,0.6), 0 30px 80px rgba(0,0,0,0.6); }
  }

  .siet-card {
    animation: fadeSlideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards, borderGlow 3s ease-in-out infinite;
  }
  .bg-layer { animation: kenBurns 25s ease-in-out infinite; }
  .shimmer-bar {
    background: linear-gradient(90deg, #004d00 0%, #FFD700 20%, #FFF9C4 50%, #FFD700 80%, #004d00 100%);
    background-size: 300% auto;
    animation: shimmer 4s linear infinite;
  }
  .login-btn { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
  .login-btn:hover:not(:disabled) {
    transform: translateY(-3px) !important;
    box-shadow: 0 16px 40px rgba(0,80,0,0.55) !important;
    filter: brightness(1.1);
  }
  .login-btn:active:not(:disabled) { transform: translateY(0px) !important; }
  .input-field { transition: all 0.2s ease !important; }
  .input-field:focus {
    border-color: #006400 !important;
    box-shadow: 0 0 0 4px rgba(0,100,0,0.12) !important;
    background: #ffffff !important;
    outline: none !important;
  }
  @media (max-width: 600px) {
    .siet-banner-img { max-height: 80px !important; }
    .siet-card { max-width: 95vw !important; border-radius: 14px !important; }
    .hero-section { padding: 24px 12px !important; }
  }
`

function Star({ style }: { style: React.CSSProperties }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style, filter: "drop-shadow(0 1px 6px rgba(255,215,0,0.7))" }}>
      <polygon
        points="10,1 12.9,7.2 20,8.2 14.9,13 16.2,20 10,16.8 3.8,20 5.1,13 0,8.2 7.1,7.2"
        fill="#FFD700" opacity="0.92"
      />
    </svg>
  )
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ registerNumber: "", dateOfBirth: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showFooter, setShowFooter] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)
  const [bgVisible, setBgVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => setShowFooter(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    const timer = setInterval(() => {
      setBgVisible(false)
      setTimeout(() => { setBgIndex(p => (p + 1) % BG_IMAGES.length); setBgVisible(true) }, 900)
    }, 15000)
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(timer) }
  }, [])

  const handleSubmit = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/student/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ register_number: form.registerNumber, date_of_birth: form.dateOfBirth }),
          signal: AbortSignal.timeout(30000),
        }
      )
      if (!res.ok) { setError("Invalid Register Number or Date of Birth"); return }
      const data = await res.json()
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("student", JSON.stringify(data.student))
      window.location.href = "/results"
    } catch { setError("Cannot connect to server. Please try again.") }
    finally { setLoading(false) }
  }

  const stars = [
    { top: "10%",    left: "6%",    delay: "0s",   dur: "3.2s", size: 18 },
    { top: "18%",    right: "8%",   delay: "1s",   dur: "4s",   size: 14 },
    { top: "35%",    left: "4%",    delay: "0.4s", dur: "3.8s", size: 20 },
    { top: "50%",    right: "5%",   delay: "1.8s", dur: "4.5s", size: 16 },
    { bottom: "32%", left: "7%",    delay: "0.8s", dur: "3.5s", size: 12 },
    { bottom: "22%", right: "9%",   delay: "2.2s", dur: "5s",   size: 18 },
    { top: "22%",    left: "40%",   delay: "1.4s", dur: "4.2s", size: 14 },
    { bottom: "40%", right: "38%",  delay: "0.6s", dur: "3.6s", size: 16 },
    { top: "65%",    left: "15%",   delay: "2s",   dur: "4.8s", size: 12 },
    { top: "75%",    right: "14%",  delay: "0.3s", dur: "3.4s", size: 14 },
    { top: "8%",     left: "55%",   delay: "1.6s", dur: "4s",   size: 10 },
    { bottom: "15%", left: "50%",   delay: "2.5s", dur: "5.2s", size: 12 },
  ]

  return (
    <>
      <style>{CSS}</style>
      <div style={{ width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#001a00", overflowX: "hidden" }}>

        {/* SIET BANNER — white background, full width, real image */}
        <div style={{ width: "100vw", background: "#ffffff", flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.18)", position: "relative", zIndex: 20 }}>
          <img
            className="siet-banner-img"
            src="/siet-logo.png"
            alt="Sri Shakthi Institute of Engineering and Technology"
            style={{ width: "100%", maxWidth: "1400px", height: "auto", maxHeight: "110px", objectFit: "contain", objectPosition: "center", display: "block", padding: "6px 12px" }}
          />
        </div>

        {/* Static gold-green divider — NO animation */}
        <div style={{ width: "100vw", height: "5px", flexShrink: 0, background: "linear-gradient(90deg, #004d00 0%, #FFD700 30%, #FFF9C4 50%, #FFD700 70%, #004d00 100%)" }} />

        {/* Exam controller bar */}
        <div style={{ width: "100vw", background: "linear-gradient(90deg, #0a3d0a 0%, #155215 40%, #155215 60%, #0a3d0a 100%)", padding: "10px 0", textAlign: "center", flexShrink: 0, zIndex: 20, borderBottom: "1px solid rgba(255,215,0,0.25)" }}>
          <span style={{ color: "#FFD700", fontSize: "13px", fontWeight: "800", letterSpacing: "4px", textTransform: "uppercase", textShadow: "0 1px 8px rgba(255,215,0,0.4)" }}>
            ✦ &nbsp; Office of Controller of Examinations &nbsp; ✦
          </span>
        </div>

        {/* HERO — full screen campus background */}
        <div className="hero-section" style={{ flex: 1, width: "100vw", minHeight: "calc(100vh - 170px)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px", overflow: "hidden" }}>

          {/* Campus background with Ken Burns */}
          <div className="bg-layer" style={{ position: "absolute", inset: 0, backgroundImage: `url('${BG_IMAGES[bgIndex]}')`, backgroundSize: "cover", backgroundPosition: "center 30%", backgroundRepeat: "no-repeat", transition: "opacity 0.9s ease-in-out", opacity: bgVisible ? 1 : 0 }} />

          {/* Light overlay — keeps campus vivid */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(0,40,0,0.42) 0%, rgba(0,15,0,0.18) 45%, rgba(0,40,0,0.42) 100%)" }} />

          {/* STARS ONLY — no human SVGs, no grad caps */}
          {stars.map((s, i) => (
            <div key={i} style={{ position: "absolute", ...s, animation: `starFloat ${s.dur} ease-in-out ${s.delay} infinite` }}>
              <Star style={{ width: s.size, height: s.size }} />
            </div>
          ))}

          {/* Slide indicator dots */}
          <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 20 }}>
            {BG_IMAGES.map((_, i) => (
              <button key={i}
                onClick={() => { setBgVisible(false); setTimeout(() => { setBgIndex(i); setBgVisible(true) }, 400) }}
                style={{ width: i === bgIndex ? "28px" : "8px", height: "8px", borderRadius: "4px", border: "none", background: i === bgIndex ? "#FFD700" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.4s ease", padding: 0 }}
              />
            ))}
          </div>

          {/* LOGIN CARD */}
          <div className="siet-card" style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "430px", borderRadius: "20px", overflow: "hidden", backdropFilter: "blur(6px)" }}>

            {/* Shimmer top border */}
            <div className="shimmer-bar" style={{ height: "4px" }} />

            {/* Card header — SIET shield logo, NO emoji, NO grad cap */}
            <div style={{ background: "linear-gradient(180deg, #004a00 0%, #002e00 100%)", padding: "24px 28px 20px", textAlign: "center" }}>
              <div style={{ width: "70px", height: "70px", margin: "0 auto 14px", animation: "pulse 2.8s ease-in-out infinite", borderRadius: "50%", overflow: "hidden", border: "2.5px solid rgba(255,215,0,0.6)", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src="/siet-shield.jpg"
                  alt="SIET Shield"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ fontSize: "19px", fontWeight: "900", color: "#FFD700", letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: "1.2", marginBottom: "7px", textShadow: "0 2px 12px rgba(255,215,0,0.3)" }}>
                Examination Result Portal
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.3px" }}>
                Enter your credentials to view your results
              </div>
            </div>

            {/* Card body */}
            <div style={{ background: "rgba(255,255,255,0.98)", padding: "30px 28px 22px" }}>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: "800", color: "#004000", marginBottom: "9px", letterSpacing: "1.4px", textTransform: "uppercase" }}>
                  <span style={{ fontSize: "15px" }}>🎫</span> Register Number
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g. 714024149040"
                  value={form.registerNumber}
                  onChange={e => setForm({ ...form, registerNumber: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{ width: "100%", padding: "13px 16px", border: "2px solid #e4e4e4", borderRadius: "10px", fontSize: "15px", outline: "none", background: "#f5fff5", fontFamily: "inherit", letterSpacing: "0.5px" }}
                />
              </div>

              <div style={{ marginBottom: "26px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: "800", color: "#004000", marginBottom: "9px", letterSpacing: "1.4px", textTransform: "uppercase" }}>
                  <span style={{ fontSize: "15px" }}>📅</span> Date of Birth
                </label>
                <input
                  className="input-field"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                  style={{ width: "100%", padding: "13px 16px", border: "2px solid #e4e4e4", borderRadius: "10px", fontSize: "15px", outline: "none", background: "#f5fff5", fontFamily: "inherit" }}
                />
              </div>

              {error && (
                <div style={{ background: "#fff0f0", border: "2px solid #e57373", color: "#b71c1c", padding: "12px 15px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                  ⚠ {error}
                </div>
              )}

              <button
                className="login-btn"
                onClick={handleSubmit}
                disabled={loading || !form.registerNumber || !form.dateOfBirth}
                style={{
                  width: "100%", padding: "15px",
                  background: loading || !form.registerNumber || !form.dateOfBirth
                    ? "#c8c8c8"
                    : "linear-gradient(135deg, #003d00 0%, #006400 35%, #007a00 65%, #003d00 100%)",
                  color: loading || !form.registerNumber || !form.dateOfBirth ? "#999" : "#FFD700",
                  border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "900",
                  cursor: loading || !form.registerNumber || !form.dateOfBirth ? "not-allowed" : "pointer",
                  letterSpacing: "2.5px", textTransform: "uppercase",
                  boxShadow: loading || !form.registerNumber || !form.dateOfBirth ? "none" : "0 6px 24px rgba(0,80,0,0.4)",
                  textShadow: loading || !form.registerNumber || !form.dateOfBirth ? "none" : "0 1px 6px rgba(255,215,0,0.3)",
                }}
              >
                {loading ? "⏳  Verifying..." : "Get Result  →"}
              </button>
            </div>

            {/* Card footer */}
            <div style={{ background: "#f0fff0", borderTop: "1px solid #c8e6c9", padding: "13px 20px", textAlign: "center", fontSize: "11px", color: "#5a7a5a", letterSpacing: "0.3px" }}>
              For assistance, contact the Office of Controller of Examinations
            </div>

            {/* Shimmer bottom border */}
            <div className="shimmer-bar" style={{ height: "4px" }} />
          </div>
        </div>

        {/* SCROLL-TRIGGERED FOOTER */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: "linear-gradient(90deg, #001a00 0%, #003300 25%, #003300 75%, #001a00 100%)",
          borderTop: "2px solid #FFD700",
          padding: "11px 20px", textAlign: "center",
          fontSize: "12px", color: "#FFD700", fontWeight: "600", letterSpacing: "0.4px",
          transform: showFooter ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 -6px 24px rgba(0,0,0,0.5)",
        }}>
          ✦ &nbsp; Designed and developed by Cloud Computing and Cyber Security Research Laboratory Team,
          Sri Shakthi Institute of Engineering and Technology, Coimbatore. &nbsp; ✦
        </div>
      </div>
    </>
  )
}
