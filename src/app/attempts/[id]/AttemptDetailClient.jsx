'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  History,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Share2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { attemptsService } from '@/lib/api';
import { formatDate, formatDurationBetween } from '@/lib/utils';
import { Skeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import ConfettiEffect from '@/components/ConfettiEffect';

export default function AttemptDetailClient() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params?.id;
  const { token } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadAttemptDetail() {
      setLoading(true);
      try {
        const res = await attemptsService.getById(attemptId);
        if (res?.data) {
          setAttempt(res.data);
        } else {
          setError('No fue posible cargar el detalle del intento.');
        }
      } catch (err) {
        console.error('Error fetching attempt detail:', err);
        setError('El examen solicitado no fue encontrado o no pertenece a tu cuenta.');
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadAttemptDetail();
    }
  }, [mounted, token, attemptId, router]);

  if (!mounted || loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="flex-1 py-12 px-4 flex items-center justify-center">
        <EmptyState
          icon={AlertTriangle}
          title="Examen no encontrado"
          description={error || 'No se encontró la información de este simulacro.'}
          actionLabel="Volver al Historial"
          actionHref="/attempts"
        />
      </div>
    );
  }

  const isApproved = Boolean(attempt.approved);
  const total = attempt.total_questions || 40;
  const correct = attempt.correct_answers || 0;
  const wrong = attempt.wrong_answers || total - correct;
  const score = parseFloat(attempt.score || 0).toFixed(1);

  return (
    <div className="flex-1 bg-slate-50 py-8 lg:py-10">
      {isApproved && <ConfettiEffect />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/attempts"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Simulacros</span>
          </Link>

          <Link
            href="/simulacrum"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Rendir Nuevo Simulacro</span>
          </Link>
        </div>

        {/* Score Summary Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  isApproved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {isApproved ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {isApproved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Desaprobado
                      </>
                    )}
                  </span>
                  <span className="text-xs text-slate-400">Simulacro #{attempt.id}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Calificación: {score}%
                </h1>
                <p className="text-xs text-slate-500">
                  {formatDate(attempt.started_at)} • Tiempo empleado: {formatDurationBetween(attempt.started_at, attempt.finished_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center min-w-[90px]">
                <span className="text-[11px] font-bold text-emerald-700 block uppercase">Correctas</span>
                <span className="text-xl font-black text-emerald-800">{correct}</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-center min-w-[90px]">
                <span className="text-[11px] font-bold text-red-700 block uppercase">Incorrectas</span>
                <span className="text-xl font-black text-red-800">{wrong}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              {isApproved
                ? '¡Excelente desempeño! Has superado el umbral mínimo del 87.5% requerido por el MTC para la obtención de tu licencia.'
                : 'Recuerda que para aprobar ante el Touring / MTC necesitas mínimo 35 aciertos de 40 preguntas. Revisa las alternativas corregidas abajo para no repetir los errores.'}
            </span>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Revisión Pregunta por Pregunta
          </h2>

          {attempt.answers && attempt.answers.length > 0 ? (
            attempt.answers.map((ans, idx) => {
              const q = ans.question || {};
              const userOptId = ans.selected_option;
              const isAnsCorrect = Boolean(ans.is_correct);

              return (
                <div
                  key={ans.id || idx}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 ${
                    isAnsCorrect ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
                  }`}
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-bold text-xs text-slate-500 uppercase">
                      Pregunta #{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isAnsCorrect
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {isAnsCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correcta
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Incorrecta
                        </>
                      )}
                    </span>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {q.question || `Pregunta ID ${ans.question_id}`}
                  </h3>

                  {/* Alternatives */}
                  <div className="space-y-2 pt-1">
                    {q.options && q.options.length > 0 ? (
                      q.options.map((opt, optIndex) => {
                        const letters = ['A', 'B', 'C', 'D'];
                        const letter = letters[optIndex] || `${optIndex + 1}`;
                        const isUserChoice = userOptId === opt.id;
                        const isOptCorrect = Boolean(opt.is_correct);

                        let cardStyle = 'border-slate-200 bg-slate-50/70 text-slate-700';
                        let badgeStyle = 'bg-slate-200 text-slate-700';

                        if (isOptCorrect) {
                          cardStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold';
                          badgeStyle = 'bg-emerald-600 text-white';
                        } else if (isUserChoice && !isOptCorrect) {
                          cardStyle = 'border-red-400 bg-red-50/80 text-red-950 line-through';
                          badgeStyle = 'bg-red-600 text-white';
                        }

                        return (
                          <div
                            key={opt.id || optIndex}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${cardStyle}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${badgeStyle}`}
                            >
                              {letter}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt.option_text}</span>

                            {isUserChoice && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 flex-shrink-0">
                                Tu Selección
                              </span>
                            )}
                            {isOptCorrect && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white flex-shrink-0">
                                Correcta
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                        <b>Respuesta registrada:</b> {ans.option?.option_text || 'Opción ID ' + userOptId}
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs sm:text-sm text-blue-900 mt-2 leading-relaxed">
                      <p className="font-bold text-blue-950 mb-0.5">Fundamento MTC:</p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400">No hay detalle de respuestas disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}
