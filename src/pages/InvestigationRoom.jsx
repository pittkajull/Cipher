import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { callGemini } from '../hooks/useGemini'
import EmailEvidence from '../components/evidence/EmailEvidence'
import WebsiteEvidence from '../components/evidence/WebsiteEvidence'
import ChatEvidence from '../components/evidence/ChatEvidence'
import ARIAChat from '../components/ARIAChat'
import ClueTracker from '../components/ClueTracker'
import AgentHUD from '../components/AgentHUD'

gsap.registerPlugin(TextPlugin)

const TIMER_SECONDS = 120
const WRONG_CLICK_PENALTY = 10 // seconds

export default function InvestigationRoom() {
  const navigate = useNavigate()
  const { state: locState } = useLocation()

  const caseData = locState?.caseData
  const agent = locState?.agent

  const [foundClues, setFoundClues] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [usedARIA, setUsedARIA] = useState(false)
  const [showDebrief, setShowDebrief] = useState(false)
  const [ariaComment, setAriaComment] = useState('')
  const [clueFlash, setClueFlash] = useState(null)
  const [visible, setVisible] = useState(false)
  const [showInstruction, setShowInstruction] = useState(true)
  const [wrongFlash, setWrongFlash] = useState(null)
  const [wrongCount, setWrongCount] = useState(0)

  const timerRef = useRef(null)
  const containerRef = useRef(null)
  const briefingRef = useRef(null)

  // Redirect if no case data
  useEffect(() => {
    if (!caseData || !agent) {
      navigate('/cases')
      return
    }
  }, [caseData, agent, navigate])

  // Start game after instruction dismissed
  useEffect(() => {
    if (!showInstruction && caseData) {
      setTimeout(() => setVisible(true), 100)

      // Briefing typing
      if (briefingRef.current) {
        setTimeout(() => {
          gsap.to(briefingRef.current, {
            duration: 1.5,
            text: { value: caseData.brief, delimiter: '' },
            ease: 'none',
          })
        }, 600)
      }
    }
  }, [showInstruction, caseData])

  // Timer
  useEffect(() => {
    if (submitted || !caseData || showInstruction) return

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleSubmit(true)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [submitted, caseData, showInstruction])

  const handleClueFound = useCallback((clueId) => {
    if (foundClues.includes(clueId)) return

    setFoundClues((prev) => [...prev, clueId])
    setClueFlash(clueId)
    setTimeout(() => setClueFlash(null), 500)

    // ARIA auto-comment
    const clue = caseData.clues.find((c) => c.id === clueId)
    if (clue) {
      setAriaComment(`Bagus, Agen. ${clue.description}. Terus selidiki.`)
      setTimeout(() => setAriaComment(''), 4000)
    }
  }, [foundClues, caseData])

  const handleWrongClick = useCallback((elementId) => {
    // Deduct time
    setTimeLeft((t) => Math.max(t - WRONG_CLICK_PENALTY, 0))
    setWrongCount((c) => c + 1)
    setWrongFlash(elementId)
    setTimeout(() => setWrongFlash(null), 600)

    // ARIA warning
    setAriaComment('Itu bukan clue, Agen. Hati-hati, waktumu berkurang.')
    setTimeout(() => setAriaComment(''), 3000)
  }, [])

  function handleSubmit(timeout = false) {
    if (submitted) return
    clearInterval(timerRef.current)
    setSubmitted(true)

    const isCorrect = timeout ? false : selectedAnswer === caseData.answer
    const clueBonus = foundClues.length * 25
    const timeBonus = Math.round(timeLeft * 0.5)
    const ariaPenalty = usedARIA ? 50 : 0
    const wrongPenalty = wrongCount * 15
    const baseXP = caseData.xp_reward || 100
    const totalXP = isCorrect
      ? Math.max(baseXP + clueBonus + timeBonus - ariaPenalty - wrongPenalty, 50)
      : Math.round(baseXP * 0.2)

    navigate('/debrief', {
      state: {
        caseData,
        agent,
        foundClues,
        selectedAnswer: timeout ? 'TIMEOUT' : selectedAnswer,
        isCorrect,
        timeLeft,
        usedARIA,
        wrongCount,
        xpGained: totalXP,
      },
    })
  }

  if (!caseData) return null

  // Instruction modal
  if (showInstruction) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          className="max-w-lg w-full bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6"
          style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.5s, transform 0.5s' }}
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="font-mono text-xl text-[#e2e8f0] font-semibold mb-1">HOW TO INVESTIGATE</h2>
            <p className="font-mono text-xs text-[#4a5568]">// Panduan singkat untuk agen baru</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm text-[#00b4d8] mt-0.5">01</span>
              <div>
                <div className="font-mono text-sm text-[#e2e8f0]">Klik elemen mencurigakan</div>
                <div className="text-xs text-[#4a5568]">Periksa bukti di panel kiri. Klik elemen yang menurutmu aneh atau mencurigakan.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm text-[#00b4d8] mt-0.5">02</span>
              <div>
                <div className="font-mono text-sm text-[#e2e8f0]">Temukan minimal 2 clue</div>
                <div className="text-xs text-[#4a5568]">Clue yang benar akan ditandai biru. Salah klik = waktu dikurangi {WRONG_CLICK_PENALTY} detik!</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm text-[#00b4d8] mt-0.5">03</span>
              <div>
                <div className="font-mono text-sm text-[#e2e8f0]">Pilih jenis serangan</div>
                <div className="text-xs text-[#4a5568]">Setelah cukup clue, pilih jawaban yang menurutmu benar di bagian SUBMIT VERDICT.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm text-[#00b4d8] mt-0.5">04</span>
              <div>
                <div className="font-mono text-sm text-[#e2e8f0]">Submit laporan</div>
                <div className="text-xs text-[#4a5568]">Klik SUBMIT REPORT untuk melihat hasil. Semakin cepat dan banyak clue = semakin tinggi XP.</div>
              </div>
            </div>
          </div>

          <div className="bg-[#f4a522]/5 border border-[#f4a522]/20 rounded-lg px-4 py-3 mb-6">
            <div className="font-mono text-[10px] text-[#f4a522] tracking-widest mb-1">⚠️ PERINGATAN</div>
            <p className="text-xs text-[#8892a4]">Salah klik elemen = <span className="text-[#ff3d3d]">-{WRONG_CLICK_PENALTY} detik</span> + <span className="text-[#ff3d3d]">-15 XP</span> saat submit. Perhatikan baik-baik sebelum mengklik!</p>
          </div>

          <button
            onClick={() => setShowInstruction(false)}
            className="w-full font-mono text-sm tracking-widest bg-[#00b4d8] text-[#080b0f] py-3.5 rounded hover:bg-[#00c8f0] active:scale-[0.98] transition-all cursor-pointer font-semibold glow-cyan-strong"
          >
            BEGIN INVESTIGATION
          </button>
        </div>
      </div>
    )
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const canSubmit = foundClues.length >= 2 && selectedAnswer

  function renderEvidence() {
    switch (caseData.evidence?.type) {
      case 'email':
        return <EmailEvidence evidence={caseData.evidence} clues={caseData.clues} onClueFound={handleClueFound} onWrongClick={handleWrongClick} foundClues={foundClues} wrongFlash={wrongFlash} />
      case 'website':
        return <WebsiteEvidence evidence={caseData.evidence} clues={caseData.clues} onClueFound={handleClueFound} onWrongClick={handleWrongClick} foundClues={foundClues} wrongFlash={wrongFlash} />
      case 'chat':
        return <ChatEvidence evidence={caseData.evidence} clues={caseData.clues} onClueFound={handleClueFound} onWrongClick={handleWrongClick} foundClues={foundClues} wrongFlash={wrongFlash} />
      default:
        return <div className="text-[#4a5568] font-mono text-sm">Unknown evidence type</div>
    }
  }

  return (
    <div className="min-h-screen px-4 py-4">
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        {/* HUD */}
        <div className="mb-4">
          <AgentHUD
            agent={agent}
            caseData={caseData}
            timeLeft={timeLeft}
            foundClues={foundClues}
          />
        </div>

        {/* Briefing */}
        <div className="mb-4 bg-[#0d1117] border border-[#1e2d3d] rounded-lg px-5 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs">🤖</span>
            <span className="font-mono text-[10px] text-[#00b4d8]">ARIA BRIEFING</span>
          </div>
          <p ref={briefingRef} className="font-mono text-sm text-[#8892a4] min-h-[1.5em]" />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Evidence */}
          <div className="lg:col-span-2">
            {renderEvidence()}

            {/* Answer Choices */}
            {!submitted && (
              <div className="mt-4 bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-4 sm:p-5">
                <div className="font-mono text-xs text-[#00b4d8] tracking-widest mb-3">SUBMIT VERDICT</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                  {caseData.choices?.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => setSelectedAnswer(choice)}
                      className={`font-mono text-xs py-3 px-4 rounded border transition-all cursor-pointer ${
                        selectedAnswer === choice
                          ? 'border-[#00b4d8] bg-[#00b4d8]/10 text-[#00b4d8] glow-cyan'
                          : 'border-[#1e2d3d] bg-[#111820] text-[#8892a4] hover:border-[#1e2d3d]/80'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!canSubmit}
                  className={`w-full font-mono text-sm tracking-widest py-3.5 rounded transition-all cursor-pointer ${
                    canSubmit
                      ? 'bg-[#00b4d8] text-[#080b0f] hover:bg-[#00c8f0] glow-cyan-strong'
                      : 'bg-[#1e2d3d] text-[#4a5568] cursor-not-allowed'
                  }`}
                >
                  {foundClues.length < 2
                    ? `NEED ${2 - foundClues.length} MORE CLUES`
                    : !selectedAnswer
                    ? 'SELECT VERDICT'
                    : 'SUBMIT REPORT'}
                </button>
              </div>
            )}
          </div>

          {/* Right: Clue Tracker + ARIA */}
          <div className="space-y-4">
            <ClueTracker
              clues={caseData.clues}
              foundClues={foundClues}
              clueFlash={clueFlash}
            />
            <ARIAChat
              caseData={caseData}
              foundClues={foundClues}
              onUseARIA={() => setUsedARIA(true)}
              ariaComment={ariaComment}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
