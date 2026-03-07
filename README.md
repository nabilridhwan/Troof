<p align="center">
  <img src="./docs/troof_promo_new_new.png" width="500" alt="Troof promo" />
</p>

<h1 align="center">Troof</h1>

<p align="center">
  Realtime multiplayer Truth or Dare with private rooms, turn-based gameplay, and live chat.
</p>

## For New Users

### What is Troof?
Troof is a web app for playing Truth or Dare online with friends in private rooms.

It solves the common remote-party problem: "How do we run a smooth game without manual tracking, awkward turn order, or people talking over each other?" Troof handles room setup, player turns, prompts, and in-room chat so people can focus on the game.

### Who is it for?
- Friend groups hosting online game nights
- Communities running lightweight social games in voice/text sessions
- Developers who want a complete reference implementation of a realtime party game stack

### Quick Start (5-10 minutes)
Prerequisites:
- Node.js `>=18`
- npm `>=9` (repo uses `npm@11.9.0`)
- Docker (recommended for local PostgreSQL)

1. Install dependencies from the repository root.

```bash
npm ci
```

2. Configure environment variables.

```bash
cp .env.example .env
```

Update at least:
- `PORT` (backend, usually `4000`)
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET`
- `RECAPTCHA_SECRET`
- `NEXT_PUBLIC_SERVICES_URL` (example: `http://localhost:4000`)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_TENOR_API_KEY`

3. Start the local database.

```bash
docker compose up -d db
```

4. Apply Prisma migrations and generate Prisma Client.

```bash
npx prisma migrate dev --config=./prisma.config.ts
npm run prisma:generate
```

5. Start frontend and backend together.

```bash
npm run dev
```

6. Open the app.
- Web: `http://localhost:3000`
- Services health endpoint: `http://localhost:4000`

### First-use demo
1. Open `http://localhost:3000`.
2. Create a room with a display name.
3. Copy the room code.
4. Open a second browser tab (or incognito window), join with a different display name.
5. Start the game, choose Truth/Dare on your turn, and chat in real time.

## For Future Contributors and Maintainers

### System architecture
Troof is an npm-workspaces Turborepo with a clear split between web, services, and shared packages.

```text
Client (Next.js App Router)
  -> REST (create/join/bootstrap/player/truth/dare)
Services (Express)
  -> JWT auth + input validation + captcha validation
  -> Socket.IO realtime channels (room, game, chat)
  -> Prisma ORM (PostgreSQL)
Database (Postgres)
```

Runtime flow:
1. User creates or joins a room over REST (`/api/room/create` or `/api/room/join`).
2. Backend returns `player_id`, `room_id`, and JWT token.
3. Web stores these in cookies and routes to `/game/[room_id]`.
4. Game page bootstraps state via `GET /api/room/bootstrap`.
5. Client opens authenticated Socket.IO connection using token header.
6. Realtime events drive room updates, turn progression, and chat.

### Project structure

```text
.
├── apps/
│   ├── services/
│   │   ├── index.ts                  # Express + Socket.IO entrypoint
│   │   ├── controllers/              # HTTP controller logic (room/player/truth-dare)
│   │   ├── routers/                  # REST route registration under /api/*
│   │   ├── middleware/               # Request middleware (reCAPTCHA verification)
│   │   ├── socket/                   # Socket.IO event handlers (room/game/chat)
│   │   ├── model/                    # Data-access and game-state model helpers
│   │   └── database/prisma.ts        # Prisma client via @prisma/adapter-pg
│   └── web/
│       ├── app/                      # Next.js App Router pages and routes
│       ├── components/               # UI and game components
│       ├── hooks/                    # App hooks for room/game/chat actions
│       ├── context/                  # React providers for socket/game/room state
│       ├── styles/                   # Styling and Tailwind-related assets
│       └── utils/                    # Cookie and client-side utility helpers
├── packages/
│   ├── api/                          # Shared HTTP client wrappers used by web
│   ├── socket/                       # Shared event names and TypeScript event contracts
│   ├── responses/                    # Standardized API response classes
│   ├── helpers/                      # Shared helpers (room IDs, game utility logic)
│   ├── jwt/                          # JWT helper package
│   ├── logger/                       # Logging package wrappers
│   ├── truth-or-dare/                # Prompt source files + generated truth/dare JSON
│   ├── database/prisma/migrations/   # Prisma migration history
│   └── config/                       # Shared lint/prettier/tailwind/postcss config
├── prisma/
│   └── schema.prisma                 # Database model definitions
├── docker/
│   └── init.sql                      # Database bootstrap SQL (uuid-ossp extension)
├── docker-compose.yml                # Local Postgres service for development
├── turbo.json                        # Turborepo task graph and caching behavior
└── prisma.config.ts                  # Prisma 7 config (schema path, migration path, datasource URL)
```

