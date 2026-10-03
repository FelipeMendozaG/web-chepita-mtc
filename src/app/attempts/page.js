'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { attemptsService } from '@/lib/api';
import { formatDate, formatDurationBetween } from '@/lib/utils';
import { Skeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

export default function AttemptsHistoryPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
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

    async function loadAttempts() {
      setLoading(true);
      try {
        const res = await attemptsService.list();
        if (res?.data && Array.isArray(res.data)) {
          setAttempts(res.data);
        }
      } catch (err) {
        console.error('Error fetching attempts list:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAttempts();
  }, [mounted, token, router]);

  if (!mounted) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const total = attempts.length;
  const approvedCount = attempts.filter((a) => a.approved).length;
  const rate = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

  return (
    <div className="flex-1 bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <History className="w-4 h-4" />
              <span>Mi Registro de Prácticas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Historial de Simulacros
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Revisa tus intentos pasados, analiza tus errores y haz seguimiento a tu curva de mejora.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/simulacrum"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Nuevo Simulacro</span>
            </Link>
          </div>
        </div>

        {/* Quick summary strip */}
        {attempts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                {total}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Total Exámenes</span>
                <p className="text-sm font-extrabold text-slate-800">Simulacros completados</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                {approvedCount}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Aprobados</span>
                <p className="text-sm font-extrabold text-slate-800">Puntaje ≥ 87.5%</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                {rate}%
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Efectividad</span>
                <p className="text-sm font-extrabold text-slate-800">Tasa de aprobación</p>
              </div>
            </div>
          </div>
        )}

        {/* List of Attempts */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : attempts.length === 0 ? (
          <EmptyState
            icon={History}
            title="Aún no has registrado simulacros"
            description="Empieza tu preparación hoy mismo. Realiza tu primer simulacro para evaluar tus conocimientos de las reglas del MTC."
            actionLabel="Comenzar Primer Examen"
            actionHref="/simulacrum"
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5"># Examen</th>
                    <th className="px-5 py-3.5">Fecha</th>
                    <th className="px-5 py-3.5">Duración</th>
                    <th className="px-5 py-3.5">Aciertos</th>
                    <th className="px-5 py-3.5">Puntaje</th>
                    <th className="px-5 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((attempt, index) => (
                    <tr key={attempt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        Simulacro #{attempt.id}
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {formatDate(attempt.started_at)}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatDurationBetween(attempt.started_at, attempt.finished_at)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-emerald-600">
                          {attempt.correct_answers || 0}
                        </span>{' '}
                        <span className="text-slate-400">/ {attempt.total_questions || 40}</span>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {parseFloat(attempt.score || 0).toFixed(1)}%
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
                          <span>Ver Revisión</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
  );
}
