'use client'

import { useState } from 'react'

const PUMPS = [
  { id: 1, name: 'Pumpe 1', location: 'Keller A', model: 'Yaskawa GA500', status: 'on', hz: 38 },
  { id: 2, name: 'Pumpe 2', location: 'Keller B', model: 'Yaskawa GA500', status: 'off', hz: 0 },
  { id: 3, name: 'Pumpe 3', location: 'Außenlager', model: 'Yaskawa GA500', status: 'offline', hz: 0 },
]

const S = {
  phone: { width: 360, background: '#1a1a1a', borderRadius: 40, padding: 12, margin: '0 auto' },
  screen: { background: '#f5f5f0', borderRadius: 30, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 700 },
  statusBar: { background: '#111', padding: '10px 20px 6px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 11, fontWeight: 500 },
  topBar: { background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.1)', padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  topTitle: { fontSize: 17, fontWeight: 500, color: '#1a1a1a' },
  topSub: { fontSize: 12, color: '#888', marginTop: 2 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, color: '#27500A' },
  content: { flex: 1, padding: 12, overflowY: 'auto' },
  sectionLabel: { fontSize: 11, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: 14, marginBottom: 10 },
  cardHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  pumpName: { fontSize: 15, fontWeight: 500, color: '#1a1a1a' },
  pumpSub: { fontSize: 11, color: '#888', marginTop: 2 },
  stats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 },
  stat: { background: '#f5f5f0', borderRadius: 8, padding: '8px 10px', textAlign: 'center' },
  statVal: { fontSize: 17, fontWeight: 500, color: '#1a1a1a' },
  statLbl: { fontSize: 10, color: '#888', marginTop: 2 },
  sliderLabel: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 5 },
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  btnStart: { padding: 9, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '0.5px solid #97C459', background: '#EAF3DE', color: '#27500A' },
  btnStop: { padding: 9, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '0.5px solid #F09595', background: '#FCEBEB', color: '#791F1F' },
  logRow: { display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0', color: '#888' },
  divider: { height: '0.5px', background: 'rgba(0,0,0,0.08)', margin: '8px 0' },
  navbar: { background: '#fff', borderTop: '0.5px solid rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 0 16px' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontSize: 10, cursor: 'pointer', border: 'none', background: 'none', padding: '4px 0' },
  demoBanner: { background: '#EAF3DE', borderBottom: '0.5px solid #97C459', padding: '6px 12px', fontSize: 11, color: '#27500A', textAlign: 'center', fontWeight: 500 },
}

function Badge({ status }) {
  const cfg = {
    on:      { label: 'Läuft',    bg: '#EAF3DE', color: '#27500A' },
    off:     { label: 'Gestoppt', bg: '#f0f0ec', color: '#888' },
    offline: { label: 'Offline',  bg: '#FAEEDA', color: '#633806' },
  }
  const c = cfg[status] || cfg.off
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {c.label}
    </span>
  )
}

function PumpCard({ pump, onChange }) {
  const rpm = Math.round(pump.hz * 20)
  const pct = Math.round((pump.hz / 60) * 100)

  if (pump.status === 'offline') {
    return (
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div>
            <div style={S.pumpName}>{pump.name} — {pump.location}</div>
            <div style={S.pumpSub}>{pump.model} · Verbindung prüfen</div>
          </div>
          <Badge status="offline" />
        </div>
        <div style={{ fontSize: 12, color: '#888', paddingBottom: 8 }}>Letzter Kontakt: vor 8 Minuten</div>
        <div style={S.divider} />
        <div style={S.logRow}><span style={{ color: '#444' }}>WLAN-Verbindung verloren</span><span>09:33</span></div>
        <div style={S.logRow}><span style={{ color: '#444' }}>Automatisch neu verbinden…</span><span>09:34</span></div>
      </div>
    )
  }

  function handleSlider(val) {
    const hz = parseInt(val)
    onChange({ hz, status: hz > 0 ? 'on' : 'off' })
  }

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.pumpName}>{pump.name} — {pump.location}</div>
          <div style={S.pumpSub}>{pump.model} · Modbus OK</div>
        </div>
        <Badge status={pump.status} />
      </div>
      <div style={S.stats}>
        <div style={S.stat}><div style={S.statVal}>{pump.hz}</div><div style={S.statLbl}>Hz</div></div>
        <div style={S.stat}><div style={S.statVal}>{rpm}</div><div style={S.statLbl}>U/min</div></div>
        <div style={S.stat}><div style={S.statVal}>{pct}</div><div style={S.statLbl}>%</div></div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={S.sliderLabel}>
          <span>Drehzahl</span>
          <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{pump.hz} Hz</span>
        </div>
        <input
          type="range" min="0" max="60" step="1" value={pump.hz}
          onChange={e => handleSlider(e.target.value)}
          style={{ width: '100%', accentColor: '#0F6E56' }}
        />
      </div>
      <div style={S.btnRow}>
        <button style={S.btnStart} onClick={() => onChange({ hz: pump.hz || 30, status: 'on' })}>Einschalten</button>
        <button style={S.btnStop} onClick={() => onChange({ hz: 0, status: 'off' })}>Ausschalten</button>
      </div>
    </div>
  )
}

export default function Page() {
  const [pumps, setPumps] = useState(PUMPS)
  const [tab, setTab] = useState('pumps')

  function updatePump(id, changes) {
    setPumps(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }

  const running = pumps.filter(p => p.status === 'on').length
  const offline = pumps.filter(p => p.status === 'offline').length

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        @media (max-width: 400px) {
          body { background: #f5f5f0 !important; padding: 0 !important; }
          .phone { width: 100% !important; border-radius: 0 !important; padding: 0 !important; background: transparent !important; }
          .screen { border-radius: 0 !important; min-height: 100vh !important; }
        }
      `}</style>

      <div className="phone" style={S.phone}>
        <div className="screen" style={S.screen}>

          <div style={S.demoBanner}>Demo-Modus · kiotra.de</div>

          <div style={S.statusBar}>
            <span>9:41</span>
            <span>WLAN ●●●●</span>
          </div>

          <div style={S.topBar}>
            <div>
              <div style={S.topTitle}>Meine Pumpen</div>
              <div style={S.topSub}>
                Weingut Hofmann · {running} aktiv{offline > 0 ? ` · ${offline} offline` : ''}
              </div>
            </div>
            <div style={S.avatar}>WH</div>
          </div>

          <div style={S.content}>
            <div style={S.sectionLabel}>Alle Pumpen</div>
            {pumps.map(pump => (
              <PumpCard key={pump.id} pump={pump} onChange={ch => updatePump(pump.id, ch)} />
            ))}
            <div style={{ fontSize: 11, color: '#bbb', textAlign: 'center', padding: '8px 0 4px' }}>
              Demo · kiotra.de · Echtzeit-Steuerung per MQTT
            </div>
          </div>

          <div style={S.navbar}>
            {[
              { id: 'pumps', label: 'Pumpen', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="5" height="8" rx="1"/><rect x="7.5" y="6" width="5" height="12" rx="1"/><rect x="13" y="2" width="5" height="16" rx="1"/></svg> },
              { id: 'history', label: 'Verlauf', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/></svg> },
              { id: 'account', label: 'Konto', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                style={{ ...S.navItem, color: tab === id ? '#0F6E56' : '#888' }}
                onClick={() => setTab(id)}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
