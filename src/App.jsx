import { Routes, Route } from 'react-router-dom'
import BriefingRoom from './pages/BriefingRoom'
import AgentSetup from './pages/AgentSetup'
import CaseBoard from './pages/CaseBoard'
import InvestigationRoom from './pages/InvestigationRoom'
import DebriefRoom from './pages/DebriefRoom'

export default function App() {
  return (
    <div className="scanline">
      <Routes>
        <Route path="/" element={<BriefingRoom />} />
        <Route path="/setup" element={<AgentSetup />} />
        <Route path="/cases" element={<CaseBoard />} />
        <Route path="/investigate" element={<InvestigationRoom />} />
        <Route path="/debrief" element={<DebriefRoom />} />
      </Routes>
    </div>
  )
}
