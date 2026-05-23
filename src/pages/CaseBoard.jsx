import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { loadAgent, getRank } from '../utils/gameState'
import { callGemini } from '../hooks/useGemini'

const THREAT_COLORS = {
  ROUTINE: { bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)', text: '#00ff88' },
  ELEVATED: { bg: 'rgba(0,180,216,0.1)', border: 'rgba(0,180,216,0.3)', text: '#00b4d8' },
  CRITICAL: { bg: 'rgba(244,165,34,0.1)', border: 'rgba(244,165,34,0.3)', text: '#f4a522' },
  CLASSIFIED: { bg: 'rgba(255,61,61,0.1)', border: 'rgba(255,61,61,0.3)', text: '#ff3d3d' },
}

const EVIDENCE_ICONS = { email: '📧', website: '🌐', chat: '💬' }

const FALLBACK_CASES = [
  {
    case_id: "CASE-101",
    codename: "Operation Phantom Mail",
    threat_level: "ROUTINE",
    brief: "Karyawan PT Maju melaporkan email mencurigakan dari 'IT Support' yang meminta reset password.",
    evidence: {
      type: "email",
      from_name: "IT Support",
      from_email: "support@ptmaju-secure.com",
      subject: "URGENT: Password Reset Required - Action Within 24 Hours",
      body: "Dear Employee,\n\nOur security system has detected unusual activity on your account. You are required to reset your password immediately to avoid account suspension.\n\nClick the button below to verify your identity and create a new password. This link will expire in 24 hours.\n\nIf you do not reset your password, your account will be locked permanently.\n\nBest regards,\nIT Security Team\nPT Maju Indonesia",
      cta_text: "Reset Password Now",
      cta_url: "https://ptmaju-secure.com/verify?id=8a7b3c",
      timestamp: "2024-01-15 09:32"
    },
    clues: [
      { id: "clue_1", "element": "from_email", description: "Domain bukan domain resmi perusahaan" },
      { id: "clue_2", "element": "cta_url", description: "URL mengarah ke domain mencurigakan" },
      { id: "clue_3", "element": "body", description: "Tekanan urgensi dan ancaman akun" }
    ],
    answer: "Phishing Attack",
    choices: ["Phishing Attack", "Malware Distribution", "Social Engineering", "Legitimate Email"],
    debrief: {
      verdict: "Phishing Attack Confirmed",
      summary: "Email ini menggunakan domain palsu yang mirip domain asli perusahaan. URL mengarah ke halaman login palsu untuk mencuri kredensial karyawan.",
      key_findings: ["Domain spoofing", "Fake urgency pressure", "Credential harvesting URL"],
      tip: "Selalu verifikasi domain pengirim email. Domain resmi PT Maju adalah ptmaju.co.id, bukan ptmaju-secure.com."
    },
    xp_reward: 100
  },
  {
    case_id: "CASE-202",
    codename: "Operation Ghost Login",
    threat_level: "ELEVATED",
    brief: "Ditemukan halaman login bank yang menyalin tampilan situs resmi tetapi dengan URL berbeda.",
    evidence: {
      type: "website",
      url: "https://bank-sentral.co.id/secure-login",
      title: "Bank Sentral Indonesia - Internet Banking",
      navbar_items: ["Berlay", "Transfer", "Pembayaran", "Bantuan"],
      hero_title: "Login ke Internet Banking Anda",
      hero_body: "Akses rekening Anda dengan aman. Masukkan email dan password untuk melanjutkan.",
      form_fields: ["Email", "Password"],
      submit_text: "Masuk Sekarang",
      footer: "© 2024 Bank Sentral Indonesia. Semua hak dilindungi. | Syarat & Ketentuan | Kebijakan Privasi"
    },
    clues: [
      { id: "clue_1", element: "url", description: "URL bukan domain resmi bank" },
      { id: "clue_2", element: "footer", description: "Tidak ada link ke OJK atau LPS" },
      { id: "clue_3", element: "form_fields", description: "Form sederhana tanpa 2FA" }
    ],
    answer: "Phishing Attack",
    choices: ["Phishing Attack", "Malware Distribution", "Social Engineering", "Legitimate Website"],
    debrief: {
      verdict: "Fake Banking Website Detected",
      summary: "Situs ini menyalin tampilan bank resmi tetapi menggunakan domain berbeda. Tujuannya adalah mencuri kredensial login nasabah.",
      key_findings: ["Typosquatting domain", "No 2FA prompt", "Missing regulatory links"],
      tip: "Selalu ketik URL bank langsung di browser. Jangan pernah login melalui link dari email atau SMS."
    },
    xp_reward: 150
  },
  {
    case_id: "CASE-303",
    codename: "Operation Sweet Talk",
    threat_level: "CRITICAL",
    brief: "Percakapan chat antara 'Manager' dan karyawan baru yang meminta transfer dana darurat.",
    evidence: {
      type: "chat",
      messages: [
        { sender: "Manager (HR)", text: "Halo, saya Manager HR. Ada urgent task dari direksi.", time: "14:02" },
        { sender: "Karyawan Baru", text: "Baik Pak, ada yang bisa saya bantu?", time: "14:03" },
        { sender: "Manager (HR)", text: "Ini rahasia ya. Direksi minta segera transfer 50jt ke rekening vendor baru. Ini nomor rekeningnya: 1234567890 a/n PT Sejahtera.", time: "14:04" },
        { sender: "Karyawan Baru", text: "Baik Pak, saya proses sekarang.", time: "14:05" }
      ]
    },
    clues: [
      { id: "clue_1", element: "msg_0", description: "Tidak ada verifikasi identitas" },
      { id: "clue_2", element: "msg_2", description: "Tekanan urgensi dan kerahasiaan" },
      { id: "clue_3", element: "msg_2", description: "Permintaan transfer tidak biasa" }
    ],
    answer: "Social Engineering",
    choices: ["Phishing Attack", "Malware Distribution", "Social Engineering", "Legitimate Request"],
    debrief: {
      verdict: "Business Email Compromise (BEC)",
      summary: "Penyamaran sebagai atasan melalui chat untuk memanipulasi karyawan baru melakukan transfer dana ke rekening penipu.",
      key_findings: ["Authority impersonation", "Urgency and secrecy pressure", "Unusual transfer request"],
      tip: "Selalu verifikasi permintaan transfer melalui jalur resmi. Telepon langsung ke atasan, jangan percaya chat saja."
    },
    xp_reward: 200
  }
]

