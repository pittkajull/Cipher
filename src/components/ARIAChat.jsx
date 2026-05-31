import { useState, useRef, useEffect } from 'react'

function getARIAReply(message, caseData, foundClues) {
  const msg = message.toLowerCase()
  const clues = caseData.clues || []
  const evidence = caseData.evidence || {}
  const unfound = clues.filter(c => !foundClues.includes(c.id))

  // Help / lost
  if (msg.match(/help|bantuan|bingung|gimana|cara|apa yang harus|ngapain/)) {
    if (unfound.length >= 3) {
      return `Oke, santai aja dulu. Coba perhatiin ${evidence.type === 'email' ? 'alamat email pengirimnya' : evidence.type === 'chat' ? 'siapa yang ngirim pesan pertama' : 'URL di address bar'}. Ada yang aneh gak?`
    }
    if (unfound.length >= 1) {
      return `Kamu udah di jalur yang bener. Sekarang coba perhatiin ${unfound[0].element.includes('body') || unfound[0].element.includes('msg') ? 'isi pesannya lebih teliti' : 'elemen yang belum kamu klik'}. Ada satu lagi yang luput.`
    }
    return 'Clue udah lengkap! Sekarang tinggal tentuin ini jenis serangan apa. Percaya sama instingmu.'
  }

  // Clue / hint request
  if (msg.match(/clue|petunjuk|hint|anjuran|tolong kasih tau/)) {
    if (unfound.length > 0) {
      const target = unfound[0]
      const hints = {
        from_email: 'Coba perhatiin alamat emailnya. Beneran dari perusahaan resmi gak?',
        from_name: 'Siapa yang ngirim? Kenal gak?',
        subject: 'Subjek emailnya mencurigakan gak?',
        body: 'Baca lagi isi emailnya. Ada yang aneh?',
        cta_url: 'Link yang dikasih, itu ke mana arahnya?',
        cta_text: 'Tombolnya ngajak ngapain?',
        url: 'URL-nya beneran situs resmi?',
        hero_title: 'Judul halamannya normal gak?',
        hero_body: 'Isi halaman ngajak ngapain?',
        footer: 'Cek footer-nya. Ada yang janggal?',
        submit_text: 'Tombol submit-nya mencurigakan gak?',
        msg_0: 'Coba baca pesan pertama lagi. Siapa yang ngirim?',
        msg_1: 'Perhatiin pesan kedua. Responnya gimana?',
        msg_2: 'Pesan ketiga ini penting. Ada yang aneh?',
        msg_3: 'Pesan keempat. Gimana reaksi penerimanya?',
      }
      const hint = hints[target.element] || `Coba klik elemen yang belum kamu periksa.`
      return `Masih ada ${unfound.length} clue yang ketangkep. ${hint}`
    }
    return 'Clue udah ketemu semua, Agen. Sekarang tinggal pilih jawaban yang tepat.'
  }

  // Phishing
  if (msg.match(/phishing|phising|email palsu/)) {
    if (caseData.answer === 'Phishing Attack') return 'Hmm, kayanya kamu udah nemu jawabannya. Coba verifikasi lagi deh.'
    return 'Phishing? Coba pikirin lagi deh. Ada elemen lain yang lebih mencurigakan.'
  }

  // Malware
  if (msg.match(/malware|virus|trojan|ransomware|berbahaya/)) {
    if (caseData.answer === 'Malware Distribution') return 'Kayanya bener nih. Perhatiin lagi file atau link-nya.'
    return 'Malware? Bisa jadi, tapi cek lagi deh. Apakah ada file mencurigakan?'
  }

  // Social engineering
  if (msg.match(/social engineering|manipulasi|tipu|scam|penipuan/)) {
    if (caseData.answer === 'Social Engineering') return 'Instingmu tajem. Perhatiin cara mereka manipulasi korbannya.'
    return 'Social engineering emang berbahaya. Tapi cek lagi deh, ada yang lebih spesifik?'
  }

  // Sender / who
  if (msg.match(/siapa|pengirim|dari siapa|who|namanya/)) {
    if (evidence.type === 'email') return `Pengirimnya ${evidence.from_name} (${evidence.from_email}). Kenal gak?`
    if (evidence.type === 'chat') return `Coba perhatiin siapa yang mulai percakapan. Dia ngaku-ngaku siapa?`
    return `Perhatiin baik-baik siapa yang bikin website ini. Resmi gak?`
  }

  // URL / link
  if (msg.match(/url|link|website|domain|situs|alamat/)) {
    if (evidence.url) return `URL-nya: ${evidence.url}. Coba bandiin sama URL resmi. Mirip tapi beda, kan?`
    if (evidence.cta_url) return `Link-nya: ${evidence.cta_url}. Perhatiin domainnya, beneran resmi?`
    return 'Cek URL-nya teliti. Seringkali beda cuma satu huruf aja dari URL asli.'
  }

  // Time
  if (msg.match(/waktu|time|cepat|buru|kejar/)) {
    return 'Santai tapi fokus, Agen. Jangan gegara buru-buru malah salah tebak.'
  }

  // Submit
  if (msg.match(/submit|laporkan|selesai|done|finish|jawab/)) {
    if (foundClues.length < 2) return `Belum bisa submit, Agen. Kamu baru nemuin ${foundClues.length} clue, minimal 2.`
    return 'Oke, kalau udah yakin tinggal pilih jenis serangan terus klik SUBMIT REPORT.'
  }

  // Thanks
  if (msg.match(/terima kasih|thanks|makasih|thx|mantap/)) {
    return 'Sip, lanjutkan misinya!'
  }

  // Who is ARIA
  if (msg.match(/siapa kamu|aria|kamu siapa|kamu ai|kamu robot/)) {
    return 'Aku ARIA, asisten analisamu di CIPHER. Tugasku bimbing kamu, bukan kasih jawaban langsung.'
  }

  // Wrong answer context
  if (msg.match(/salah|gagal|rugi|kurang/)) {
    return 'Gak apa-apa, Agen. Yang penting kamu belajar dari situ. Coba lagi!'
  }

  // General what to do
  if (msg.match(/apa|what|kenapa|why|gimana|how/)) {
    if (unfound.length > 0) return `Kamu masih perlu nemuin ${unfound.length} clue lagi. Coba klik elemen yang belum diperiksa.`
    if (foundClues.length >= 2) return 'Clue udah cukup. Sekarang pilih jenis serangan yang tepat terus submit.'
    return 'Perhatiin bukti di depanmu. Klik elemen yang menurutmu aneh atau mencurigakan.'
  }

  // Default
  if (unfound.length > 0) return `Masih ada ${unfound.length} clue yang belum ketemu. Coba perhatiin lagi deh.`
  if (foundClues.length >= 2) return 'Udah cukup cluenya. Sekarang tinggal pilih jawaban yang bener.'
  return 'Perhatiin baik-baik bukti di depanmu, Agen. Ada yang janggal.'
}

