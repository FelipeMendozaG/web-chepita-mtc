'use client';

import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
