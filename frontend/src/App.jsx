import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Sidebar
        activeItem="dashboard"
        onNavChange={(id) => console.log('Navigated to:', id)}
        user={{ initials: 'AS', name: 'Asel Silva', role: '2nd Year · CS' }}
      />
      
    </>
  )
}

export default App
