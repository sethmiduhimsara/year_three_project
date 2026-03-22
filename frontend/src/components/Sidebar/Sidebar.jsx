import React, { useState } from 'react'
import './Sidebar.css'

// ── Nav config ────────────────────────────────────────────────
const NAV_MAIN = [
  { icon: '📊', label: 'Dashboard',        id: 'dashboard' },
  { icon: '📈', label: 'Progress',         id: 'progress' },
  { icon: '🕒', label: 'Activity History', id: 'activity' },
  { icon: '🏅', label: 'Badges',           id: 'badges' },
]

const NAV_COMMUNITY = [
  { icon: '💬', label: 'Discussions', id: 'discussions' },
  { icon: '🤝', label: 'Peer Help',   id: 'peerhelp' },
  { icon: '📁', label: 'Resources',   id: 'resources' },
]

// ── Props ──────────────────────────────────────────────────────
// activeItem  : string  – id of the currently active nav item
// onNavChange : (id) => void  – called when user clicks a nav item
// user        : { initials, name, role }  – student info to show in footer

const Sidebar = ({
  activeItem = 'dashboard',
  onNavChange = () => {},
  user = { initials: 'AS', name: 'Asel Silva', role: '2nd Year · CS' },
}) => {

  const [active, setActive] = useState(activeItem)

  const handleClick = (id) => {
    setActive(id)
    onNavChange(id)
  }

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-dot" />
        UniTrack
      </div>

      {/* Main nav */}
      <div className="sidebar-section-label">Main</div>
      {NAV_MAIN.map(({ icon, label, id }) => (
        <button
          key={id}
          className={`sidebar-nav-item ${active === id ? 'active' : ''}`}
          onClick={() => handleClick(id)}
        >
          <span className="sidebar-nav-icon">{icon}</span>
          {label}
        </button>
      ))}

      {/* Community nav */}
      <div className="sidebar-section-label">Community</div>
      {NAV_COMMUNITY.map(({ icon, label, id }) => (
        <button
          key={id}
          className={`sidebar-nav-item ${active === id ? 'active' : ''}`}
          onClick={() => handleClick(id)}
        >
          <span className="sidebar-nav-icon">{icon}</span>
          {label}
        </button>
      ))}

      {/* Footer – student profile */}
      <div className="sidebar-footer">
        <div className="sidebar-avatar-row">
          <div className="sidebar-avatar">{user.initials}</div>
          <div>
            <div className="sidebar-avatar-name">{user.name}</div>
            <div className="sidebar-avatar-role">{user.role}</div>
          </div>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar