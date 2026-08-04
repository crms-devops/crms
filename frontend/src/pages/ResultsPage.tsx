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
  exam_session: { display_label: string; session_name: string; exam_year: number }
  results: ResultItem[]
}

const STATUS_COLOR: Record<string, { text: string; bg: string }> = {
  PASS:            { text: "#155724", bg: "#d4edda" },
  RA_FAIL:         { text: "#721c24", bg: "#f8d7da" },
  RA_ABSENT:       { text: "#721c24", bg: "#f8d7da" },
  WH_WITHHELD:     { text: "#856404", bg: "#fff3cd" },
  WH1_MALPRACTICE: { text: "#491217", bg: "#f8d7da" },
  NC_NO_CHANGE:    { text: "#0c5460", bg: "#d1ecf1" },
}

const STATUS_LABEL: Record<string, string> = {
  PASS:            "PASS",
  RA_FAIL:         "RA - FAIL",
  RA_ABSENT:       "RA* - ABSENT",
  WH_WITHHELD:     "WH - WITHHELD",
  WH1_MALPRACTICE: "WH1 - MALPRACTICE",
  NC_NO_CHANGE:    "NC - NO CHANGE",
}

function SIETBanner() {
  return (
    <>
      <div style={{ width: "100%", lineHeight: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.25)" }}>
        <img
          src="/siet-logo.png"
          alt="Sri Shakthi Institute of Engineering and Technology"
          style={{ width: "100%", height: "auto", display: "block", maxHeight: "120px", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
      <div style={{ height: "5px", background: "linear-gradient(90deg, #006400, #FFD700, #006400)" }} />
      <div style={{ background: "#1a6b1a", padding: "8px 0", textAlign: "center", letterSpacing: "2.5px" }}>
        <span style={{ color: "#FFD700", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>
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
  const [showFooter, setShowFooter] = useState(false)

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

    const onScroll = () => setShowFooter(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
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
      background: "#f0fff0",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      paddingBottom: "60px",
    }}>

      <SIETBanner />

      <div style={{ flex: 1, maxWidth: "1020px", margin: "24px auto 40px", width: "100%", padding: "0 16px" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: "80px", color: "#006400", fontSize: "15px", fontWeight: "600" }}>
            Loading your results...
          </div>
        )}

        {error && (
          <div style={{
            background: "#fdecea", border: "1px solid #e57373",
            color: "#b71c1c", padding: "16px", borderRadius: "4px",
            textAlign: "center", fontSize: "14px",
          }}>
            {error} &nbsp;
            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#b71c1c", textDecoration: "underline", cursor: "pointer", fontWeight: "600" }}>
              Login again
            </button>
          </div>
        )}

        {data && !loading && (
          <div style={{
            background: "white",
            border: "2px solid #FFD700",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,100,0,0.12)",
          }}>

            {/* Result session title */}
            <div style={{ background: "#006400", padding: "13px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#FFD700", letterSpacing: "0.5px" }}>
                {data.exam_session.display_label}
              </div>
            </div>

            {/* Yellow stripe */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #FFD700, #FFC200, #FFD700)" }} />

            {/* Student info */}
            <div style={{
              padding: "14px 20px",
              borderBottom: "1px solid #e8f5e9",
              background: "#f0fff0",
              fontSize: "13px",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "6px" }}>
                <div><span style={{ color: "#006400", fontWeight: "700" }}>Register Number: </span>{data.register_number}</div>
                <div><span style={{ color: "#006400", fontWeight: "700" }}>Name: </span>{data.student_name}</div>
                <div><span style={{ color: "#006400", fontWeight: "700" }}>Regulation: </span>{data.regulation_year}</div>
                <div><span style={{ color: "#006400", fontWeight: "700" }}>Semester: </span>{data.results[0]?.semester ?? "—"}</div>
              </div>
              <div>
                <span style={{ color: "#006400", fontWeight: "700" }}>Degree and Branch: </span>
                {data.degree} {data.branch_name} ({data.branch_code})
              </div>
            </div>

            {/* Results table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#006400", color: "#FFD700" }}>
                    <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: "700", whiteSpace: "nowrap" }}>SEM</th>
                    <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: "700", whiteSpace: "nowrap" }}>SUBJECT CODE</th>
                    <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: "700" }}>SUBJECT NAME</th>
                    <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: "700", whiteSpace: "nowrap" }}>GRADE</th>
                    <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: "700", whiteSpace: "nowrap" }}>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#f9fff9" : "white", borderBottom: "1px solid #e8f5e9" }}>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>{r.semester}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "monospace", fontSize: "12px", color: "#333" }}>{r.subject_code}</td>
                      <td style={{ padding: "10px 14px", color: "#222" }}>{r.subject_name}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: "700", color: "#006400" }}>{r.grade ?? "—"}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "3px",
                          fontWeight: "700",
                          fontSize: "12px",
                          color: STATUS_COLOR[r.result_status]?.text ?? "#333",
                          background: STATUS_COLOR[r.result_status]?.bg ?? "#eee",
                        }}>
                          {STATUS_LABEL[r.result_status] ?? r.result_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status legend */}
            <div style={{ padding: "12px 20px", background: "#f9fff9", borderTop: "1px solid #e8f5e9" }}>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "11px" }}>
                {Object.entries(STATUS_LABEL).filter(([k]) => k !== "PASS").map(([k, v]) => (
                  <span key={k} style={{ color: STATUS_COLOR[k]?.text, fontWeight: "700" }}>{v}</span>
                ))}
              </div>
            </div>

            {/* Logout */}
            <div style={{ padding: "12px 20px", textAlign: "right", borderTop: "1px solid #e8f5e9", background: "#f0fff0" }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 24px",
                  border: "2px solid #006400",
                  background: "white",
                  color: "#006400",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scroll-triggered sticky footer */}
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