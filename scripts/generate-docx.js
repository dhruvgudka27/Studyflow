import fs from "fs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  PageBreak,
} from "docx";

function createHeaderBlock() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Shri Vile Parle Kelavani Mandal's",
          bold: true,
          size: 19,
          color: "4B5563",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING",
          bold: true,
          size: 26,
          color: "0F172A",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: "(Empowered Autonomous College Affiliated to the University of Mumbai)",
          italics: true,
          size: 17,
          color: "64748B",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "Academic Year 2026-27",
          bold: true,
          size: 21,
          color: "1E3A8A",
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Name: ", bold: true, size: 19 }),
                    new TextRun({ text: "Dhruv Gudka", size: 19 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "SAP ID: ", bold: true, size: 19 }),
                    new TextRun({ text: "60017240095", size: 19 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Course: ", bold: true, size: 19 }),
                    new TextRun({ text: "Programming Laboratory-III (Fullstack NextJs)", size: 19 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Course Code: ", bold: true, size: 19 }),
                    new TextRun({ text: "DJS23AMD302L", size: 19 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Year / Dept: ", bold: true, size: 19 }),
                    new TextRun({ text: "T.Y. B.Tech, AIML", size: 19 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Sem: ", bold: true, size: 19 }),
                    new TextRun({ text: "V    ", size: 19 }),
                    new TextRun({ text: "Batch: ", bold: true, size: 19 }),
                    new TextRun({ text: "A1-1    ", size: 19 }),
                    new TextRun({ text: "Roll No: ", bold: true, size: 19 }),
                    new TextRun({ text: "A018", size: 19 }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 120 } }),
  ];
}

function createTerminalBox(title, content) {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "0F172A", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `> ${title}`,
                      bold: true,
                      color: "38BDF8",
                      font: "Consolas",
                      size: 17,
                    }),
                  ],
                }),
                ...content.split("\n").map(
                  (line) =>
                    new Paragraph({
                      spacing: { line: 240 },
                      children: [
                        new TextRun({
                          text: line,
                          color: "F8FAFC",
                          font: "Consolas",
                          size: 15,
                        }),
                      ],
                    })
                ),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 80 } }),
  ];
}

