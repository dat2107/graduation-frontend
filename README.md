# Frontend — English Learning Platform

React SPA frontend for the AI-powered English learning web application.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Routes](#routes)
- [State Management](#state-management)
- [Styling Conventions](#styling-conventions)
- [Mock API](#mock-api)
- [Implementation Status](#implementation-status)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.6 |
| Framework | React 18.3 |
| Build tool | Vite 5.4 |
| UI library | Mantine 7.12 |
| State management | Redux Toolkit 2.2 + redux-persist |
| Routing | React Router DOM 6 |
| HTTP client | Axios 1.7 |
| Forms | Mantine Form + Yup |
| i18n | i18next 23 (vi / en) |
| Charts | Recharts 2 + Mantine Charts |
| Mock API | MirageJS 0.1 |
| Testing | Vitest 1.6 + React Testing Library 14 |
| Component docs | Storybook 8 |
| Package manager | Yarn 4.4 (Berry) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn 4.4+ — enable with `corepack enable`

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:8081/api
VITE_APP_NAME=English Learning Platform
```

### 3. Start the development server

```bash
yarn dev
```

App is available at `http://localhost:5173`.

---

## Project Structure

```
src/
├── @types/              # Global TypeScript type definitions
├── assets/              # Fonts, images, audio files
├── components/          # Reusable UI components (PascalCase folders)
│   ├── Breadcrumbs/
│   ├── ColorSchemeToggle/
│   ├── LanguageSwitcher/
│   ├── Layout/
│   ├── LoadingScreen/
│   ├── Table/
│   └── popup/
├── configs/
│   ├── navigation.config/   # Sidebar / nav menu items
│   └── routes.config/       # Route definitions (path, component, authority)
├── constants/           # App-wide constants
├── locales/lang/        # Translation files (vi.json, en.json)
├── mock/                # MirageJS mock server
│   ├── data/            # Static fixture data
│   └── fakeApi/         # Mock request handlers
├── pages/               # Page-level components (mapped 1:1 with routes)
│   ├── auth/            # Login, Register, Forgot password
│   ├── profile/         # User profile
│   ├── quiz/            # Quiz list and quiz attempt
│   └── vocabulary/      # Vocabulary sets and flashcards
├── route/               # Router setup and protected route logic
├── services/            # API service layer (one file per domain)
│   ├── auth/
│   ├── quiz/
│   ├── user/
│   └── vocabulary/
├── store/               # Redux store
│   ├── slices/
│   │   ├── auth/        # user, session, userInfo slices
│   │   ├── base/        # global loading / notifications
│   │   ├── cache/       # cached API responses
│   │   ├── locale/      # current language
│   │   └── theme/       # dark / light mode
│   ├── hook.ts          # typed useAppDispatch, useAppSelector
│   └── index.ts         # store with redux-persist
└── utils/               # Shared utilities and custom hooks
```

---

## Available Scripts

| Script | Description |
|---|---|
| `yarn dev` | Start Vite dev server (port 5173) |
| `yarn build` | TypeScript type-check + production build |
| `yarn preview` | Preview the production build locally |
| `yarn typecheck` | Run TypeScript type checks |
| `yarn lint` | Run ESLint + Stylelint |
| `yarn vitest` | Run unit tests |
| `yarn storybook` | Start Storybook component explorer (port 6006) |
| `yarn test` | Full CI check: typecheck + lint + prettier + build |

---

## Routes

### Public routes (no authentication required)

| Path | Page |
|---|---|
| `/login` | Login |
| `/register` | Registration |
| `/forgot-password` | Password recovery |

### Protected routes (require login)

| Path | Page |
|---|---|
| `/dashboard` | Dashboard |
| `/profile` | User profile |
| `/vocabulary` | Vocabulary sets |
| `/vocabulary/:setId` | Vocabulary set detail |
| `/quiz` | Quiz listing |
| `/quiz/:quizId` | Quiz attempt |

Route authority is enforced per-route in `configs/routes.config/routes.config.ts`.

---

## State Management

Redux Toolkit slices with `redux-persist`:

| Slice | Stored state |
|---|---|
| `auth/user` | Logged-in user data |
| `auth/session` | Access token and refresh token |
| `auth/userInfo` | Extended user profile |
| `base/common` | Global loading, error, notification flags |
| `cache` | API response cache |
| `locale` | Current language (`vi` / `en`) |
| `theme` | Color scheme (`light` / `dark`) |

Always use typed hooks — never call `useSelector` / `useDispatch` directly:

```ts
import { useAppDispatch, useAppSelector } from '@/store/hook'
```

---

## Styling Conventions

This project uses **Mantine 7** as the sole styling system. **Tailwind CSS is not used.**

Priority order:

1. Mantine layout components (`Stack`, `Group`, `Flex`, `SimpleGrid`, `Box`, `Paper`)
2. Mantine style props (`c`, `bg`, `p`, `m`, `gap`, `fw`, `fz`, etc.)
3. CSS Modules (`.module.css`) — for animations, `:hover`, `::before/::after`
4. Inline `style={{}}` — only for dynamic values or complex gradients

```tsx
// Correct
<Stack gap="md" p="xl">
  <Text fw={600} c="dark">Title</Text>
</Stack>

// Incorrect — Tailwind classes have no effect in this project
<div className="flex flex-col gap-4 p-8">...</div>
```

CSS Module files are placed in the same folder as the component and use `camelCase` class names:

```
components/FlashCard/
├── FlashCard.tsx
├── FlashCard.module.css
└── index.ts
```

---

## i18n

Two supported languages: Vietnamese (`vi`) and English (`en`).

```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
return <p>{t('some.key')}</p>
```

Translation files are in `src/locales/lang/vi.json` and `en.json`.

---

## Mock API

During development the app can run against MirageJS instead of a live backend.
Handlers live in `src/mock/fakeApi/` and must be registered **before** `this.passthrough()` in `src/mock/mock.ts`.

---

## Code Quality

- **ESLint** (Airbnb + Mantine preset) — enforced via `yarn lint`
- **Prettier** — auto-format on save, enforced in CI
- **Stylelint** — CSS/SCSS linting
- **Husky + lint-staged** — pre-commit hooks run linting on staged files

---

## Building for Production

```bash
yarn build
```

Output goes to `dist/`. The Docker image serves the built files with Nginx.

---

## Implementation Status

| Module | Status |
|---|---|
| Auth (login, register, Google OAuth2, password reset) | Done |
| User profile | Done |
| Routing and layout scaffolding | Done |
| Mock API infrastructure | Done |
| Vocabulary (flashcards, spaced repetition) | Planned |
| Grammar lessons | Planned |
| Listening practice | Planned |
| Speaking practice | Planned |
| Quiz system | Planned |
| AI Chatbot (SSE streaming) | Planned |
| AI writing grader and pronunciation evaluation | Planned |
| Gamification (XP, levels, badges, leaderboard) | Planned |
