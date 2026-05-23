export default function EmailEvidence({ evidence, clues, onClueFound, foundClues }) {
  function handleClick(elementId) {
    const clue = clues.find((c) => c.element === elementId)
    if (clue) onClueFound(clue.id)
  }

  function isClueElement(elementId) {
    return clues.some((c) => c.element === elementId)
  }

  function isFound(elementId) {
    const clue = clues.find((c) => c.element === elementId)
    return clue && foundClues.includes(clue.id)
  }

  function getStyle(elementId) {
    if (!isClueElement(elementId)) return {}
    if (isFound(elementId)) {
      return { border: '1px solid #00b4d8', background: 'rgba(0,180,216,0.05)', borderRadius: '4px', padding: '2px 4px' }
    }
    return { cursor: 'pointer', transition: 'all 0.2s' }
  }

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden">
      {/* Email header bar */}
      <div className="bg-[#111820] border-b border-[#1e2d3d] px-5 py-3">
        <div className="font-mono text-[10px] text-[#00b4d8] tracking-widest mb-2">EMAIL EVIDENCE</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#4a5568] w-12">From:</span>
          <span
            className="font-mono text-sm text-[#e2e8f0]"
            style={getStyle('from_name')}
            onClick={() => handleClick('from_name')}
            data-clue-id={clues.find(c => c.element === 'from_name')?.id}
          >
            {evidence.from_name}
          </span>
          <span
            className="font-mono text-xs text-[#ff3d3d]"
            style={getStyle('from_email')}
            onClick={() => handleClick('from_email')}
            data-clue-id={clues.find(c => c.element === 'from_email')?.id}
          >
            &lt;{evidence.from_email}&gt;
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#4a5568] w-12">Subj:</span>
          <span
            className="font-mono text-sm text-[#e2e8f0] font-semibold"
            style={getStyle('subject')}
            onClick={() => handleClick('subject')}
            data-clue-id={clues.find(c => c.element === 'subject')?.id}
          >
            {evidence.subject}
          </span>
        </div>
        {evidence.timestamp && (
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs text-[#4a5568] w-12">Date:</span>
            <span className="font-mono text-[10px] text-[#4a5568]">{evidence.timestamp}</span>
          </div>
        )}
      </div>

      {/* Email body */}
      <div className="px-5 py-4">
        <div
          className="text-sm text-[#e2e8f0] leading-relaxed whitespace-pre-wrap"
          style={getStyle('body')}
          onClick={() => handleClick('body')}
          data-clue-id={clues.find(c => c.element === 'body')?.id}
        >
          {evidence.body}
        </div>

        {/* CTA Button */}
        {evidence.cta_text && (
          <div className="mt-4">
            <div
              className="inline-block bg-[#00b4d8] text-white font-mono text-sm px-6 py-2.5 rounded cursor-pointer hover:bg-[#00c8f0] transition-colors"
              style={getStyle('cta_url')}
              onClick={() => handleClick('cta_url')}
              data-clue-id={clues.find(c => c.element === 'cta_url')?.id}
            >
              {evidence.cta_text}
            </div>
            {evidence.cta_url && (
              <div className="font-mono text-[10px] text-[#4a5568] mt-1">{evidence.cta_url}</div>
            )}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="border-t border-[#1e2d3d] px-5 py-2 bg-[#111820]/50">
        <span className="font-mono text-[10px] text-[#4a5568]">Click suspicious elements to investigate</span>
      </div>
    </div>
  )
}
