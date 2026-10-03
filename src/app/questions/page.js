'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  ExternalLink,
  Sparkles,
  ImageIcon,
  X,
} from 'lucide-react';
import { questionsService } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { MOCK_QUESTIONS } from '@/lib/mockData';
import { Skeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedExplanation, setExpandedExplanation] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const categories = ['ALL', 'A-I', 'A-IIa', 'A-IIb', 'A-IIIa', 'A-IIIb', 'B-IIc'];

  useEffect(() => {
    fetchQuestions(page, limit);
  }, [page, limit]);

  const fetchQuestions = async (p, l) => {
    setLoading(true);
    try {
      const res = await questionsService.list(p, l);
      if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setQuestions(res.data.data);
        setTotalPages(res.data.totalPages || Math.ceil((res.data.total || 1) / l));
        setTotalCount(res.data.total || res.data.data.length);
      } else {
        // Fallback to high quality mock questions
        setQuestions(MOCK_QUESTIONS);
        setTotalPages(Math.ceil(MOCK_QUESTIONS.length / l));
        setTotalCount(MOCK_QUESTIONS.length);
      }
    } catch (err) {
      console.warn('API error in questions list, using curated MTC questions:', err);
      setQuestions(MOCK_QUESTIONS);
      setTotalPages(Math.ceil(MOCK_QUESTIONS.length / l));
      setTotalCount(MOCK_QUESTIONS.length);
    } finally {
      setLoading(false);
    }
  };

  const toggleExplanation = (id) => {
    setExpandedExplanation((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Local filtering by search term or category
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      searchTerm === '' ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.subject && q.subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      !q.license_category ||
      q.license_category.toUpperCase() === selectedCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Balotario Oficial MTC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Banco de Preguntas Oficiales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Estudia todas las preguntas que forman parte del examen de reglas. Revisa cada alternativa correcta con su base normativa.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/simulacrum"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Practicar en Simulacro</span>
            </Link>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por palabras clave (ej: rotonda, velocidad, pare)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">
              Categoría:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Mostrando <b>{filteredQuestions.length}</b> preguntas en esta página (Total disponible: ~{totalCount})
          </span>
          <div className="flex items-center gap-2">
            <span>Filas por página:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={40}>40</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No se encontraron preguntas"
            description="Intenta cambiar los términos de búsqueda o selecciona otra categoría."
            actionLabel="Limpiar Filtros"
            onAction={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const qNumber = q.number || (page - 1) * limit + idx + 1;
              const hasImage = Boolean(q.image_url);
              const imgFullUrl = getImageUrl(q.image_url);
              const isExplanationOpen = expandedExplanation[q.id];

              return (
                <div
                  key={q.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        #{qNumber}
                      </span>
                      {q.license_category && (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Cat. {q.license_category}
                        </span>
                      )}
                      {q.subject && (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {q.subject}
                        </span>
                      )}
                      {q.topic && (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 hidden sm:inline">
                          {q.topic}
                        </span>
                      )}
                    </div>

                    {hasImage && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(imgFullUrl)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Ver Imagen / Señal</span>
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h3>

                  {/* Embedded image preview if available */}
                  {hasImage && (
                    <div className="my-2">
                      <img
                        src={imgFullUrl}
                        alt="Imagen explicativa de la pregunta"
                        className="max-h-48 rounded-xl border border-slate-200 object-contain bg-slate-50 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewImage(imgFullUrl)}
                      />
                    </div>
                  )}

                  {/* Options List */}
                  <div className="space-y-2 pt-1">
                    {q.options && q.options.length > 0 ? (
                      q.options.map((opt, optIndex) => {
                        const optionLetters = ['A', 'B', 'C', 'D'];
                        const letter = optionLetters[optIndex] || `${optIndex + 1}`;
                        const isCorrect = Boolean(opt.is_correct);

                        return (
                          <div
                            key={opt.id || optIndex}
                            className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                              isCorrect
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-slate-50/70 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt.option_text}</span>
                            {isCorrect && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex-shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Respuesta Correcta</span>
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic">No hay alternativas disponibles.</p>
                    )}
                  </div>

                  {/* Explanation Toggle */}
                  {q.explanation && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleExplanation(q.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{isExplanationOpen ? 'Ocultar Fundamento' : 'Ver Fundamento / Explicación'}</span>
                      </button>

                      {isExplanationOpen && (
                        <div className="mt-2.5 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs sm:text-sm text-blue-900 leading-relaxed animate-in fade-in">
                          <p className="font-semibold text-blue-950 mb-1">Fundamento del MTC:</p>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Navigation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => {
              setPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <span className="text-xs sm:text-sm font-bold text-slate-700">
            Página {page} de {Math.max(1, totalPages)}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => {
              setPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal for Image Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">Señal o Imagen de Referencia</span>
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
