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
      const res = await fetch("http://localhost:8000/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          register_number: form.registerNumber,
          date_of_birth: form.dateOfBirth,
        }),
      })
      if (!res.ok) {
        setError("Invalid register number or date of birth")
        return
      }
      const data = await res.json()
      localStorage.setItem("token", data.access_token)
      // navigate to results page — we'll add routing next
      window.location.href = "/results"
    } catch {
      setError("Cannot connect to server. Is FastAPI running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f2f5",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontSize: "18px" }}>
          Office of Controller of Examinations
        </h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "32px", fontSize: "13px" }}>
          Enter your details to view results
        </p>

        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#333" }}>
          Register Number
        </label>
        <input
          type="text"
          placeholder="e.g. 714024149040"
          value={form.registerNumber}
          onChange={e => setForm({ ...form, registerNumber: e.target.value })}
          style={{
            width: "100%", padding: "10px 12px", marginBottom: "20px",
            border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px",
            boxSizing: "border-box"
          }}
        />

        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#333" }}>
          Date of Birth
        </label>
        <input
          type="date"
          value={form.dateOfBirth}
          onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
          style={{
            width: "100%", padding: "10px 12px", marginBottom: "28px",
            border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px",
            boxSizing: "border-box"
          }}
        />

        {error && (
          <p style={{ color: "#d32f2f", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.registerNumber || !form.dateOfBirth}
          style={{
            width: "100%", padding: "12px",
            background: loading ? "#ccc" : "#1a73e8",
            color: "white", border: "none",
            borderRadius: "4px", fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 500
          }}
        >
          {loading ? "Checking..." : "GET RESULT →"}
        </button>
      </div>
    </div>
  )
}