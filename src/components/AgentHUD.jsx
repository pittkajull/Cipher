import { getRank } from '../utils/gameState'

export default function AgentHUD({ agent, caseData, timeLeft, foundClues }) {
  const rank = getRank(agent?.xp || 0)
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerWarning = timeLeft <= 30
  const timerCritical = timeLeft <= 10

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg px-3 sm:px-5 py-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Case info */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div>
            <div className="font-mono text-[10px] text-[#4a5568]">CASE</div>
            <div className="font-mono text-xs text-[#e2e8f0]">{caseData?.case_id}</div>
          </div>
          <div className="w-px h-4 sm:h-6 bg-[#1e2d3d]" />
          <div>
            <div className="font-mono text-[10px] text-[#4a5568]">THREAT</div>
            <div className="font-mono text-xs text-[#f4a522]">{caseData?.threat_level}</div>
          </div>
          <div className="w-px h-4 sm:h-6 bg-[#1e2d3d]" />
          <div>
            <div className="font-mono text-[10px] text-[#4a5568]">CLUES</div>
            <div className="font-mono text-xs text-[#00b4d8]">{foundClues?.length || 0}/{caseData?.clues?.length || 0}</div>
          </div>
        </div>

        {/* Timer */}
        <div className={`font-mono text-base sm:text-lg font-bold ${
          timerCritical ? 'text-[#ff3d3d]' : timerWarning ? 'text-[#f4a522]' : 'text-[#e2e8f0]'
        }`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Agent info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="font-mono text-[10px] text-[#4a5568]">AGENT</div>
            <div className="font-mono text-xs text-[#e2e8f0]">{agent?.codename}</div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#00b4d8]/10 border border-[#00b4d8]/20 flex items-center justify-center text-sm">
            {rank.icon}
          </div>
        </div>
      </div>
    </div>
  )
}