### Key design decisions and patterns
- Monorepo + shared packages: API contracts, event names, response classes, and helpers are centralized in `packages/*` to prevent drift between frontend and backend.
- Hybrid REST + Socket architecture: REST is used for session and bootstrap flows; Socket.IO is used for low-latency room/game/chat interactions.
- Contract-first realtime events: all socket event names and payload types are declared in `packages/socket/index.ts` and reused by both apps.
- Cookie-based client session: web stores `player_id`, `room_id`, and JWT token in cookies and uses them for room recovery and authenticated socket handshakes.
- Defensive validation: request payloads are validated with Zod in controllers; create/join routes require reCAPTCHA middleware.
- Prisma + PostgreSQL persistence: room, player, sequence, log, and chat state are persisted, so reconnect and bootstrap flows can restore the latest state.

### Core API endpoints (services)
- `GET /` service health plus app/version metadata and truth/dare totals
- `GET /api/room?room_id=...` room existence and status check
- `GET /api/room/bootstrap?room_id=...` authenticated room bootstrap payload
- `POST /api/room/create` create room (requires `troof_captcha_token` header)
- `POST /api/room/join` join room (requires `troof_captcha_token` header)
- `GET /api/player` resolve player from JWT in `token` header
- `GET /api/truth` list truth prompts
- `GET /api/dare` list dare prompts

### Core socket event groups
Source of truth: `packages/socket/index.ts`

- `room:*`: room info, players update, game status, leader transfer, self info
- `truth_or_dare:*`: joined/continue/select truth/select dare/leave game
- `chat:*`: latest messages, new message, replies, reactions, typing state

### Database model overview
Defined in `prisma/schema.prisma`:
- `game`: room lifecycle and current room status
- `player`: player identity, room membership, party leader status, turn index
- `player_sequence`: tracks current turn index for each room
- `log`: turn-by-turn action log
- `chat`: persisted messages and reply relationships
- `question`: question metadata set

### Local development commands
Run from repository root.

- `npm run dev`: run all workspace development servers via Turborepo
- `npm run build:all`: build all apps/packages
- `npm run build:services`: build backend only
- `npm run build:troof`: build frontend only
- `npm run start:all`: run start scripts for all workspaces
- `npm run start:services`: start backend only
- `npm run start:troof`: start frontend only
- `npm run prisma:generate`: generate Prisma client with `prisma.config.ts`
- `npm run prettier`: format repository files

### Practical maintenance map
- Room create/join/bootstrap logic: `apps/services/controllers/room.ts`
- Socket room behavior: `apps/services/socket/roomHandler.ts`
- Turn/game behavior: `apps/services/socket/gameHandler.ts`
- Chat behavior: `apps/services/socket/messageHandler.ts`
- Turn sequencing internals: `apps/services/model/sequence.ts`
- Web game bootstrap page: `apps/web/app/game/[room_id]/page.tsx`
- Shared socket contracts: `packages/socket/index.ts`
- Truth/Dare source content: `packages/truth-or-dare/textfiles/`

## Notes
- `apps/web/README.md` is still the default Next.js template and does not represent this app.
- `docker-compose.yml` currently runs PostgreSQL only; containerized app services are present but commented out.
