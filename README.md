<p align="center">
  <img src="./docs/troof_promo_new_new.png" width="500" alt="Troof promo" />
</p>

<h1 align="center">Troof</h1>

<p align="center">
  Multiplayer truth-or-dare with rooms, live turns, and encrypted chat.
</p>

## What this repo is
Troof is a Turborepo monorepo with:
- `apps/web`: Next.js frontend (home, join/create room, game UI)
- `apps/services`: Express + Socket.IO backend (room lifecycle, game loop, chat, security)
- `packages/*`: shared libs used by both apps (API client, socket contracts, helpers, auth, encryption, etc.)

## Current architecture
- Frontend calls backend REST endpoints for create/join/room/player checks.
- Frontend opens a Socket.IO connection using JWT from cookies.
- Backend validates JWT in socket middleware and handles room/game/chat events.
- PostgreSQL (via Prisma) stores rooms, players, logs, chat, and keypairs.
- Chat messages are encrypted client->server with room public key and re-signed/encrypted by server before persistence/broadcast.

## Repository structure
```text
.
├── apps
│   ├── services
│   │   ├── index.ts                    # Express + Socket.IO entrypoint
│   │   ├── controllers/                # REST handlers (room/player/truth/dare)
│   │   ├── routers/                    # /api routes
│   │   ├── socket/                     # socket event handlers (room/game/chat)
│   │   ├── model/                      # DB logic for room/player/chat/sequence
│   │   └── database/prisma.ts          # Prisma client adapter (pg)
│   └── web
│       ├── app/                        # Next.js App Router routes
│       ├── components/                 # UI
│       ├── hooks/                      # realtime/game/chat hooks
│       ├── context/                    # socket/game/public key providers
│       └── utils/Cookie.ts             # player_id/room_id/token cookie helpers
├── packages
│   ├── api/                            # Axios wrappers for backend endpoints
│   ├── socket/                         # Shared socket event names + TypeScript types
│   ├── helpers/                        # Room ID generator + truth/dare utilities
│   ├── encrypt/                        # RSA helpers
│   ├── jwt/                            # JWT helpers
│   ├── responses/                      # Standard API response classes
│   ├── logger/                         # Winston logger
│   ├── config/                         # Shared eslint/tailwind/postcss/prettier config
│   └── truth-or-dare/                  # Source text + generated JSON truth/dare data
├── prisma
│   └── schema.prisma                   # DB schema
├── docker-compose.yml                  # Local postgres service
└── turbo.json                          # Turborepo pipeline
```

## User flow (actual app behavior)
1. User lands on `/` and chooses **Create Room** or **Join Room**.
2. User submits display name (max 20 chars) + reCAPTCHA.
3. Web calls:
   - `POST /api/room/create` or
   - `POST /api/room/join`
4. Backend creates/joins player, returns `player_id`, `room_id`, and JWT token.
5. Web stores `player_id`, `room_id`, `token` in cookies and redirects to `/game/[room_id]`.
6. Game page validates token by calling `GET /api/player`; invalid state redirects home.
7. Client opens socket with token header and emits `truth_or_dare:joined` + `chat:join`.
8. Backend sends players list, game status, room public key, latest chat, and current turn log.
9. During play:
   - current player emits `truth_or_dare:select_truth` or `truth_or_dare:select_dare`
   - clients emit `truth_or_dare:continue` to advance turn
   - chat goes through `chat:message_new` and typing indicators
10. Leaving emits `truth_or_dare:leave_game`; backend updates players and leadership as needed.

## API surface (services)
- `GET /` health + version + truth/dare counts
- `GET /api/room?room_id=...` check room exists and status
- `POST /api/room/create` create room (requires `troof_captcha_token` header)
- `POST /api/room/join` join room (requires `troof_captcha_token` header)
- `GET /api/player` resolve player from JWT header (`token`)
- `GET /api/truth` all truths
- `GET /api/dare` all dares

## Socket events
Source of truth is `packages/socket/index.ts`.

Main groups:
- `room:*` for room membership, player list, status, leader transfer, self info
- `truth_or_dare:*` for turn/game actions
- `chat:*` for chat history, new messages, reactions, typing
- `security:public_key` for per-room public key delivery

## Local development
### Prerequisites
- Node.js `>=18` (repo currently uses npm `11.9.0`)
- Docker (recommended for local Postgres)

### 1) Install dependencies
```bash
npm ci
```

### 2) Configure env
```bash
cp .env.example .env
```
Set at least:
- `PORT` (services port, usually `4000`)
- `DATABASE_URL` (Postgres)
- `JWT_SECRET`
- `RECAPTCHA_SECRET`
- `NEXT_PUBLIC_SERVICES_URL` (e.g. `http://localhost:4000`)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_TENOR_API_KEY`

### 3) Start Postgres
```bash
docker compose up -d db
```

### 4) Generate Prisma client
```bash
npm run prisma:generate
```

### 5) Run apps
```bash
npm run dev
```
This starts all workspace `dev` scripts through Turborepo.

## Build and run commands
From repo root:
- `npm run dev` - run all workspace dev scripts
- `npm run build:all` - build all apps/packages
- `npm run build:services` - build backend only
- `npm run build:troof` - build web only
- `npm run start:all` - run all start scripts (depends on successful build)
- `npm run start:services` - run backend start script
- `npm run start:troof` - run web start script
- `npm run prettier` - format repo

## Data model summary
Defined in `prisma/schema.prisma`:
- `game`: room and status lifecycle
- `player`: players in a room, party leader flag
- `player_sequence`: whose turn is current
- `log`: truth/dare action history per room
- `chat`: persisted messages (including system messages)
- `keys`: per-room RSA keypair used by chat flow
- `question`: truth/dare question data metadata

## Editing guide (for future maintenance)
- Changing game behavior:
  - backend logic: `apps/services/socket/gameHandler.ts`
  - turn sequencing: `apps/services/model/sequence.ts`
- Changing room/lobby behavior:
  - REST create/join/get: `apps/services/controllers/room.ts`
  - realtime room state: `apps/services/socket/roomHandler.ts`
- Changing chat/encryption behavior:
  - backend handler: `apps/services/socket/messageHandler.ts`
  - frontend chat hook: `apps/web/hooks/useChat.ts`
  - crypto helpers: `packages/encrypt`
- Changing event names/contracts:
  - `packages/socket/index.ts` (update both web and services usage)
- Changing truth/dare source data:
  - edit files in `packages/truth-or-dare/textfiles`
  - rebuild package so `output/*.json` is regenerated

## Notes
- Root `apps/web/README.md` is a default Next.js template and does not describe this app.
- `docker-compose.yml` currently starts the database; app services are commented out.
