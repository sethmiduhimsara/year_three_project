import React, { useState, useEffect } from 'react'
import './History.css'

// ── Data ──────────────────────────────────────────────────────

const ALL_ACTIVITIES = [
  // Today
  { id: 1,  day: 'Today',      time: '9:14 AM',   type: 'peer',       icon: '🤝', color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)',  title: 'Answered a help request in Data Structures',         subject: 'Data Structures',  status: 'closed'   },
  { id: 2,  day: 'Today',      time: '11:02 AM',  type: 'resource',   icon: '📁', color: '#34d399', bg: 'rgba(52,211,153,0.12)',  title: 'Downloaded lecture notes — Software Engineering',     subject: 'SE Engineering',   status: null       },
  { id: 3,  day: 'Today',      time: '2:30 PM',   type: 'discussion', icon: '💬', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', title: 'Posted in Exam Tips thread — Database Systems',       subject: 'Database Systems', status: null       },

  // Yesterday
  { id: 4,  day: 'Yesterday',  time: '8:45 AM',   type: 'peer',       icon: '🤝', color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)',  title: 'Completed peer session with Kavindu R.',              subject: 'Algorithm Design', status: 'closed'   },
  { id: 5,  day: 'Yesterday',  time: '12:10 PM',  type: 'discussion', icon: '💬', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', title: 'Replied to group issue — Final Year Project planning', subject: 'FYP',              status: null       },
  { id: 6,  day: 'Yesterday',  time: '3:55 PM',   type: 'resource',   icon: '📁', color: '#34d399', bg: 'rgba(52,211,153,0.12)',  title: 'Uploaded past paper — Computer Networks 2023',        subject: 'Computer Networks', status: null      },
  { id: 7,  day: 'Yesterday',  time: '5:20 PM',   type: 'peer',       icon: '🤝', color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)',  title: 'Opened help request — Dijkstra Algorithm doubt',      subject: 'Algorithm Design', status: 'open'     },

  // Mar 19
  { id: 8,  day: 'Mar 19',     time: '9:00 AM',   type: 'session',    icon: '📝', color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  title: 'Study session logged — Database Normalization',        subject: 'Database Systems', status: null       },
  { id: 9,  day: 'Mar 19',     time: '11:30 AM',  type: 'discussion', icon: '💬', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', title: 'Started a new thread — OS Scheduling Algorithms',     subject: 'Operating Systems', status: null      },
  { id: 10, day: 'Mar 19',     time: '2:00 PM',   type: 'peer',       icon: '🤝', color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)',  title: 'Accepted help request from Sithara P.',               subject: 'Data Structures',  status: 'progress' },
  { id: 11, day: 'Mar 19',     time: '4:40 PM',   type: 'resource',   icon: '📁', color: '#34d399', bg: 'rgba(52,211,153,0.12)',  title: 'Bookmarked YouTube playlist — React Hooks deep-dive', subject: 'Web Development',  status: null       },

  // Mar 18
  { id: 12, day: 'Mar 18',     time: '10:15 AM',  type: 'session',    icon: '📝', color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  title: 'Study session logged — Algorithm complexity',         subject: 'Algorithm Design', status: null       },
  { id: 13, day: 'Mar 18',     time: '1:00 PM',   type: 'peer',       icon: '🤝', color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)',  title: 'Closed help request — Binary Trees explanation',      subject: 'Data Structures',  status: 'closed'   },
  { id: 14, day: 'Mar 18',     time: '3:30 PM',   type: 'discussion', icon: '💬', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', title: 'Commented on thread — Group project deadlines',       subject: 'FYP',              status: null       },
]

const FILTERS = [
  { label: 'All',        value: 'all',        icon: '⚡', color: '#f0f4ff' },
  { label: 'Peer Help',  value: 'peer',       icon: '🤝', color: '#4f8ef7' },
  { label: 'Resources',  value: 'resource',   icon: '📁', color: '#34d399' },
  { label: 'Discussions',value: 'discussion', icon: '💬', color: '#a78bfa' },
  { label: 'Sessions',   value: 'session',    icon: '📝', color: '#fb923c' },
]

const STATS = [
  { icon: '⚡', label: 'Total Activities', val: '61',  color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)'  },
  { icon: '🤝', label: 'Peer Help',        val: '24',  color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)'  },
  { icon: '💬', label: 'Discussions',      val: '18',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { icon: '📁', label: 'Resources',        val: '19',  color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
]

const CATEGORIES = [
  { label: 'Peer Help',   count: 24, color: '#4f8ef7', pct: 85 },
  { label: 'Resources',   count: 19, color: '#34d399', pct: 68 },
  { label: 'Discussions', count: 18, color: '#a78bfa', pct: 64 },
  { label: 'Sessions',    count: 10, color: '#fb923c', pct: 36 },
]

// Mini calendar helpers
const CAL_DAYS   = ['S','M','T','W','T','F','S']
const MONTH_NAME = 'March 2026'
// Days in March 2026 — starts on Sunday (0)
const MARCH_START_DOW = 0 // Sunday
const MARCH_DAYS      = 31
const TODAY_DATE      = 22
// Days that have activity dots
const ACTIVE_DAYS = new Set([3,5,7,8,10,12,14,15,17,18,19,20,21,22])

// ── Component ─────────────────────────────────────────────────
const History = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search,       setSearch]       = useState('')
  const [selectedDay,  setSelectedDay]  = useState(TODAY_DATE)
  const [catFills,     setCatFills]     = useState(CATEGORIES.map(() => 0))
  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    const t = setTimeout(() => setCatFills(CATEGORIES.map(c => c.pct)), 400)
    return () => clearTimeout(t)
  }, [])

  // Filter logic
  const filtered = ALL_ACTIVITIES.filter(a => {
    const matchType   = activeFilter === 'all' || a.type === activeFilter
    const matchSearch = search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  // Group by day
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = []
    acc[item.day].push(item)
    return acc
  }, {})

  const dayOrder = ['Today', 'Yesterday', 'Mar 19', 'Mar 18']
  const visibleDays = dayOrder.filter(d => grouped[d])

  // Calendar cells
  const calCells = []
  for (let i = 0; i < MARCH_START_DOW; i++) calCells.push(null)
  for (let d = 1; d <= MARCH_DAYS; d++) calCells.push(d)

  return (
    <div className="history-wrapper">

      {/* ── Header ── */}
      <div className="hist-header">
        <div>
          <div className="hist-title">Activity History</div>
          <div className="hist-sub">A full log of your academic interactions</div>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="hist-controls">
        <div className="hist-search">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search activities, subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-chip ${activeFilter === f.value ? 'active' : ''}`}
              style={activeFilter === f.value ? { background: f.color, borderColor: f.color } : {}}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="hist-stats">
        {STATS.map((s, i) => (
          <div className="hist-stat" key={i}>
            <div className="hist-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="hist-stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="hist-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="hist-grid">

        {/* Timeline */}
        <div className="hist-card">
          <div className="hist-card-title">
            Timeline
            <span>Sorted by most recent</span>
          </div>
          <div className="hist-result-count">
            Showing {Math.min(filtered.length, visibleCount)} of {filtered.length} activities
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0', fontSize: 14 }}>
              No activities found for that filter.
            </div>
          ) : (
            <div className="timeline">
              {visibleDays.map(day => {
                const entries = grouped[day]
                const shown   = entries.slice(0, visibleCount)
                return (
                  <div key={day}>
                    <div className="timeline-day-label">{day}</div>
                    {shown.map((a, i) => (
                      <div
                        className="timeline-entry"
                        key={a.id}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {/* Dot on line */}
                        <div className="timeline-dot" style={{ background: a.color }} />

                        {/* Icon */}
                        <div className="entry-icon" style={{ background: a.bg }}>{a.icon}</div>

                        {/* Body */}
                        <div className="entry-body">
                          <div className="entry-title">{a.title}</div>
                          <div className="entry-meta">
                            <span
                              className="entry-tag"
                              style={{ background: a.bg, color: a.color }}
                            >
                              {FILTERS.find(f => f.value === a.type)?.label}
                            </span>
                            <span className="entry-subject">{a.subject}</span>
                            {a.status && (
                              <span className={`entry-status status-${a.status}`}>
                                {a.status === 'open' ? 'Open' : a.status === 'closed' ? 'Closed' : 'In Progress'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Time */}
                        <div className="entry-time">{a.time}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {/* Load more */}
          {visibleCount < filtered.length && (
            <div className="load-more">
              <button className="load-more-btn" onClick={() => setVisibleCount(v => v + 10)}>
                Load more activities
              </button>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="right-panel">

          {/* Mini Calendar */}
          <div className="mini-cal">
            <div className="mini-cal-header">
              <button className="cal-nav">‹</button>
              <div className="mini-cal-month">{MONTH_NAME}</div>
              <button className="cal-nav">›</button>
            </div>
            <div className="cal-grid">
              {CAL_DAYS.map((d, i) => (
                <div className="cal-day-name" key={i}>{d}</div>
              ))}
              {calCells.map((d, i) =>
                d === null ? (
                  <div className="cal-cell empty" key={i} />
                ) : (
                  <div
                    key={i}
                    className={[
                      'cal-cell',
                      d === TODAY_DATE   ? 'today'    : '',
                      d === selectedDay  ? 'selected' : '',
                      ACTIVE_DAYS.has(d) ? 'has-activity' : '',
                    ].join(' ')}
                    onClick={() => setSelectedDay(d)}
                  >
                    {d}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Category Summary */}
          <div className="cat-card">
            <div className="cat-card-title">By Category</div>
            {CATEGORIES.map((c, i) => (
              <div className="cat-row" key={i}>
                <div className="cat-left">
                  <div className="cat-dot" style={{ background: c.color }} />
                  <div className="cat-name">{c.label}</div>
                </div>
                <div className="cat-right">
                  <div className="cat-bar-mini">
                    <div
                      className="cat-bar-fill"
                      style={{ width: `${catFills[i]}%`, background: c.color }}
                    />
                  </div>
                  <div className="cat-count" style={{ color: c.color }}>{c.count}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default History