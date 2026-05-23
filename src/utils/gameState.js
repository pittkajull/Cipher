const STORAGE_KEY = 'cipher_agent'

const RANKS = [
  { name: 'Recruit', xp: 0, icon: '🔰' },
  { name: 'Analyst', xp: 200, icon: '🔍' },
  { name: 'Operative', xp: 500, icon: '🎯' },
  { name: 'Specialist', xp: 1000, icon: '⚡' },
  { name: 'Commander', xp: 2000, icon: '🛡️' },
]

export function getRank(xp) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.xp) rank = r
    else break
  }
  return rank
}

export function getNextRankXP(xp) {
  for (const r of RANKS) {
    if (xp < r.xp) return r.xp
  }
  return RANKS[RANKS.length - 1].xp
}

export function getRankIndex(xp) {
  let idx = 0
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) idx = i
    else break
  }
  return idx
}

export function loadAgent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveAgent(agent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agent))
}

export function clearAgent() {
  localStorage.removeItem(STORAGE_KEY)
}

export { RANKS }