function generateCasePrompt(difficulty, type) {
  return `Generate sebuah kasus investigasi cybersecurity untuk game CIPHER.
Difficulty: ${difficulty}
Tipe evidence: ${type}

Return HANYA JSON, tanpa markdown code blocks, tanpa teks lain:
{
  "case_id": "CASE-${Math.floor(Math.random() * 900 + 100)}",
  "codename": "Operation [nama dramatis 1-2 kata]",
  "threat_level": "${difficulty}",
  "brief": "Satu kalimat deskripsi kasus untuk briefing awal.",
  "evidence": {
    "type": "${type}",
    ${type === 'email' ? `"from_name": "Nama Pengirim",
    "from_email": "email@domain.com",
    "subject": "Subject email",
    "body": "Isi email 2-3 paragraf dengan red flag tersembunyi.",
    "cta_text": "Teks tombol jika ada",
    "cta_url": "https://url-mencurigakan.com",
    "timestamp": "2024-01-15 09:32"` : ''}
    ${type === 'website' ? `"url": "https://suspicious-site.com",
    "title": "Judul halaman",
    "navbar_items": ["Home", "Login", "Support"],
    "hero_title": "Headline utama",
    "hero_body": "Deskripsi halaman",
    "form_fields": ["Email", "Password"],
    "submit_text": "Teks tombol submit",
    "footer": "Teks footer"` : ''}
    ${type === 'chat' ? `"messages": [
      {"sender": "nama", "text": "pesan", "time": "09:30"},
      {"sender": "nama", "text": "pesan", "time": "09:31"}
    ]` : ''}
  },
  "clues": [
    { "id": "clue_1", "element": "nama_elemen", "description": "Deskripsi clue max 8 kata" },
    { "id": "clue_2", "element": "nama_elemen", "description": "Deskripsi clue max 8 kata" },
    { "id": "clue_3", "element": "nama_elemen", "description": "Deskripsi clue max 8 kata" }
  ],
  "answer": "Jenis serangan",
  "choices": ["Phishing Attack", "Malware Distribution", "Social Engineering", "Legitimate"],
  "debrief": {
    "verdict": "Verdict singkat",
    "summary": "Maksimal 2 kalimat penjelasan.",
    "key_findings": ["finding 1", "finding 2", "finding 3"],
    "tip": "Satu tips keamanan singkat."
  },
  "xp_reward": ${difficulty === 'ROUTINE' ? 100 : difficulty === 'ELEVATED' ? 150 : difficulty === 'CRITICAL' ? 200 : 300}
}`
}

const CASES_POOL = [
  { difficulty: 'ROUTINE', type: 'email' },
  { difficulty: 'ELEVATED', type: 'website' },
  { difficulty: 'CRITICAL', type: 'chat' },
]

