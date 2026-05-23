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
  { difficulty: 'ELEVATED', type: 'email' },
  { difficulty: 'CLASSIFIED', type: 'website' },
]

export default function CaseBoard() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [agent, setAgent] = useState(null)
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const a = loadAgent()
    if (!a) {
      navigate('/setup')
      return
    }
    setAgent(a)
    generateCases()
  }, [])

  async function generateCases() {
    setLoading(true)
    setError(null)

    try {
      const results = await Promise.all(
        CASES_POOL.map(async (c) => {
          const prompt = generateCasePrompt(c.difficulty, c.type)
          const raw = await callGemini(prompt)
          // Strip markdown code blocks if present
          const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
          return JSON.parse(cleaned)
        })
      )
      setCases(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Stagger animation after cases load
  useEffect(() => {
    if (cases.length > 0) {
      gsap.from('.case-card', {
        opacity: 0,
        y: 30,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }
  }, [cases])

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
      <div ref={containerRef} className="max-w-5xl mx-auto">
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
                  className="case-card bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden hover:border-[#00b4d8]/40 hover:shadow-[0_0_20px_rgba(0,180,216,0.1)] transition-all cursor-pointer group"
                  onClick={() => handleOpenCase(c)}
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
