'use client'

import { useState, useEffect } from 'react'

/* ─── Inline Styles (alle im Phone-Viewport-Kontext) ─── */
const S = {
  phone: { width: 360, background: '#1a1a1a', borderRadius: 40, padding: 12, margin: '0 auto' },
  screen: { background: '#fafaf8', borderRadius: 30, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 700 },
  statusBar: { background: '#111', padding: '10px 20px 6px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 11, fontWeight: 500 },

  demoBanner: { background: '#dcfce7', borderBottom: '1px solid rgba(22,163,74,0.2)', padding: '6px 12px', fontSize: 11, color: '#16a34a', textAlign: 'center', fontWeight: 500 },

  header: { background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '16px 16px 14px' },
  headerTitle: { fontSize: 18, fontWeight: 600, color: '#1a1d1b', marginBottom: 8 },
  badges: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badgeOnline: { display: 'inline-block', padding: '2px 10px', fontSize: 11, fontWeight: 500, borderRadius: 100, background: '#dcfce7', color: '#16a34a' },
  badgeControl: { display: 'inline-block', padding: '2px 10px', fontSize: 11, fontWeight: 500, borderRadius: 100, background: '#dcfce7', color: '#16a34a' },

  content: { flex: 1, padding: 14, overflowY: 'auto' },

  /* Hz Section */
  hzSection: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 20, marginBottom: 16 },
  sectionHeader: { fontSize: 13, fontWeight: 500, color: '#5c6560', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 },
  hzDisplay: { textAlign: 'center', marginBottom: 20 },
  hzValue: { fontSize: 48, fontWeight: 700, color: '#16a34a', lineHeight: 1 },
  hzUnit: { fontSize: 18, fontWeight: 400, color: '#5c6560', marginLeft: 4 },
  hzButtons: { display: 'flex', gap: 10, marginBottom: 16 },
  hzButtonOn: { flex: 1, padding: '10px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' },
  hzButtonOnDisabled: { flex: 1, padding: '10px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'not-allowed', opacity: 0.4 },
  hzButtonOff: { flex: 1, padding: '10px 16px', background: '#fff', color: '#DC2626', border: '2px solid #DC2626', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' },
  hzButtonOffDisabled: { flex: 1, padding: '10px 16px', background: '#fff', color: '#DC2626', border: '2px solid #DC2626', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'not-allowed', opacity: 0.4 },

  /* Signal Cards */
  signalCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16, marginBottom: 12 },
  signalCardWarning: { background: '#fff', border: '2px solid #DC2626', borderRadius: 12, padding: 16, marginBottom: 12 },
  signalName: { fontSize: 12, color: '#5c6560', marginBottom: 6 },
  signalValueRow: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 },
  signalValue: { fontSize: 26, fontWeight: 700, color: '#1a1d1b', lineHeight: 1 },
  signalValueWarning: { fontSize: 26, fontWeight: 700, color: '#DC2626', lineHeight: 1 },
  signalEinheit: { fontSize: 13, color: '#5c6560' },
  signalRange: { fontSize: 11, color: '#9CA3AF' },
  signalWarningText: { fontSize: 11, color: '#DC2626', fontWeight: 500, marginTop: 4 },

  /* Digital Signal */
  digitalStatus: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 },
  digitalDotOff: { width: 14, height: 14, borderRadius: '50%', background: '#f0f4f0', border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 },
  digitalDotOn: { width: 14, height: 14, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px rgba(22,163,74,0.4)', flexShrink: 0 },
  digitalLabel: { fontSize: 15, fontWeight: 600, color: '#1a1d1b' },

  footer: { fontSize: 10, color: '#9CA3AF', textAlign: 'center', padding: '8px 0 4px' },
}

/* Custom slider CSS (injected via <style>) */
const SLIDER_CSS = `
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }

  .hz-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    background: #f0f4f0;
    border-radius: 4px;
    outline: none;
  }
  .hz-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #16a34a;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  }
  .hz-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #16a34a;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  }

  @media (max-width: 400px) {
    body { background: #fafaf8 !important; padding: 0 !important; }
    .phone { width: 100% !important; border-radius: 0 !important; padding: 0 !important; background: transparent !important; }
    .screen { border-radius: 0 !important; min-height: 100vh !important; }
  }
`

