import React, { useState, useEffect } from 'react'
import './Progress.css'

// ── Data ──────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKS  = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Monthly line chart data — 3 series
const LINE_DATA = {
  Month: {
    labels: WEEKS,
    series: [
      { label: 'Peer Help',   color: '#4f8ef7', values: [4, 7, 5, 9]  },
      { label: 'Discussions', color: '#a78bfa', values: [3, 5, 8, 6]  },
      { label: 'Resources',   color: '#34d399', values: [6, 9, 7, 11] },
    ],
  },
  Semester: {
    labels: MONTHS.slice(0, 6),
    series: [
      { label: 'Peer Help',   color: '#4f8ef7', values: [8, 12, 10, 15, 13, 18]  },
      { label: 'Discussions', color: '#a78bfa', values: [5, 8, 11, 9, 14, 12]   },
      { label: 'Resources',   color: '#34d399', values: [10, 14, 12, 17, 15, 20] },
    ],
  },
}

// Activity breakdown donut
const DONUT_DATA = [
  { label: 'Resource Access', pct: 35, color: '#34d399' },
  { label: 'Peer Help',       pct: 28, color: '#4f8ef7' },
  { label: 'Discussions',     pct: 22, color: '#a78bfa' },
  { label: 'Study Sessions',  pct: 15, color: '#fb923c' },
]

// Subject engagement horizontal bars
const SUBJECTS = [
  { label: 'Data Structures', val: 85, color: '#4f8ef7' },
  { label: 'SE Engineering',  val: 72, color: '#a78bfa' },
  { label: 'Database Systems',val: 60, color: '#34d399' },
  { label: 'Algorithm Design',val: 48, color: '#fb923c' },
  { label: 'Computer Networks',val: 38, color: '#4f8ef7' },
]

// Weekly heatmap (7 days × 4 weeks)
const HEATMAP = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 4 }, (_, w) => Math.random())
)

const heatColor = (v) => {
  if (v > 0.8)  return '#4f8ef7'
  if (v > 0.6)  return 'rgba(79,142,247,0.55)'
  if (v > 0.35) return 'rgba(79,142,247,0.25)'
  return 'var(--surface2)'
}

