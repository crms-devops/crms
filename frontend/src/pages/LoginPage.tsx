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
      background: "#f5f5f5",
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      {/* Top yellow header bar */}
      <div style={{
        background: "linear-gradient(135deg, #FFD700 0%, #FFC200 50%, #FFD700 100%)",
        padding: "0",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          gap: "16px",
        }}>
          {/* Logo placeholder */}
          <div style={{
            width: "70px",
            height: "70px",
            background: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="24" fill="#FFD700" stroke="#333" strokeWidth="1"/>
              <text x="25" y="20" textAnchor="middle" fontSize="7" fill="#333" fontWeight="bold">SRI</text>
              <text x="25" y="29" textAnchor="middle" fontSize="7" fill="#333" fontWeight="bold">SHAKTHI</text>
              <text x="25" y="38" textAnchor="middle" fontSize="6" fill="#1a5c1a" fontWeight="bold">NAAC A</text>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "22px",
              fontWeight: "900",
              color: "#1a1a1a",
              letterSpacing: "0.5px",
              lineHeight: "1.1",
              textTransform: "uppercase",
            }}>
              SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY
            </div>
            <div style={{
              fontSize: "12px",
              color: "#333",
              marginTop: "2px",
              fontWeight: "500",
            }}>
              (AN AUTONOMOUS INSTITUTION) — Approved by AICTE, New Delhi &nbsp;•&nbsp; Affiliated to Anna University, Chennai
            </div>
          </div>
          {/* NAAC A badge */}
          <div style={{
            background: "#c0392b",
            color: "white",
            borderRadius: "50%",
            width: "56px",
            height: "56px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "bold",
            fontSize: "11px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize: "20px", lineHeight: "1" }}>A</div>
            <div style={{ fontSize: "8px" }}>NAAC</div>
          </div>
        </div>
      </div>

      {/* Green nav bar */}
      <div style={{
        background: "#1a6b1a",
        padding: "6px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ color: "white", fontSize: "13px", fontWeight: "600", letterSpacing: "1px" }}>
          OFFICE OF CONTROLLER OF EXAMINATIONS
        </span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)),
                     url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23f0f0f0"/><circle cx="30" cy="30" r="2" fill="%23e0e0e0"/></svg>')`,
      }}>
        <div style={{
          background: "white",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}>
          {/* Card header */}
          <div style={{
            background: "#1565C0",
            padding: "14px 24px",
            color: "white",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px" }}>
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
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s",
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
                  border: "1px solid #ccc",
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
                {error}
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
                fontSize: "14px",
                fontWeight: "700",
                cursor: loading || !form.registerNumber || !form.dateOfBirth
                  ? "not-allowed" : "pointer",
                letterSpacing: "0.5px",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Verifying..." : "GET RESULT →"}
            </button>
          </div>

          {/* Footer note */}
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

      {/* Bottom footer */}
      <div style={{
        background: "#222",
        color: "#aaa",
        textAlign: "center",
        padding: "12px",
        fontSize: "12px",
      }}>
        Designed and developed by CSE Team, Sri Shakthi Institute of Engineering and Technology, Coimbatore.
      </div>
    </div>
  )
}