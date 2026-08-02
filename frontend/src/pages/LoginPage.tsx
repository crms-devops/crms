import { useState } from "react"

interface LoginForm {
  registerNumber: string
  dateOfBirth: string
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    registerNumber: "",
    dateOfBirth: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
      if (!res.ok) {
        setError("Invalid Register Number or Date of Birth")
        return
      }
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
      background: "#f0f0f0",
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      {/* ── Real SIET header banner ── */}
      <div style={{
        background: "white",
        borderBottom: "3px solid #FFD700",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          gap: "12px",
        }}>

          {/* NBA logo */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
            minWidth: "70px",
          }}>
            <div style={{
              background: "#003087",
              color: "white",
              fontWeight: "900",
              fontSize: "18px",
              padding: "4px 8px",
              borderRadius: "3px",
              letterSpacing: "2px",
            }}>NBA</div>
            <div style={{ fontSize: "8px", color: "#555", textAlign: "center", marginTop: "2px", lineHeight: "1.3" }}>
              NATIONAL BOARD<br/>OF ACCREDITATION<br/>
              <span style={{ color: "#003087" }}>Agri, BME, BT, CSE<br/>ECE, EEE, Mech, IT</span>
            </div>
          </div>

          <div style={{ width: "1px", height: "60px", background: "#ddd", flexShrink: 0 }} />

          {/* SIET shield logo */}
          <img
            src="/siet-shield.jpg"
            alt="SIET Shield"
            style={{ width: "70px", height: "70px", objectFit: "contain", flexShrink: 0 }}
          />

          {/* College name and details */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "#006400",
              letterSpacing: "1px",
              lineHeight: "1",
              fontFamily: "Arial Black, sans-serif",
            }}>
              SRI SHAKTHI
            </div>
            <div style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#006400",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}>
              INSTITUTE OF ENGINEERING AND TECHNOLOGY
            </div>
            <div style={{ fontSize: "12px", color: "#333", fontWeight: "600" }}>
              Approved by AICTE, New Delhi ■ Affiliated to Anna University, Chennai
            </div>
            <div style={{ fontSize: "12px", color: "#333", fontWeight: "700" }}>
              AN AUTONOMOUS INSTITUTION
            </div>
            <div style={{ fontSize: "11px", color: "#555" }}>
              L&T By-Pass, Chinniyampalayam Post, Coimbatore-641062 | Tel: +91 422 2369900
            </div>
          </div>

          <div style={{ width: "1px", height: "60px", background: "#ddd", flexShrink: 0 }} />

          {/* NAAC A badge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{
              background: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #8B4513 100%)",
              borderRadius: "50%",
              width: "58px",
              height: "58px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #FFD700",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}>
              <div style={{ fontSize: "8px", color: "#FFD700", fontWeight: "600" }}>ACCREDITED WITH</div>
              <div style={{ fontSize: "24px", fontWeight: "900", color: "#FFD700", lineHeight: "1" }}>A</div>
              <div style={{ fontSize: "10px", color: "white", fontWeight: "700" }}>NAAC</div>
            </div>
          </div>

          <div style={{ width: "1px", height: "60px", background: "#ddd", flexShrink: 0 }} />

          {/* Counselling code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{
              fontSize: "28px",
              fontWeight: "900",
              color: "#006400",
              lineHeight: "1",
            }}>2727</div>
            <div style={{ fontSize: "11px", color: "#555", fontWeight: "600", textAlign: "center" }}>
              Counselling<br/>Code
            </div>
          </div>
        </div>
      </div>

      {/* ── Yellow accent strip ── */}
      <div style={{
        background: "linear-gradient(90deg, #FFD700, #FFC200, #FFD700)",
        height: "6px",
      }} />

      {/* ── Green exam controller nav ── */}
      <div style={{
        background: "#1a6b1a",
        padding: "7px 0",
        textAlign: "center",
      }}>
        <span style={{
          color: "white",
          fontSize: "14px",
          fontWeight: "700",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}>
          Office of Controller of Examinations
        </span>
      </div>

      {/* ── Main content with campus background ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        backgroundImage: "url('/siet-campus.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
        {/* Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.75)",
        }} />

        {/* Login card */}
        <div style={{
          position: "relative",
          background: "white",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
          overflow: "hidden",
          border: "1px solid #ccc",
        }}>
          {/* Card header */}
          <div style={{
            background: "#1565C0",
            padding: "16px 24px",
            color: "white",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.5px" }}>
              EXAMINATION RESULT PORTAL
            </div>
            <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "3px" }}>
              Enter your credentials to view results
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: "28px 28px 24px" }}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "6px",
              }}>
                Register Number
              </label>
              <input
                type="text"
                placeholder="e.g. 714024149040"
                value={form.registerNumber}
                onChange={e => setForm({ ...form, registerNumber: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1.5px solid #ccc",
                  borderRadius: "3px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = "#1565C0"}
                onBlur={e => e.target.style.borderColor = "#ccc"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#333",
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
                  padding: "10px 12px",
                  border: "1.5px solid #ccc",
                  borderRadius: "3px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = "#1565C0"}
                onBlur={e => e.target.style.borderColor = "#ccc"}
              />
            </div>

            {error && (
              <div style={{
                background: "#fdecea",
                border: "1px solid #f5c6cb",
                color: "#c0392b",
                padding: "10px 14px",
                borderRadius: "3px",
                fontSize: "13px",
                marginBottom: "16px",
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !form.registerNumber || !form.dateOfBirth}
              style={{
                width: "100%",
                padding: "12px",
                background: loading || !form.registerNumber || !form.dateOfBirth
                  ? "#aaa" : "#1565C0",
                color: "white",
                border: "none",
                borderRadius: "3px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading || !form.registerNumber || !form.dateOfBirth
                  ? "not-allowed" : "pointer",
                letterSpacing: "0.5px",
              }}
            >
              {loading ? "Verifying..." : "GET RESULT →"}
            </button>
          </div>

          <div style={{
            background: "#f8f9fa",
            borderTop: "1px solid #eee",
            padding: "12px 24px",
            textAlign: "center",
            fontSize: "11px",
            color: "#888",
          }}>
            For assistance, contact the Office of Controller of Examinations
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: "#1a1a1a",
        color: "#aaa",
        textAlign: "center",
        padding: "12px",
        fontSize: "12px",
        borderTop: "3px solid #FFD700",
      }}>
        Designed and developed by CSE Team, Sri Shakthi Institute of Engineering and Technology, Coimbatore.
      </div>
    </div>
  )
}