// Monthly goals
const GOALS = [
  { icon: '🤝', label: 'Peer Sessions',       current: 18, target: 25, color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)'  },
  { icon: '💬', label: 'Discussion Posts',     current: 12, target: 20, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { icon: '📁', label: 'Resources Shared',     current: 9,  target: 10, color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  { icon: '📝', label: 'Help Requests Closed', current: 7,  target: 15, color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
]

const SUMMARY_CARDS = [
  { name: 'Overall Progress', count: '61 activities',  pct: 74, color: '#4f8ef7', trend: '+8% vs last month',  up: true  },
  { name: 'Goals Completed',  count: '3 of 4 goals',   pct: 60, color: '#34d399', trend: '+1 goal this week',  up: true  },
  { name: 'Engagement Score', count: 'Above average',  pct: 82, color: '#a78bfa', trend: '-3% vs last month', up: false },
]

// ── SVG Line Chart helper ─────────────────────────────────────
const W = 500
const H = 140
const PAD = { top: 10, right: 10, bottom: 10, left: 10 }

function pointsToPath(pts) {
  if (!pts.length) return ''
  return pts
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ')
}

function dataToPoints(values, maxVal) {
  const n = values.length
  return values.map((v, i) => ({
    x: PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right),
    y: PAD.top  + (1 - v / maxVal) * (H - PAD.top - PAD.bottom),
  }))
}

// ── Donut helper ──────────────────────────────────────────────
const DONUT_R  = 54
const DONUT_CX = 65
const DONUT_CY = 65
const CIRC     = 2 * Math.PI * DONUT_R

function donutSegments(data) {
  let offset = 0
  return data.map((d) => {
    const dash   = (d.pct / 100) * CIRC
    const gap    = CIRC - dash
    const rotate = (offset / 100) * 360
    offset += d.pct
    return { ...d, dash, gap, rotate }
  })
}

// ── Ring helper for summary cards ────────────────────────────
const RING_R  = 26
const RING_CX = 32
const RING_CY = 32
const RING_C  = 2 * Math.PI * RING_R

// ── Component ─────────────────────────────────────────────────
const Progress = () => {
  const [period,    setPeriod]    = useState('Month')
  const [hbarFills, setHbarFills] = useState(SUBJECTS.map(() => 0))
  const [goalFills, setGoalFills] = useState(GOALS.map(() => 0))
  const [ringFills, setRingFills] = useState(SUMMARY_CARDS.map(() => 0))
  const [donutFills,setDonutFills]= useState(donutSegments(DONUT_DATA).map(d => ({ ...d, dash: 0, gap: CIRC })))

  useEffect(() => {
    const t1 = setTimeout(() => setHbarFills(SUBJECTS.map(s => s.val)),               300)
    const t2 = setTimeout(() => setGoalFills(GOALS.map(g => (g.current / g.target) * 100)), 400)
    const t3 = setTimeout(() => setRingFills(SUMMARY_CARDS.map(c => c.pct)),           200)
    const t4 = setTimeout(() => setDonutFills(donutSegments(DONUT_DATA)),              350)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  const chartData = LINE_DATA[period] || LINE_DATA['Month']
  const allVals   = chartData.series.flatMap(s => s.values)
  const maxVal    = Math.max(...allVals) * 1.15

  // Y grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(
    f => PAD.top + (1 - f) * (H - PAD.top - PAD.bottom)
  )

  const segments = donutFills

  return (
    <div className="progress-wrapper">

      {/* ── Header ── */}
      <div className="prog-header">
        <div>
          <div className="prog-title">Academic Progress</div>
          <div className="prog-sub">Your activity trends, goals &amp; engagement breakdown</div>
        </div>
        <div className="period-tabs">
          {['Month', 'Semester'].map(p => (
            <button
              key={p}
              className={`period-tab ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary Ring Cards ── */}
      <div className="summary-grid">
        {SUMMARY_CARDS.map((c, i) => {
          const pct    = ringFills[i] ?? 0
          const offset = RING_C - (pct / 100) * RING_C
          return (
            <div className="summary-card" key={i}>
              <div className="summary-ring-wrap">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle className="ring-bg"   cx={RING_CX} cy={RING_CY} r={RING_R} />
                  <circle
                    className="ring-fill"
                    cx={RING_CX} cy={RING_CY} r={RING_R}
                    stroke={c.color}
                    strokeDasharray={`${RING_C}`}
                    strokeDashoffset={offset}
                  />
                </svg>
                <div className="ring-label" style={{ color: c.color }}>{c.pct}%</div>
              </div>
              <div className="summary-info">
                <div className="summary-name">{c.name}</div>
                <div className="summary-count">{c.count}</div>
                <div className={`summary-trend ${c.up ? 'trend-up' : 'trend-down'}`}>
                  {c.up ? '↑' : '↓'} {c.trend}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Line Chart + Donut ── */}
      <div className="prog-grid-3">

        {/* Line Chart */}
        <div className="prog-card">
          <div className="prog-card-title">
            Activity Over Time
            <span>{period === 'Month' ? 'This Month' : 'This Semester'}</span>
          </div>

          {/* Legend */}
          <div className="chart-legend">
            {chartData.series.map((s, i) => (
              <div className="legend-item" key={i}>
                <div className="legend-dot" style={{ background: s.color }} />
                {s.label}
              </div>
            ))}
          </div>

          {/* SVG */}
          <div className="line-chart-area">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              {/* Grid */}
              {gridLines.map((y, i) => (
                <line key={i} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} className="line-grid-line" />
              ))}

              {/* Series */}
              {chartData.series.map((s, si) => {
                const pts = dataToPoints(s.values, maxVal)
                const d   = pointsToPath(pts)
                const areaD = d + ` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`
                return (
                  <g key={si}>
                    <path d={areaD} fill={s.color} className="chart-area" />
                    <path d={d} stroke={s.color} className="chart-line" />
                    {pts.map((p, pi) => (
                      <circle key={pi} cx={p.x} cy={p.y} r={3.5} fill={s.color} className="chart-dot" />
                    ))}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* X labels */}
          <div className="line-x-labels">
            {chartData.labels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        {/* Donut */}
        <div className="prog-card">
          <div className="prog-card-title">Activity Breakdown</div>
          <div className="donut-wrap">
            <div className="donut-svg-wrap">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R} fill="none" stroke="var(--surface2)" strokeWidth="12" />
                {segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={`${seg.dash} ${seg.gap}`}
                    strokeDashoffset={0}
                    style={{ transform: `rotate(${seg.rotate}deg)`, transformOrigin: `${DONUT_CX}px ${DONUT_CY}px`, transition: 'stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1)' }}
                  />
                ))}
              </svg>
              <div className="donut-center">
                <div className="donut-center-val">61</div>
                <div className="donut-center-label">activities</div>
              </div>
            </div>

            <div className="donut-legend">
              {DONUT_DATA.map((d, i) => (
                <div className="donut-legend-item" key={i}>
                  <div className="donut-legend-left">
                    <div className="donut-legend-dot" style={{ background: d.color }} />
                    <span style={{ fontSize: 12 }}>{d.label}</span>
                  </div>
                  <span className="donut-legend-pct" style={{ color: d.color }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Subject Engagement + Heatmap ── */}
      <div className="prog-grid-2">

        {/* Horizontal bars */}
        <div className="prog-card">
          <div className="prog-card-title">
            Subject Engagement
            <span>By interaction count</span>
          </div>
          {SUBJECTS.map((s, i) => (
            <div className="hbar-row" key={i}>
              <div className="hbar-label">{s.label}</div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: `${hbarFills[i]}%`, background: s.color }} />
              </div>
              <div className="hbar-val" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Weekly heatmap */}
        <div className="prog-card">
          <div className="prog-card-title">
            Weekly Pattern
            <span>Activity by day</span>
          </div>
          <div className="heatmap-grid">
            {DAYS.map((day, d) => (
              <div className="heatmap-col" key={d}>
                <div className="heatmap-day-label">{day}</div>
                {HEATMAP[d].map((v, w) => (
                  <div
                    key={w}
                    className="heatmap-cell"
                    style={{ background: heatColor(v) }}
                    title={`${day} Week ${w + 1}: ${Math.round(v * 10)} activities`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Less</span>
            {['var(--surface2)', 'rgba(79,142,247,0.25)', 'rgba(79,142,247,0.55)', '#4f8ef7'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* ── Monthly Goals ── */}
      <div className="prog-card">
        <div className="prog-card-title">
          Monthly Goals
          <span>Resets in 9 days</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          {GOALS.map((g, i) => (
            <div className="goal-item" key={i}>
              <div className="goal-icon" style={{ background: g.bg }}>{g.icon}</div>
              <div className="goal-info">
                <div className="goal-name">{g.label}</div>
                <div className="goal-track">
                  <div className="goal-fill" style={{ width: `${goalFills[i]}%`, background: g.color }} />
                </div>
              </div>
              <div className="goal-counts">
                <div className="goal-current" style={{ color: g.color }}>{g.current}</div>
                <div className="goal-target">/ {g.target}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Progress