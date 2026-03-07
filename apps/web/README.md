<!-- @format -->

# Troof Web (`apps/web`)

Frontend application for Troof: room creation/join flow, game screen, realtime player updates, and chat/reactions.

## What This App Owns

- Landing page and room onboarding (`/`)
- Game UI (`/game/[room_id]`)
- Realtime chat and reactions
- Static content pages (`/manual`, `/privacy`, `/terms`, `/changelog`, `/caution`)
- Browser session state (cookies + localStorage)

## Technologies Used

### Core framework
- `next@16` (App Router)
- `react@18` + `react-dom@18`
- `typescript`

### Styling and UI
- `tailwindcss` (with shared config from `@troof/config`)
- `postcss` + `autoprefixer`
- `@headlessui/react`
- `classnames`
- `@tabler/icons` + `@reacticons/ionicons`

### Motion and interactions
- `framer-motion` (page transitions, animated states)
- `emoji-picker-react` (emoji and reaction picker)
- `react-spinners`

### Networking and realtime
- `axios`
- `socket.io-client`
- Shared API wrappers: `@troof/api`
- Shared socket contracts/types: `@troof/socket`

### Security and user input support
- `reaptcha` (Google reCAPTCHA client)
- `xss`
- `validator`

### Content and utilities
- `gray-matter` + `markdown-it` (changelog/manual content rendering)
- `cookies-next` (token/player/room cookie helpers)
- `nanoid`

### Tooling
- ESLint (`eslint`, `eslint-config-next`)
- Prettier (`prettier-plugin-tailwindcss`)

## Environment Variables (Web-Relevant)

Set these in root `.env` (copy from `../../.env.example`):

- `NEXT_PUBLIC_SERVICES_URL`: backend base URL for API + socket
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: reCAPTCHA site key for create/join forms
- `NEXT_PUBLIC_TENOR_API_KEY`: GIF search/provider key
- `ANALYZE` (optional): bundle analyzer toggle

## Running Locally

From repository root (recommended in this monorepo):

```bash
npm ci
docker compose up -d db
npm run dev
```

From `apps/web` only:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Web Architecture Summary

1. Home page (`HomeClient`) handles create/join flow.
2. Create/join hooks call `@troof/api` and set `player_id`, `room_id`, `token` cookies.
3. Game route (`app/game/[room_id]/page.tsx`) bootstraps room state server-side via API.
4. `GamePageClient` composes providers:
	 - `SocketProvider`
	 - `GameRoomProvider` (RoomContext + GameContext)
5. Hooks consume socket/context and drive live updates (`useGameRoom`, `useTruthOrDare`, `useChat`, `usePlayers`).

## Folder Structure (Web)

```text
apps/web
├── app/
│   ├── layout.tsx                 # root metadata + global shell
│   ├── page.tsx                   # home route wrapper
│   ├── game/[room_id]/page.tsx    # server-side bootstrap + guard + client handoff
│   ├── manual/                    # how-to-play content route
│   ├── changelog/                 # release notes route
│   ├── privacy/                   # policy page
│   ├── terms/                     # terms page
│   └── caution/                   # caution page
├── components/
│   ├── HomeClient.tsx             # landing/create/join orchestration
│   ├── GamePageClient.tsx         # game shell layout + providers
│   ├── game/                      # game-center components
│   ├── home/                      # landing page sections/modals
│   ├── message/                   # chat UI and reaction UI
│   ├── Players.tsx                # players list and controls
│   ├── PageTransitionWrapper.tsx  # route transition wrapper
│   └── ...
├── context/
│   ├── SocketProvider.tsx         # socket instance provider
│   ├── GameRoomProvider.tsx       # aggregates room/game state
│   ├── RoomContext.tsx            # room/player/bootstrap context
│   └── GameContext.tsx            # current game status flags
├── hooks/
│   ├── useGameRoom.ts             # primary game room state sync
│   ├── useTruthOrDare.ts          # turn progression actions/state
│   ├── useChat.ts                 # chat stream + typing indicator
│   ├── usePlayers.ts              # kick/change name/leader transfer actions
│   ├── useSocket.ts               # socket connection lifecycle
│   ├── useCreateRoom.tsx          # create flow + cookie/session handling
│   ├── useJoinRoom.tsx            # join flow + cookie/session handling
│   └── useEmojiReaction.ts        # floating emoji burst state
├── styles/
│   └── globals.css                # global styles + utility classes
├── utils/
│   ├── Cookie.ts                  # cookie helpers (player_id, room_id, token)
│   └── ...
├── public/                        # static assets
├── tailwind.config.js             # extends shared `@troof/config/tailwind.config`
└── postcss.config.js              # extends shared postcss config
```

