import { describe, it, expect } from 'vitest';
import {
  cn,
  getImageUrl,
  formatSecondsToMMSS,
  formatDate,
  formatDurationBetween,
  MTC_EXAM_CONSTANTS,
} from '../src/lib/utils';

describe('Suite de Pruebas Unitarias - Utils Web Chepita MTC', () => {
  describe('cn (Tailwind class merging)', () => {
    it('debe combinar clases de manera adecuada', () => {
      const result = cn('bg-red-500', 'text-white', 'p-4');
      expect(result).toBe('bg-red-500 text-white p-4');
    });

    it('debe resolver conflictos de Tailwind correctamente con tailwind-merge', () => {
      const result = cn('p-2', 'p-4');
      expect(result).toBe('p-4');
    });

    it('debe filtrar valores condicionales falsos o nulos', () => {
      const result = cn('btn', false && 'btn-disabled', null, undefined, 'btn-primary');
      expect(result).toBe('btn btn-primary');
    });
  });

  describe('getImageUrl', () => {
    it('debe retornar null si la ruta es nula o vacía', () => {
      expect(getImageUrl(null)).toBeNull();
      expect(getImageUrl('')).toBeNull();
    });

    it('debe respetar URLs absolutas http y https', () => {
      expect(getImageUrl('https://example.com/foto.jpg')).toBe('https://example.com/foto.jpg');
      expect(getImageUrl('http://example.com/foto.jpg')).toBe('http://example.com/foto.jpg');
    });

    it('debe prefijar rutas relativas con el dominio base', () => {
      const res = getImageUrl('uploads/test.png');
      expect(res).toContain('/uploads/test.png');
    });
  });

  describe('formatSecondsToMMSS', () => {
    it('debe formatear segundos a formato MM:SS', () => {
      expect(formatSecondsToMMSS(0)).toBe('00:00');
      expect(formatSecondsToMMSS(65)).toBe('01:05');
      expect(formatSecondsToMMSS(2400)).toBe('40:00');
    });
  });

  describe('formatDate', () => {
    it('debe manejar entradas nulas o vacías', () => {
      expect(formatDate(null)).toBe('Fecha no disponible');
      expect(formatDate('')).toBe('Fecha no disponible');
    });

    it('debe formatear fechas válidas', () => {
      const dateStr = '2026-05-15T10:30:00Z';
      const formatted = formatDate(dateStr);
      expect(typeof formatted).toBe('string');
      expect(formatted).not.toBe('Fecha no disponible');
    });
  });

  describe('formatDurationBetween', () => {
    it('debe calcular la duración correctamente', () => {
      const start = '2026-05-15T10:00:00Z';
      const end = '2026-05-15T10:05:30Z';
      const duration = formatDurationBetween(start, end);
      expect(duration).toBe('5 min 30 seg');
    });

    it('debe manejar duración menor a un minuto', () => {
      const start = '2026-05-15T10:00:00Z';
      const end = '2026-05-15T10:00:25Z';
      const duration = formatDurationBetween(start, end);
      expect(duration).toBe('25 seg');
    });

    it('debe retornar 0 min si las fechas no están disponibles', () => {
      expect(formatDurationBetween(null, null)).toBe('0 min');
    });
  });

  describe('MTC_EXAM_CONSTANTS', () => {
    it('debe tener las especificaciones oficiales del examen', () => {
      expect(MTC_EXAM_CONSTANTS.TOTAL_QUESTIONS).toBe(40);
      expect(MTC_EXAM_CONSTANTS.PASSING_SCORE).toBe(87.5);
      expect(MTC_EXAM_CONSTANTS.PASSING_CORRECT_COUNT).toBe(35);
      expect(MTC_EXAM_CONSTANTS.TIME_LIMIT_MINUTES).toBe(40);
    });
  });
});
