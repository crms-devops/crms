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

interface StudentInfo {
  register_number: string
  name: string
  degree: string
  branch_name: string
  branch_code: string
  regulation_year: number
  current_semester: number
}

interface ResultsData {
  student_name: string
  register_number: string
  degree: string
  branch_name: string
  branch_code: string
  regulation_year: number
  exam_session: { display_label: string; session_name: string; exam_year: number }
  results: ResultItem[]
}

const statusColor: Record<string, string> = {
  PASS: "#155724",
  RA_FAIL: "#721c24",
  RA_ABSENT: "#721c24",
  WH_WITHHELD: "#856404",
  WH1_MALPRACTICE: "#491217",
  NC_NO_CHANGE: "#0c5460",
}

const statusBg: Record<string, string> = {
  PASS: "#d4edda",
  RA_FAIL: "#f8d7da",
  RA_ABSENT: "#f8d7da",
  WH_WITHHELD: "#fff3cd",
  WH1_MALPRACTICE: "#f8d7da",
  NC_NO_CHANGE: "#d1ecf1",
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
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const studentData = localStorage.getItem("student")
    if (!token) { window.location.href = "/"; return }
    if (studentData) setStudent(JSON.parse(studentData))

    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/results/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.json() })
      .then(setData)
      .catch(() => setError("Could not load results. Please login again."))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("student")
    window.location.href = "/"
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFC200 50%, #FFD700 100%)", boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", padding: "10px 20px", gap: "16px" }}>
          <div style={{ width: "70px", height: "70px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="24" fill="#FFD700" stroke="#333" strokeWidth="1"/>
              <text x="25" y="20" textAnchor="middle" fontSize="7" fill="#333" fontWeight="bold">SRI</text>
              <text x="25" y="29" textAnchor="middle" fontSize="7" fill="#333" fontWeight="bold">SHAKTHI</text>
              <text x="25" y="38" textAnchor="middle" fontSize="6" fill="#1a5c1a" fontWeight="bold">NAAC A</text>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY
            </div>
            <div style={{ fontSize: "12px", color: "#333", marginTop: "2px", fontWeight: "500" }}>
              (AN AUTONOMOUS INSTITUTION) — Approved by AICTE, New Delhi &nbsp;•&nbsp; Affiliated to Anna University, Chennai
            </div>
          </div>
          <div style={{ background: "#c0392b", color: "white", borderRadius: "50%", width: "56px", height: "56px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: "bold", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: "20px", lineHeight: "1" }}>A</div>
            <div style={{ fontSize: "8px" }}>NAAC</div>
          </div>
        </div>
      </div>

      <div style={{ background: "#1a6b1a", padding: "6px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "white", fontSize: "13px", fontWeight: "600", letterSpacing: "1px" }}>
          OFFICE OF CONTROLLER OF EXAMINATIONS
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: "1000px", margin: "24px auto", width: "100%", padding: "0 16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>Loading results...</div>
        )}

        {error && (
          <div style={{ background: "#fdecea", border: "1px solid #f5c6cb", color: "#c0392b", padding: "16px", borderRadius: "4px", textAlign: "center" }}>
            {error} &nbsp;
            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#c0392b", textDecoration: "underline", cursor: "pointer" }}>Login again</button>
          </div>
        )}

        {data && !loading && (
          <div style={{ background: "white", border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            {/* Result title */}
            <div style={{ background: "#1565C0", color: "white", padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px" }}>
                {data.exam_session.display_label}
              </div>
            </div>

            {/* Student info */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #eee", background: "#fafafa" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", fontSize: "13px" }}>
                <div><span style={{ color: "#666", fontWeight: "600" }}>Register Number: </span>{data.register_number}</div>
                <div><span style={{ color: "#666", fontWeight: "600" }}>Name: </span>{data.student_name}</div>
                <div><span style={{ color: "#666", fontWeight: "600" }}>Regulation: </span>{data.regulation_year}</div>
                <div><span style={{ color: "#666", fontWeight: "600" }}>Semester: </span>{data.results[0]?.semester || "-"}</div>
              </div>
              <div style={{ fontSize: "13px", marginTop: "6px" }}>
                <span style={{ color: "#666", fontWeight: "600" }}>Degree and Branch: </span>
                {data.degree} {data.branch_name} ({data.branch_code})
              </div>
            </div>

            {/* Results table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#1565C0", color: "white" }}>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600" }}>SEM</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600" }}>SUBJECT CODE</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "600" }}>SUBJECT NAME</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600" }}>GRADE</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600" }}>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#f9f9f9" : "white", borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "9px 14px", textAlign: "center" }}>{r.semester}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", fontFamily: "monospace", fontSize: "12px" }}>{r.subject_code}</td>
                      <td style={{ padding: "9px 14px" }}>{r.subject_name}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: "600" }}>{r.grade ?? "—"}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "3px",
                          fontWeight: "700",
                          fontSize: "12px",
                          color: statusColor[r.result_status] ?? "#333",
                          background: statusBg[r.result_status] ?? "#eee",
                        }}>
                          {statusLabel[r.result_status] ?? r.result_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status legend */}
            <div style={{ padding: "12px 20px", background: "#f8f9fa", borderTop: "1px solid #eee" }}>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "12px" }}>
                <span style={{ color: statusColor.RA_FAIL, fontWeight: "700" }}>RA* - ABSENT</span>
                <span style={{ color: statusColor.WH_WITHHELD, fontWeight: "700" }}>WH - WITHHELD</span>
                <span style={{ color: statusColor.WH1_MALPRACTICE, fontWeight: "700" }}>WH1 - FAIL DUE TO MALPRACTICE</span>
                <span style={{ color: statusColor.RA_FAIL, fontWeight: "700" }}>RA - FAIL</span>
                <span style={{ color: statusColor.NC_NO_CHANGE, fontWeight: "700" }}>NC - NO CHANGE</span>
              </div>
            </div>

            {/* Logout */}
            <div style={{ padding: "12px 20px", textAlign: "right", borderTop: "1px solid #eee" }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 20px",
                  border: "1px solid #1565C0",
                  background: "white",
                  color: "#1565C0",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#222", color: "#aaa", textAlign: "center", padding: "12px", fontSize: "12px" }}>
        Designed and developed by CSE Team, Sri Shakthi Institute of Engineering and Technology, Coimbatore.
      </div>
    </div>
  )
}