## Important Contexts and State

### Context providers
- `context/SocketProvider.tsx`: provides socket instance initialized with JWT token.
- `context/RoomContext.tsx`: room id, current player, players list, bootstrap payload.
- `context/GameContext.tsx`: room status and readiness flags.
- `context/GameRoomProvider.tsx`: connects `useGameRoom` output into contexts.

### High-impact hooks (state owners)
- `hooks/useGameRoom.ts`: authoritative client state for players + game status + reconnect behavior.
- `hooks/useTruthOrDare.ts`: truth/dare actions, current turn player, displayed prompt text.
- `hooks/useChat.ts`: messages, typing states, message sending.
- `hooks/usePlayers.ts`: moderation-like actions (remove player, transfer leader, rename).
- `hooks/useSocket.ts`: socket connection lifecycle.

### Session persistence
- Cookie keys are managed in `utils/Cookie.ts`.
- `localStorage` keys used by web flow include:
	- `displayName`
	- `cautionDismissed`

## Where To Change Design, Colors, and UI

### Colors, fonts, and Tailwind tokens
- Main theme tokens: `../../packages/config/tailwind.config.js`
	- `theme.extend.colors` (`primary`, `secondary`, `text`)
	- `theme.extend.fontFamily`
- Web Tailwind entry: `tailwind.config.js` (inherits shared config).

### Global look and utility classes
- `styles/globals.css`
	- Base `html` styling
	- Shared button/input utility classes
	- Global typography and link styles

### Page-level structure and branding
- Root metadata/title/OG image: `app/layout.tsx`
- Landing page layout/content: `components/HomeClient.tsx`
- Game page grid layout: `components/GamePageClient.tsx`

### Motion and transitions
- App-level transitions: `components/PageTransitionWrapper.tsx`
- Route transition overlay in game: `components/GamePageClient.tsx`
- Section and element animations: mostly in `components/home/*`, `components/message/*`, and `components/game/*`

### Chat and reaction UI
- Chat container and input UX: `components/message/ChatBox.tsx`
- Bubbles and message rendering: `components/message/*ChatBubble*.tsx`
- Emoji/GIF pickers: `components/EmojiBar.tsx`, `components/GifPicker.tsx`

## Future Maintenance Guide

### Common tasks and where to edit
- Change create/join behavior:
	- `hooks/useCreateRoom.tsx`
	- `hooks/useJoinRoom.tsx`
	- `components/home/CreateRoomSection.tsx`
	- `components/home/JoinRoomSection.tsx`

- Change room/game state logic:
	- `hooks/useGameRoom.ts`
	- `context/GameRoomProvider.tsx`
	- `components/GamePageClient.tsx`

- Change truth/dare turn behavior UI:
	- `hooks/useTruthOrDare.ts`
	- `components/game/MainItemSection.tsx`

- Change players panel behavior:
	- `components/Players.tsx`
	- `hooks/usePlayers.ts`

- Change chat behavior:
	- `hooks/useChat.ts`
	- `components/message/ChatBox.tsx`

- Change API integration points:
	- `@troof/api` package usage across hooks/components
	- game bootstrap route: `app/game/[room_id]/page.tsx`

### Contracts and compatibility
- Socket event names/types come from `@troof/socket`.
- If backend socket contract changes, update web listeners/emitters in hooks first.

### Code quality checks
From `apps/web`:

```bash
npm run lint
npm run build
```

## Notes

- This app depends on backend availability (`NEXT_PUBLIC_SERVICES_URL`).
- Realtime features require a valid token cookie set during create/join flow.
- For full-stack local dev, prefer running from repo root so all workspace packages stay in sync.
