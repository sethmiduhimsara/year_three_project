import React, { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './components/Activity_Tracking/Dashboard/Dashboard'
import Progress from './components/Activity_Tracking/Progress/Progress'
import History from './components/Activity_Tracking/Activity_history/History'
import Badges from './components/Activity_Tracking/Badges/Badges'
// import './App.css'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />
      case 'progress':  return <Progress />
      case 'activity': return <History />
      case 'badges':    return <Badges />
      // case 'badges':    return <Badges />
      default: return <Dashboard />
    }
  }

  return (
    <>
      <Sidebar
        activeItem={activePage}
        onNavChange={(id) => setActivePage(id)}
        user={{ initials: 'AS', name: 'Asel Silva', role: '2nd Year · CS' }}
      />
      {renderPage()}
    </>
  )
}

export default App