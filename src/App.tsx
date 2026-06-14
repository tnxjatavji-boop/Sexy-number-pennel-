/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

type HackState = 'wingo' | 'scanning' | 'result';

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 12 + 8;
        const number = Math.floor(Math.random() * 10);
        return (
          <div
            key={i}
            className="absolute font-mono font-bold"
            style={{
              fontSize: `${size}px`,
              color: Math.random() > 0.5 ? 'rgba(255, 31, 68, 0.4)' : 'rgba(157, 75, 255, 0.4)',
              textShadow: `0 0 ${size/2}px ${Math.random() > 0.5 ? '#ff1f44' : '#ff2bd6'}`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatUp ${Math.random() * 15 + 15}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`,
              opacity: 0,
              willChange: 'transform, opacity'
            }}
          >
            {number}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [appState, setAppState] = useState<HackState>('wingo');
  const [resultStore, setResultStore] = useState<Record<string, { out: string; p: string }>>({});
  const [confidence, setConfidence] = useState(87);
  const [currentResult, setCurrentResult] = useState('');
  const [currentPeriodSlice, setCurrentPeriodSlice] = useState('');
  const [unlockMessage, setUnlockMessage] = useState('');

  const getP = () => {
    const d = new Date();
    const utc = new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
    const y = utc.getFullYear();
    const m = String(utc.getMonth() + 1).padStart(2, '0');
    const dt = String(utc.getDate()).padStart(2, '0');
    const totalMins = (utc.getHours() * 60) + utc.getMinutes();
    return y + m + dt + '1000' + (10001 + totalMins);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence(70 + Math.floor(Math.random() * 30));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (appState === 'wingo') {
      const cp = getP();
      setCurrentPeriodSlice(cp.slice(-4));
      if (resultStore[cp]) {
        setAppState('result');
      }
    }
  }, [appState, resultStore]);

  const handleStart = () => {
    if (appState === 'scanning') return;
    const cp = getP();
    setAppState('scanning');
    
    setTimeout(() => {
      const isSmall = Math.random() < 0.5;
      const n = isSmall ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 5) + 5;
      const sz = isSmall ? 'SMALL' : 'BIG';
      const r = { out: `${sz} ${n}`, p: cp };
      setResultStore(prev => ({ ...prev, [cp]: r }));
      setCurrentResult(r.out);
      setCurrentPeriodSlice(r.p.slice(-4));
      setAppState('result');
    }, 4000);
  };

  const handleNext = () => {
    setAppState('wingo');
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1]" style={{
        backgroundImage: 'url("/src/assets/images/real_sexy_girl_penthouse_upgrade_1781421050036.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="absolute inset-0" style={{ animation: 'pulseOverlay 4s infinite alternate' }}></div>
        <Particles />
      </div>

      <div className="stage" style={{
        background: 'transparent'
      }}>
        <div className="frame" style={{ marginBottom: '5px' }}>
        
        <span className="rivet tl"></span>
        <span className="rivet tr"></span>
        <span className="rivet bl"></span>
        <span className="rivet br"></span>
        <span className="notch left"></span>
        <span className="notch right"></span>
        
        <div className="head" style={{ marginTop: '30px' }}>
          <div className="title" style={{ textShadow: '0 2px 10px rgba(255,255,255,0.5)' }}>
            SEXY<small>NUMBER PANNEL</small>
          </div>
          <div className="badge">ACTV</div>
        </div>
        
        <div className="screen">
          <div className="bracket tl"></div>
          <div className="bracket tr"></div>
          <div className="bracket bl"></div>
          <div className="bracket br"></div>
          <div className="crosshair"></div>
          <div className="sweep"></div>
          <div className="locator">
            <svg viewBox="0 0 200 200" fill="none" stroke="rgba(255,31,68,.8)" strokeWidth="1.5">
              <polygon points="100,20 175,65 175,135 100,180 25,135 25,65" />
              <polygon points="100,45 150,75 150,125 100,155 50,125 50,75" stroke="rgba(157,75,255,.7)" />
              <circle cx="100" cy="100" r="14" fill="rgba(255,31,68,.6)" stroke="none" />
            </svg>
          </div>
          <div className="scan-beam"></div>
          
          {appState === 'scanning' && <div className="proc-anim" style={{ display: 'block' }}></div>}
          
          {appState !== 'scanning' && (
            <div className="val-text">
              {appState === 'wingo' ? 'READY' : currentResult}
            </div>
          )}
          
          <div className="meta">
            <div className="pill">
              {appState === 'scanning' ? 'ANALYZING' : `PRD:${currentPeriodSlice}`}
            </div>
            <div className="pill red">CONF {confidence}%</div>
          </div>
        </div>
        
        <div className="actions" style={{ flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button 
              className="btn btn-analyze" 
              style={{ flex: 1 }}
              onClick={appState === 'result' ? handleNext : handleStart}
              disabled={appState === 'scanning'}
            >
              {appState === 'scanning' ? 'WAIT...' : appState === 'result' ? 'NEXT HACK' : 'START'}
            </button>
            <button className="btn btn-hide" style={{ flex: 1 }} onClick={() => {
              setAppState('wingo');
              setResultStore({});
              setUnlockMessage('');
            }}>
              RESET
            </button>
          </div>
          
          <a 
            href="https://tnxjatavji-boop.github.io/Papa-payment-page-/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-unlock"
            onClick={() => setUnlockMessage('Initiating Level 1 Authorization... Secure channel opening.')}
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 120, 0, 0.5))',
              boxShadow: '0 8px 25px rgba(255, 215, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.6)',
              color: '#fff',
              textShadow: '0 0 8px rgba(255,255,255,0.8)',
              border: '1px solid rgba(255, 215, 0, 0.6)',
              borderRadius: '8px',
              padding: '14px 10px',
              fontWeight: 900,
              fontSize: '14px',
              animation: 'pulseButton 2.5s infinite alternate'
            }}
          >
            <span>🔓</span> UNLOCK 99% ACCURACY LEVEL
          </a>

          {unlockMessage && (
            <div style={{
              marginTop: '10px',
              padding: '8px',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '4px',
              color: '#ffd700',
              fontSize: '12px',
              fontFamily: 'Share Tech Mono, monospace',
              textAlign: 'center',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
              animation: 'pulseOverlay 2s infinite alternate'
            }}>
              {unlockMessage}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
