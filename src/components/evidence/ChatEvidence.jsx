export default function ChatEvidence({ evidence, clues, onClueFound, onWrongClick, foundClues, wrongFlash }) {
  function handleClick(elementId) {
    const clue = clues.find((c) => c.element === elementId)
    if (clue) {
      onClueFound(clue.id)
    } else {
      onWrongClick(elementId)
    }
  }

  function isFound(elementId) {
    const clue = clues.find((c) => c.element === elementId)
    return clue && foundClues.includes(clue.id)
  }

  function isWrong(elementId) {
    return wrongFlash === elementId
  }

  function getStyle(elementId) {
    if (isWrong(elementId)) {
      return { border: '1px solid #ff3d3d', background: 'rgba(255,61,61,0.15)' }
    }
    if (isFound(elementId)) {
      return { border: '1px solid #00b4d8', background: 'rgba(0,180,216,0.15)' }
    }
    return {
      cursor: 'pointer',
      borderBottom: '1px dashed rgba(0,180,216,0.3)',
      transition: 'all 0.2s',
    }
  }

  const messages = evidence.messages || []

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-[#111820] border-b border-[#1e2d3d] px-5 py-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] text-[#00b4d8] tracking-widest">CHAT EVIDENCE</span>
          <span className="font-mono text-[10px] text-[#f4a522] animate-pulse">🔍 Klik pesan yang mencurigakan</span>
        </div>
        <div className="font-mono text-xs text-[#4a5568]">{messages.length} messages recorded</div>
      </div>

      {/* Messages */}
      <div className="px-4 py-4 space-y-3 max-h-[400px] overflow-y-auto">
        {messages.map((msg, i) => {
          const elementId = `msg_${i}`

          return (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1e2d3d] flex items-center justify-center flex-shrink-0">
                <span className="text-xs">{msg.sender?.[0]?.toUpperCase() || '?'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#e2e8f0] font-semibold">{msg.sender}</span>
                  <span className="font-mono text-[10px] text-[#4a5568]">{msg.time}</span>
                </div>
                <div
                  className="bg-[#111820] rounded-lg px-3 py-2 text-sm text-[#8892a4] inline-block max-w-full"
                  style={getStyle(elementId)}
                  onClick={() => handleClick(elementId)}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2d3d] px-5 py-2 bg-[#111820]/50">
        <span className="font-mono text-[10px] text-[#4a5568]">
          Garis putus-putus di pesan = bisa diklik • Salah = -10 detik
        </span>
      </div>
    </div>
  )
}
