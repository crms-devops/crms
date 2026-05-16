import { useEffect, useState } from "react"

interface ResultItem {
  semester: number
  subject_code: string
  subject_name: string
  subject_type: string
  grade: string | null
  marks_obtained: number | null
  result_status: string
  attempt_number: number
}

interface ResultsData {
  student_name: string
  register_number: string
  degree: string
  branch_name: string
  branch_code: string
  regulation_year: number
  exam_session: {
    display_label: string
  }
  results: ResultItem[]
}

const statusColor: Record<string, string> = {
  PASS: "#2e7d32",
  RA_FAIL: "#c62828",
  RA_ABSENT: "#c62828",
  WH_WITHHELD: "#e65100",
  WH1_MALPRACTICE: "#b71c1c",
  NC_NO_CHANGE: "#1565c0",
}

const statusLabel: Record<string, string> = {
  PASS: "PASS",
  RA_FAIL: "RA - FAIL",
  RA_ABSENT: "RA* - ABSENT",
  WH_WITHHELD: "WH - WITHHELD",
  WH1_MALPRACTICE: "WH1 - MALPRACTICE",
  NC_NO_CHANGE: "NC - NO CHANGE",
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/"
      return
    }
    fetch("http://localhost:8000/results/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch results")
        return r.json()
      })
      .then(setData)
      .catch(() => setError("Could not load results. Please login again."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px", fontFamily: "sans-serif" }}>
      Loading results...
    </div>
  )

  if (error) return (
    <div style={{ textAlign: "center", padding: "60px", color: "red", fontFamily: "sans-serif" }}>
      {error}
    </div>
  )

  if (!data) return null

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 4px" }}>
          OFFICE OF CONTROLLER OF EXAMINATIONS
        </h2>
        <h3 style={{ fontSize: "14px", fontWeight: "normal", color: "#333", margin: 0 }}>
          {data.exam_session.display_label}
        </h3>
      </div>

      {/* Student info */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "8px", marginBottom: "12px", fontSize: "13px"
      }}>
        <div><strong>Register Number:</strong><br />{data.register_number}</div>
        <div><strong>Name:</strong><br />{data.student_name}</div>
        <div><strong>Regulation:</strong><br />{data.regulation_year}</div>
        <div><strong>Degree & Branch:</strong><br />
          {data.degree} {data.branch_name} ({data.branch_code})
        </div>
      </div>

      {/* Results table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ background: "#1565c0", color: "white" }}>
            <th style={{ padding: "10px", textAlign: "center" }}>SEM</th>
            <th style={{ padding: "10px", textAlign: "center" }}>SUBJECT CODE</th>
            <th style={{ padding: "10px", textAlign: "left" }}>SUBJECT NAME</th>
            <th style={{ padding: "10px", textAlign: "center" }}>GRADE</th>
            <th style={{ padding: "10px", textAlign: "center" }}>RESULT</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#f9f9f9" : "white" }}>
              <td style={{ padding: "8px", textAlign: "center" }}>{r.semester}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{r.subject_code}</td>
              <td style={{ padding: "8px" }}>{r.subject_name}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{r.grade ?? "—"}</td>
              <td style={{
                padding: "8px", textAlign: "center",
                color: statusColor[r.result_status] ?? "#333",
                fontWeight: "bold"
              }}>
                {statusLabel[r.result_status] ?? r.result_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Status legend */}
      <div style={{
        display: "flex", gap: "20px", marginTop: "16px",
        fontSize: "12px", flexWrap: "wrap"
      }}>
        {Object.entries(statusLabel).filter(([k]) => k !== "PASS").map(([k, v]) => (
          <span key={k} style={{ color: statusColor[k], fontWeight: "bold" }}>{v}</span>
        ))}
      </div>

      <button
        onClick={() => { localStorage.removeItem("token"); window.location.href = "/" }}
        style={{
          marginTop: "20px", padding: "8px 20px",
          border: "1px solid #ccc", background: "white",
          cursor: "pointer", borderRadius: "4px", fontSize: "13px"
        }}
      >
        Logout
      </button>
    </div>
  )
}