'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Image as ImageIcon,
  Send,
  Flag,
  Lock,
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { discussionsService, getErrorMessage } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import { MOCK_DISCUSSIONS } from '@/lib/mockData';
import { Skeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

export default function DiscussionsPage() {
  const { user, token, isAuthenticated } = useAuthStore();

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & States
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newError, setNewError] = useState('');

  // Reply States (keyed by discussion ID)
  const [activeReplyThread, setActiveReplyThread] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Close Modal
  const [closingThreadId, setClosingThreadId] = useState(null);
  const [closeReason, setCloseReason] = useState('');
  const [submittingClose, setSubmittingClose] = useState(false);

  // Report Modal
  const [reportingThreadId, setReportingThreadId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Image Lightbox
  const [previewZoomImage, setPreviewZoomImage] = useState(null);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const res = await discussionsService.list();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setDiscussions(res.data);
      } else {
        setDiscussions(MOCK_DISCUSSIONS);
      }
    } catch (err) {
      console.warn('API error in discussions list, using fallback:', err);
      setDiscussions(MOCK_DISCUSSIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    setNewError('');

    if (!token) {
      setNewError('Debes iniciar sesión para publicar en el foro.');
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      setNewError('Por favor ingresa un título y el contenido del tema.');
      return;
    }

    setSubmittingNew(true);
    try {
      const formData = new FormData();
      formData.append('title', newTitle.trim());
      formData.append('content', newContent.trim());
      if (newImage) {
        formData.append('image', newImage);
      }

      const res = await discussionsService.create(formData);
      if (res?.data) {
        // Prepend created discussion
        const created = {
          ...res.data,
          author: { id: user?.id, name: user?.name || 'Tú' },
        };
        setDiscussions([created, ...discussions]);
        setShowNewModal(false);
        setNewTitle('');
        setNewContent('');
        setNewImage(null);
        setImagePreview(null);
      }
    } catch (err) {
      setNewError(getErrorMessage(err));
    } finally {
      setSubmittingNew(false);
    }
  };

  const handleSendReply = async (discId) => {
    if (!token) {
      alert('Debes iniciar sesión para responder.');
      return;
    }
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      await discussionsService.reply(discId, replyText.trim());
      alert('¡Respuesta publicada con éxito!');
      setReplyText('');
      setActiveReplyThread(null);
      fetchDiscussions();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleCloseDiscussion = async () => {
    if (!closingThreadId) return;

    setSubmittingClose(true);
    try {
      await discussionsService.close(closingThreadId, closeReason.trim());
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === closingThreadId
            ? { ...d, status: 'closed', closed_reason: closeReason.trim() }
            : d
        )
      );
      setClosingThreadId(null);
      setCloseReason('');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmittingClose(false);
    }
  };

  const handleReportDiscussion = async () => {
    if (!reportingThreadId) return;
    if (!reportReason.trim()) {
      alert('Por favor ingresa el motivo del reporte.');
      return;
    }

    setSubmittingReport(true);
    try {
      await discussionsService.report(reportingThreadId, reportReason.trim());
      setReportSuccess(true);
      setTimeout(() => {
        setReportingThreadId(null);
        setReportReason('');
        setReportSuccess(false);
      }, 1500);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmittingReport(false);
    }
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesSearch =
      searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || d.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 bg-slate-50 py-8 lg:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Banner Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Comunidad de Postulantes MTC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Foro de Debates y Consultas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Comparte preguntas difíciles, sube capturas de señales confusas y aclara tus dudas con la comunidad antes del examen oficial.
            </p>
          </div>

          <div className="flex-shrink-0">
            {token ? (
              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Nuevo Tema</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Inicia Sesión para Participar</span>
              </Link>
            )}
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar discusiones y consultas..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({discussions.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'open'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Abiertos
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('closed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'closed'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Resueltos
            </button>
          </div>
        </div>

        {/* Discussions Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No hay temas en esta sección"
            description="Sé el primero en iniciar una conversación o formular una duda sobre el examen MTC."
            actionLabel="Crear Tema"
            onAction={() => setShowNewModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredDiscussions.map((disc) => {
              const isOpen = disc.status === 'open';
              const hasImage = Boolean(disc.image_url);
              const imgUrl = getImageUrl(disc.image_url);
              const isReplying = activeReplyThread === disc.id;

              return (
                <div
                  key={disc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  {/* Author bar & status badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center uppercase">
                        {disc.author?.name ? disc.author.name[0] : 'U'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          {disc.author?.name || 'Usuario MTC'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(disc.created_at)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isOpen
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Abierto</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Cerrado</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Content */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {disc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {disc.content}
                    </p>
                  </div>

                  {/* Attached Image Thumbnail */}
                  {hasImage && (
                    <div className="pt-1">
                      <img
                        src={imgUrl}
                        alt="Imagen del debate"
                        className="max-h-48 rounded-xl border border-slate-200 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewZoomImage(imgUrl)}
                      />
                    </div>
                  )}

                  {/* Closed reason notice if closed */}
                  {!isOpen && disc.closed_reason && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <b>Motivo de Cierre:</b> {disc.closed_reason}
                      </span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                      {isOpen && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!token) {
                              alert('Por favor inicia sesión para responder.');
                              return;
                            }
                            setActiveReplyThread(isReplying ? null : disc.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{isReplying ? 'Cancelar' : 'Responder'}</span>
                        </button>
                      )}

                      {isOpen && token && (
                        <button
                          type="button"
                          onClick={() => {
                            setClosingThreadId(disc.id);
                            setCloseReason('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Cerrar tema</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReportingThreadId(disc.id);
                        setReportReason('');
                      }}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Reportar</span>
                    </button>
                  </div>

                  {/* Inline Reply Box */}
                  {isReplying && (
                    <div className="pt-3 border-t border-slate-100 space-y-2 animate-in fade-in">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta o aclaración para este tema..."
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden text-slate-800 placeholder-slate-400"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={submittingReply || !replyText.trim()}
                          onClick={() => handleSendReply(disc.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {submittingReply ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Publicar Respuesta</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE NEW DISCUSSION MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Crear Nuevo Tema en el Foro
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{newError}</span>
              </div>
            )}

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título del Tema
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Duda sobre prioridad en óvalos no semaforizados"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Contenido / Consulta
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe con claridad tu duda o comparte el enunciado de la pregunta..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Adjuntar Imagen (Opcional)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-lg object-contain"
                      />
                      <p className="text-xs text-blue-600 font-semibold">Clic para cambiar imagen</p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-500">
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-xs font-semibold">Arrastra o selecciona una captura / señal</p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, WEBP hasta 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingNew}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingNew ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <span>Publicar Tema</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLOSE DISCUSSION MODAL */}
      {closingThreadId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Cerrar este tema
            </h3>
            <p className="text-xs text-slate-500">
              Al cerrar el tema ya no se permitirán nuevas respuestas. Opcionalmente indica el motivo.
            </p>
            <input
              type="text"
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              placeholder="Ej: Duda resuelta por la comunidad"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-blue-500 outline-hidden"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setClosingThreadId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={submittingClose}
                onClick={handleCloseDiscussion}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black"
              >
                {submittingClose ? 'Cerrando...' : 'Confirmar Cierre'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT DISCUSSION MODAL */}
      {reportingThreadId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-600" />
              <span>Reportar Contenido</span>
            </h3>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-center font-bold text-sm">
                ¡Gracias! Tu reporte ha sido recibido para revisión de moderación.
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  Ayúdanos a mantener la comunidad segura y respetuosa. Describe brevemente el problema.
                </p>
                <input
                  type="text"
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Ej: Contenido ofensivo o spam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-red-500 outline-hidden"
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReportingThreadId(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={submittingReport || !reportReason.trim()}
                    onClick={handleReportDiscussion}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                  >
                    {submittingReport ? 'Enviando...' : 'Enviar Reporte'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR PREVIEWING ATTACHED IMAGES */}
      {previewZoomImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">Imagen Adjunta</span>
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-50 rounded-xl mt-3">
              <img
                src={previewZoomImage}
                alt="Imagen ampliada"
                className="max-h-[65vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
