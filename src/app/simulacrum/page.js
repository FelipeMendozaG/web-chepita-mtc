'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Timer,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  HelpCircle,
  ImageIcon,
  X,
  RefreshCw,
  Award,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { questionsService } from '@/lib/api';
import { getImageUrl, formatSecondsToMMSS, MTC_EXAM_CONSTANTS } from '@/lib/utils';
import { MOCK_QUESTIONS } from '@/lib/mockData';
import ConfettiEffect from '@/components/ConfettiEffect';

export default function SimulacrumPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [question_id]: option_id }
  const [timeLeft, setTimeLeft] = useState(MTC_EXAM_CONSTANTS.TIME_LIMIT_SECONDS); // 40 minutes = 2400s
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const timerRef = useRef(null);

  // Initialize Exam
  useEffect(() => {
    let isMounted = true;

    async function initSimulacrum() {
      setLoading(true);
      try {
        if (token) {
          const res = await questionsService.getSimulacrum();
          if (isMounted && res?.data?.questions && res.data.questions.length > 0) {
            setAttemptId(res.data.attempt_id);
            setQuestions(res.data.questions);
            setIsGuestMode(false);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API error in simulacrum generation, running guest mode with standard bank:', err);
      }

      // Guest / Fallback Mode (allows immediate practice even without auth or during API cold start)
      if (isMounted) {
        setIsGuestMode(true);
        setAttemptId(`local_${Date.now()}`);
        setQuestions(MOCK_QUESTIONS);
        setLoading(false);
      }
    }

    initSimulacrum();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [token]);

  // Countdown Timer
  useEffect(() => {
    if (loading || examResult) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, examResult]);

  const handleSelectOption = (questionId, optionId) => {
    if (examResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleAutoSubmit = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    setShowFinishModal(false);
    setIsSubmitting(true);

    const answersPayload = Object.entries(selectedAnswers).map(([qid, oid]) => ({
      question_id: Number(qid),
      selected_option: Number(oid),
    }));

    // If answers is empty, push default dummy answer to avoid backend validation error
    if (answersPayload.length === 0 && questions.length > 0) {
      answersPayload.push({
        question_id: questions[0].id,
        selected_option: questions[0].options?.[0]?.id || 1,
      });
    }

    try {
      if (!isGuestMode && attemptId && token) {
        const res = await questionsService.submitAttempt(attemptId, answersPayload);
        if (res?.data) {
          setExamResult(res.data);
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Error submitting to remote attempt, calculating locally:', err);
    }

    // Local calculation fallback
    let correctCount = 0;
    questions.forEach((q) => {
      const selectedOptId = selectedAnswers[q.id];
      const correctOpt = q.options?.find((o) => o.is_correct);
      if (selectedOptId && correctOpt && selectedOptId === correctOpt.id) {
        correctCount += 1;
      }
    });

    const total = questions.length || 40;
    const scoreVal = ((correctCount / total) * 100).toFixed(2);
    const approvedVal = parseFloat(scoreVal) >= MTC_EXAM_CONSTANTS.PASSING_SCORE;

    setExamResult({
      attempt_id: attemptId,
      correct_answers: correctCount,
      wrong_answers: total - correctCount,
      score: scoreVal,
      approved: approvedVal,
    });
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm animate-bounce">
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Generando tu Simulacro Oficial MTC...
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Seleccionando 40 preguntas aleatorias del banco de reglas de tránsito.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isTimeUrgent = timeLeft < 300; // less than 5 minutes

  // Result View (After finishing)
  if (examResult) {
    const isApproved = Boolean(examResult.approved);

    return (
      <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {isApproved && <ConfettiEffect />}

        <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div
            className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
              isApproved
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-red-500 text-white shadow-red-500/30'
            }`}
          >
            {isApproved ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
          </div>

          <div className="space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {isApproved ? '¡Aprobado con Éxito!' : 'Desaprobado'}
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Puntaje: {parseFloat(examResult.score).toFixed(1)}%
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {isApproved
                ? '¡Felicitaciones! Cumples con el puntaje reglamentario del MTC (mínimo 87.5% / 35 aciertos).'
                : 'No te desanimes. El formato del MTC requiere mínimo 35 aciertos. Revisa las respuestas y vuelve a intentar.'}
            </p>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-left">
              <span className="text-xs text-emerald-700 font-semibold block">Respuestas Correctas</span>
              <span className="text-2xl font-black text-emerald-800">
                {examResult.correct_answers}{' '}
                <span className="text-xs font-medium text-emerald-600">/ {totalQuestions}</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 text-left">
              <span className="text-xs text-red-700 font-semibold block">Respuestas Incorrectas</span>
              <span className="text-2xl font-black text-red-800">
                {examResult.wrong_answers}{' '}
                <span className="text-xs font-medium text-red-600">/ {totalQuestions}</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {token && !isGuestMode ? (
              <Link
                href={`/attempts/${examResult.attempt_id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Revisar Examen Pregunta por Pregunta</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setExamResult(null);
                setSelectedAnswers({});
                setTimeLeft(MTC_EXAM_CONSTANTS.TIME_LIMIT_SECONDS);
                setCurrentIndex(0);
                window.location.reload();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Rendir Otro Simulacro</span>
            </button>

            <Link
              href="/dashboard"
              className="block text-xs font-medium text-slate-500 hover:text-slate-800 pt-1"
            >
              Volver al Panel Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* STICKY EXAM HEADER */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Progress info */}
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                {currentIndex + 1}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Pregunta {currentIndex + 1} de {totalQuestions}
                </p>
                <p className="text-[11px] text-slate-500">
                  Respondidas: <span className="font-semibold text-blue-600">{answeredCount}</span> de {totalQuestions}
                </p>
              </div>
            </div>

            {/* Middle: Countdown Timer */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base transition-colors ${
                isTimeUrgent
                  ? 'bg-red-50 border-red-300 text-red-700 animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <Timer className={`w-4 h-4 ${isTimeUrgent ? 'text-red-600' : 'text-slate-600'}`} />
              <span>{formatSecondsToMMSS(timeLeft)}</span>
            </div>

            {/* Right: Submit Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowFinishModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-black shadow-xs transition-all hover:scale-105 active:scale-100"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Finalizar Examen</span>
              </button>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN EXAM BODY */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 flex flex-col justify-between">
        {/* Guest Mode Warning Banner if applicable */}
        {isGuestMode && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3">
            <span>
              <b>Modo de Práctica Libre:</b> Estás practicando con el banco de preguntas estándar. Para guardar tu puntaje en tu historial oficial, inicia sesión.
            </span>
            <Link
              href="/login"
              className="font-bold text-amber-900 underline whitespace-nowrap"
            >
              Iniciar sesión
            </Link>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {currentQuestion.license_category || 'A-I'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {currentQuestion.subject || 'Educación y Seguridad Vial'}
              </span>
            </div>

            {currentQuestion.image_url && (
              <button
                type="button"
                onClick={() => setPreviewImage(getImageUrl(currentQuestion.image_url))}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Ver Señal / Imagen</span>
              </button>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Optional Image */}
          {currentQuestion.image_url && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center">
              <img
                src={getImageUrl(currentQuestion.image_url)}
                alt="Señal referencial"
                className="max-h-56 object-contain rounded-lg cursor-pointer hover:opacity-95"
                onClick={() => setPreviewImage(getImageUrl(currentQuestion.image_url))}
              />
            </div>
          )}

          {/* Options Radio List */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((option, optIdx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const letter = letters[optIdx] || `${optIdx + 1}`;
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;

                return (
                  <button
                    key={option.id || optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                    className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm leading-relaxed flex-1">
                      {option.option_text}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">No hay alternativas disponibles.</p>
            )}
          </div>
        </div>

        {/* Question Palette (Quick Jump 1 to 40) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Paleta de Navegación Rápida
          </p>
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;

              let buttonStyle = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';
              if (isAnswered) {
                buttonStyle = 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 font-bold';
              }
              if (isCurrent) {
                buttonStyle = 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 font-black';
              }

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full aspect-square rounded-lg text-[11px] border flex items-center justify-center transition-all ${buttonStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowFinishModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-black shadow-md transition-all"
            >
              <span>Finalizar Examen</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ¿Finalizar y calificar simulacro?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Has respondido <b>{answeredCount}</b> de <b>{totalQuestions}</b> preguntas.
              {totalQuestions - answeredCount > 0 ? (
                <span className="block mt-1 text-amber-600 font-semibold">
                  Aviso: Aún tienes {totalQuestions - answeredCount} preguntas sin responder que se considerarán incorrectas.
                </span>
              ) : (
                <span className="block mt-1 text-emerald-600 font-semibold">
                  ¡Excelente! Has contestado todas las preguntas del examen.
                </span>
              )}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Volver al Examen
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitExam}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calificando...</span>
                  </>
                ) : (
                  <span>Sí, Calificar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Image Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">Señal Oficial MTC</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-50 rounded-xl mt-3">
              <img
                src={previewImage}
                alt="Señal de tránsito ampliada"
                className="max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
