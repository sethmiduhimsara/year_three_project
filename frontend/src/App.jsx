import React, { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './components/Activity_Tracking/Dashboard/Dashboard'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />
      // later you'll add:
      // case 'progress':  return <Progress />
      // case 'activity':  return <History />
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