export default function EmailEvidence({ evidence, clues, onClueFound, onWrongClick, foundClues, wrongFlash }) {
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
      return { border: '1px solid #ff3d3d', background: 'rgba(255,61,61,0.1)', borderRadius: '4px', padding: '2px 4px' }
    }
    if (isFound(elementId)) {
      return { border: '1px solid #00b4d8', background: 'rgba(0,180,216,0.05)', borderRadius: '4px', padding: '2px 4px' }
    }
    return {
      cursor: 'pointer',
      borderRadius: '4px',
      padding: '2px 4px',
      borderBottom: '1px dashed rgba(0,180,216,0.3)',
      transition: 'all 0.2s',
    }
  }

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden">
      {/* Header + Hint */}
      <div className="bg-[#111820] border-b border-[#1e2d3d] px-3 sm:px-5 py-3">
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="font-mono text-[10px] text-[#00b4d8] tracking-widest shrink-0">EMAIL EVIDENCE</span>
          <span className="font-mono text-[10px] text-[#f4a522] animate-pulse text-right">🔍 Klik yang mencurigakan</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
          <span className="font-mono text-xs text-[#4a5568] w-12 shrink-0">From:</span>
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span
              className="font-mono text-sm text-[#e2e8f0] truncate"
              style={getStyle('from_name')}
              onClick={() => handleClick('from_name')}
            >
              {evidence.from_name}
            </span>
            <span
              className="font-mono text-xs text-[#ff3d3d] truncate"
              style={getStyle('from_email')}
              onClick={() => handleClick('from_email')}
            >
              &lt;{evidence.from_email}&gt;
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-mono text-xs text-[#4a5568] w-12 shrink-0">Subj:</span>
          <span
            className="font-mono text-sm text-[#e2e8f0] font-semibold truncate"
            style={getStyle('subject')}
            onClick={() => handleClick('subject')}
          >
            {evidence.subject}
          </span>
        </div>
        {evidence.timestamp && (
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs text-[#4a5568] w-12">Date:</span>
            <span
              className="font-mono text-[10px] text-[#4a5568]"
              style={getStyle('timestamp')}
              onClick={() => handleClick('timestamp')}
            >
              {evidence.timestamp}
            </span>
          </div>
        )}
      </div>

      {/* Email body */}
      <div className="px-5 py-4">
        <div
          className="text-sm text-[#e2e8f0] leading-relaxed whitespace-pre-wrap"
          style={getStyle('body')}
          onClick={() => handleClick('body')}
        >
          {evidence.body}
        </div>

        {/* Attachment */}
        {evidence.attachment && (
          <div
            className="mt-4 bg-[#111820] border border-[#1e2d3d] rounded-lg p-3 inline-flex items-center gap-3"
            style={getStyle('attachment')}
            onClick={() => handleClick('attachment')}
          >
            <span className="text-lg">📎</span>
            <div>
              <div className="font-mono text-xs text-[#e2e8f0]">{evidence.attachment}</div>
              <div className="font-mono text-[10px] text-[#4a5568]">Click to download</div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {evidence.cta_text && (
          <div className="mt-4">
            <div
              className="inline-block bg-[#00b4d8] text-white font-mono text-sm px-6 py-2.5 rounded cursor-pointer hover:bg-[#00c8f0] transition-colors"
              style={getStyle('cta_url')}
              onClick={() => handleClick('cta_url')}
            >
              {evidence.cta_text}
            </div>
            {evidence.cta_url && (
              <div
                className="font-mono text-[10px] text-[#4a5568] mt-1"
                style={getStyle('cta_url_display')}
                onClick={() => handleClick('cta_url_display')}
              >
                {evidence.cta_url}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2d3d] px-5 py-2 bg-[#111820]/50">
        <span className="font-mono text-[10px] text-[#4a5568]">
          Garis putus-putus = bisa diklik • Salah = -10 detik
        </span>
      </div>
    </div>
  )
}
