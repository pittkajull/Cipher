export default function WebsiteEvidence({ evidence, clues, onClueFound, foundClues }) {
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

  const isSuspicious = clues.some(c => c.element === 'url')

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-[#111820] border-b border-[#1e2d3d] px-4 py-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff3d3d]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f4a522]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]/60" />
          </div>
          <div
            className="flex-1 bg-[#080b0f] rounded px-3 py-1 font-mono text-xs"
            style={{
              ...getStyle('url'),
              color: isSuspicious ? '#ff3d3d' : '#00ff88',
              border: isFound('url') ? '1px solid #00b4d8' : '1px solid #1e2d3d',
            }}
            onClick={() => handleClick('url')}
            data-clue-id={clues.find(c => c.element === 'url')?.id}
          >
            {evidence.url}
          </div>
        </div>
        {/* Navbar */}
        {evidence.navbar_items && (
          <div className="flex items-center gap-4 px-2">
            {evidence.navbar_items.map((item, i) => (
              <span key={i} className="font-mono text-[10px] text-[#4a5568]">{item}</span>
            ))}
          </div>
        )}
      </div>

      {/* Website content */}
      <div className="bg-white text-gray-900 px-5 py-6">
        {/* Hero */}
        <div className="mb-6">
          <h2
            className="text-2xl font-bold mb-2 text-gray-900"
            style={getStyle('hero_title')}
            onClick={() => handleClick('hero_title')}
            data-clue-id={clues.find(c => c.element === 'hero_title')?.id}
          >
            {evidence.hero_title}
          </h2>
          <p
            className="text-sm text-gray-600 leading-relaxed"
            style={getStyle('hero_body')}
            onClick={() => handleClick('hero_body')}
            data-clue-id={clues.find(c => c.element === 'hero_body')?.id}
          >
            {evidence.hero_body}
          </p>
        </div>

        {/* Form */}
        {evidence.form_fields?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-sm">
            {evidence.form_fields.map((field, i) => (
              <div key={i} className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">{field}</label>
                <div className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-400">
                  {field === 'Password' ? '••••••••' : `Enter ${field.toLowerCase()}...`}
                </div>
              </div>
            ))}
            <button
              className="w-full bg-[#00b4d8] text-white font-medium text-sm py-2.5 rounded mt-2 cursor-pointer"
              style={getStyle('submit_text')}
              onClick={() => handleClick('submit_text')}
              data-clue-id={clues.find(c => c.element === 'submit_text')?.id}
            >
              {evidence.submit_text}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2d3d] px-5 py-2 bg-[#111820]/50">
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[10px] text-[#4a5568]"
            style={getStyle('footer')}
            onClick={() => handleClick('footer')}
            data-clue-id={clues.find(c => c.element === 'footer')?.id}
          >
            {evidence.footer}
          </span>
          <span className="font-mono text-[10px] text-[#4a5568]">Click elements to investigate</span>
        </div>
      </div>
    </div>
  )
}
