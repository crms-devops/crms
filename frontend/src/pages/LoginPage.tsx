import { useState } from "react"

interface LoginForm {
  registerNumber: string
  dateOfBirth: string
}

const RESET_CSS = `
  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
    height: 100% !important;
    min-height: 0 !important;
    overflow: hidden !important;
    display: block !important;
    text-align: left !important;
    border: none !important;
    background: #F3F4F6 !important;
  }
  *, *::before, *::after { box-sizing: border-box; }

  .login-input:focus { border-color: #006400 !important; background: #fff !important; }
  .login-btn:hover:not(:disabled) { background: #004d00 !important; }

  @media (max-width: 760px) {
    .login-left { display: none !important; }
  }
`

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ registerNumber: "", dateOfBirth: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!form.registerNumber || !form.dateOfBirth) return
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
      if (!res.ok) { setError("Invalid Register Number or Date of Birth."); return }
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

  const disabled = loading || !form.registerNumber || !form.dateOfBirth

  return (
    <>
      <style>{RESET_CSS}</style>

      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        textAlign: "left",
        padding: "16px",
      }}>
        <div style={{
          display: "flex",
          width: "min(940px, 100%)",
          height: "min(580px, 100%)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          background: "#fff",
        }}>

          {/* LEFT — campus photo */}
          <div className="login-left" style={{
            flex: "0 0 45%",
            position: "relative",
            overflow: "hidden",
          }}>
            <img
              src="/siet-building.jpg"
              alt="Sri Shakthi campus"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,40,0,0.70) 0%, rgba(0,50,0,0.40) 50%, rgba(0,30,0,0.85) 100%)",
            }} />

            {/* College name */}
            <div style={{ position: "relative", padding: "32px 30px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#fff",
                  border: "2px solid rgba(255,215,0,0.6)",
                  flexShrink: 0,
                }}>
                  <img
                    src="/siet-shield.jpg"
                    alt="SIET"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div>
                  <div style={{
                    color: "#FFD700",
                    fontSize: "26px",
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    lineHeight: 1.1,
                    textShadow: "0 1px 4px rgba(0,0,0,0.45)",
                  }}>
                    SRI SHAKTHI
                  </div>
                  <div style={{
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.4px",
                    marginTop: "5px",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}>
                    Institute of Engineering &amp; Technology
                  </div>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 30px 40px" }}>
              <h2 style={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.25,
                margin: 0,
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}>
                Check Your<br />
                <span style={{ color: "#FFD700" }}>Semester Results</span>
              </h2>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{
            flex: 1,
            background: "#fff",
            padding: "0 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "left",
          }}>
            <h1 style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px",
              letterSpacing: "-0.3px",
            }}>
              Student Login
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 30px", lineHeight: 1.5 }}>
              Enter your details to view your results.
            </p>

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
              Register Number
            </label>
            <input
              className="login-input"
              type="text"
              placeholder="e.g. 714024149040"
              value={form.registerNumber}
              onChange={e => setForm({ ...form, registerNumber: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                color: "#111827",
                background: "#FAFAFA",
                marginBottom: "18px",
              }}
            />

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
              Date of Birth
            </label>
            <input
              className="login-input"
              type="date"
              value={form.dateOfBirth}
              onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                color: "#111827",
                background: "#FAFAFA",
                marginBottom: "24px",
              }}
            />

            {error && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "13px",
                color: "#DC2626",
              }}>
                {error}
              </div>
            )}

            <button
              className="login-btn"
              onClick={handleSubmit}
              disabled={disabled}
              style={{
                width: "100%",
                padding: "13px",
                background: disabled ? "#E5E7EB" : "#006400",
                color: disabled ? "#9CA3AF" : "#FFD700",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.3px",
                marginBottom: "28px",
              }}
            >
              {loading ? "Verifying..." : "View My Results →"}
            </button>

            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "18px" }}>
              <p style={{ fontSize: "11.5px", color: "#9CA3AF", textAlign: "center", lineHeight: 1.7, margin: 0 }}>
                Office of Controller of Examinations<br />
                Sri Shakthi Institute of Engineering and Technology<br />
                Coimbatore, 641 062
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}