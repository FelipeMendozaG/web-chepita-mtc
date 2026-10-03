'use client';

import React from 'react';
import Link from 'next/link';
import { Car, ShieldCheck, Heart, ExternalLink, CheckCircle } from 'lucide-react';
import GooglePlayButton from './GooglePlayButton';

export default function Footer() {
  const categories = [
    { code: 'A-I', desc: 'Autos particulares y SUV' },
    { code: 'A-IIa', desc: 'Taxis, colectivos y remises' },
    { code: 'A-IIb', desc: 'Cústers, combis y microbuses' },
    { code: 'A-IIIa', desc: 'Buses interprovinciales' },
    { code: 'A-IIIb', desc: 'Camiones y remolcadores' },
    { code: 'B-IIc', desc: 'Mototaxis y motocicletas' },
  ];

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info & Play Store */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white tracking-tight text-xl">
                Simulacro<span className="text-blue-400">MTC</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Tu mejor aliado para aprobar el examen de reglas de tránsito a la primera.
              Simulacros cronometrados con el banco oficial del MTC, explicaciones detalladas y comunidad activa.
            </p>
            <div className="pt-2">
              <GooglePlayButton variant="light" size="default" />
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/simulacrum" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Iniciar Simulacro
                </Link>
              </li>
              <li>
                <Link href="/questions" className="hover:text-white transition-colors">
                  Banco de Preguntas
                </Link>
              </li>
              <li>
                <Link href="/attempts" className="hover:text-white transition-colors">
                  Historial de Exámenes
                </Link>
              </li>
              <li>
                <Link href="/discussions" className="hover:text-white transition-colors">
                  Foro de Consultas
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-white transition-colors">
                  Consejos de Conducción
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categorías MTC */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Categorías MTC
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {categories.map((c) => (
                <li key={c.code} className="flex items-center gap-2">
                  <span className="font-bold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/50">
                    {c.code}
                  </span>
                  <span className="truncate">{c.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Garantía y Seguridad */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Formato Oficial
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>40 preguntas aleatorias en 40 minutos</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Mínimo 35 respuestas correctas para aprobar (87.5%)</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Actualizado al D.S. 025-2021-MTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Simulacro MTC / Chepita. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-slate-400 text-center sm:text-right max-w-md">
            Nota: Aplicación de carácter formativo y de entrenamiento. Las marcas y reglamentos son propiedad del Ministerio de Transportes y Comunicaciones del Perú.
          </p>
        </div>
      </div>
    </footer>
  );
}
