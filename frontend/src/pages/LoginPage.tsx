import { useState } from "react"

interface LoginForm {
  registerNumber: string
  dateOfBirth: string
}

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

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#F3F4F6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: "20px",
      boxSizing: "border-box",
    }}>
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "900px",
        minHeight: "520px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      }}>

        {/* LEFT — campus photo */}
        <div style={{
          flex: "0 0 45%",
          position: "relative",
          minHeight: "520px",
        }}>
          <img
            src="/siet-building.jpg"
            alt="Sri Shakthi Campus"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {/* overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,40,0,0.65) 0%, rgba(0,50,0,0.45) 50%, rgba(0,30,0,0.85) 100%)",
          }} />

          {/* top — logo */}
          <div style={{ position: "relative", zIndex: 2, padding: "28px 28px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "8px",
                overflow: "hidden", border: "1.5px solid rgba(255,215,0,0.45)",
                flexShrink: 0,
              }}>
                <img
                  src="/siet-shield.jpg"
                  alt="SIET"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div style={{ color: "#FFD700", fontSize: "12px", fontWeight: "700", letterSpacing: "0.3px" }}>SRI SHAKTHI</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", marginTop: "1px" }}>Institute of Engineering & Technology</div>
              </div>
            </div>
          </div>

          {/* bottom — text */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, padding: "0 28px 32px" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(255,215,0,0.15)",
              border: "1px solid rgba(255,215,0,0.3)",
              borderRadius: "20px",
              padding: "3px 10px",
              marginBottom: "12px",
            }}>
              <span style={{ fontSize: "10px", color: "#FFD700", fontWeight: "600", letterSpacing: "0.5px" }}>
                EXAMINATION PORTAL
              </span>
            </div>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#fff",
              lineHeight: 1.3,
              margin: "0 0 8px",
            }}>
              Check Your<br />
              <span style={{ color: "#FFD700" }}>Semester Results</span>
            </h2>
            <p style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              margin: "0 0 20px",
              maxWidth: "230px",
            }}>
              Secure access to your Anna University examination results.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { v: "5000+", l: "Students" },
                { v: "0%", l: "Error Rate" },
                { v: "58ms", l: "Response" },
              ].map(s => (
                <div key={s.l} style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "8px 4px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#FFD700" }}>{s.v}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div style={{
          flex: 1,
          background: "#fff",
          padding: "52px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>

          {/* header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 8px",
              letterSpacing: "-0.3px",
            }}>
              Student Login
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
              Enter your details to view your results.
            </p>
          </div>

          {/* Register Number */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
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
                padding: "12px 14px",
                border: "1.5px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                color: "#111827",
                background: "#FAFAFA",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#006400"}
              onBlur={e => e.target.style.borderColor = "#D1D5DB"}
            />
          </div>

          {/* Date of Birth */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
            }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
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
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#006400"}
              onBlur={e => e.target.style.borderColor = "#D1D5DB"}
            />
          </div>

          {/* error */}
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

          {/* button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !form.registerNumber || !form.dateOfBirth}
            style={{
              width: "100%",
              padding: "13px",
              background: loading || !form.registerNumber || !form.dateOfBirth
                ? "#E5E7EB"
                : "#006400",
              color: loading || !form.registerNumber || !form.dateOfBirth
                ? "#9CA3AF"
                : "#FFD700",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading || !form.registerNumber || !form.dateOfBirth
                ? "not-allowed"
                : "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.3px",
              marginBottom: "28px",
            }}
          >
            {loading ? "Verifying..." : "View My Results →"}
          </button>

          {/* footer */}
          <div style={{
            borderTop: "1px solid #F3F4F6",
            paddingTop: "20px",
          }}>
            <p style={{
              fontSize: "11px",
              color: "#9CA3AF",
              textAlign: "center",
              lineHeight: 1.7,
              margin: 0,
            }}>
              Office of Controller of Examinations<br />
              Sri Shakthi Institute of Engineering and Technology<br />
              Coimbatore — 641 062
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}