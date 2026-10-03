# GitHub Copilot & AI Agent Instructions - Web Chepita MTC

Este documento define la arquitectura, convenciones técnicas, estándares de código y guardrails para cualquier Agente de Inteligencia Artificial (GitHub Copilot, Cursor, Roo Code, Claude Dev, Antigravity) que opere en este repositorio.

---

## 1. Tech Stack & Next.js Architecture

- **Framework & Runtime:**
  - **Next.js 16.3.6** con **React 19.2.8** y **React Compiler** activado (`reactCompiler: true` en `next.config.mjs`).
  - Runtime de producción: **Node.js 22** sobre **Google Cloud App Engine** (`app.yaml`).
- **Routing Model:**
  - **Next.js App Router** bajo el directorio `src/app/`.
  - Rutas detectadas:
    - `/` (Landing principal con Hero, CTA, estadísticas y acceso a simulacros)
    - `/simulacrum` (Simulador de examen con temporizador, 40 preguntas y evaluación)
    - `/questions` & `/question` (Banco de preguntas y visualizador de preguntas MTC)
    - `/attempts` & `/attempts/[id]` (Historial y revisión detallada de simulacros rendidos)
    - `/discussions` (Foro y debate comunitario sobre preguntas y normativa de tránsito)
    - `/recommendations` (Tips, recomendaciones de estudio y normativa vial)
    - `/dashboard` (Panel de usuario y progreso)
    - `/login` & `/register` (Autenticación de usuarios)
- **Lenguaje y Resolución de Rutas:**
  - JavaScript moderno (ESModules, JSX) con alias de ruta `@/*` mapeado a `./src/*` en `jsconfig.json`.
  - Estándar de tipado y contratos: Documentar funciones y props con JSDoc y validar estructuras de datos con esquemas o tipado defensivo.
- **Styling & UI:**
  - **Tailwind CSS v4** integrado vía `@tailwindcss/postcss` con directiva `@import "tailwindcss";` en `src/app/globals.css`.
  - Utilidad de combinación de clases: `clsx` y `tailwind-merge` unificadas en `cn(...)` (`src/lib/utils.js`).
  - Iconografía: `lucide-react`.
  - Animaciones y Efectos: `framer-motion` para transiciones y micro-interacciones, `canvas-confetti` para feedback visual de simulacros aprobados.
- **Data Fetching & State Management:**
  - **Capa de Servicios REST:** `src/lib/api.js` centraliza las llamadas HTTP con `axios`, manejo de tokens Bearer e interceptores de error / 401.
  - **Estado Global del Cliente:** `zustand` con middleware `persist` (`useAuthStore` en `src/lib/store.js`) para sesión y token de usuario.
  - **Estrategia de Renderizado:**
    - Server Components (RSC) para layouts, cabeceras SEO y páginas con contenido estático o semi-estático.
    - Client Components (`'use client'`) exclusivamente para hojas interactivas: temporizadores, formularios reactivos, estado de preguntas y efectos visuales.
  - **Backend Externo:** REST API desplegada en Google Cloud Platform (`/api/v1`), documentada en `docs/api-chepita.openapi.json`.

---

## 2. Directory Structure & Component Standards

### Organización del Repositorio
```text
web-chepita-mtc/
├── .github/
│   └── copilot-instructions.md   # Este archivo de reglas para IA
├── docs/                         # Documentación OpenAPI y colecciones Postman
│   ├── api-chepita.openapi.json
│   └── api-chepita.postman_collection.json
├── public/                       # Assets estáticos servidos directamente
├── src/
│   ├── app/                      # Next.js App Router (Páginas, Layouts, CSS global)
│   │   ├── layout.js             # Root layout con Navbar, Footer y Metadata SEO
│   │   ├── globals.css           # Configuración base Tailwind v4 y estilos globales
│   │   ├── page.js               # Landing page principal
│   │   ├── simulacrum/           # Examen cronometrado
│   │   ├── attempts/             # Historial y detalle de intentos
│   │   ├── questions/            # Explorador del balotario
│   │   ├── discussions/          # Foro de la comunidad
│   │   ├── recommendations/      # Tips y guías de conducción
│   │   └── (auth)/               # Login y Registro
│   ├── components/               # Componentes UI reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Skeleton.jsx
│   │   ├── EmptyState.jsx
│   │   ├── GooglePlayButton.jsx
│   │   └── ConfettiEffect.jsx
│   └── lib/                      # Lógica de negocio y utilitarios
│       ├── api.js                # Cliente Axios y endpoints de backend
│       ├── store.js              # Store Zustand (auth/sesión)
│       ├── utils.js              # Helpers de formateo, clases CSS y lógica de negocio
│       └── mockData.js           # Datos fallback offline para resiliencia
├── app.yaml                      # Configuración de despliegue en Google App Engine
├── jsconfig.json                 # Path aliases (@/* -> ./src/*)
├── next.config.mjs               # Configuración Next.js (React Compiler habilitado)
└── package.json                  # Dependencias del proyecto
```

