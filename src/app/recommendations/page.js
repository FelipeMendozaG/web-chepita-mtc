'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  ShieldCheck,
  BookOpen,
  Filter,
  Sparkles,
  ChevronRight,
  Clock,
  Car,
  Heart,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { recommendationsService } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import { MOCK_RECOMMENDATIONS } from '@/lib/mockData';
import { Skeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: 'Todas las Recomendaciones', value: '' },
    { label: 'Seguridad Vial', value: 'Seguridad Vial' },
    { label: 'Normas de Tránsito', value: 'Normas de Tránsito' },
    { label: 'Mecánica Básica', value: 'Mecánica Básica' },
    { label: 'Primeros Auxilios', value: 'Primeros Auxilios' },
  ];

  useEffect(() => {
    fetchRecommendations(selectedCategory);
  }, [selectedCategory]);

  const fetchRecommendations = async (cat) => {
    setLoading(true);
    try {
      const res = await recommendationsService.list(cat);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setRecommendations(res.data);
      } else {
        // Fallback filter
        const filtered = cat
          ? MOCK_RECOMMENDATIONS.filter((r) => r.category.toLowerCase() === cat.toLowerCase())
          : MOCK_RECOMMENDATIONS;
        setRecommendations(filtered);
      }
    } catch (err) {
      console.warn('API error in recommendations, using curated MTC tips:', err);
      const filtered = cat
        ? MOCK_RECOMMENDATIONS.filter((r) => r.category.toLowerCase() === cat.toLowerCase())
        : MOCK_RECOMMENDATIONS;
      setRecommendations(filtered);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'seguridad vial':
        return ShieldCheck;
      case 'normas de tránsito':
        return BookOpen;
      case 'mecánica básica':
        return Wrench;
      case 'primeros auxilios':
        return Heart;
      default:
        return Lightbulb;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Educación y Conducción Segura</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Consejos y Recomendaciones de Manejo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Buenas prácticas de conducción a la defensiva, interpretación de normas del MTC y prevención de accidentes para todo conductor responsable.
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

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedCategory(c.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No se encontraron recomendaciones"
            description="No hay consejos disponibles en esta categoría por el momento."
            actionLabel="Ver todas las categorías"
            onAction={() => setSelectedCategory('')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => {
              const IconComponent = getCategoryIcon(rec.category);
              const hasImage = Boolean(rec.image_url);
              const imgUrl = getImageUrl(rec.image_url);

              return (
                <div
                  key={rec.id || idx}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  {hasImage && (
                    <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                          <IconComponent className="w-3.5 h-3.5" />
                          <span>{rec.category || 'Consejo'}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>2 min lectura</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {rec.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {rec.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Válido para todas las categorías</span>
                      <span className="font-semibold text-blue-600 flex items-center gap-0.5">
                        MTC Perú
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
