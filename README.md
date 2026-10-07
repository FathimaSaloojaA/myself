# MYSELF — Digital Emotional Diary

> **MYSELF — Everything I was. Everything I felt. Everything I became.**

MYSELF is a private digital manuscript app where a person can preserve their life through words, memories, emotions, voice, photographs, people, places, moments, and messages to their future self.

---

## Core Philosophy

- **Manuscript Aesthetic**: Deep obsidian backgrounds (`#0A0A0C`), warm parchment typography (*Cormorant Garamond* & *Plus Jakarta Sans*), and ambient gold glows.
- **First-Person Language**: Designed around personal ownership:
  - *"My World"* (Dashboard)
  - *"My Memories"* (Timeline & Grid)
  - *"I want to remember this."* (Memory Creation)
  - *"How I felt."* (Emotional Spectrum)
  - *"About Me."* (Identity & Passcode Lock)
- **15 Core Emotions Spectrum**: Happy, Sad, Peaceful, Angry, Excited, Grateful, Loved, Lonely, Confused, Nostalgic, Hopeful, Afraid, Proud, Calm, Overwhelmed — with intensity sliders (0 - 100%).

---

## High-Level Architecture

```
MYSELF/
├── client/                     # React + Vite + TypeScript + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── components/         # EmotionBadge, MemoryCard, MemoryDetailModal
│   │   ├── layouts/            # AppShell (First-person navigation sidebar)
│   │   ├── pages/              # ManuscriptOpeningPage, MyWorldPage, CreateMemoryPage, MyMemoriesPage, HowIFeltPage, AboutMePage, AuthPage
│   │   ├── services/           # API client (Express backend + Local Manuscript storage fallback)
│   │   ├── store/              # Zustand state (useAuthStore, useMemoryStore)
│   │   ├── types/              # TypeScript interfaces for Memory, User, Emotion
│   │   └── utils/              # Emotion spectrum metadata & colors
└── server/                     # Node.js + Express + TypeScript + Prisma ORM + MongoDB
    ├── prisma/
    │   └── schema.prisma       # User & Memory schemas with MongoDB provider
    └── src/
        ├── controllers/        # authController, memoryController
        ├── middleware/         # authMiddleware (JWT)
        └── routes/             # authRoutes, memoryRoutes
```

---

## Getting Started

### 1. Frontend Client
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000`.
