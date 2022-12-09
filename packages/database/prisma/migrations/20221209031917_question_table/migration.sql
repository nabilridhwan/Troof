-- CreateTable
CREATE TABLE " chat" (
    "room_id" VARCHAR NOT NULL,
    "player_id" TEXT,
    "message" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_name" TEXT NOT NULL DEFAULT '',
    "id" VARCHAR NOT NULL DEFAULT uuid_generate_v4(),
    "reply_to" VARCHAR,

    CONSTRAINT " chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE " game" (
    "room_id" VARCHAR NOT NULL DEFAULT '',
    "status" VARCHAR NOT NULL,
    "room_created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),

    CONSTRAINT " game_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "log" (
    "action" VARCHAR NOT NULL,
    "game_room_id" VARCHAR NOT NULL,
    "player_id" VARCHAR NOT NULL DEFAULT uuid_generate_v4(),
    "data" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("game_room_id","player_id","id")
);

-- CreateTable
CREATE TABLE "player" (
    "player_id" VARCHAR NOT NULL DEFAULT uuid_generate_v4(),
    "display_name" VARCHAR NOT NULL,
    "joined_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "game_room_id" VARCHAR NOT NULL,
    "is_party_leader" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "player_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "player_sequence" (
    "game_room_id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "current_player_id" TEXT NOT NULL,

    CONSTRAINT "player_sequence_pkey" PRIMARY KEY ("game_room_id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" VARCHAR NOT NULL DEFAULT uuid_generate_v4(),
    "type" VARCHAR NOT NULL,
    "data" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "batch_name" VARCHAR NOT NULL,
    "under_review" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE " chat" ADD CONSTRAINT " chat_reply_to_fkey" FOREIGN KEY ("reply_to") REFERENCES " chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE " chat" ADD CONSTRAINT " chat_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES " game"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_game_room_id_fkey" FOREIGN KEY ("game_room_id") REFERENCES " game"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_game_room_id_fkey" FOREIGN KEY ("game_room_id") REFERENCES " game"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sequence" ADD CONSTRAINT "player_sequence_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "player"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sequence" ADD CONSTRAINT "player_sequence_game_room_id_fkey" FOREIGN KEY ("game_room_id") REFERENCES " game"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;
