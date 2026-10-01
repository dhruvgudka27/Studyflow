# StudyFlow — Student Academic Productivity Platform

> **Academic Year 2026–27 • Department of Artificial Intelligence & Machine Learning**  
> **Student:** Dhruv Gudka • **SAP ID:** `60017240095` • **Roll No:** `A018` • **Batch:** `A1-1`  
> **Course:** Programming Laboratory-III (Full Stack Development Using Next.js) • **Course Code:** `DJS23AMD302L` • **Semester:** V  
> **Project Name:** **STUDYFLOW** (Integrated Submission for Assignment 1 & Assignment 2)

---

## 🌟 Executive Overview

**StudyFlow** is a comprehensive, production-grade academic productivity and coursework orchestration platform designed specifically for engineering students. Built natively on the **Next.js App Router**, StudyFlow unifies coursework deliverables, persistent focus session timers, type-safe Server Action mutations, relational academic ledgers, and real-time MongoDB telemetry into a single cohesive full-stack architecture.

StudyFlow strictly implements every syllabus outcome across **Units I through VI**, encompassing both **Assignment 1** (Accessible component architecture, hydration-safe state management, shared Zod Server Actions, and Core Web Vitals) and **Assignment 2** (Normalized Prisma relational schemas, automated Faker.js seeding, Edge Middleware RBAC with Better Auth, transactional Resend email dispatch, and Mongoose document streams).

---

## 🛠️ Complete Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Framework & Runtime** | Next.js 14 (App Router), React 18, TypeScript, Node.js v22 |
| **Styling & Design System** | Tailwind CSS, shadcn/ui primitives, Radix UI Primitives, Lucide Icons |
| **Theming & Hydration** | `next-themes` (Dark / Light / System mode, hydration-safe mount guards) |
| **Client State Management**| Zustand v5 (Persistent local storage, selective subscriptions, Pomodoro focus slice) |
| **Type-Safe Validation** | Zod (Shared schemas between client forms and backend Server Actions) |
| **Form Engineering** | `react-hook-form` coupled with `@hookform/resolvers/zod` |
| **Server Mutations** | Native Next.js Server Actions (`'use server'`) with cache revalidation |
| **Relational Database** | PostgreSQL 16/18 with Prisma ORM 5 (Normalized multi-entity relational schema) |
| **Object Database** | MongoDB with Mongoose ODM (Focus telemetry & unstructured event streams) |
| **Authentication & RBAC** | Better Auth / Cryptographic HS256 JWT sessions enforced at Edge Middleware |
| **Transactional Email** | React Email (`@react-email/components`) & Resend API SDK |
| **Webhooks & Ingestion** | Next.js Route Handlers (`/api/webhooks/resend`) with event state logging |
| **Social Sharing Images** | Dynamic Open Graph preview generator (`/api/og`) powered by `@vercel/og` |
| **Testing & Auditing** | Google Lighthouse v12.8.2 CLI, Node ESM integration test suite |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: v18.17+ or v20+ / v22+
- **PostgreSQL**: Running locally on `localhost:5432`
- **MongoDB**: (Optional) Standard MongoDB on `localhost:27017` or automatically spins up an embedded `mongodb-memory-server` instance!

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/studyflow?schema=public"
MONGODB_URI="mongodb://localhost:27017/studyflow_telemetry"
BETTER_AUTH_SECRET="studyflow_super_secret_jwt_encryption_key_2026_aiml"
BETTER_AUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_test_mock_studyflow_key"
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_WEBHOOK_SECRET="whsec_mock_studyflow_webhook"
```

### 3. Automated Database Setup & Seeding CLI
Run the automated migration and Faker.js database seeding pipeline:
```bash
# Automatically applies Prisma migrations and populates realistic relational test data
npm run db:reset
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Run the Automated System Integration Test Suite
```bash
npm run test:system
```
*Verifies all 5 test suites (Prisma schemas, Better Auth JWT, Zod validation, Mongoose streams, and Resend webhooks).*

### 6. Production Build & Start
```bash
npm run build
npm run start
```

---

## 👥 Evaluator One-Click Demo Credentials

