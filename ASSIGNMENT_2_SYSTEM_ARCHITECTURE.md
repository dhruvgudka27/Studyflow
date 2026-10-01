# Assignment 2: System Architecture Note
## Automated Relational Data Seeding, Transactional Event Notification & Secure Full-Stack Endpoints

**Academic Year:** 2026–27  
**Student Name:** Dhruv Gudka  
**SAP ID:** 60017240095  
**Roll No:** A018 • **Batch:** A1-1  
**Course:** Programming Laboratory-III (Full Stack Development Using Next.js)  
**Course Code:** `DJS23AMD302L`  
**Class / Year:** T.Y. B.Tech, Department of Artificial Intelligence & Machine Learning  
**Semester:** V  
**Project Name:** **STUDYFLOW — Student Academic Productivity Platform**  

---

## 1. System Overview & Layered Architecture

StudyFlow is a production-grade academic management and focus orchestration system. It integrates an App Router presentation tier with a dual-database persistence tier (PostgreSQL for structured relational data and MongoDB for unstructured telemetry), secured by cryptographic session tokens evaluated at Next.js Edge Middleware.

```
                              Student Client / Browser
                                        │
                                        ▼
                         Next.js Edge Proxy / Middleware
                          (middleware.ts / proxy layer)
                                        │
                       ┌────────────────┴────────────────┐
                       ▼                                 ▼
             [Public Routes]                   [Session Verified & RBAC]
          (/login, /register, /)            (/dashboard, /tasks, /admin)
                                                         │
                                ┌────────────────────────┼────────────────────────┐
                                ▼                        ▼                        ▼
                        [Server Components]       [Server Actions]       [Route Handlers]
                            (RSC Pages)           ('use server')         (/api/tasks, /api/og)
                                │                        │                        │
                                └────────────────────────┼────────────────────────┘
                                                         │
                                        ┌────────────────┴────────────────┐
                                        ▼                                 ▼
                               [Prisma ORM Client]              [Mongoose ODM Client]
                                        │                                 │
                                        ▼                                 ▼
                                  [PostgreSQL]                        [MongoDB]
                           (Users, Tasks, Courses,              (Time-Series Focus
                           AuditLogs, Transactions)             Telemetry Events)
```

---

## 2. Normalized Relational Data Model (Prisma ORM & PostgreSQL)

The relational database is fully normalized to eliminate data redundancy and enforce referential integrity across the academic lifecycle.

### 2.1 Entity Relationship Diagram

```
[User] ───(1:N)───► [Session]
  │
  ├───(1:N)───► [Account] (Better Auth provider credentials)
  │
  ├───(1:N)───► [Course] ───(1:N)───► [StudyTask] ───(1:N)───► [StudySession]
  │                                        │
  ├───(1:N)───► [AcademicGoal]             │
  │                                        │
  ├───(1:N)───► [Transaction] (Financial/Lab Allowances)
  │
  └───(1:N)───► [AuditLog] (Forensic State Ledger)

[EmailDeliveryLog] (Resend Dispatch & Ingested Webhook Delivery / Bounce Records)
```

### 2.2 Core Entity Definitions
- **`User`**: Stores student profiles, institutional email credentials, and assigned role (`ADMIN`, `MEMBER`, `GUEST`).
- **`Session` & `Account`**: Managed for Better Auth session tracking with cryptographically hashed tokens.
- **`Course`**: Represents registered academic curricula (code, title, instructor, credits, color token).
- **`StudyTask`**: Normalized coursework deliverables with foreign keys referencing `Course` and `User`.
- **`AcademicGoal`**: Milestone projections and term GPA targets.
- **`StudySession`**: Discrete focus intervals linked to tasks with focus quality ratings.
- **`Transaction`**: Immutable ledger of student credits, lab allowances, and resource grants.
- **`AuditLog`**: Tamper-evident forensic record containing action codes, target entities, IP addresses, and JSON payloads.
- **`EmailDeliveryLog`**: Resend transactional lifecycle entries tracking state transitions (`SENT`, `DELIVERED`, `BOUNCED`).

---