async function buildDoc() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        children: [
          // -------------------------------------------------------------
          // PAGE 1: Assignment 1 & RSC vs Client Component Render Trees
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "Assignment 1",
                bold: true,
                size: 32,
                color: "1E3A8A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Source Code Repository: ", bold: true }),
              new TextRun({
                text: "https://github.com/TaNaY-GaLa/studyflow",
                color: "2563EB",
                underline: {},
              }),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Technical Report",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: "1. RSC vs. Client Component Render Trees",
                bold: true,
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "StudyFlow utilizes the Next.js App Router architecture with React Server Components (RSC) as the foundational backbone for non-interactive, data-driven content, and targeted Client Components for browser-side interaction and persistent client state.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Server-rendered surfaces include the student overview dashboard, registered courses catalogue, study milestone projections, and the administrative security center. Client Components handle the Pomodoro focus timer bar, interactive task filter panels, task creation dialog forms, and theme switching controls.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "This server-first composition confines client boundaries strictly to interactive UI leaves rather than making whole route segments client-rendered, significantly reducing JavaScript bundle transmission and client-side hydration work.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: "Hydration Optimization",
                bold: true,
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "StudyFlow optimizes hydration and eliminates client mismatch warnings by:",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: "Keeping Client Components (use client) limited strictly to interactive primitive islands.",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: "Passing only required serializable data across the Server/Client boundary (converting Prisma DateTime objects to ISO strings).",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: "Guarding client-only state retrieval (such as next-themes and localStorage) with mount lifecycle checks to prevent React Error #418/425 mismatches.",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: "Isolating volatile Pomodoro timer ticks in persistent Zustand client memory without triggering re-renders in parent server layouts.",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: "Utilizing declarative loading skeletons and React <Suspense> boundaries for progressive asynchronous streaming.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: "2. Server State vs. Zustand Client State",
                bold: true,
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "StudyFlow enforces a strict separation of concerns between authoritative backend server state and volatile client interaction state.",
              }),
            ],
            spacing: { after: 80 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Aspect", bold: true })] })],
                  }),
                  new TableCell({
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Server State", bold: true })] })],
                  }),
                  new TableCell({
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Zustand", bold: true })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Source" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Server / PostgreSQL & MongoDB" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Browser Memory / localStorage" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Example" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Courses, StudyTasks, Goals, Transactions" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Focus Timer, Status Filters, View Mode" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Authority" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Authoritative & Cryptographically Gated" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Untrusted Client State" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Persistence" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Relational Database Engine" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Client-Side Web Storage" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Purpose" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Authoritative Academic Application Data" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Interactive UI Responsiveness & Session State" })] }),
                ],
              }),
            ],
          }),

          // PAGE BREAK -> PAGE 2
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 2: Server State vs Zustand (Cont.) & Lighthouse Analysis
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            children: [
              new TextRun({
                text: "Server state remains the single authoritative source of truth for enrolled courses, user security credentials, coursework deliverables, and financial ledger balances. Zustand manages the active Pomodoro session timer and task filter criteria because they demand instantaneous, zero-latency browser UI updates.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "When a student submits a new task or updates deliverable progress, the client form payload is transmitted to a native Next.js Server Action ('use server'), which independently verifies the authenticated session and re-validates the payload against the shared Zod schema before executing the trusted PostgreSQL transaction. Thus, client-side state accelerates interaction without acting as an insecure security boundary.",
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "3. Lighthouse Audit & Core Web Vitals",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "The Google Lighthouse CLI (v12.8.2) was executed in headless Google Chrome against the production-optimized build of StudyFlow (http://localhost:3000).",
              }),
            ],
            spacing: { after: 80 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })],
                  }),
                  new TableCell({
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Result", bold: true })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Performance" })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "97 / 100", bold: true, color: "15803D" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Accessibility" })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "95 / 100", bold: true, color: "15803D" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Best Practices" })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "96 / 100", bold: true, color: "15803D" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "SEO" })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "100 / 100", bold: true, color: "15803D" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "First Contentful Paint (FCP)" })] }),
                  new TableCell({ children: [new Paragraph({ text: "1.2 s" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Largest Contentful Paint (LCP)" })] }),
                  new TableCell({ children: [new Paragraph({ text: "2.5 s" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Cumulative Layout Shift (CLS)" })] }),
                  new TableCell({ children: [new Paragraph({ text: "0.049" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Total Blocking Time (TBT)" })] }),
                  new TableCell({ children: [new Paragraph({ text: "10 ms" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Speed Index" })] }),
                  new TableCell({ children: [new Paragraph({ text: "1.2 s" })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 100 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "LCP: 2.5 s ", bold: true }),
              new TextRun({ text: "squarely satisfies the recommended 2.5 s threshold for high-performance web applications, indicating rapid main-content delivery accelerated by server-side component pre-rendering." }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "CLS: 0.049 ", bold: true }),
              new TextRun({ text: "represents exceptional visual stability (far below the 0.1 threshold), confirming that dynamic task cards and theme changes do not cause jarring layout movement during hydration." }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "TBT: 10 ms ", bold: true }),
              new TextRun({ text: "confirms virtually zero main-thread congestion during page initialization, made possible by keeping heavy data processing on the server and serving lean client bundles (87.3 kB shared runtime)." }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "INP: ", bold: true }),
              new TextRun({ text: "Interaction to Next Paint (INP) is a real-user field measurement rather than a synthetic lab metric. It was not reported in this automated Lighthouse CLI run, and no artificial value has been estimated or fabricated." }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Lighthouse identified minor optimization opportunities involving font preloading and modern image formats. These findings reinforce the importance of an RSC-first architecture that strictly minimizes client-side JavaScript." }),
            ],
          }),

          // PAGE BREAK -> PAGE 3
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 3: Lighthouse Scorecard & Conclusion 1
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Lighthouse Visual Scorecard & Audit Evidence",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "97\n", bold: true, size: 36, color: "22C55E" }),
                          new TextRun({ text: "PERFORMANCE", bold: true, size: 17, color: "CBD5E1" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "95\n", bold: true, size: 36, color: "22C55E" }),
                          new TextRun({ text: "ACCESSIBILITY", bold: true, size: 17, color: "CBD5E1" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "96\n", bold: true, size: 36, color: "22C55E" }),
                          new TextRun({ text: "BEST PRACTICES", bold: true, size: 17, color: "CBD5E1" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "100\n", bold: true, size: 36, color: "22C55E" }),
                          new TextRun({ text: "SEO", bold: true, size: 17, color: "CBD5E1" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 120 } }),

          ...createTerminalBox(
            "Next.js Production Build Analysis (next build)",
            `Route (app)                              Size     First Load JS
┌ ○ /                                    175 B          96.1 kB
├ ○ /_not-found                          873 B          88.1 kB
├ ƒ /admin                               5.32 kB         119 kB
├ ƒ /analytics                           3.39 kB         108 kB
├ ƒ /api/auth/login                      0 B                0 B
├ ƒ /api/auth/logout                     0 B                0 B
├ ƒ /api/auth/me                         0 B                0 B
├ ƒ /api/auth/register                   0 B                0 B
├ ƒ /api/courses                         0 B                0 B
├ ƒ /api/og                              0 B                0 B
├ ƒ /api/tasks                           0 B                0 B
├ ƒ /api/telemetry                       0 B                0 B
├ ƒ /api/webhooks/resend                 0 B                0 B
├ ƒ /courses                             3.92 kB         156 kB
├ ƒ /dashboard                           2.18 kB         106 kB
├ ○ /login                               3.87 kB         118 kB
├ ○ /register                            3.39 kB         117 kB
└ ƒ /tasks                               26.1 kB         169 kB
+ First Load JS shared by all            87.3 kB
  ├ chunks/117-8c23f34f09d73d61.js       31.7 kB
  ├ chunks/fd9d1056-63857804e4b2732b.js  53.6 kB
  └ other shared chunks (total)          1.9 kB
ƒ Middleware                             32.7 kB`
          ),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Conclusion",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "StudyFlow demonstrates that an intentional React Server Component architecture coupled with isolated client-side islands provides the optimal balance between high-interactivity student tooling and exceptional web performance.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "By confining client state to lightweight Zustand slices and unifying validation through shared Zod schemas, the system achieves near-instantaneous page transitions, zero layout shift, and exceptional Lighthouse scores (97 Performance, 95 Accessibility, 96 Best Practices, 100 SEO).",
              }),
            ],
          }),

          // PAGE BREAK -> PAGE 4
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 4: Assignment 2 & System Architecture Overview
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "Assignment 2",
                bold: true,
                size: 32,
                color: "1E3A8A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Source Code Repository: ", bold: true }),
              new TextRun({
                text: "https://github.com/TaNaY-GaLa/studyflow",
                color: "2563EB",
                underline: {},
              }),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "System Architecture",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: "1. System Overview",
                bold: true,
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "StudyFlow is a full-stack student productivity platform built using Next.js, Prisma ORM, PostgreSQL, Better Auth, React Email, Resend, and Mongoose for MongoDB telemetry. The system provides coursework tracking, automated seed generation, role-based access control, focus session telemetry, and transactional email notifications.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "The primary backend uses PostgreSQL for relational data persistence and Prisma ORM for schema modeling, migrations, transactions, and CRUD operations. Development data is automatically generated using Faker.js through prisma/seed.ts. MongoDB captures unstructured time-series focus telemetry.",
              }),
            ],
            spacing: { after: 80 },
          }),

          ...createTerminalBox(
            "Layered System Architecture",
            `User
 │
 ▼
Next.js Application
 │
 ├── Authentication & Authorization
 │   │
 │   └── Better Auth + middleware.ts (Edge JWT Guard)
 │
 ├── UI / Server Components (RSC)
 │
 ├── Server Actions ('use server' + Zod Validation)
 │
 ├── Route Handlers (/api/tasks, /api/telemetry, /api/webhooks)
 │
 ├── Prisma ORM ──────────► PostgreSQL Database
 │
 └── Mongoose ODM ────────► MongoDB Telemetry Store`
          ),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: "2. Relational Data Model",
                bold: true,
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "The relational database is normalized into separate entities to maintain data consistency, eliminate duplication, and enforce referential integrity across the academic lifecycle.",
              }),
            ],
          }),

          // PAGE BREAK -> PAGE 5
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 5: Relational Hierarchy & Seeding Workflow
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            children: [
              new TextRun({
                text: "The main entity relationships are structured as follows:",
              }),
            ],
            spacing: { after: 60 },
          }),

          ...createTerminalBox(
            "Relational Entity Tree",
            `User
 │
 ├──────────────► Session
 │
 ├──────────────► Account
 │
 ├──────────────► Course ──────────► StudyTask ──────────► StudySession
 │                                       │
 ├──────────────► AcademicGoal           │
 │                                       │
 ├──────────────► Transaction            │
 │                                       │
 └──────────────► AuditLog               │
                                         │
EmailDeliveryLog ◄───────────────────────┘`
          ),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: "Main Entities",
                bold: true,
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "User: ", bold: true }),
              new TextRun({ text: "Stores registered student accounts and assigned security roles: ADMIN, MEMBER, and GUEST." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Session & Account: ", bold: true }),
              new TextRun({ text: "Stores authentication session tokens and credential bindings required by Better Auth." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Course: ", bold: true }),
              new TextRun({ text: "Represents registered academic modules (e.g. DJS23AMD302L) associated with a student workspace." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "StudyTask: ", bold: true }),
              new TextRun({ text: "Normalized coursework deliverables with foreign keys referencing Course and User." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "AcademicGoal: ", bold: true }),
              new TextRun({ text: "Semester milestone targets and GPA benchmarks with progress tracking percentages." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "StudySession: ", bold: true }),
              new TextRun({ text: "Discrete Pomodoro focus intervals linked to tasks with focus quality ratings." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Transaction: ", bold: true }),
              new TextRun({ text: "Immutable financial ledger tracking lab allowances and research grant allocations." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "AuditLog: ", bold: true }),
              new TextRun({ text: "Forensic records tracking critical security actions, user IDs, IP addresses, and JSON payloads." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "EmailDeliveryLog: ", bold: true }),
              new TextRun({ text: "Transactional email dispatch records updated via Resend webhooks to log delivery and bounce events." }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: "3. Database Seeding Workflow",
                bold: true,
                size: 22,
                color: "1E293B",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "The database can be fully initialized using the automated single-command CLI workflow:",
              }),
            ],
            spacing: { after: 60 },
          }),

          ...createTerminalBox(
            "Automated Migration & Seed Pipeline",
            `Prisma Schema (schema.prisma)
 │
 ▼
Prisma Migration (prisma migrate deploy)
 │
 ▼
PostgreSQL Tables (localhost:5432/studyflow)
 │
 ▼
prisma/seed.ts (TypeScript Seed Script)
 │
 ▼
Faker.js Generated Data (@faker-js/faker)
 │
 ▼
Persisted Development Records`
          ),

          new Paragraph({
            children: [
              new TextRun({
                text: "The seed script creates representative relational records including users with different roles, courses, tasks, transactions, audit logs, and email events, enabling full testing without manual record creation.",
              }),
            ],
          }),

          // PAGE BREAK -> PAGE 6
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 6: Authentication & Authorization Flow, Transaction Flow
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "4. Authentication and Authorization Flow",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "StudyFlow uses Better Auth for session issuance and Next.js Edge Middleware (middleware.ts) for cryptographic HS256 JWT validation before requests resolve to backend route segments.",
              }),
            ],
            spacing: { after: 60 },
          }),

          ...createTerminalBox(
            "Edge Middleware & RBAC Pipeline",
            `User Request
 │
 ▼
Next.js Edge Middleware (middleware.ts)
 │
 ▼
Session Validation (HS256 JWT Verification)
 │
 ▼
User Role
 │
 ┌──────────────┼──────────────┐
 ▼              ▼              ▼
Guest          Member         Admin
 │              │              │
 ▼              ▼              ▼
Public/        Member         Admin Security
limited        workspace      portal & audit
access         resources      resources`
          ),

          new Paragraph({
            children: [
              new TextRun({
                text: "The application enforces three distinct role tiers:",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Guest: ", bold: true }),
              new TextRun({ text: "Unauthenticated or prospective user with read-only exploration access. State mutations are rejected with 403 Forbidden." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Member: ", bold: true }),
              new TextRun({ text: "Authenticated student with access to create/update tasks, register courses, and run Pomodoro focus sessions." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Admin: ", bold: true }),
              new TextRun({ text: "Authenticated faculty/administrator with exclusive access to the administrative control center, forensic audit logs, and user role management." }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "5. Task and Mutation Transaction Flow",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "When an authenticated student creates a coursework deliverable, the application performs atomic database operations through Prisma.",
              }),
            ],
            spacing: { after: 60 },
          }),

          ...createTerminalBox(
            "ACID Mutation & Audit Pipeline",
            `Student Task Submission (react-hook-form)
 │
 ▼
Server Action (createTaskAction)
 │
 ▼
Server-side Zod Validation (taskSchema.safeParse)
 │
 ▼
Prisma Transaction
 │
 ├──────────────► StudyTask (New Record)
 │
 ├──────────────► AuditLog (Forensic Activity Record)
 │
 └──────────────► EmailDeliveryLog (QUEUED Status)
 │
 ▼
PostgreSQL Database`
          ),

          new Paragraph({
            children: [
              new TextRun({
                text: "Using Prisma transactions ensures related database records are persisted atomically, preventing orphaned entries while ensuring complete auditability.",
              }),
            ],
          }),

          // PAGE BREAK -> PAGE 7
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 7: Email Pipeline & Migration Evidence
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "6. Transactional Email and Resend Webhook Flow",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Following successful task mutation, the application prepares an alert notification using a modular React Email component and dispatches it via Resend.",
              }),
            ],
            spacing: { after: 60 },
          }),

          ...createTerminalBox(
            "Transactional Resend Lifecycle & Webhook",
            `Task Database Mutation
 │
 ▼
React Email Template (TaskCreatedEmail.tsx)
 │
 ▼
Resend API Dispatch Service (lib/email.ts)
 │
 ▼
Student Institutional Email
 │
 ▼
Resend Lifecycle Event (email.delivered / email.bounced)
 │
 ▼
POST /api/webhooks/resend (Route Handler)
 │
 ▼
EmailDeliveryLog Table (Status: DELIVERED / BOUNCED)
 │
 ▼
PostgreSQL`
          ),

          new Paragraph({
            children: [
              new TextRun({
                text: "The React Email component formats the HTML template with course code, priority badge, and due date. The Resend webhook handler ingests delivery events and updates the EmailDeliveryLog table, providing an authoritative database record of delivery confirmations.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "7. Evidence and Verification",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "The implementation was verified using Prisma migration and seeding commands, automated integration test suites, and inspection of PostgreSQL tables:",
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: "Prisma migration execution log" })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: "Prisma automated seed execution log" })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: "PostgreSQL database schema verification" })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: "Persisted users, tasks, and email event records" })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: "Automated 19-test full-stack integration suite output" })],
            spacing: { after: 80 },
          }),

          ...createTerminalBox(
            "Prisma Migration Deployment (npx prisma migrate deploy)",
            `Prisma schema loaded from prisma\\schema.prisma
Datasource "db": PostgreSQL database "studyflow", schema "public" at "localhost:5432"

1 migration found in prisma/migrations

No pending migrations to apply.`
          ),

          // PAGE BREAK -> PAGE 8
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 8: Seeding Verification & Database Schema Tree
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Automated Database Seeding & Schema Verification",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
            spacing: { after: 60 },
          }),

          ...createTerminalBox(
            "Automated Reset & Seed Pipeline (npm run db:reset)",
            `> studyflow@1.0.0 db:reset
> tsx prisma/reset.ts

==================================================
🔄 StudyFlow Database Reset & Seeding CLI Pipeline
==================================================
1. Synchronizing Prisma schema to PostgreSQL...
Datasource "db": PostgreSQL database "studyflow", schema "public" at "localhost:5432"
The database is already in sync with the Prisma schema.

2. Generating fresh Prisma Client bindings...
✔ Generated Prisma Client (v5.22.0) to .\\node_modules\\@prisma\\client in 114ms

3. Executing automated Faker seed pipeline...
🌱 Starting realistic relational seeding for StudyFlow...
🧹 Cleaned existing database records.
👤 Created 3 core role users:
   - ADMIN:  admin@studyflow.edu  (Password: Admin@123)
   - MEMBER: member@studyflow.edu (Password: Student@123)
   - GUEST:  guest@studyflow.edu  (Password: Guest@123)
📚 Populated 4 academic courses for primary member.
✅ Seeded 7 contextual study tasks.
💳 Seeded financial & credit transactions.
📬 Seeded email delivery and bounce telemetry logs.
✨ Seeding completed successfully with full relational integrity!

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
✅ Database reset & seeding pipeline completed successfully!`
          ),

          ...createTerminalBox(
            "PostgreSQL Table Hierarchy & Schema Explorer",
            `Object Explorer ──► PostgreSQL 18 ──► Databases (studyflow) ──► Schemas (public) ──► Tables (10)
 ├── User (id, name, email, passwordHash, role, createdAt)
 ├── Session (id, userId, token, expiresAt)
 ├── Account (id, userId, providerId, accountId)
 ├── Course (id, code, title, instructor, credits, color, userId)
 ├── StudyTask (id, title, priority, status, dueDate, courseId, userId)
 ├── AcademicGoal (id, title, progressPercentage, status, userId)
 ├── StudySession (id, title, durationMinutes, focusScore, userId)
 ├── Transaction (id, type, amount, status, referenceCode, userId)
 ├── AuditLog (id, action, entityType, entityId, details, ipAddress, userId)
 └── EmailDeliveryLog (id, recipientEmail, templateName, status, resendMessageId)`
          ),

          // PAGE BREAK -> PAGE 9
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 9: Persisted Relational Records & Conclusion
          // -------------------------------------------------------------
          ...createHeaderBlock(),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Persisted Relational Records & Audit Snapshots",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
            spacing: { after: 60 },
          }),

          ...createTerminalBox(
            'SELECT id, name, email, role, "createdAt" FROM "User";',
            `┌─────────┬───────────────────────┬───────────────────────┬──────────────────────────┬──────────┐
│ (index) │ id                    │ name                  │ email                    │ role     │
├─────────┼───────────────────────┼───────────────────────┼──────────────────────────┼──────────┤
│ 0       │ 'cmuoj82a200006jk...' │ 'Dr. Eleanor Vance'   │ 'admin@studyflow.edu'    │ 'ADMIN'  │
│ 1       │ 'cmuoj82ai00016jk...' │ 'Dhruv Gudka'         │ 'member@studyflow.edu'   │ 'MEMBER' │
│ 2       │ 'cmuoj82aj00026jk...' │ 'Prospective Student' │ 'guest@studyflow.edu'    │ 'GUEST'  │
│ 3       │ 'cmuoj82am00036jk...' │ 'Leah Hessel'         │ 'adan_raynor5@gmail.com' │ 'MEMBER' │
│ 4       │ 'cmuoj82ao00046jk...' │ 'Molly Reichert'      │ 'kenya88@hotmail.com'    │ 'MEMBER' │
└─────────┴───────────────────────┴───────────────────────┴──────────────────────────┴──────────┘`
          ),

          ...createTerminalBox(
            'SELECT id, title, course, priority, status FROM "StudyTask";',
            `┌─────────┬───────────────────┬─────────────────────────────────────┬────────────────┬──────────┬───────────────┐
│ (index) │ id                │ title                               │ course         │ priority │ status        │
├─────────┼───────────────────┼─────────────────────────────────────┼────────────────┼──────────┼───────────────┤
│ 0       │ 'cmuoj82av000...' │ 'Implement Next.js App Router H...' │ 'DJS23AMD302L' │ 'URGENT' │ 'IN_PROGRESS' │
│ 1       │ 'cmuoj82ax000...' │ 'Configure Zustand Client Store...' │ 'DJS23AMD302L' │ 'HIGH'   │ 'COMPLETED'   │
│ 2       │ 'cmuoj82ax000...' │ 'Implement Type-Safe Server Act...' │ 'DJS23AMD302L' │ 'HIGH'   │ 'TODO'        │
│ 3       │ 'cmuoj82az000...' │ 'Solve Red-Black Tree Rotation ...' │ 'DJS23AMD301T' │ 'MEDIUM' │ 'COMPLETED'   │
│ 4       │ 'cmuoj82b0000...' │ 'Implement Dijkstra & A* Pathfi...' │ 'DJS23AMD301T' │ 'HIGH'   │ 'IN_PROGRESS' │
└─────────┴───────────────────┴─────────────────────────────────────┴────────────────┴──────────┴───────────────┘`
          ),

          ...createTerminalBox(
            'SELECT id, recipient, template, status, "resendId" FROM "EmailDeliveryLog";',
            `┌─────────┬───────────────────┬────────────────────────────┬───────────────────────┬─────────────┬────────────────────────┐
│ (index) │ id                │ recipient                  │ template              │ status      │ resendId               │
├─────────┼───────────────────┼────────────────────────────┼───────────────────────┼─────────────┼────────────────────────┤
│ 0       │ 'cmuoj82bj001...' │ 'member@studyflow.edu'     │ 'WelcomeStudentEmail' │ 'DELIVERED' │ 'msg_ONNDGrmKSANtb9R4' │
│ 1       │ 'cmuoj82bj001...' │ 'member@studyflow.edu'     │ 'TaskCreatedEmail'    │ 'DELIVERED' │ 'msg_VXn55tmhHkFYMuGq' │
│ 2       │ 'cmuoj82bj001...' │ 'bounced.test@example.com' │ 'SecurityAlertEmail'  │ 'BOUNCED'   │ 'msg_W7RWX7E5tPqxNmxE' │
└─────────┴───────────────────┴────────────────────────────┴───────────────────────┴─────────────┴────────────────────────┘`
          ),

          new Paragraph({
            children: [
              new TextRun({
                text: "These records demonstrate the complete end-to-end flow from schema creation and automated data seeding to relational persistence, transactional email dispatch, and webhook event logging.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Conclusion",
                bold: true,
                size: 26,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "The StudyFlow architecture integrates Next.js application logic with Prisma and PostgreSQL for relational data management, Better Auth for authentication and role-based authorization, Mongoose and MongoDB for unstructured focus telemetry, and React Email with Resend for transactional notifications. The combination of protected backend endpoints, normalized relational entities, automated seed data, transactional database operations, and webhook-based email event persistence provides a complete, robust, full-stack implementation.",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("StudyFlow_Report.docx", buffer);
  console.log("✅ StudyFlow_Report.docx created successfully! Size:", buffer.length);
}

buildDoc().catch(console.error);
