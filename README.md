# Web Chepita MTC - Simulador de Examen de Reglas de Tránsito

Aplicación web interactiva para la preparación y práctica del examen oficial de reglas de tránsito del MTC (Ministerio de Transportes y Comunicaciones de Perú), construida con Next.js 16, React 19 y Tailwind CSS v4.

---

## Next.js Architecture & Data Flow for AI

**Web Chepita MTC** es una plataforma orientada a la preparación integral para la obtención de licencias de conducir en Perú, implementada sobre la arquitectura **Next.js App Router (v16.3.6)** con una estrategia de renderizado híbrido. La aplicación prioriza el uso de **React Server Components (RSC)** en el nivel de layout y páginas de catálogo para optimizar el rendimiento inicial, el SEO y el Largest Contentful Paint (LCP), delegando el renderizado interactivo en el cliente (**Client Components**) únicamente a los nodos interactivos como el temporizador de 40 minutos del simulacro, el selector reactivo de alternativas, el almacenamiento local de sesión vía Zustand y las animaciones con Framer Motion / Canvas Confetti. Las solicitudes de datos viajan desde los componentes interactivos del cliente hacia una capa de servicios tipada que consume la API REST de Chepita alojada en Google Cloud Platform mediante tokens Bearer autenticados.

```mermaid
flowchart TD
    subgraph Browser ["Navegador (Client Side)"]
        UI["Client Components ('use client')\n(Simulacrum, Timer, Forms, Navbar)"]
        Store["Zustand Store\n(Persisted Auth & Token)"]
        UI -->|Lee / Actualiza Estado| Store
    end

    subgraph NextServer ["Next.js App Router Layer"]
        RSC["React Server Components (RSC)\n(RootLayout, Static Pages, Metadata)"]
        RouteHandler["Route Handlers / Server Actions (Opcional)\n(app/api/*)"]
    end

    subgraph ServiceLayer ["Service & API Client Layer"]
        ApiClient["Axios API Client (src/lib/api.js)\n(Bearer Token Interceptor, Error Normalizer)"]
        MockData["Mock Data Fallback (src/lib/mockData.js)\n(Offline Resilience)"]
    end

    subgraph BackendAPI ["External REST API Backend (GCP App Engine)"]
        AuthService["/api/v1/auth (Login / Register)"]
        QuestionsService["/api/v1/question (Balotario & Simulacro)"]
        AttemptsService["/api/v1/attempt (Calificación & Historial)"]
        DiscussionsService["/api/v1/discussion (Debates & Foros)"]
        RecommendationsService["/api/v1/recommendation (Consejos Viales)"]
    end

    subgraph DatabaseLayer ["Persistencia & Almacenamiento"]
        DB[(Cloud SQL / Datastore)]
        CloudStorage[("Cloud Storage (Imágenes / Balotarios)")]
    end

    %% Flujos de interacción
    RSC -->|Renderiza HTML inicial + Streaming| UI
    UI -->|Petición HTTP con Token JWT| ApiClient
    UI -.->|Proxy o Mutación Segura| RouteHandler
    RouteHandler -.->|Llamada Servidor a Servidor| ApiClient
    ApiClient -->|Llamadas REST HTTP| BackendAPI
    ApiClient -.->|En caso de timeout/error de red| MockData

    BackendAPI -->|Consultas SQL / ORM| DB
    BackendAPI -->|Lectura de assets| CloudStorage
```

---

## Getting Started

### 1. Requisitos Previos
- Node.js 20+ o 22 (recomendado Node.js 22, correspondiente al runtime de producción en `app.yaml`).
- npm, pnpm o yarn.

### 2. Configurar Variables de Entorno
Copia la plantilla `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local con Hot Reload.
- `npm run build`: Compila y genera el bundle de producción optimizado.
- `npm run gcp-build`: Script de compilación específico para Google Cloud App Engine.
- `npm run start`: Inicia el servidor en modo producción.
- `npm run lint`: Ejecuta el linter (ESLint 9 con reglas de Next.js).

---

## Despliegue en Google Cloud App Engine

El proyecto está configurado para desplegarse como servicio `web-chepita-mtc` en runtime `nodejs22` según [`app.yaml`](file:///e:/chepita-dev/chepita.mtc/web-chepita-mtc/app.yaml):

```bash
gcloud app deploy app.yaml
```
