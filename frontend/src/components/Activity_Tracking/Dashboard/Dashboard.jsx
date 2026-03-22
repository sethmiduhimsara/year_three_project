import React, { useState, useEffect } from 'react'
import './Dashboard.css'

// ── Static data ───────────────────────────────────────────────
const WEEK_DATA = [
  { day: 'Mon', value: 60, color: '#4f8ef7' },
  { day: 'Tue', value: 85, color: '#4f8ef7' },
  { day: 'Wed', value: 45, color: '#4f8ef7' },
  { day: 'Thu', value: 90, color: '#a78bfa' },
  { day: 'Fri', value: 70, color: '#4f8ef7' },
  { day: 'Sat', value: 30, color: '#4f8ef7' },
  { day: 'Sun', value: 55, color: '#34d399' },
]

const ACTIVITIES = [
  { color: '#4f8ef7', text: 'Answered a help request in Data Structures',       time: '2h ago',   tag: 'Peer Help'  },
  { color: '#34d399', text: 'Downloaded lecture notes for Software Engineering', time: '5h ago',   tag: 'Resource'   },
  { color: '#a78bfa', text: 'Posted in Exam Discussion – Database Systems',      time: 'Yesterday', tag: 'Discussion' },
  { color: '#fb923c', text: 'Completed peer session with Kavindu R.',            time: 'Yesterday', tag: 'Session'    },
  { color: '#4f8ef7', text: 'Opened help request – Algorithm Analysis',          time: '2d ago',    tag: 'Peer Help'  },
]

const MODULES = [
  { label: 'Peer Support',    pct: 72, color: '#4f8ef7' },
  { label: 'Discussions',     pct: 55, color: '#a78bfa' },
  { label: 'Resource Access', pct: 88, color: '#34d399' },
  { label: 'Study Sessions',  pct: 41, color: '#fb923c' },
]

const BADGES = [
  { icon: '🤝', label: 'Helper x5',    bg: 'rgba(79,142,247,0.12)',  color: '#4f8ef7' },
  { icon: '📚', label: 'Sharer',       bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
  { icon: '🔥', label: '7-Day Streak', bg: 'rgba(251,146,60,0.12)',  color: '#fb923c' },
  { icon: '⭐', label: 'Top Student',  bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
]

const STREAK_DATA = Array.from({ length: 60 }, (_, i) =>
  i >= 53 ? 0.95 : Math.random()
)

const STAT_CARDS = [
  { icon: '🤝', label: 'Peer Sessions',      value: '24', change: '+4 this week',    up: true,  color: '#4f8ef7' },
  { icon: '📁', label: 'Resources Accessed', value: '61', change: '+12 this month',  up: true,  color: '#34d399' },
  { icon: '💬', label: 'Discussions Joined', value: '18', change: '-2 vs last week', up: false, color: '#a78bfa' },
  { icon: '🔥', label: 'Activity Streak',    value: '7d', change: 'Personal best!',  up: true,  color: '#fb923c' },
]

// ── Helper ────────────────────────────────────────────────────
const streakColor = (v) => {
  if (v > 0.8)  return '#4f8ef7'
  if (v > 0.6)  return 'rgba(79,142,247,0.55)'
  if (v > 0.35) return 'rgba(79,142,247,0.25)'
  return 'var(--surface2)'
}

// ── Component ─────────────────────────────────────────────────
const Dashboard = () => {
  const [period,     setPeriod]     = useState('Week')
  const [barHeights, setBarHeights] = useState(WEEK_DATA.map(() => 0))
  const [progFills,  setProgFills]  = useState(MODULES.map(() => 0))

  // Animate bars & progress bars on mount
  useEffect(() => {
    const t1 = setTimeout(() => setBarHeights(WEEK_DATA.map(d => d.value)), 300)
    const t2 = setTimeout(() => setProgFills(MODULES.map(m => m.pct)),      500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="dashboard-wrapper">

      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <div className="dash-title">My Academic Dashboard</div>
          <div className="dash-sub">Track your progress, activity &amp; engagement</div>
        </div>

        <div className="dash-header-right">
          <div className="period-tabs">
            {['Week', 'Month', 'Semester'].map(p => (
              <button
                key={p}
                className={`period-tab ${period === p ? 'active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="notif-dot">3</div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        {STAT_CARDS.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-glow" style={{ background: s.color }} />
            <div className="stat-icon-wrap" style={{ background: `${s.color}22` }}>
              {s.icon}
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
              {s.up ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 2 : Bar Chart + Activity Feed ── */}
      <div className="dash-grid-2">

        {/* Weekly bar chart */}
        <div className="dash-card">
          <div className="dash-card-title">
            Weekly Activity
            <a>View report →</a>
          </div>
          <div className="bar-chart">
            {WEEK_DATA.map((d, i) => (
              <div className="bar-col" key={i}>
                <div className="bar-track" style={{ height: 90 }}>
                  <div
                    className="bar-fill"
                    style={{ height: `${barHeights[i]}%`, background: d.color }}
                  />
                </div>
                <div className="bar-day">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="dash-card">
          <div className="dash-card-title">
            Recent Activity
            <a>View all →</a>
          </div>
          {ACTIVITIES.map((a, i) => (
            <div className="activity-item" key={i}>
              <div className="activity-dot" style={{ background: a.color }} />
              <div>
                <div className="activity-text">{a.text}</div>
                <div className="activity-tag">{a.tag}</div>
              </div>
              <div className="activity-time">{a.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 3 : Module Engagement + Streak Calendar ── */}
      <div className="dash-grid-2">

        {/* Module progress + badges */}
        <div className="dash-card">
          <div className="dash-card-title">Module Engagement</div>
          {MODULES.map((m, i) => (
            <div className="progress-row" key={i}>
              <div className="progress-label">{m.label}</div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progFills[i]}%`, background: m.color }}
                />
              </div>
              <div className="progress-pct">{m.pct}%</div>
            </div>
          ))}

          <div className="dash-card-title" style={{ marginTop: 20, marginBottom: 10 }}>
            Badges Earned
          </div>
          <div className="badge-row">
            {BADGES.map((b, i) => (
              <div
                className="badge"
                key={i}
                style={{ background: b.bg, color: b.color, borderColor: `${b.color}30` }}
              >
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* Streak calendar */}
        <div className="dash-card">
          <div className="dash-card-title">Activity Streak Calendar</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
            Last 60 days —{' '}
            <span style={{ color: '#fb923c', fontWeight: 600 }}>🔥 7-day streak</span>
          </div>
          <div className="streak-grid">
            {STREAK_DATA.map((v, i) => (
              <div
                key={i}
                className="streak-cell"
                style={{ background: streakColor(v) }}
              />
            ))}
          </div>
          <div className="streak-footer">
            <span>60 days ago</span>
            <span>Today</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard