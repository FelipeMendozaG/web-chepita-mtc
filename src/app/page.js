'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Timer,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Smartphone,
  Users,
  Compass,
} from 'lucide-react';
import GooglePlayButton from '@/components/GooglePlayButton';

export default function HomePage() {
  const categories = [
    { code: 'A-I', name: 'Particular', desc: 'Sedán, Hatchback, SUV y camionetas' },
    { code: 'A-IIa', name: 'Taxi / Remisse', desc: 'Servicio de taxi y movilidad particular' },
    { code: 'A-IIb', name: 'Combi / Cúster', desc: 'Transporte de pasajeros urbano e interurbano' },
    { code: 'A-IIIa', name: 'Buses', desc: 'Transporte interprovincial de pasajeros' },
    { code: 'A-IIIb', name: 'Carga Pesada', desc: 'Camiones y remolques' },
    { code: 'B-IIc', name: 'Mototaxi / Moto', desc: 'Vehículos menores de 2 y 3 ruedas' },
  ];

  const features = [
    {
      icon: Timer,
      color: 'bg-blue-500/10 text-blue-600',
      title: 'Simulacros Reales con Tiempo',
      desc: '40 preguntas seleccionadas al azar en 40 minutos exactos, simulando la misma interfaz y presión del examen oficial del MTC.',
    },
    {
      icon: BookOpen,
      color: 'bg-emerald-500/10 text-emerald-600',
      title: 'Banco Oficial Actualizado',
      desc: 'Accede a cientos de preguntas oficiales con alternativas completas, imágenes explicativas de señales y fundamentos normativos.',
    },
    {
      icon: MessageSquare,
      color: 'bg-indigo-500/10 text-indigo-600',
      title: 'Comunidad y Foro de Debates',
      desc: 'Consulta dudas específicas sobre preguntas capciosas, comparte capturas y recibe respuestas de otros postulantes e instructores.',
    },
    {
      icon: Lightbulb,
      color: 'bg-amber-500/10 text-amber-600',
      title: 'Consejos de Conducción Segura',
      desc: 'Aprende normas de tránsito, límites de velocidad, prioridad de paso y mecánica básica para convertirte en un conductor ejemplar.',
    },
  ];

  const stats = [
    { value: '87.5%', label: 'Puntaje Mínimo para Aprobar', sub: '35 de 40 preguntas acertadas' },
    { value: '40 min', label: 'Tiempo Máximo Oficial', sub: '1 minuto promedio por pregunta' },
    { value: '1,200+', label: 'Preguntas en el Banco', sub: 'Categorías A-I hasta A-IIIc y B-IIc' },
    { value: '98%', label: 'Tasa de Éxito', sub: 'De postulantes que practican 5+ veces' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Background decorative circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Regulation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-800 text-xs font-semibold shadow-xs animate-pulse-subtle">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Actualizado al Reglamento Nacional de Tránsito MTC 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Aprueba tu Examen de Reglas MTC <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">a la Primera</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Entrena con el simulacro oficial más completo del Perú. Pon a prueba tus conocimientos con 40 preguntas cronometradas, retroalimentación instantánea y explicaciones detalladas.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <GooglePlayButton size="large" variant="dark" />

              <Link
                href="/simulacrum"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Iniciar Simulacro Web</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust checkmarks */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Sin costo de registro
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Mismo banco de preguntas oficial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Disponible en App móvil y Web
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-slate-900 text-white py-12 relative z-10 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1 p-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-200">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES PILLS SECTION */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Todas las categorías
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Entrenamiento para cualquier categoría de licencia
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Desde tu primer brevete A-I hasta revalidaciones y recategorizaciones profesionales.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.code}
                href={`/question?category=${cat.code}`}
                className="group p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all text-center flex flex-col items-center"
              >
                <span className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2">
                  {cat.code}
                </span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-tight">
                  {cat.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE DE CARACTERÍSTICAS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full">
              Herramientas de Estudio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Todo lo que necesitas para aprobar sin estrés
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Diseñado con rigor pedagógico y alineado 100% con los estándares de evaluación de los centros de emisión del Touring y MTC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Conocer más <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MOBILE APP SHOWCASE BANNER */}
      <section className="py-16 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
                <Smartphone className="w-3.5 h-3.5 text-amber-300" /> App Móvil para Android
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Lleva tus simulacros a cualquier lugar con la App oficial
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Practica en el bus, en tus ratos libres o sin conexión con la aplicación oficial de Simulacro MTC Chepita. Sincroniza tus estadísticas y domina el examen.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <GooglePlayButton variant="light" size="large" />
                <Link
                  href="/register"
                  className="px-5 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs transition-colors"
                >
                  Crear cuenta gratuita
                </Link>
              </div>
            </div>

            <div className="bg-white/10 p-6 sm:p-8 rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl">
              <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                Formato Oficial de Evaluación MTC
              </h3>
              <ul className="space-y-3.5 text-sm text-blue-50">
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>40 preguntas de opción múltiple con alternativas A, B, C y D.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Tiempo límite estricto de 40 minutos con cronómetro en pantalla.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Calificación sobre 100 puntos. Aprobación mínima: 35 aciertos (87.50%).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Evaluación inmediata de respuestas y desglose por temas normativos.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
