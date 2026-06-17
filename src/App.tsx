/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

type HackState = 'wingo' | 'scanning' | 'result';

export default function App() {
  const [appState, setAppState] = useState<HackState>('wingo');
  const [resultStore, setResultStore] = useState<Record<string, { out: string; p: string }>>({});
  const [confidence, setConfidence] = useState(87);
  const [currentResult, setCurrentResult] = useState('');
  const [currentPeriodSlice, setCurrentPeriodSlice] = useState('');

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
    <div className="stage">
      <div className="frame">
        <div className="frame-glow"></div>
        <div className="frame-border"></div>
        <div className="frame-inner"></div>
        
        <span className="rivet tl"></span>
        <span className="rivet tr"></span>
        <span className="rivet bl"></span>
        <span className="rivet br"></span>
        <span className="notch left"></span>
        <span className="notch right"></span>
        
        <div className="head">
          <div className="title">
            DRACULA<small>NUMBER PANNEL</small>
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
        
        <div className="actions">
          <button 
            className="btn btn-analyze" 
            onClick={appState === 'result' ? handleNext : handleStart}
            disabled={appState === 'scanning'}
          >
            {appState === 'scanning' ? 'WAIT...' : appState === 'result' ? 'NEXT HACK' : 'START'}
          </button>
          <button className="btn btn-hide" onClick={() => {
            setAppState('wingo');
            setResultStore({});
          }}>
            RESET
          </button>
        </div>
      </div>
    </div>
  );
}
