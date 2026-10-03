'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, HelpCircle } from 'lucide-react';

export default function EmptyState({
  icon: Icon = HelpCircle,
  title = 'No se encontraron resultados',
  description = 'No hay información disponible para mostrar en esta sección.',
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm border border-blue-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all"
        >
          {actionLabel}
        </Link>
      )}

      {onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
