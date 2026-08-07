import { useState, useEffect } from "react"

interface LoginForm {
  registerNumber: string
  dateOfBirth: string
}

const BG_IMAGES = ["/siet-building.jpg", "/siet-campus.webp"]

// Inline CSS for animations
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }

  @keyframes kenBurns {
    0%   { transform: scale(1.0) translateX(0px); }
    50%  { transform: scale(1.08) translateX(-20px); }
    100% { transform: scale(1.0) translateX(0px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }

  @keyframes walk {
    0%   { transform: translateX(-120px); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateX(110vw); opacity: 0; }
  }

  @keyframes walkReverse {
    0%   { transform: translateX(110vw) scaleX(-1); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateX(-120px) scaleX(-1); opacity: 0; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    40%       { transform: translateY(-6px); }
    60%       { transform: translateY(-3px); }
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.4); }
    50%       { box-shadow: 0 0 0 12px rgba(255,215,0,0); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes bgFade {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes starFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
    50%       { transform: translateY(-20px) rotate(180deg); opacity: 1; }
  }

  .siet-card {
    animation: fadeSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 32px rgba(0,80,0,0.55) !important;
  }

  .login-btn:active:not(:disabled) {
    transform: translateY(0px) !important;
  }

  .input-field:focus {
    border-color: #006400 !important;
    box-shadow: 0 0 0 3px rgba(0,100,0,0.12) !important;
    background: #ffffff !important;
  }

  .bg-layer {
    animation: kenBurns 20s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    .siet-card { max-width: 96vw !important; }
    .banner-title { font-size: 18px !important; }
  }
`

// SVG Student figure — walking silhouette
function StudentFigure({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      width="40" height="70"
      viewBox="0 0 40 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style, opacity: 0.18 }}
    >
      {/* Head */}
      <circle cx="20" cy="8" r="7" fill="#FFD700" />
      {/* Body */}
      <rect x="13" y="16" width="14" height="22" rx="4" fill="#006400" />
      {/* Book */}
      <rect x="24" y="20" width="10" height="13" rx="2" fill="#FFD700" />
      <line x1="29" y1="20" x2="29" y2="33" stroke="#004d00" strokeWidth="1" />
      {/* Left arm */}
      <rect x="5" y="18" width="8" height="3" rx="1.5" fill="#006400" />
      {/* Legs */}
      <rect x="13" y="37" width="5" height="18" rx="2.5" fill="#004d00" />
      <rect x="22" y="37" width="5" height="18" rx="2.5" fill="#004d00" />
      {/* Feet */}
      <ellipse cx="15.5" cy="55" rx="5" ry="3" fill="#333" />
      <ellipse cx="24.5" cy="55" rx="5" ry="3" fill="#333" />
    </svg>
  )
}

// Floating graduation cap
function GradCap({ style }: { style: React.CSSProperties }) {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" style={{ ...style, opacity: 0.22 }}>
      <polygon points="18,2 36,12 18,22 0,12" fill="#FFD700" />
      <rect x="26" y="12" width="3" height="12" rx="1.5" fill="#FFD700" />
      <circle cx="27.5" cy="25" r="3" fill="#FFD700" />
      <ellipse cx="18" cy="22" rx="10" ry="5" fill="#006400" />
    </svg>
  )
}

// Floating star
function Star({ style }: { style: React.CSSProperties }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ ...style, opacity: 0.3 }}>
      <polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,12 3.5,15 5,9.5 1,6 6,6" fill="#FFD700" />
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

    // Slideshow every 15s
    const timer = setInterval(() => {
      setBgVisible(false)
      setTimeout(() => {
        setBgIndex(p => (p + 1) % BG_IMAGES.length)
        setBgVisible(true)
      }, 900)
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

  return (
    <>
      <style>{CSS}</style>
      <div style={{ width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000" }}>

        {/* ══ SIET BANNER — edge to edge ══ */}
        <div style={{ width: "100vw", lineHeight: 0, position: "relative", zIndex: 20, flexShrink: 0 }}>
          <img
            src="/siet-logo.png"
            alt="Sri Shakthi Institute of Engineering and Technology"
            style={{ width: "100%", height: "auto", display: "block", maxHeight: "130px", objectFit: "cover", objectPosition: "center top" }}
          />
          {/* Gold shimmer line below banner */}
          <div style={{
            height: "4px",
            background: "linear-gradient(90deg, #004d00, #FFD700 25%, #FFF9C4 50%, #FFD700 75%, #004d00)",
            backgroundSize: "200% auto",
            animation: "shimmer 3s linear infinite",
          }} />
        </div>

        {/* ══ Exam controller bar ══ */}
        <div style={{
          width: "100vw",
          background: "linear-gradient(90deg, #0a3d0a, #145214, #0a3d0a)",
          padding: "10px 0",
          textAlign: "center",
          flexShrink: 0,
          position: "relative",
          zIndex: 20,
          borderBottom: "1px solid rgba(255,215,0,0.3)",
        }}>
          <span style={{ color: "#FFD700", fontSize: "13px", fontWeight: "800", letterSpacing: "3px", textTransform: "uppercase" }}>
            ✦ &nbsp; Office of Controller of Examinations &nbsp; ✦
          </span>
        </div>

        {/* ══ HERO — full screen campus + animations ══ */}
        <div style={{ flex: 1, width: "100vw", minHeight: "calc(100vh - 186px)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", overflow: "hidden" }}>

          {/* Campus background — Ken Burns + crossfade */}
          <div
            className="bg-layer"
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `url('${BG_IMAGES[bgIndex]}')`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              transition: "opacity 0.9s ease",
              opacity: bgVisible ? 1 : 0,
            }}
          />

          {/* Gradient overlay — transparent so campus is vivid */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, rgba(0,50,0,0.38) 0%, rgba(0,20,0,0.15) 45%, rgba(0,50,0,0.38) 100%)",
          }} />

          {/* ── Animated walking students ── */}
          <StudentFigure style={{ position: "absolute", bottom: "60px", left: 0, animation: "walk 22s linear infinite" }} />
          <StudentFigure style={{ position: "absolute", bottom: "60px", left: 0, animation: "walk 22s linear 8s infinite" }} />
          <StudentFigure style={{ position: "absolute", bottom: "65px", left: 0, animation: "walkReverse 28s linear 4s infinite", transform: "scaleX(-1)" }} />

          {/* ── Floating graduation caps ── */}
          <GradCap style={{ position: "absolute", top: "12%", left: "8%", animation: "float 4s ease-in-out infinite" }} />
          <GradCap style={{ position: "absolute", top: "20%", right: "10%", animation: "float 5s ease-in-out 1.5s infinite" }} />
          <GradCap style={{ position: "absolute", bottom: "25%", left: "12%", animation: "float 3.5s ease-in-out 0.8s infinite" }} />
          <GradCap style={{ position: "absolute", bottom: "30%", right: "14%", animation: "float 4.5s ease-in-out 2s infinite" }} />

          {/* ── Floating stars ── */}
          <Star style={{ position: "absolute", top: "18%", left: "22%", animation: "starFloat 3s ease-in-out infinite" }} />
          <Star style={{ position: "absolute", top: "35%", right: "18%", animation: "starFloat 4s ease-in-out 1s infinite" }} />
          <Star style={{ position: "absolute", bottom: "40%", left: "18%", animation: "starFloat 3.5s ease-in-out 0.5s infinite" }} />
          <Star style={{ position: "absolute", top: "55%", right: "22%", animation: "starFloat 5s ease-in-out 2s infinite" }} />
          <Star style={{ position: "absolute", bottom: "20%", left: "35%", animation: "starFloat 4s ease-in-out 1.5s infinite" }} />

          {/* Slide indicator dots */}
          <div style={{ position: "absolute", bottom: "18px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 20 }}>
            {BG_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setBgVisible(false); setTimeout(() => { setBgIndex(i); setBgVisible(true) }, 400) }}
                style={{
                  width: i === bgIndex ? "28px" : "8px", height: "8px",
                  borderRadius: "4px", border: "none",
                  background: i === bgIndex ? "#FFD700" : "rgba(255,255,255,0.45)",
                  cursor: "pointer", transition: "all 0.4s ease", padding: 0,
                }}
              />
            ))}
          </div>

          {/* ══ LOGIN CARD ══ */}
          <div
            className="siet-card"
            style={{
              position: "relative", zIndex: 10,
              width: "100%", maxWidth: "420px",
              borderRadius: "20px", overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
            }}
          >
            {/* Gold shimmer top border */}
            <div style={{
              height: "4px",
              background: "linear-gradient(90deg, #b8860b, #FFD700, #FFF9C4, #FFD700, #b8860b)",
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite",
            }} />

            {/* Card header */}
            <div style={{ background: "linear-gradient(180deg, #005200 0%, #003800 100%)", padding: "24px 28px 20px", textAlign: "center" }}>
              {/* Animated icon */}
              <div style={{
                width: "54px", height: "54px", margin: "0 auto 14px",
                background: "rgba(255,215,0,0.15)", borderRadius: "50%",
                border: "2px solid rgba(255,215,0,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", animation: "pulse 2.5s ease-in-out infinite",
              }}>🎓</div>
              <div style={{ fontSize: "19px", fontWeight: "900", color: "#FFD700", letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: "1.2", marginBottom: "6px" }}>
                Examination Result Portal
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.3px" }}>
                Enter your credentials to view your results
              </div>
            </div>

            {/* Card body */}
            <div style={{ background: "rgba(255,255,255,0.98)", padding: "28px 28px 20px" }}>

              {/* Register number */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: "800", color: "#004d00", marginBottom: "8px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                  <span>🎫</span> Register Number
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g. 714024149040"
                  value={form.registerNumber}
                  onChange={e => setForm({ ...form, registerNumber: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{ width: "100%", padding: "13px 16px", border: "2px solid #e8e8e8", borderRadius: "10px", fontSize: "15px", outline: "none", transition: "all 0.2s", background: "#f8fff8", fontFamily: "inherit", letterSpacing: "0.5px" }}
                />
              </div>

              {/* Date of Birth */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: "800", color: "#004d00", marginBottom: "8px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                  <span>📅</span> Date of Birth
                </label>
                <input
                  className="input-field"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                  style={{ width: "100%", padding: "13px 16px", border: "2px solid #e8e8e8", borderRadius: "10px", fontSize: "15px", outline: "none", background: "#f8fff8", fontFamily: "inherit", transition: "all 0.2s" }}
                />
              </div>

              {error && (
                <div style={{ background: "#fff3f3", border: "2px solid #e57373", color: "#b71c1c", padding: "11px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
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
                    ? "#c0c0c0"
                    : "linear-gradient(135deg, #004d00 0%, #006400 40%, #007a00 60%, #004d00 100%)",
                  color: loading || !form.registerNumber || !form.dateOfBirth ? "#fff" : "#FFD700",
                  border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "900",
                  cursor: loading || !form.registerNumber || !form.dateOfBirth ? "not-allowed" : "pointer",
                  letterSpacing: "2px", textTransform: "uppercase", transition: "all 0.2s",
                  boxShadow: loading || !form.registerNumber || !form.dateOfBirth ? "none" : "0 6px 20px rgba(0,80,0,0.4)",
                }}
              >
                {loading ? "⏳ Verifying..." : "Get Result →"}
              </button>
            </div>

            {/* Card footer */}
            <div style={{ background: "#f0fff0", borderTop: "1px solid #c8e6c9", padding: "12px 20px", textAlign: "center", fontSize: "11px", color: "#666", letterSpacing: "0.3px" }}>
              For assistance, contact the Office of Controller of Examinations
            </div>

            {/* Gold shimmer bottom border */}
            <div style={{
              height: "4px",
              background: "linear-gradient(90deg, #b8860b, #FFD700, #FFF9C4, #FFD700, #b8860b)",
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite",
            }} />
          </div>
        </div>

        {/* ══ SCROLL-TRIGGERED FOOTER ══ */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: "linear-gradient(90deg, #002600 0%, #003d00 30%, #003d00 70%, #002600 100%)",
          borderTop: "2px solid #FFD700",
          padding: "11px 24px", textAlign: "center",
          fontSize: "12px", color: "#FFD700", fontWeight: "600", letterSpacing: "0.4px",
          transform: showFooter ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.4)",
        }}>
          ✦ &nbsp; Designed and developed by Cloud Computing and Cyber Security Research Laboratory Team, Sri Shakthi Institute of Engineering and Technology, Coimbatore. &nbsp; ✦
        </div>
      </div>
    </>
  )
}