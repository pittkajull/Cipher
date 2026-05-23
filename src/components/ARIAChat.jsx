import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { callGemini } from '../hooks/useGemini'

const ARIA_SYSTEM = `Kamu adalah ARIA (Advanced Response Intelligence Agent), AI briefing officer di CIPHER Agency.
Karaktermu: profesional, singkat, sedikit misterius, seperti karakter di film spy/thriller.
Kamu TIDAK pernah bertele-tele. Maksimal 2-3 kalimat per respons.
Kamu memanggil user sebagai "Agen" bukan nama mereka.
Kamu berbicara dalam bahasa Indonesia dengan sedikit istilah teknis.
Kamu membimbing tanpa memberi jawaban langsung.
Contoh gaya bicara:
- "Agen, perhatikan domain emailnya. Ada yang tidak biasa."
- "Intel menunjukkan anomali di attachment ini. Selidiki lebih lanjut."
- "Kamu sudah dekat. Satu clue lagi sebelum kamu bisa submit laporan."`

export default function ARIAChat({ caseData, foundClues, onUseARIA, ariaComment }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ARIA typing indicator animation
  useEffect(() => {
    if (!dotRef.current) return
    const ctx = gsap.context(() => {
      gsap.to('.aria-dot', {
        opacity: 0,
        duration: 0.4,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
      })
    }, dotRef)
    return () => ctx.revert()
  }, [])

  // Show ARIA auto-comment
  useEffect(() => {
    if (ariaComment) {
      setMessages((prev) => [...prev, { role: 'assistant', content: ariaComment }])
    }
  }, [ariaComment])

  async function handleSend(e) {
    e.preventDefault()
    const msg = input.trim()
    if (!msg || loading) return

    setInput('')
    onUseARIA?.()
    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const clueContext = foundClues.length > 0
        ? `\nClue yang sudah ditemukan: ${foundClues.join(', ')}`
        : '\nBelum ada clue yang ditemukan.'

      const prompt = `${ARIA_SYSTEM}

Konteks kasus: ${caseData.case_id} — ${caseData.codename}
Threat level: ${caseData.threat_level}
Brief: ${caseData.brief}
${clueContext}

Riwayat chat:
${newMessages.map((m) => `${m.role === 'user' ? 'Agen' : 'ARIA'}: ${m.content}`).join('\n')}

Agen: ${msg}

Balas sebagai ARIA. Maksimal 2-3 kalimat. Jangan beri jawaban langsung, bimbing Agen.`

      let reply
      try {
        reply = await callGemini(prompt)
      } catch {
        // Fallback ARIA responses
        const fallbacks = [
          "Agen, fokus pada elemen yang mencurigakan. Perhatikan detail yang tidak biasa.",
          "Intel menunjukkan anomali. Cek kembali URL dan pengirimnya.",
          "Kamu sudah dekat. Periksa lagi elemen yang belum kamu selidiki.",
          "Instingmu bagus, Agen. Terus gali lebih dalam.",
        ]
        reply = fallbacks[Math.floor(Math.random() * fallbacks.length)]
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Koneksi terganggu. Coba lagi, Agen.' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2d3d] flex items-center gap-2 bg-[#111820]/50">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-[#00b4d8]/10 border border-[#00b4d8]/20 flex items-center justify-center text-sm">
            🤖
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00ff88] border border-[#0d1117]" />
        </div>
        <div>
          <div className="font-mono text-xs text-[#e2e8f0] font-semibold">ARIA</div>
          <div className="font-mono text-[10px] text-[#00b4d8]">Advanced Response Intelligence Agent</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="text-2xl mb-2">🤖</div>
            <p className="font-mono text-xs text-[#4a5568]">Tanya ARIA untuk petunjuk.</p>
            <p className="font-mono text-[10px] text-[#4a5568]/50 mt-1">Menggunakan ARIA = -50 XP</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`${msg.role === 'user' ? 'ml-4' : 'mr-4'}`}>
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px]">🤖</span>
                <span className="font-mono text-[10px] text-[#00b4d8]">ARIA</span>
              </div>
            )}
            <div
              className={`px-3 py-2 rounded-lg text-xs whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20'
                  : 'bg-[#111820] text-[#8892a4] border border-[#1e2d3d]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div ref={dotRef} className="mr-4">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px]">🤖</span>
              <span className="font-mono text-[10px] text-[#00b4d8]">ARIA</span>
            </div>
            <div className="bg-[#111820] border border-[#1e2d3d] rounded-lg px-3 py-2 inline-flex gap-1">
              <span className="aria-dot w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
              <span className="aria-dot w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
              <span className="aria-dot w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#1e2d3d]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya ARIA..."
            className="flex-1 bg-[#111820] border border-[#1e2d3d] rounded px-3 py-2 text-xs text-[#e2e8f0] placeholder:text-[#4a5568]/50 focus:outline-none focus:border-[#00b4d8] transition-colors font-mono"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#00b4d8] text-[#080b0f] px-3 py-2 rounded text-xs font-mono hover:bg-[#00c8f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            →
          </button>
        </div>
      </form>
    </div>
  )
}
