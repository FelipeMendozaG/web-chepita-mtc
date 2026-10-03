'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Car,
  BookOpen,
  History,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import GooglePlayButton from './GooglePlayButton';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Inicio', icon: null },
    { href: '/simulacrum', label: 'Simulacro', icon: Sparkles, highlight: true },
    { href: '/questions', label: 'Banco de Preguntas', icon: BookOpen },
    { href: '/attempts', label: 'Historial', icon: History, authOnly: true },
    { href: '/discussions', label: 'Foro', icon: MessageSquare },
    { href: '/recommendations', label: 'Consejos MTC', icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  Simulacro<span className="text-blue-600">MTC</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  Chepita
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
                Examen de Reglas Oficial
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              if (link.authOnly && mounted && !token) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;

              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 text-amber-300" />}
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <GooglePlayButton className="scale-90" variant="dark" />

            {mounted && isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[110px] truncate">
                    {user?.name || 'Mi Perfil'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Conectado como</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel Principal
                      </Link>
                      <Link
                        href="/attempts"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <History className="w-4 h-4" />
                        Mis Simulacros
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100/60 rounded-lg transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-md shadow-lg">
          {navLinks.map((link) => {
            if (link.authOnly && mounted && !token) return null;
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-blue-600" />}
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <GooglePlayButton className="w-full justify-center" variant="dark" />

            {mounted && isAuthenticated ? (
              <div className="pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user?.name ? user.name[0] : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg"
                  >
                    Panel
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
