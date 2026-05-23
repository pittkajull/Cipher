export async function callGemini(prompt) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data.candidates[0].content.parts[0].text
}