export default function ARIAChat({ caseData, foundClues, onUseARIA, ariaComment }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (ariaComment) {
      setMessages((prev) => [...prev, { role: 'assistant', content: ariaComment }])
    }
  }, [ariaComment])

  function handleSend(e) {
    e.preventDefault()
    const msg = input.trim()
    if (!msg || loading) return

    setInput('')
    onUseARIA?.()
    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)

    setTimeout(() => {
      const reply = getARIAReply(msg, caseData, foundClues)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setLoading(false)
      inputRef.current?.focus()
    }, 600 + Math.random() * 800)
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
            <p className="font-mono text-xs text-[#4a5568]">Tanya ARIA kalau butuh petunjuk.</p>
            <p className="font-mono text-[10px] text-[#4a5568]/50 mt-1">Menggunakan ARIA = -50 XP</p>
            <div className="mt-3 text-left space-y-1">
              <p className="font-mono text-[10px] text-[#4a5568]/70">Contoh:</p>
              <p className="font-mono text-[10px] text-[#00b4d8]/50">"Gimana cara mainnya?"</p>
              <p className="font-mono text-[10px] text-[#00b4d8]/50">"Kasih hint dong"</p>
              <p className="font-mono text-[10px] text-[#00b4d8]/50">"Siapa pengirimnya?"</p>
            </div>
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
          <div className="mr-4">
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