### Reglas para Componentes
1. **Server Components por Defecto:**
   - Todo archivo dentro de `src/app/` es un Server Component a menos que declare explícitamente `'use client';` en la primera línea.
   - No añadir `'use client'` a un layout o página completa si solo un botón, modal o selector requiere interactividad. Mover la interacción a un componente hijo en `src/components/`.
2. **Convención de Nombrado y Exportación:**
   - Componentes UI en `src/components/`: usar `PascalCase.jsx` y exportación nombrada o por defecto consistente.
   - Páginas y layouts en `src/app/`: exportación `export default function Page()` o `export default function Layout()`.
3. **Optimización Nativizada de Next.js:**
   - Usar `<Link href="...">` de `next/link` para navegación interna (evitar etiquetas `<a>` crudas).
   - Usar `<Image>` de `next/image` con atributos `width`, `height`, `alt` y `priority` (cuando esté en el viewport crítico/LCP).
   - Definir metadata en Server Components usando el objeto exportado `export const metadata = { ... }`.
4. **Manejo Seguro de Estilos (Tailwind CSS v4):**
   - Utilizar la función utilitaria `cn(...)` de `src/lib/utils.js` para fusionar condicionalmente clases de Tailwind.
   - Respetar las variables de color temáticas definidas en `src/app/globals.css` (`--primary`, `--background`, `--surface`, etc.).

---

## 3. Execution & Test Commands

- **Servidor de Desarrollo Local:**
  ```bash
  npm run dev
  ```
  Inicia el servidor en `http://localhost:3000`.

- **Compilación de Producción:**
  ```bash
  npm run build
  ```
  Genera la versión optimizada en `.next/`. Verifica errores de sintaxis y renderizado estático.

- **Build para Google Cloud App Engine:**
  ```bash
  npm run gcp-build
  ```

- **Ejecución del Build Localmente:**
  ```bash
  npm run start
  ```

- **Análisis de Código / Linter:**
  ```bash
  npm run lint
  ```
  Ejecuta ESLint 9 configurado con `eslint-config-next`.

- **Verificación de Tipos / Sintaxis (si se añade TypeScript):**
  ```bash
  npx tsc --noEmit
  ```

---

## 4. Critical Rules & Guardrails for AI

1. **No Forzar `'use client'` Innecesariamente:**
   - Mantener la separación de responsabilidades del App Router. El fetching inicial o la metadata deben residir en Server Components siempre que sea posible.
2. **Validación Defensiva de Datos y Manejo de Errores:**
   - Todas las llamadas a `api.js` deben considerar estados de carga (`loading`), estados vacíos (`EmptyState`) y manejo de errores mediante `getErrorMessage(error)`.
   - Si se incorporan Route Handlers o Server Actions, validar estrictamente los parámetros de entrada antes de operar.
3. **Seguridad y Variables de Entorno:**
   - **NUNCA** exponer credenciales, tokens de servicio ni claves privadas en el navegador.
   - **SOLO** las variables destinadas a ser accesibles por el bundle de React deben llevar el prefijo `NEXT_PUBLIC_` (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_BASE`).
   - Las variables privadas del servidor deben consumirse sin el prefijo `NEXT_PUBLIC_` y exclusivamente en Server Components, Route Handlers o Server Actions.
4. **Integridad de Dependencias:**
   - **NO** instalar librerías adicionales en `package.json` sin solicitar confirmación explícita al desarrollador.
   - Aprovechar las dependencias ya existentes en el proyecto (`axios`, `zustand`, `framer-motion`, `lucide-react`, `canvas-confetti`, `clsx`, `tailwind-merge`).
5. **Compatibilidad con Tailwind CSS v4:**
   - No crear archivos obsoletos `tailwind.config.js` de la versión 3. La configuración de Tailwind v4 se gestiona de forma nativa mediante CSS en `src/app/globals.css`.
6. **Resiliencia ante Caídas del Backend:**
   - Mantener coherencia con los fallbacks de `src/lib/mockData.js` para asegurar que el simulador y las vistas principales continúen siendo navegables en caso de interrupción del servicio externo.