## 3. Database Seeding & CLI Migration Pipeline

To satisfy the requirement for automated database provisioning, StudyFlow integrates an automated workflow command combining schema synchronization, migration deployment, and programmatic mock data generation via **`@faker-js/faker`**.

### 3.1 Automated Pipeline Command
```bash
npm run db:reset
```

### 3.2 Seeding Execution Lifecycle
1. **Schema Push / Migration:** `npx prisma migrate deploy` applies versioned SQL migrations.
2. **Client Generation:** `npx prisma generate` binds fresh TypeScript definitions.
3. **Faker.js Execution (`prisma/seed.ts`):**
   - Cleans existing tables in reverse foreign-key sequence to prevent constraint violations.
   - Creates the 3 core role archetypes (`admin@studyflow.edu`, `member@studyflow.edu`, `guest@studyflow.edu`) with bcrypt hashes.
   - Generates realistic student profiles using localized Faker names and avatars.
   - Populates semester courses (including `DJS23AMD302L` - Full Stack Development Using Next.js).
   - Seeds realistic study tasks, academic milestones, focus sessions, and financial transactions.
   - Seeds transactional email dispatch logs and webhook delivery events.

---

## 4. Authentication, Session Enforcement & Edge Middleware RBAC

StudyFlow employs a layered security architecture combining **Better Auth**, Edge-compatible JWT tokens (`jose` library), and **Next.js Middleware (`middleware.ts`)**.

```
                           Incoming Client Request
                                      │
                                      ▼
                           [Next.js Edge Middleware]
                                      │
                        Extracts `studyflow_session`
                                      │
                   Is Token Valid & Cryptographically Signed?
                                 /          \
                              [No]          [Yes]
                              /                \
          Is Route Protected?           Extract Role (ADMIN, MEMBER, GUEST)
             /           \                           │
          [Yes]          [No]           Does User Meet Route Clearance?
           /               \                       /         \
   Redirect to /login    Pass Thru               [Yes]       [No]
                                                  /             \
                                          Allow Request   403 Forbidden /
                                                          Redirect with Error
```

### 4.1 Role-Based Access Control (RBAC) Hierarchy
- **`GUEST`**: Public read-only inspection. Mutations via Server Actions or protected Route Handlers are blocked with `403 Forbidden`.
- **`MEMBER`**: Authenticated students. Authorized to create and cycle study tasks, register courses, and record focus telemetry.
- **`ADMIN`**: Faculty and system administrators. Authorized to access the `/admin` control center, inspect all user records, review forensic audit logs, and simulate webhook ingestions.

---

## 5. Dual Database Architecture: PostgreSQL + MongoDB Object Telemetry

In accordance with Unit IV syllabus specifications, StudyFlow strategically leverages **PostgreSQL** for structured, relational, ACID-compliant business models and **MongoDB** (via **Mongoose ODM**) for flexible, high-throughput document telemetry.

| Architectural Feature | PostgreSQL via Prisma ORM | MongoDB via Mongoose ODM |
| :--- | :--- | :--- |
| **Model Type** | Normalized Relational Schema | Unstructured Document Collections |
| **Primary Domain** | User accounts, courses, study tasks, transactions | Real-time Pomodoro ticks, device telemetry, focus pulses |
| **Indexing Strategy** | Foreign key constraints and compound unique indexes | Compound time-series index: `{ userId: 1, timestamp: -1 }` |
| **Payload Nature** | Strictly typed relational rows | Dynamic JSON payloads (`Schema.Types.Mixed`) |
| **Access Layer** | Prisma Client in Server Components & Server Actions | Mongoose connection singleton in Route Handlers (`/api/telemetry`) |

---

## 6. Transactional Email Pipeline & Resend Webhook Ingestion

StudyFlow integrates **React Email (`@react-email/components`)** and the **Resend API SDK** to dispatch transactional notifications immediately following database mutations.