For zero-friction evaluation, pre-seeded accounts across all 3 roles are readily available on the login page via **1-Click Demo Buttons**:

| Role Archetype | Institutional Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **MEMBER (Student)** | `member@studyflow.edu` | `Student@123` | Full student workspace: Create & cycle tasks, register courses, trigger Pomodoro focus sessions |
| **ADMIN (Faculty/Staff)**| `admin@studyflow.edu` | `Admin@123` | Gated Admin Console: Access user directory, forensic audit logs, transactions, and email delivery telemetry |
| **GUEST (Prospective)** | `guest@studyflow.edu` | `Guest@123` | Read-only inspection; mutation attempts safely rejected with 403 Forbidden |

---

## 🏛️ Project Directory Structure

```
studyflow/
├── app/
│   ├── actions/
│   │   └── task-actions.ts        # Native Server Actions ('use server') with Zod sanitization
│   ├── admin/
│   │   └── page.tsx               # RSC Admin Portal (Protected by Middleware & Server RBAC)
│   ├── analytics/
│   │   └── page.tsx               # RSC Analytics & Mongoose Telemetry Stream
│   ├── api/
│   │   ├── auth/                  # Better Auth session endpoints (/login, /logout, /me, /register)
│   │   ├── courses/               # Protected Route Handler for academic courses
│   │   ├── og/                    # Dynamic @vercel/og Open Graph generator route
│   │   ├── tasks/                 # Protected Route Handler for study tasks
│   │   ├── telemetry/             # Mongoose/MongoDB time-series route handler
│   │   └── webhooks/resend/       # Resend email delivery/bounce webhook ingestion route
│   ├── courses/
│   │   └── page.tsx               # RSC Courses Catalogue & Credit Tracking
│   ├── dashboard/
│   │   ├── layout.tsx             # Authenticated workspace layout
│   │   └── page.tsx               # RSC Student Dashboard with PostgreSQL KPI metrics
│   ├── login/
│   │   └── page.tsx               # Sign In Page with 1-click evaluator logins
│   ├── register/
│   │   └── page.tsx               # Student Registration Page
│   ├── tasks/
│   │   └── page.tsx               # RSC Task Management with Suspense and Zustand filters
│   ├── globals.css                # Tailwind CSS variables & theme tokens
│   ├── layout.tsx                 # Root layout with ThemeProvider, FocusSessionBar & Sonner
│   └── page.tsx                   # Interactive Homepage & Architecture Showcase
├── components/
│   ├── admin/                     # AdminTabs (Users, Audit, Transactions, Resend logs)
│   ├── analytics/                 # TelemetryViewer (MongoDB live pulse console)
│   ├── auth/                      # LoginForm & RegisterForm components
│   ├── courses/                   # CreateCourseDialog component
│   ├── tasks/                     # TaskFilterBar, TaskList, TaskCard, CreateTaskDialog, Skeleton
│   ├── ui/                        # Accessible Radix + shadcn/ui component primitives
│   ├── focus-session-bar.tsx      # Persistent Zustand Pomodoro focus bar
│   ├── mode-toggle.tsx            # Hydration-safe dark/light/system theme switcher
│   ├── navbar.tsx                 # Responsive header with session integration & RBAC links
│   └── theme-provider.tsx         # Next-themes provider wrapper
├── emails/
│   └── TaskCreatedEmail.tsx       # Modular React Email template (@react-email/components)
├── lib/
│   ├── auth.ts                    # JWT cryptographic signing & verification helpers
│   ├── email.ts                   # Resend API transactional dispatch pipeline
│   ├── mongodb.ts                 # Mongoose singleton with MongoMemoryServer fallback
│   ├── prisma.ts                  # Global PrismaClient singleton
│   ├── utils.ts                   # Tailwind cn utility helper
│   └── validations/
│       └── task.ts                # Shared Zod validation schemas (taskSchema, courseSchema)
├── models/
│   └── StudyTelemetry.ts          # Mongoose schema for MongoDB focus telemetry events
├── prisma/
│   ├── migrations/                # Versioned SQL migration files
│   ├── reset.ts                   # Automated CLI reset, migration & seeding pipeline
│   ├── schema.prisma              # Normalized PostgreSQL multi-entity relational schema
│   └── seed.ts                    # Realistic Faker.js relational data seeding script
├── scripts/
│   ├── parse-lighthouse.js        # Script extracting exact Lighthouse metrics from JSON
│   └── system-audit.mjs           # Automated 19-test end-to-end integration audit suite
├── middleware.ts                  # Next.js Edge Middleware for session parsing & RBAC routing
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## 🏆 Real Google Lighthouse & Core Web Vitals Audit

Audited via Google Lighthouse CLI (v12.8.2) in headless Chrome against the live production build at `http://localhost:3000`:

