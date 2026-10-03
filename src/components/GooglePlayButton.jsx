'use client';

import React from 'react';
import { MTC_EXAM_CONSTANTS } from '@/lib/utils';

export default function GooglePlayButton({ className = '', variant = 'dark', size = 'default' }) {
  const isDark = variant === 'dark';

  const baseStyles = isDark
    ? 'bg-slate-900 hover:bg-black text-white border-slate-700 shadow-md hover:shadow-lg'
    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm hover:shadow-md';

  const sizeStyles = size === 'large' ? 'px-5 py-3 text-base' : 'px-4 py-2.5 text-sm';

  return (
    <a
      href={MTC_EXAM_CONSTANTS.PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group ${baseStyles} ${sizeStyles} ${className}`}
      title="Descarga la aplicación oficial de Simulacro MTC en Google Play"
    >
      {/* Official Google Play Triangle Logo SVG */}
      <svg
        className="w-6 h-6 flex-shrink-0"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48.7 15.6C44.8 19.8 42.6 26.2 42.6 34.6V477.4C42.6 485.8 44.8 492.2 48.7 496.4L50.4 498L291.6 256.8V255.2L50.4 14L48.7 15.6Z"
          fill="url(#gp_a)"
        />
        <path
          d="M371.9 337.2L291.6 256.8V255.2L372 174.8L373.9 175.9L469 230C476.3 234.1 480.3 240.5 480.3 248C480.3 255.5 476.3 261.9 469 266L373.9 320.1L371.9 337.2Z"
          fill="url(#gp_b)"
        />
        <path
          d="M373.9 337.2L291.6 256.8L48.7 496.4C52.7 500.6 59.2 501.1 66.8 496.8L373.9 337.2Z"
          fill="url(#gp_c)"
        />
        <path
          d="M373.9 174.8L66.8 15.2C59.2 10.9 52.7 11.4 48.7 15.6L291.6 255.2L373.9 174.8Z"
          fill="url(#gp_d)"
        />
        <defs>
          <linearGradient id="gp_a" x1="270" y1="472.5" x2="68.8" y2="271.3" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00A0FF" />
            <stop offset="0.007" stopColor="#00A1FF" />
            <stop offset="0.26" stopColor="#00BEFF" />
            <stop offset="0.512" stopColor="#00D2FF" />
            <stop offset="0.76" stopColor="#00DFFF" />
            <stop offset="1" stopColor="#00E3FF" />
          </linearGradient>
          <linearGradient id="gp_b" x1="488.5" y1="248" x2="286.2" y2="248" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE000" />
            <stop offset="0.409" stopColor="#FFBD00" />
            <stop offset="0.775" stopColor="#FFA500" />
            <stop offset="1" stopColor="#FF9C00" />
          </linearGradient>
          <linearGradient id="gp_c" x1="316.5" y1="281.8" x2="108.5" y2="489.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF3A44" />
            <stop offset="1" stopColor="#C31162" />
          </linearGradient>
          <linearGradient id="gp_d" x1="108.5" y1="22.2" x2="316.5" y2="230.2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#32A071" />
            <stop offset="0.069" stopColor="#2DA771" />
            <stop offset="0.476" stopColor="#15CF74" />
            <stop offset="0.801" stopColor="#06E775" />
            <stop offset="1" stopColor="#00F076" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col text-left leading-tight">
        <span className={`text-[10px] tracking-wide uppercase font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Disponible en
        </span>
        <span className={`font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>
          Google Play
        </span>
      </div>
    </a>
  );
}
