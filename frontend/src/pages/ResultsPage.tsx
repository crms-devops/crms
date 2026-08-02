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
    session_name: string
    exam_year: number
  }
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

function SIETHeader() {
  return (
    <>
      {/* Real SIET header banner */}
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, minWidth: "70px" }}>
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
              NATIONAL BOARD<br />OF ACCREDITATION<br />
              <span style={{ color: "#003087" }}>Agri, BME, BT, CSE<br />ECE, EEE, Mech, IT</span>
            </div>
          </div>

          <div style={{ width: "1px", height: "60px", background: "#ddd", flexShrink: 0 }} />

          {/* SIET shield logo */}
          <img
            src="/siet-shield.jpg"
            alt="SIET Shield"
            style={{ width: "70px", height: "70px", objectFit: "contain", flexShrink: 0 }}
          />

          {/* College name */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "#006400",
              letterSpacing: "1px",
              lineHeight: "1",
              fontFamily: "Arial Black, sans-serif",
            }}>SRI SHAKTHI</div>
            <div style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#006400",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}>INSTITUTE OF ENGINEERING AND TECHNOLOGY</div>
            <div style={{ fontSize: "12px", color: "#333", fontWeight: "600" }}>
              Approved by AICTE, New Delhi ■ Affiliated to Anna University, Chennai
            </div>
            <div style={{ fontSize: "12px", color: "#333", fontWeight: "700" }}>AN AUTONOMOUS INSTITUTION</div>
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
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#006400", lineHeight: "1" }}>2727</div>
            <div style={{ fontSize: "11px", color: "#555", fontWeight: "600", textAlign: "center" }}>
              Counselling<br />Code
            </div>
          </div>
        </div>
      </div>

      {/* Yellow accent strip */}
      <div style={{ background: "linear-gradient(90deg, #FFD700, #FFC200, #FFD700)", height: "6px" }} />

      {/* Green exam controller nav */}
      <div style={{ background: "#1a6b1a", padding: "7px 0", textAlign: "center" }}>
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
    </>
  )
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { window.location.href = "/"; return }

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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#f5f5f5",
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>

      <SIETHeader />

      {/* Content */}
      <div style={{ flex: 1, maxWidth: "1000px", margin: "24px auto", width: "100%", padding: "0 16px" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#666", fontSize: "15px" }}>
            Loading your results...
          </div>
        )}

        {error && (
          <div style={{
            background: "#fdecea",
            border: "1px solid #f5c6cb",
            color: "#c0392b",
            padding: "16px",
            borderRadius: "4px",
            textAlign: "center",
            fontSize: "14px",
          }}>
            {error} &nbsp;
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "#c0392b", textDecoration: "underline", cursor: "pointer" }}
            >
              Login again
            </button>
          </div>
        )}

        {data && !loading && (
          <div style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>

            {/* Result title bar */}
            <div style={{ background: "#1565C0", color: "white", padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px" }}>
                {data.exam_session.display_label}
              </div>
            </div>

            {/* Student info */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #eee", background: "#fafafa" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
                fontSize: "13px",
                marginBottom: "6px",
              }}>
                <div>
                  <span style={{ color: "#555", fontWeight: "600" }}>Register Number: </span>
                  {data.register_number}
                </div>
                <div>
                  <span style={{ color: "#555", fontWeight: "600" }}>Name: </span>
                  {data.student_name}
                </div>
                <div>
                  <span style={{ color: "#555", fontWeight: "600" }}>Date of Birth: </span>
                  {data.results[0]?.semester ? `Semester ${data.results[0].semester}` : "-"}
                </div>
                <div>
                  <span style={{ color: "#555", fontWeight: "600" }}>Regulation: </span>
                  {data.regulation_year}
                </div>
              </div>
              <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#555", fontWeight: "600" }}>Degree and Branch: </span>
                {data.degree} {data.branch_name} ({data.branch_code})
              </div>
            </div>

            {/* Results table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#1565C0", color: "white" }}>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600", whiteSpace: "nowrap" }}>SEM</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600", whiteSpace: "nowrap" }}>SUBJECT CODE</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "600" }}>SUBJECT NAME</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600", whiteSpace: "nowrap" }}>GRADE</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600", whiteSpace: "nowrap" }}>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((r, i) => (
                    <tr
                      key={i}
                      style={{
                        background: i % 2 === 0 ? "#f9f9f9" : "white",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <td style={{ padding: "9px 14px", textAlign: "center" }}>{r.semester}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", fontFamily: "monospace", fontSize: "12px" }}>
                        {r.subject_code}
                      </td>
                      <td style={{ padding: "9px 14px" }}>{r.subject_name}</td>
                      <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: "600" }}>
                        {r.grade ?? "—"}
                      </td>
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
            <div style={{
              padding: "12px 20px",
              background: "#f8f9fa",
              borderTop: "1px solid #eee",
            }}>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "12px" }}>
                <span style={{ color: statusColor.RA_ABSENT, fontWeight: "700" }}>RA* - ABSENT</span>
                <span style={{ color: statusColor.WH_WITHHELD, fontWeight: "700" }}>WH - WITHHELD</span>
                <span style={{ color: statusColor.WH1_MALPRACTICE, fontWeight: "700" }}>WH1 - FAIL DUE TO MALPRACTICE</span>
                <span style={{ color: statusColor.RA_FAIL, fontWeight: "700" }}>RA - FAIL</span>
                <span style={{ color: statusColor.NC_NO_CHANGE, fontWeight: "700" }}>NC - NO CHANGE</span>
              </div>
            </div>

            {/* Logout button */}
            <div style={{
              padding: "12px 20px",
              textAlign: "right",
              borderTop: "1px solid #eee",
            }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 24px",
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