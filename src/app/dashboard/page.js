'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Award,
  TrendingUp,
  History,
  BookOpen,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { attemptsService } from '@/lib/api';
import { formatDate, formatDurationBetween } from '@/lib/utils';
import { Skeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAttempts = async () => {
      setLoading(true);
      try {
        const res = await attemptsService.list();
        if (res?.data && Array.isArray(res.data)) {
          setAttempts(res.data);
        }
      } catch (err) {
        console.error('Error fetching attempts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [mounted, token, router]);

  if (!mounted) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalAttempts = attempts.length;
  const approvedAttempts = attempts.filter((a) => a.approved).length;
  const successRate = totalAttempts > 0 ? Math.round((approvedAttempts / totalAttempts) * 100) : 0;
  const bestScore = totalAttempts > 0
    ? Math.max(...attempts.map((a) => parseFloat(a.score) || 0)).toFixed(1)
    : '0.0';

  // Readiness level
  const isExamReady = totalAttempts >= 3 && successRate >= 75;

  return (
    <div className="flex-1 bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
                <Car className="w-3.5 h-3.5 text-amber-300" />
                <span>Simulador de Examen de Reglas MTC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                ¡Hola, {user?.name || 'Conductor'}!
              </h1>
              <p className="text-blue-100 text-sm sm:text-base max-w-xl">
                Revisa tu progreso, pon a prueba tus conocimientos con el banco oficial y asegura tu brevete a la primera.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/simulacrum"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10 hover:scale-105 active:scale-100 transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Iniciar Nuevo Simulacro</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Simulacros</span>
              <History className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalAttempts}</div>
            <p className="text-xs text-slate-500">Exámenes realizados</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Aprobados</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{approvedAttempts}</div>
            <p className="text-xs text-slate-500">Puntaje ≥ 87.5% (35/40)</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tasa de Éxito</span>
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600">{successRate}%</div>
            <p className="text-xs text-slate-500">Efectividad global</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Mejor Puntaje</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{bestScore}%</div>
            <p className="text-xs text-slate-500">Puntaje más alto</p>
          </div>
        </div>

        {/* Readiness Level Banner */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isExamReady
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}
            >
              {isExamReady ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Diagnóstico de Preparación para el Examen Oficial
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isExamReady
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isExamReady ? 'Nivel Alto • Listo' : 'En Entrenamiento'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isExamReady
                  ? '¡Excelente! Tus resultados constantes indican que estás preparado para rendir el examen oficial ante el Touring / MTC.'
                  : 'Te sugerimos rendir al menos 3 a 5 simulacros más para consolidar los temas de señales de tránsito y límites de velocidad.'}
              </p>
            </div>
          </div>

          <Link
            href="/simulacrum"
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-900 text-white hover:bg-black transition-colors"
          >
            <span>Rendir otro simulacro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Access Feature Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Acceso Rápido a Secciones
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/questions"
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  Banco de Preguntas
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Estudia pregunta por pregunta con alternativas y explicaciones paso a paso.
                </p>
              </div>
            </Link>

            <Link
              href="/discussions"
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                  Foro Comunitario
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Publica dudas sobre preguntas capciosas y debate con otros conductores.
                </p>
              </div>
            </Link>

            <Link
              href="/recommendations"
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 group-hover:text-amber-600 transition-colors">
                  Consejos de Manejo
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Guías sobre normas de tránsito, límites de velocidad y primeros auxilios.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Attempts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Historial Reciente de Simulacros
            </h2>
            <Link
              href="/attempts"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : attempts.length === 0 ? (
            <EmptyState
              icon={History}
              title="Aún no has realizado simulacros"
              description="Empieza tu primer examen ahora mismo para evaluar tus conocimientos de las reglas de tránsito MTC."
              actionLabel="Iniciar mi Primer Simulacro"
              actionHref="/simulacrum"
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Fecha</th>
                      <th className="px-5 py-3.5">Duración</th>
                      <th className="px-5 py-3.5">Aciertos</th>
                      <th className="px-5 py-3.5">Puntaje</th>
                      <th className="px-5 py-3.5">Resultado</th>
                      <th className="px-5 py-3.5 text-right">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.slice(0, 5).map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4 font-medium text-slate-800">
                          {formatDate(attempt.started_at)}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {formatDurationBetween(attempt.started_at, attempt.finished_at)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-emerald-600">
                            {attempt.correct_answers || 0}
                          </span>{' '}
                          / {attempt.total_questions || 40}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {parseFloat(attempt.score || 0).toFixed(1)}%
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              attempt.approved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {attempt.approved ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Desaprobado
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/attempts/${attempt.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            Revisar <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
