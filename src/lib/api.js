import axios from 'axios';
import { useAuthStore } from './store';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://project-d5c1b1cb-efd2-47ae-ad8.uc.r.appspot.com/api/v1';

export const UPLOADS_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://project-d5c1b1cb-efd2-47ae-ad8.uc.r.appspot.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Inject Bearer Token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: Extract errors & handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errCode = error.response.data?.error || error.response.data?.data;
      if (errCode === 'ERROR_NO_EXISTS_TOKEN' || errCode === 'ERROR_NO_VALID_TOKEN') {
        if (typeof window !== 'undefined') {
          useAuthStore.getState().logout();
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Normaliza los mensajes de error recibidos desde el backend
 */
export function getErrorMessage(error) {
  if (!error) return 'Error inesperado. Intente nuevamente.';
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data.data === 'string') {
      if (data.data === 'USER_NOT_FOUND') return 'El correo electrónico no se encuentra registrado.';
      if (data.data === 'INVALID_PASSWORD') return 'La contraseña ingresada es incorrecta.';
      if (data.data === 'ERROR_DISCUSSION_NOT_FOUND') return 'El debate solicitado no fue encontrado.';
      return data.data;
    }
    if (data.message && data.status !== 'success') {
      return data.message;
    }
    if (data.error) {
      if (data.error === 'ERROR_NO_VALID_TOKEN') return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
      return data.error;
    }
  }
  return error.message || 'No fue posible conectar con el servidor.';
}

// -------------------------------------------------------------
// SERVICIOS ESPECÍFICOS DE LA API
// -------------------------------------------------------------

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // { status, message, data: { user, token } }
  },
  register: async (name, email, password) => {
    const res = await api.post('/auth', { name, email, password });
    return res.data; // { status, message, data: { user, token } }
  },
};

export const questionsService = {
  list: async (page = 1, limit = 10) => {
    const res = await api.get(`/question?page=${page}&limit=${limit}`);
    return res.data; // { status, data: { total, page, limit, totalPages, data: [] } }
  },
  getSimulacrum: async () => {
    const res = await api.get('/question/simulacrum');
    return res.data; // { status, data: { attempt_id, questions: [] } }
  },
  submitAttempt: async (attemptId, answers) => {
    const res = await api.post(`/question/attempt/${attemptId}`, { answers });
    return res.data; // { status, data: { attempt_id, correct_answers, wrong_answers, score, approved } }
  },
};

export const attemptsService = {
  list: async () => {
    const res = await api.get('/attempt');
    return res.data; // { status, data: [Attempt] }
  },
  getById: async (attemptId) => {
    const res = await api.get(`/attempt/${attemptId}`);
    return res.data; // { status, data: AttemptDetail }
  },
};

export const discussionsService = {
  list: async () => {
    const res = await api.get('/discussion');
    return res.data; // { status, data: [Discussion] }
  },
  create: async (formData) => {
    const res = await api.post('/discussion', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  reply: async (discussionId, replyText) => {
    const res = await api.post(`/discussion/${discussionId}/reply`, {
      reply: replyText,
    });
    return res.data;
  },
  close: async (discussionId, closedReason) => {
    const res = await api.patch(`/discussion/${discussionId}/close`, {
      closed_reason: closedReason || 'Tema cerrado por el usuario',
    });
    return res.data;
  },
  report: async (discussionId, reason) => {
    const res = await api.post(`/discussion/${discussionId}/report`, {
      reason,
    });
    return res.data;
  },
};

export const recommendationsService = {
  list: async (category = '') => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await api.get(`/recommendation${query}`);
    return res.data; // { status, data: [Recommendation] }
  },
};