export default function Page() {
  const [sliderHz, setSliderHz] = useState(32.5)
  const [lastHz, setLastHz] = useState(32.5)
  const [pressure, setPressure] = useState(3.2)
  const [trockenlauf, setTrockenlauf] = useState(false)

  const isRunning = sliderHz > 0

  function handleTurnOn() {
    const hz = lastHz > 0 ? lastHz : 50
    setSliderHz(hz)
    setLastHz(hz)
  }

  function handleTurnOff() {
    if (sliderHz > 0) setLastHz(sliderHz)
    setSliderHz(0)
  }

  function handleSliderChange(e) {
    const hz = parseFloat(e.target.value)
    setSliderHz(hz)
    if (hz > 0) setLastHz(hz)
  }

  // Simulate pressure sensor: fluctuates based on Hz
  useEffect(() => {
    const interval = setInterval(() => {
      const basePress = isRunning ? 1.0 + (sliderHz / 100) * 7.0 : 0.0
      const fluctuation = (Math.random() - 0.5) * 0.4
      const newPressure = Math.max(0, Math.min(10, basePress + fluctuation))
      setPressure(newPressure)
    }, 3000)

    return () => clearInterval(interval)
  }, [sliderHz, isRunning])

  const pressureWarning = pressure > 8

  return (
    <>
      <style>{SLIDER_CSS}</style>

      <div className="phone" style={S.phone}>
        <div className="screen" style={S.screen}>

          {/* Demo Banner */}
          <div style={S.demoBanner}>Demo-Modus · kiotra.de</div>

          {/* Status Bar */}
          <div style={S.statusBar}>
            <span>9:41</span>
            <span>WLAN ●●●●</span>
          </div>

          {/* Header */}
          <div style={S.header}>
            <div style={S.headerTitle}>Weinpumpe 3000</div>
            <div style={S.badges}>
              <span style={S.badgeOnline}>● Online</span>
              <span style={S.badgeControl}>Steuerung aktiv</span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div style={S.content}>

            {/* Hz Control Section */}
            <div style={S.hzSection}>
              <div style={S.sectionHeader}>Frequenzsteuerung</div>
              <div style={S.hzDisplay}>
                <span style={S.hzValue}>{Number(sliderHz).toFixed(1)}</span>
                <span style={S.hzUnit}>Hz</span>
              </div>
              <div style={S.hzButtons}>
                <button
                  style={isRunning ? S.hzButtonOnDisabled : S.hzButtonOn}
                  disabled={isRunning}
                  onClick={handleTurnOn}
                >
                  Einschalten
                </button>
                <button
                  style={!isRunning ? S.hzButtonOffDisabled : S.hzButtonOff}
                  disabled={!isRunning}
                  onClick={handleTurnOff}
                >
                  Ausschalten
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={sliderHz}
                onChange={handleSliderChange}
                className="hz-slider"
              />
            </div>

            {/* Analog Signals */}
            <div style={S.sectionHeader}>Analoge Signale</div>
            <div style={pressureWarning ? S.signalCardWarning : S.signalCard}>
              <div style={S.signalName}>Pumpendruck (A0)</div>
              <div style={S.signalValueRow}>
                <span style={pressureWarning ? S.signalValueWarning : S.signalValue}>
                  {pressure.toFixed(1)}
                </span>
                <span style={S.signalEinheit}>bar</span>
              </div>
              <div style={S.signalRange}>Bereich: 0 – 10 bar</div>
              {pressureWarning && (
                <div style={S.signalWarningText}>Warnschwelle überschritten</div>
              )}
            </div>

            {/* Digital Signals */}
            <div style={S.sectionHeader}>Digitale Signale</div>
            <div style={S.signalCard}>
              <div style={S.signalName}>Trockenlauf (D0)</div>
              <div style={S.digitalStatus}>
                <span style={trockenlauf ? S.digitalDotOn : S.digitalDotOff} />
                <span style={S.digitalLabel}>{trockenlauf ? 'Ein' : 'Aus'}</span>
              </div>
            </div>

            <div style={S.footer}>
              Demo · kiotra.de
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
