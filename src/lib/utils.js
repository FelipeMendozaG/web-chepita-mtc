import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UPLOADS_BASE_URL } from './api';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normaliza las URLs de imágenes subidas o externas
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${UPLOADS_BASE_URL}${cleanPath}`;
}

/**
 * Formatea fechas a formato amigable en español
 */
export function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formatea tiempo en minutos y segundos (e.g. "34:20")
 */
export function formatSecondsToMMSS(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Calcula la duración entre dos fechas ISO
 */
export function formatDurationBetween(startStr, endStr) {
  if (!startStr || !endStr) return '0 min';
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffSecs = Math.max(0, Math.floor((end - start) / 1000));
    const mins = Math.floor(diffSecs / 60);
    const secs = diffSecs % 60;
    if (mins === 0) return `${secs} seg`;
    return `${mins} min ${secs} seg`;
  } catch {
    return '0 min';
  }
}

/**
 * Constantes del examen oficial MTC
 */
export const MTC_EXAM_CONSTANTS = {
  TOTAL_QUESTIONS: 40,
  TIME_LIMIT_MINUTES: 40,
  TIME_LIMIT_SECONDS: 40 * 60,
  PASSING_SCORE: 87.5,
  PASSING_CORRECT_COUNT: 35, // 35 / 40 = 87.5%
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=pe.chepita.simulacromtc',
};
