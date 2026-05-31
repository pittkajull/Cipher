import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { saveAgent } from '../utils/gameState'

const SPECIALIZATIONS = [
  {
    id: 'email',
    name: 'EMAIL INTEL',
    icon: '📧',
    desc: 'Ahli deteksi phishing via email. Mampu membaca header, domain, dan red flag dalam hitungan detik.',
    skills: ['Header Analysis', 'Domain Verification', 'Phishing Detection'],
  },
  {
    id: 'web',
    name: 'WEB FORENSICS',
    icon: '🌐',
    desc: 'Ahli analisis website berbahaya. Mendeteksi fake login, malware, dan suspicious URL.',
    skills: ['URL Analysis', 'SSL Verification', 'Malware Detection'],
  },
  {
    id: 'social',
    name: 'SOCIAL ENGINEERING',
    icon: '🎭',
    desc: 'Ahli deteksi manipulasi psikologis. Mengenali teknik social engineering dan pretexting.',
    skills: ['Psychology Analysis', 'Pretext Detection', 'Manipulation Tactics'],
  },
]

export default function AgentSetup() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [codename, setCodename] = useState('')
  const [selectedSpec, setSelectedSpec] = useState(null)
  const [step, setStep] = useState(1)
  const [visible, setVisible] = useState(false)
  const [step2Visible, setStep2Visible] = useState(false)

  useEffect(() => {
    // Small delay then fade in
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (step === 2) {
      setStep2Visible(false)
      const t = setTimeout(() => setStep2Visible(true), 50)
      return () => clearTimeout(t)
    }
  }, [step])

  function handleNameSubmit(e) {
    e.preventDefault()
    if (!codename.trim()) return
    setStep(2)
  }

  function handleSelectSpec(spec) {
    setSelectedSpec(spec)
  }

  function handleInitialize() {
    if (!codename.trim() || !selectedSpec) return

    saveAgent({
      codename: codename.trim(),
      specialization: selectedSpec.id,
      xp: 0,
      casesCompleted: 0,
      createdAt: Date.now(),
    })

    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => navigate('/briefing'),
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        ref={containerRef}
        className="max-w-2xl w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse" />
            <span className="font-mono text-[10px] text-[#00b4d8] tracking-widest">AGENT REGISTRATION</span>
          </div>
          <h1 className="font-mono text-2xl md:text-3xl text-[#e2e8f0] font-semibold">
            Initialize Agent Profile
          </h1>
          <p className="text-sm text-[#4a5568] mt-2 font-mono">
            // Complete registration to access CIPHER systems
          </p>
        </div>

        {/* Step 1: Codename */}
        <form onSubmit={handleNameSubmit} className="mb-8">
          <label className="block font-mono text-xs text-[#00b4d8] tracking-widest mb-3">
            AGENT CODENAME
          </label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[#00b4d8] text-sm">{'>'}</span>
            <input
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="Enter your codename..."
              maxLength={20}
              className="w-full bg-transparent border-b border-[#1e2d3d] focus:border-[#00b4d8] text-[#e2e8f0] font-mono text-lg py-3 pl-6 pr-4 outline-none transition-colors placeholder:text-[#4a5568]/50"
              autoFocus
            />
            {codename && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#4a5568]">
                {codename.length}/20
              </span>
            )}
          </div>

          {step === 1 && codename.trim() && (
            <button
              type="submit"
              className="mt-6 font-mono text-xs tracking-widest bg-transparent border border-[#1e2d3d] text-[#8892a4] px-6 py-2.5 rounded hover:border-[#00b4d8] hover:text-[#00b4d8] transition-colors cursor-pointer"
            >
              CONTINUE →
            </button>
          )}
        </form>

        {/* Step 2: Specialization */}
        {step === 2 && (
          <div
            style={{
              opacity: step2Visible ? 1 : 0,
              transform: step2Visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            }}
          >
            <label className="block font-mono text-xs text-[#00b4d8] tracking-widest mb-4">
              SELECT SPECIALIZATION
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {SPECIALIZATIONS.map((spec) => {
                const isSelected = selectedSpec?.id === spec.id
                return (
                  <button
                    key={spec.id}
                    onClick={() => handleSelectSpec(spec)}
                    className={`text-left p-5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00b4d8] bg-[#00b4d8]/5 glow-cyan'
                        : 'border-[#1e2d3d] bg-[#0d1117] hover:border-[#1e2d3d]/80'
                    }`}
                  >
                    <div className="text-2xl mb-3">{spec.icon}</div>
                    <div className={`font-mono text-sm font-semibold mb-2 ${isSelected ? 'text-[#00b4d8]' : 'text-[#e2e8f0]'}`}>
                      {spec.name}
                    </div>
                    <p className="text-xs text-[#4a5568] leading-relaxed mb-3">{spec.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#00b4d8]/15 text-[#00b4d8] border border-[#00b4d8]/30'
                              : 'bg-[#111820] text-[#4a5568] border border-[#1e2d3d]'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Initialize button */}
            {selectedSpec && (
              <div>
                <button
                  onClick={handleInitialize}
                  className="w-full font-mono text-sm tracking-widest bg-[#00b4d8] text-[#080b0f] py-4 rounded hover:bg-[#00c8f0] active:scale-[0.98] transition-all cursor-pointer font-semibold glow-cyan-strong"
                >
                  INITIALIZE AGENT PROFILE
                </button>
                <p className="text-center text-[10px] text-[#4a5568] font-mono mt-3">
                  Agent: <span className="text-[#8892a4]">{codename}</span> •
                  Spec: <span className="text-[#8892a4]">{selectedSpec.name}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