```
[Prisma Mutation: Task Created]
               │
               ▼
   [dispatchTaskCreatedEmail]
               │
     Creates `QUEUED` Log in PostgreSQL
               │
               ▼
      [Resend API SDK] ──(Dispatches JSX Email Template)──► [Student Inbox]
               │
               ▼
[Resend Webhook Dispatch: POST /api/webhooks/resend]
               │
   Cryptographic Svix Signature Verification
               │
               ▼
[EmailDeliveryLog State Update: SENT ──► DELIVERED / BOUNCED]
```

A dedicated Next.js Route Handler (`app/api/webhooks/resend/route.ts`) handles asynchronous delivery confirmations:
- Verifies incoming cryptographic Svix webhook signatures in production environments.
- Ingests delivery events (`email.delivered`, `email.bounced`, `email.complained`).
- Updates the corresponding record in PostgreSQL, providing end-to-end delivery auditability.

---

## 7. Evidence and Verification Artifacts

### 7.1 Automated Integration Test Suite Results (`npm run test:system`)
```
==================================================================
🚀 STUDYFLOW END-TO-END SYSTEM INTEGRATION & COMPLIANCE AUDIT
   Academic Year 2026-27 • Programming Laboratory-III (Next.js)
==================================================================

--- TEST SUITE 1: PostgreSQL & Prisma Relational Schema ---
  ✅ [PASS] User Archetypes Seeded (Found 7 users)
  ✅ [PASS] Admin User Registered (admin@studyflow.edu)
  ✅ [PASS] Member User Registered (member@studyflow.edu)
  ✅ [PASS] Guest User Registered (guest@studyflow.edu)
  ✅ [PASS] Relational Course Ownership (Member has 4 courses)
  ✅ [PASS] Foreign-Key Integrity: Tasks -> Course (7 tasks linked to courses)
  ✅ [PASS] Transactions Relational Model (4 financial transactions recorded)
  ✅ [PASS] Forensic AuditLog Persistence (4 audit logs persisted)

--- TEST SUITE 2: Better Auth JWT Session & Edge RBAC ---
  ✅ [PASS] Cryptographic HS256 Token Generation 
  ✅ [PASS] Edge Middleware JWT Signature Verification (Role: MEMBER)
  ✅ [PASS] Cryptographic Anti-Tampering Rejection 

--- TEST SUITE 3: Shared Zod Schema Validation ---
  ✅ [PASS] Zod Valid Input Conformance 
  ✅ [PASS] Zod Field Constraint: Title Min Length 
  ✅ [PASS] Zod Field Constraint: Estimated Minutes Upper Bound 

--- TEST SUITE 4: Mongoose & MongoDB Object Database ---
  ✅ [PASS] Mongoose MongoDB Connection Established
  ✅ [PASS] Mongoose Document Inserted (Doc ID: 6abd6daad0795b4ce8a57365)
  ✅ [PASS] Mongoose Document Query & Lean Retrieval 

--- TEST SUITE 5: Resend Email & Webhook State Lifecycle ---
  ✅ [PASS] Transactional Email Log Created (msg_audit_test_1790799274586)
  ✅ [PASS] Resend Webhook 'email.delivered' State Transition 

==================================================================
🏁 AUDIT COMPLETION SUMMARY: 19 / 19 TESTS PASSED (100% SUCCESS)
==================================================================
```

### 7.2 Database Seeding Verification Summary (`npm run db:reset`)
```
==================================================
📊 PostgreSQL Database Verification Summary
==================================================
- Users:               7 (1 Admin, 5 Members, 1 Guest)
- Courses:             4 Academic Modules
- Study Tasks:         7 Relational Deliverables
- Academic Goals:      3 Term Benchmarks
- Study Sessions:      6 Focus Intervals
- Transactions:        4 Credit Allocations
- Audit Logs:          4 Forensic Records
- Email Delivery Logs: 3 Transactional Logs
==================================================
✅ Database reset & seeding pipeline completed successfully!
```

---

## 8. Conclusion

The StudyFlow system architecture successfully couples Next.js App Router full-stack capabilities with dual-database persistence, Edge-evaluated session authorization, and an end-to-end transactional notification pipeline. By fulfilling every requirement of Assignment 2 with authentic execution evidence, the platform provides a resilient foundation for student productivity.
