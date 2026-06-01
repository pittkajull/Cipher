import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveAgent, getRank, getNextRankXP } from '../utils/gameState'

export default function DebriefRoom() {
  const navigate = useNavigate()
  const { state: locState } = useLocation()
  const containerRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const caseData = locState?.caseData
  const agent = locState?.agent
  const foundClues = locState?.foundClues || []
  const selectedAnswer = locState?.selectedAnswer
  const isCorrect = locState?.isCorrect
  const timeLeft = locState?.timeLeft ?? 0
  const usedARIA = locState?.usedARIA ?? false
  const wrongCount = locState?.wrongCount ?? 0
  const xpGained = locState?.xpGained ?? 0

  useEffect(() => {
    if (!caseData || !agent) {
      navigate('/cases')
      return
    }

    // Save updated XP only if correct or first attempt
    if (isCorrect) {
      const updatedAgent = {
        ...agent,
        xp: (agent.xp || 0) + xpGained,
        casesCompleted: (agent.casesCompleted || 0) + 1,
      }
      saveAgent(updatedAgent)
    }

    setTimeout(() => setVisible(true), 100)
  }, [])

  if (!caseData || !agent) return null

  const oldRank = getRank(agent.xp || 0)
  const newRank = getRank((agent.xp || 0) + xpGained)
  const nextXP = getNextRankXP((agent.xp || 0) + xpGained)
  const currentXP = (agent.xp || 0) + xpGained
  const progress = nextXP > 0 ? Math.min((currentXP / nextXP) * 100, 100) : 100
  const debrief = caseData.debrief || {}
  const leveledUp = newRank.index > oldRank.index

  function handleNextCase() {
    navigate('/cases')
  }

  function handleReturn() {
    navigate('/cases')
  }

  function handleTryAgain() {
    navigate('/investigate', { state: { caseData, agent } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        ref={containerRef}
        className="max-w-lg w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{isCorrect ? '✅' : '❌'}</div>
          <h1 className="font-mono text-2xl md:text-3xl font-bold mb-1">
            {isCorrect ? (
              <span className="text-[#00ff88]">MISSION SUCCESS</span>
            ) : (
              <span className="text-[#ff3d3d]">MISSION FAILED</span>
            )}
          </h1>
          <p className="font-mono text-xs text-[#4a5568]">{caseData.case_id} — {caseData.codename}</p>
        </div>

        {/* Verdict Card */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-5 mb-4">
          <div className="font-mono text-xs text-[#00b4d8] tracking-widest mb-2">VERDICT</div>
          <div className="font-mono text-lg text-[#e2e8f0] font-semibold mb-2">{debrief.verdict}</div>
          <p className="text-sm text-[#8892a4] leading-relaxed">{debrief.summary}</p>

          <div className="mt-4 pt-3 border-t border-[#1e2d3d]">
            <div className="font-mono text-xs text-[#4a5568] mb-1">Your answer:</div>
            <div className={`font-mono text-sm ${isCorrect ? 'text-[#00ff88]' : 'text-[#ff3d3d]'}`}>
              {selectedAnswer}
              {!isCorrect && (
                <span className="text-[#4a5568]"> → Correct: <span className="text-[#00ff88]">{caseData.answer}</span></span>
              )}
            </div>
          </div>
        </div>

        {/* Key Findings */}
        {debrief.key_findings?.length > 0 && (
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-5 mb-4">
            <div className="font-mono text-xs text-[#00b4d8] tracking-widest mb-3">KEY FINDINGS</div>
            <div className="flex flex-wrap gap-2">
              {debrief.key_findings.map((finding, i) => (
                <span
                  key={i}
                  className="font-mono text-[11px] bg-[#00b4d8]/10 border border-[#00b4d8]/20 text-[#00b4d8] px-3 py-1.5 rounded"
                >
                  {finding}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Clues Found */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-5 mb-4">
          <div className="font-mono text-xs text-[#00b4d8] tracking-widest mb-3">
            CLUES FOUND: {foundClues.length}/{caseData.clues?.length || 0}
          </div>
          <div className="space-y-2">
            {caseData.clues?.map((clue) => {
              const found = foundClues.includes(clue.id)
              return (
                <div key={clue.id} className="flex items-center gap-2">
                  <span className={found ? 'text-[#00ff88]' : 'text-[#4a5568]'}>{found ? '✓' : '○'}</span>
                  <span className={`font-mono text-xs ${found ? 'text-[#8892a4]' : 'text-[#4a5568]'}`}>
                    {clue.description}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* XP Gained */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-xs text-[#00b4d8] tracking-widest">XP GAINED</div>
            <div className={`font-mono text-2xl font-bold ${isCorrect ? 'text-[#00ff88]' : 'text-[#ff3d3d]'}`}>
              {isCorrect ? `+${xpGained}` : '+0'}
            </div>
          </div>

          {/* Rank progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-[#8892a4]">{newRank.icon} {newRank.name}</span>
            <span className="font-mono text-[10px] text-[#4a5568]">{currentXP} / {nextXP} XP</span>
          </div>
          <div className="h-2 bg-[#111820] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00b4d8] rounded-full"
              style={{
                width: visible ? `${progress}%` : '0%',
                transition: 'width 1s ease-out 0.5s',
              }}
            />
          </div>

          {leveledUp && (
            <div className="mt-3 text-center">
              <span className="font-mono text-sm text-[#f4a522]">⚡ RANK UP: {newRank.name} ⚡</span>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#1e2d3d]">
            <div className="text-center">
              <div className="font-mono text-[11px] text-[#4a5568]">Time</div>
              <div className="font-mono text-sm text-[#8892a4]">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[11px] text-[#4a5568]">Clues</div>
              <div className="font-mono text-sm text-[#8892a4]">{foundClues.length}/{caseData.clues?.length || 0}</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[11px] text-[#4a5568]">Wrong</div>
              <div className={`font-mono text-sm ${wrongCount > 0 ? 'text-[#ff3d3d]' : 'text-[#8892a4]'}`}>{wrongCount}</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[11px] text-[#4a5568]">ARIA</div>
              <div className="font-mono text-sm text-[#8892a4]">{usedARIA ? 'Used' : 'None'}</div>
            </div>
          </div>
        </div>

        {/* Tip */}
        {debrief.tip && (
          <div className="bg-[#f4a522]/5 border border-[#f4a522]/20 rounded-lg px-5 py-3 mb-6">
            <div className="font-mono text-[10px] text-[#f4a522] tracking-widest mb-1">💡 SECURITY TIP</div>
            <p className="text-sm text-[#8892a4]">{debrief.tip}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!isCorrect && (
            <button
              onClick={handleTryAgain}
              className="flex-1 font-mono text-sm tracking-widest bg-[#ff3d3d] text-white py-3.5 rounded hover:bg-[#ff5555] active:scale-[0.98] transition-all cursor-pointer font-semibold"
            >
              🔄 TRY AGAIN
            </button>
          )}
          <button
            onClick={handleNextCase}
            className="flex-1 font-mono text-sm tracking-widest bg-[#00b4d8] text-[#080b0f] py-3.5 rounded hover:bg-[#00c8f0] active:scale-[0.98] transition-all cursor-pointer font-semibold"
          >
            NEXT CASE
          </button>
          <button
            onClick={handleReturn}
            className="flex-1 font-mono text-xs tracking-widest border border-[#1e2d3d] text-[#8892a4] py-3.5 rounded hover:border-[#00b4d8] hover:text-[#00b4d8] transition-colors cursor-pointer"
          >
            CASE BOARD
          </button>
        </div>
      </div>
    </div>
  )
}