export default function CaseBoard() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [agent, setAgent] = useState(null)
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    const a = loadAgent()
    if (!a) {
      navigate('/setup')
      return
    }
    setAgent(a)
    generateCases()
    setTimeout(() => setVisible(true), 100)
  }, [])

  async function generateCases() {
    setLoading(true)
    setError(null)
    setCardsVisible(false)

    try {
      // Try Gemini API first (1 attempt only)
      const c = CASES_POOL[0]
      const prompt = generateCasePrompt(c.difficulty, c.type)
      const raw = await callGemini(prompt)
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const firstCase = JSON.parse(cleaned)
      setCases([firstCase])

      // Try remaining cases
      const results = [firstCase]
      for (let i = 1; i < CASES_POOL.length; i++) {
        await new Promise((r) => setTimeout(r, 3000))
        try {
          const ci = CASES_POOL[i]
          const pi = generateCasePrompt(ci.difficulty, ci.type)
          const ri = await callGemini(pi)
          const cl = ri.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
          results.push(JSON.parse(cl))
          setCases([...results])
        } catch {
          // Skip failed case, continue with others
        }
      }

      setLoading(false)
      setTimeout(() => setCardsVisible(true), 100)
    } catch {
      // Fallback to static cases
      setCases(FALLBACK_CASES)
      setLoading(false)
      setTimeout(() => setCardsVisible(true), 100)
    }
  }

  function handleOpenCase(caseData) {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => navigate('/investigate', { state: { caseData, agent } }),
    })
  }

  if (!agent) return null

  const rank = getRank(agent.xp)

  return (
    <div className="min-h-screen px-4 py-8">
      <div
        ref={containerRef}
        className="max-w-5xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse" />
                <span className="font-mono text-[10px] text-[#00b4d8] tracking-widest">CASE BOARD</span>
              </div>
              <h1 className="font-mono text-xl text-[#e2e8f0]">
                {'// ACTIVE CASES — '}
                <span className="text-[#00b4d8]">{loading ? '...' : cases.length}</span>
                {' PENDING'}
              </h1>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-[#4a5568]">AGENT</div>
              <div className="font-mono text-sm text-[#e2e8f0]">{agent.codename}</div>
              <div className="font-mono text-[10px] text-[#00b4d8]">{rank.icon} {rank.name}</div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex gap-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00b4d8] dot-1" />
              <span className="w-2 h-2 rounded-full bg-[#00b4d8] dot-2" />
              <span className="w-2 h-2 rounded-full bg-[#00b4d8] dot-3" />
            </div>
            <p className="font-mono text-sm text-[#4a5568]">Decrypting case files...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <div className="text-3xl mb-4">⚠️</div>
            <p className="font-mono text-sm text-[#ff3d3d] mb-4">{error}</p>
            <button
              onClick={generateCases}
              className="font-mono text-xs border border-[#1e2d3d] text-[#8892a4] px-6 py-2.5 rounded hover:border-[#00b4d8] hover:text-[#00b4d8] transition-colors cursor-pointer"
            >
              RETRY
            </button>
          </div>
        )}

        {/* Cases Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((c, i) => {
              const tc = THREAT_COLORS[c.threat_level] || THREAT_COLORS.ROUTINE
              return (
                <div
                  key={c.case_id}
                  className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden hover:border-[#00b4d8]/40 hover:shadow-[0_0_20px_rgba(0,180,216,0.1)] transition-all cursor-pointer group"
                  onClick={() => handleOpenCase(c)}
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.4s ease-out ${i * 0.1}s, transform 0.4s ease-out ${i * 0.1}s`,
                  }}
                >
                  {/* Threat badge */}
                  <div className="px-5 pt-5 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded"
                        style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}
                      >
                        {c.threat_level}
                      </span>
                      <span className="font-mono text-[10px] text-[#4a5568]">{c.case_id}</span>
                    </div>

                    {/* Codename */}
                    <h3 className="font-mono text-sm text-[#e2e8f0] font-semibold mb-2 group-hover:text-[#00b4d8] transition-colors">
                      {c.codename}
                    </h3>

                    {/* Brief */}
                    <p className="text-xs text-[#4a5568] leading-relaxed mb-4">{c.brief}</p>

                    {/* Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{EVIDENCE_ICONS[c.evidence?.type] || '📄'}</span>
                        <span className="font-mono text-[10px] text-[#8892a4] uppercase">{c.evidence?.type}</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#00b4d8]">+{c.xp_reward} XP</span>
                    </div>
                  </div>

                  {/* Open button */}
                  <div className="border-t border-[#1e2d3d] px-5 py-3 group-hover:bg-[#00b4d8]/5 transition-colors">
                    <span className="font-mono text-[10px] text-[#8892a4] tracking-widest group-hover:text-[#00b4d8] transition-colors">
                      OPEN CASE FILE →
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
