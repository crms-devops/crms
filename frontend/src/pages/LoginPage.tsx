import { useState, useEffect } from "react"

interface LoginForm {
  registerNumber: string
  dateOfBirth: string
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ registerNumber: "", dateOfBirth: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowFooter(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/student/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            register_number: form.registerNumber,
            date_of_birth: form.dateOfBirth,
          }),
          signal: AbortSignal.timeout(30000),
        }
      )
      if (!res.ok) { setError("Invalid Register Number or Date of Birth"); return }
      const data = await res.json()
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("student", JSON.stringify(data.student))
      window.location.href = "/results"
    } catch {
      setError("Cannot connect to server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      overflowX: "hidden",
    }}>

      {/* ── SIET banner image — full width, top of page ── */}
      <div style={{
        width: "100%",
        lineHeight: 0,
        boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
      }}>
        <img
          src="/siet-logo.png"
          alt="Sri Shakthi Institute of Engineering and Technology"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxHeight: "120px",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </div>

      {/* ── Yellow accent line ── */}
      <div style={{ height: "5px", background: "linear-gradient(90deg, #006400, #FFD700, #006400)" }} />

      {/* ── Green exam controller bar ── */}
      <div style={{
        background: "#1a6b1a",
        padding: "8px 0",
        textAlign: "center",
        letterSpacing: "2.5px",
      }}>
        <span style={{ color: "#FFD700", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>
          Office of Controller of Examinations
        </span>
      </div>

      {/* ── Full screen campus background section ── */}
      <div style={{
        flex: 1,
        position: "relative",
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>

        {/* Campus background image — full clear */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/siet-building.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }} />

        {/* Very light overlay so campus is clearly visible */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 60, 0, 0.35)",
        }} />

        {/* Login card */}
        <div style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(255,255,255,0.96)",
          borderRadius: "6px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          overflow: "hidden",
          border: "2px solid #FFD700",
        }}>

          {/* Card top stripe */}
          <div style={{ height: "5px", background: "linear-gradient(90deg, #006400, #FFD700, #006400)" }} />

          {/* Card header */}
          <div style={{
            background: "#006400",
            padding: "18px 24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#FFD700", letterSpacing: "1px" }}>
              EXAMINATION RESULT PORTAL
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", marginTop: "4px" }}>
              Enter your details to view your results
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: "28px 28px 20px" }}>

            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#006400",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Register Number
              </label>
              <input
                type="text"
                placeholder="e.g. 714024149040"
                value={form.registerNumber}
                onChange={e => setForm({ ...form, registerNumber: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s",
                  background: "#fafff8",
                }}
                onFocus={e => e.target.style.borderColor = "#006400"}
                onBlur={e => e.target.style.borderColor = "#ccc"}
              />
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#006400",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  background: "#fafff8",
                }}
                onFocus={e => e.target.style.borderColor = "#006400"}
                onBlur={e => e.target.style.borderColor = "#ccc"}
              />
            </div>

            {error && (
              <div style={{
                background: "#fdecea",
                border: "1px solid #e57373",
                color: "#b71c1c",
                padding: "10px 14px",
                borderRadius: "4px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !form.registerNumber || !form.dateOfBirth}
              style={{
                width: "100%",
                padding: "13px",
                background: loading || !form.registerNumber || !form.dateOfBirth
                  ? "#aaa"
                  : "linear-gradient(135deg, #006400 0%, #1a8a1a 100%)",
                color: loading || !form.registerNumber || !form.dateOfBirth ? "white" : "#FFD700",
                border: "none",
                borderRadius: "4px",
                fontSize: "15px",
                fontWeight: "800",
                cursor: loading || !form.registerNumber || !form.dateOfBirth ? "not-allowed" : "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(0,100,0,0.3)",
              }}
            >
              {loading ? "Verifying..." : "GET RESULT →"}
            </button>
          </div>

          {/* Card footer note */}
          <div style={{
            background: "#f0fff0",
            borderTop: "1px solid #c8e6c9",
            padding: "10px 20px",
            textAlign: "center",
            fontSize: "11px",
            color: "#555",
          }}>
            For assistance, contact the Office of Controller of Examinations
          </div>

          {/* Bottom stripe */}
          <div style={{ height: "4px", background: "linear-gradient(90deg, #006400, #FFD700, #006400)" }} />
        </div>
      </div>

      {/* ── Scroll-triggered sticky footer ── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(0, 60, 0, 0.95)",
        borderTop: "2px solid #FFD700",
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "12px",
        color: "#FFD700",
        fontWeight: "500",
        letterSpacing: "0.3px",
        transform: showFooter ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s ease",
        zIndex: 100,
      }}>
        Designed and developed by Cloud Computing and Cyber Security Research Laboratory Team,
        Sri Shakthi Institute of Engineering and Technology, Coimbatore.
      </div>
    </div>
  )
}