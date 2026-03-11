# Troof — Codebase Overview

## What It Is

A party game where players join private rooms and take turns choosing Truth or Dare, with live prompts delivered via Socket.IO.

---

## Monorepo Structure (Turborepo + npm workspaces)

```
apps/
  services/   # Express + Socket.IO backend
  web/         # Next.js 16 frontend
packages/
  api/         # HTTP client for frontend
  database/    # Prisma migrations
  helpers/     # ID generators, profanity filter, truth/dare fetchers
  jwt/         # JWT signing/verification
  logger/      # Winston-based logging
  responses/   # Standard API response classes
  socket/      # Shared socket event definitions & types
prisma/        # PostgreSQL schema
docker-compose.yml  # PostgreSQL + Redis
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Express 5, Socket.IO 4, Prisma 7, Zod |
| Frontend | Next.js 16, React 18, Tailwind CSS, Framer Motion |
| Database | PostgreSQL 16 |
| Scaling | Redis 7 + Socket.IO Redis adapter |
| Auth | JWT in cookies + socket handshake headers |
| Language | TypeScript throughout |

---

## Key Architecture

**Room Creation → Game Flow:**
1. User fills name + reCAPTCHA → `POST /api/room/create`
2. Backend creates a room with a 4-word ID (e.g. `fire-pine-beat-tree`) + JWT
3. Frontend redirects to `/game/[room_id]`, bootstraps state via `GET /api/room/bootstrap`
4. Socket.IO connection established with JWT in handshake
5. Players take turns: select Truth/Dare → prompt fetched from DB → broadcast to room → advance turn

**Turn Sequencing** (`apps/services/model/sequence.ts`):
- Uses a `player_sequence` table with a `version` column for optimistic locking
- `setNextPlayer()` retries up to 3× on version conflict — handles concurrent updates safely
- Players ordered circularly by `turn_index`

**Socket Events** (defined in `packages/socket/`):
- `ROOM_EVENTS` — player list, game status, leader transfer
- `CHAT_EVENTS` — messages, replies, reactions, typing indicators
- `TRUTH_OR_DARE_EVENTS` — turn selection, prompt delivery, game progression

**Auth flow:** reCAPTCHA → JWT issued → stored in cookie → verified in `socketAuthMiddleware` → `socket.data.player_id` set for all handlers

---

## Infrastructure

- Docker Compose spins up Postgres + Redis locally
- Redis adapter enables horizontal scaling of Socket.IO across multiple server instances
- Truth/Dare prompts are seeded from text files into the `question` table

---

## Key File Locations

| Component | Path |
|---|---|
| API Entrypoint | `apps/services/index.ts` |
| Room Controller | `apps/services/controllers/room.ts` |
| Game Handler | `apps/services/socket/gameHandler.ts` |
| Room Handler | `apps/services/socket/roomHandler.ts` |
| Turn Sequencing | `apps/services/model/sequence.ts` |
| Player Model | `apps/services/model/player.ts` |
| Room Model | `apps/services/model/room.ts` |
| Socket Events | `packages/socket/index.ts` |
| JWT Utils | `packages/jwt/index.ts` |
| ID Generators | `packages/helpers/src/files/generators.ts` |
| Database Schema | `prisma/schema.prisma` |
| Game Page | `apps/web/app/game/[room_id]/page.tsx` |
| Socket Auth | `apps/services/middleware/socketAuth.ts` |
| Docker Compose | `docker-compose.yml` |
