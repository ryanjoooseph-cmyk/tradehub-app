'use client';
import React from 'react';

export default function ThemeToggle(){
  const [mode,setMode] = React.useState<'dark'|'light'>('dark');
  React.useEffect(()=>{
    const m = (localStorage.getItem('th-theme') as 'dark'|'light') || 'dark';
    setMode(m);
    document.documentElement.setAttribute('data-theme', m);
  },[]);
  function flip(){
    const m = mode === 'dark' ? 'light' : 'dark';
    setMode(m);
    localStorage.setItem('th-theme', m);
    document.documentElement.setAttribute('data-theme', m);
  }
  return <button className="theme-toggle" onClick={flip} aria-label="Toggle theme">{mode==='dark'?'🌙':'☀️'}&nbsp;<b>Toggle Theme</b></button>;
}