| Category | Score Obtained | Target / Standard | Status |
| :--- | :---: | :---: | :---: |
| **Performance** | **97 / 100** | ≥ 90 | 🟢 EXCELLENT |
| **Accessibility** | **95 / 100** | ≥ 90 | 🟢 EXCELLENT |
| **Best Practices** | **96 / 100** | ≥ 90 | 🟢 EXCELLENT |
| **SEO** | **100 / 100** | ≥ 90 | 🟢 PERFECT |

### Core Web Vitals Metrics
- **First Contentful Paint (FCP):** `1.2 s` (Target: < 1.8 s)
- **Largest Contentful Paint (LCP):** `2.5 s` (Target: ≤ 2.5 s)
- **Cumulative Layout Shift (CLS):** `0.049` (Target: < 0.1)
- **Total Blocking Time (TBT):** `10 ms` (Target: < 200 ms — virtually zero main thread blocking)
- **Speed Index:** `1.2 s` (Target: < 3.4 s)

---

## 📋 Syllabus Requirements Verification Matrix

| Requirement / Module | Implementation in StudyFlow | File References |
| :--- | :--- | :--- |
| **Accessible Primitives (Topic 1)** | Unstyled Radix UI primitives styled with Tailwind CSS; full keyboard navigation and ARIA attributes | `components/ui/*`, `components/tasks/*` |
| **Hydration-Safe Theming (Topic 1)** | `next-themes` with `suppressHydrationWarning` and mount-guarded ModeToggle | `components/mode-toggle.tsx`, `app/layout.tsx` |
| **Zustand State Store (Topic 2)** | Persistent local storage store with selective subscriptions preventing layout re-renders | `stores/useStudyStore.ts`, `components/focus-session-bar.tsx` |
| **Shared Zod Schema (Topic 3)** | Single source of truth schema used in `react-hook-form` and native Server Action | `lib/validations/task.ts`, `app/actions/task-actions.ts` |
| **Server Actions Mutation (Topic 3)** | Server-side validated data mutation with optimistic UI and toast feedback | `app/actions/task-actions.ts`, `components/tasks/task-card.tsx` |
| **Prisma Relational Schema (Topic 4)** | Normalized models (User, Course, StudyTask, Goal, Session, AuditLog, Transaction) | `prisma/schema.prisma` |
| **Faker.js Realistic Seeding (Topic 4)** | Automated programmatic data generation with foreign key referential integrity | `prisma/seed.ts`, `prisma/reset.ts` |
| **React Email & Resend (Topic 5)** | Modular JSX email template dispatched post-mutation via Resend API | `emails/TaskCreatedEmail.tsx`, `lib/email.ts` |
| **Resend Webhook Handler (Topic 5)** | Route Handler `/api/webhooks/resend` logging delivery and bounce events to database | `app/api/webhooks/resend/route.ts` |
| **Mongoose MongoDB DB (Unit IV)** | Mongoose object schema for focus session telemetry with compound indexes | `models/StudyTelemetry.ts`, `app/api/telemetry/route.ts` |
| **Better Auth & Edge RBAC (Unit V)** | Edge middleware checking cryptographic sessions for Admin, Member, and Guest | `middleware.ts`, `lib/auth.ts`, `app/admin/page.tsx` |
| **Dynamic OG Image (Topic 6)** | Dynamic Open Graph preview image generation via `@vercel/og` Edge runtime | `app/api/og/route.tsx` |
| **Core Web Vitals Audit (Topic 6)** | Real Lighthouse audit recording 97 Performance, 95 Accessibility, 100 SEO | `audit/lighthouse-report.report.html` |
