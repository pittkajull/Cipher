import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ClueTracker({ clues, foundClues, clueFlash }) {
  const counterRef = useRef(null)

  // Flash counter on clue found
  useEffect(() => {
    if (clueFlash && counterRef.current) {
      gsap.fromTo(counterRef.current,
        { color: '#00ff88', scale: 1.2 },
        { color: '#00b4d8', scale: 1, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [clueFlash])

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2d3d] bg-[#111820]/50">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#00b4d8] tracking-widest">CLUE TRACKER</span>
          <span ref={counterRef} className="font-mono text-sm text-[#00b4d8] font-bold">
            {foundClues.length}/{clues.length}
          </span>
        </div>
      </div>

      {/* Clues */}
      <div className="p-4 space-y-2">
        {clues.map((clue) => {
          const found = foundClues.includes(clue.id)
          return (
            <div
              key={clue.id}
              className={`flex items-start gap-2 py-2 px-3 rounded transition-all ${
                found ? 'bg-[#00b4d8]/5 border border-[#00b4d8]/20' : 'border border-transparent'
              }`}
            >
              <span className={`mt-0.5 text-xs ${found ? 'text-[#00ff88]' : 'text-[#4a5568]'}`}>
                {found ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <span className={`font-mono text-xs ${found ? 'text-[#8892a4]' : 'text-[#4a5568]'}`}>
                  {found ? clue.description : '???'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hint */}
      {foundClues.length < 2 && (
        <div className="px-4 py-2 border-t border-[#1e2d3d] bg-[#f4a522]/5">
          <span className="font-mono text-[10px] text-[#f4a522]">
            Find at least 2 clues to submit report
          </span>
        </div>
      )}
    </div>
  )
}
