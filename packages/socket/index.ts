export enum ROOM_EVENTS {
	// Server → Client: sends the current room details (status, creation time, etc.)
	ROOM_INFO = "room:room_info",

	// Client → Server: client requests to join a specific room by room_id
	JOIN_ROOM = "room:join_room",
	// Bidirectional: client triggers a refresh; server broadcasts the updated player list to all room members
	PLAYERS_UPDATE = "room:players_update",
	// Client → Server: notifies the server that this client has disconnected from a room
	DISCONNECTED = "room:disconnected",
	// Bidirectional: client triggers a status change; server broadcasts the updated room state (e.g. lobby → in-game)
	GAME_UPDATE = "room:game_update",

	// Client → Server: party leader requests the game to start
	START_GAME = "room:start_game",
	// Server → Client: broadcasts to the room when a player has left the game
	LEFT_GAME = "room:left_game",

	// Client → Server: player requests to change their display name
	CHANGE_NAME = "room:change_name",
	// Client → Server: party leader transfers the party leader role to another player
	TRANSFER_PARTY_LEADER = "room:transfer_party_leader",

	// Bidirectional: client requests its own player details; server responds with the Player object
	SELF_INFO = "room:self_info",
}

export enum CHAT_EVENTS {
	// Server → Client: sends the full message history when a client joins the chat room
	LATEST_MESSAGES = "chat:latest_messages",
	// Bidirectional: client sends a new chat message; server broadcasts it to all room members
	MESSAGE_NEW = "chat:message_new",
	// Bidirectional: client sends a reply to an existing message; server broadcasts it
	MESSAGE_ANSWER = "chat:message_answer",
	// Server → Client: broadcasts an updated message when a reaction is added/removed
	MESSAGE_REACTION = "chat:message_reaction",
	// Server → Client: broadcasts the edited content of an existing message
	MESSAGE_UPDATE = "chat:message_update",
	// Server → Client: broadcasts a message deletion to all room members
	MESSAGE_DELETE = "chat:message_delete",
	// Server → Client: server-generated messages (e.g. "Player X joined the room")
	MESSAGE_SYSTEM = "chat:message_system",
	// Bidirectional: client notifies the room it is typing; server broadcasts the typing state to other members
	IS_TYPING = "chat:is_typing",
	// Client → Server: client joins the chat channel for a specific room
	JOIN = "chat:join",
}

export enum TRUTH_OR_DARE_EVENTS {
	// Server → Client: pushes the current turn's log entry and the player whose turn it is
	INCOMING_DATA = "truth_or_dare:incoming_data",
	// Bidirectional: client selects "dare" for their turn; server broadcasts the updated room state
	SELECT_DARE = "truth_or_dare:select_dare",
	// Bidirectional: client selects "truth" for their turn; server broadcasts the updated room state
	SELECT_TRUTH = "truth_or_dare:select_truth",
	// Bidirectional: client signals it has joined an active game session; server broadcasts to the room
	JOINED = "truth_or_dare:joined",
	// Bidirectional: client advances to the next turn; server broadcasts the updated log and next player
	CONTINUE = "truth_or_dare:continue",
	// Bidirectional: client leaves an active game mid-session; server broadcasts the updated room state
	LEAVE_GAME = "truth_or_dare:leave_game",
}

export enum SECURITY_EVENTS {
	// Server → Client: sends the server's public key used for end-to-end encryption of messages
	PUBLIC_KEY = "security:public_key",
}

export enum Status {
	In_Lobby = "in_lobby",
	In_Game = "in_game",
	Game_Over = "game_over",
}

export enum Action {
	Waiting_For_Selection = "waiting_for_selection",
	Truth = "truth",
	Dare = "dare",
}

export enum GameType {
	Truth_Or_Dare = 1,
}

export interface RoomIDObject {
	room_id: string;
}

export interface PlayerIDObject {
	player_id: string;
}

export interface PlayerDisplayNameObject {
	display_name: string;
}

export type DisconnectedRoomObject = RoomIDObject & PlayerIDObject;

export interface StatusChangeObject extends RoomIDObject {
	status: Status;
}

export interface Player {
	player_id: string;
	display_name: string;
	game_room_id: string;
	is_party_leader: boolean;
	joined_at: Date | null;
}

export interface Room {
	room_id: string;
	status: Status | string;
	room_created_at: Date;
}

export interface Log {
	player_id: string;
	game_room_id: string;
	action: Action | string;
	data: string;
	created_at: Date;
}

type MessageTypes = "message" | "answer" | "reaction" | "system" | "reply";

export interface BaseNewMessage extends PlayerDisplayNameObject, RoomIDObject {
	message: string;
	type: MessageTypes | string;
	display_name: string;
	reply_to: string | null;
	created_at: Date;
}

export interface SystemMessage extends BaseNewMessage {
	type: "system";
	created_at: Date;
}

// ID is changed to string for UUID
export interface MessageUpdatedFromServer extends BaseNewMessage {
	id: string;
}

export interface RoomBootstrapState {
	room: Room;
	self: Player;
	players: Player[];
	current_player: Player | null;
	latest_log: Log | null;
	latest_messages: MessageUpdatedFromServer[];
	public_key: string | null;
}

// This interface represents the events that are from server to clients when you use socket.emit/io.emit
export interface ServerToClientEvents {
	[ROOM_EVENTS.ROOM_INFO]: (room: Room) => void;
	[ROOM_EVENTS.PLAYERS_UPDATE]: (players: Player[]) => void;
	[ROOM_EVENTS.GAME_UPDATE]: (room: Room) => void;
	[ROOM_EVENTS.LEFT_GAME]: (playerRemoved: Player) => void;

	[ROOM_EVENTS.SELF_INFO]: (obj: Player) => void;

	[TRUTH_OR_DARE_EVENTS.INCOMING_DATA]: (log: Log, player: Player) => void;

	[TRUTH_OR_DARE_EVENTS.LEAVE_GAME]: (room: Room) => void;
	[TRUTH_OR_DARE_EVENTS.SELECT_TRUTH]: (room: Room) => void;
	[TRUTH_OR_DARE_EVENTS.SELECT_DARE]: (room: Room) => void;
	[TRUTH_OR_DARE_EVENTS.CONTINUE]: (log: Log, player: Player) => void;
	[TRUTH_OR_DARE_EVENTS.JOINED]: (log: Log, player: Player) => void;

	// Messages
	[CHAT_EVENTS.MESSAGE_NEW]: (message: MessageUpdatedFromServer) => void;
	[CHAT_EVENTS.MESSAGE_ANSWER]: (message: MessageUpdatedFromServer) => void;
	[CHAT_EVENTS.MESSAGE_SYSTEM]: (message: SystemMessage) => void;
	[CHAT_EVENTS.LATEST_MESSAGES]: (messages: MessageUpdatedFromServer[]) => void;

	[CHAT_EVENTS.MESSAGE_REACTION]: (message: MessageUpdatedFromServer) => void;

	[CHAT_EVENTS.IS_TYPING]: (
		obj: PlayerDisplayNameObject & { is_typing: boolean }
	) => void;

	[SECURITY_EVENTS.PUBLIC_KEY]: (public_key: string) => void;
}

// This interface represents the events that are from clients to server when you use socket.on/io.on
export interface ClientToServerEvents {
	[ROOM_EVENTS.GAME_UPDATE]: (obj: StatusChangeObject) => void;
	[ROOM_EVENTS.PLAYERS_UPDATE]: (obj: StatusChangeObject) => void;
	[ROOM_EVENTS.DISCONNECTED]: (obj: DisconnectedRoomObject) => void;
	[ROOM_EVENTS.JOIN_ROOM]: (obj: RoomIDObject) => void;
	[ROOM_EVENTS.START_GAME]: (obj: RoomIDObject) => void;

	[ROOM_EVENTS.SELF_INFO]: (obj: PlayerIDObject) => void;

	[ROOM_EVENTS.CHANGE_NAME]: (
		obj: RoomIDObject &
			PlayerIDObject & { display_name: string; new_name: string }
	) => void;

	[ROOM_EVENTS.TRANSFER_PARTY_LEADER]: (
		obj: RoomIDObject & PlayerIDObject
	) => void;

	[TRUTH_OR_DARE_EVENTS.LEAVE_GAME]: (
		obj: RoomIDObject & PlayerIDObject
	) => void;

	[TRUTH_OR_DARE_EVENTS.SELECT_TRUTH]: (obj: RoomIDObject) => void;

	[TRUTH_OR_DARE_EVENTS.SELECT_DARE]: (obj: RoomIDObject) => void;

	[TRUTH_OR_DARE_EVENTS.CONTINUE]: (obj: RoomIDObject) => void;

	[TRUTH_OR_DARE_EVENTS.JOINED]: (obj: RoomIDObject) => void;

	// Messages
	[CHAT_EVENTS.MESSAGE_NEW]: (obj: BaseNewMessage) => void;
	[CHAT_EVENTS.MESSAGE_ANSWER]: (obj: BaseNewMessage) => void;
	[CHAT_EVENTS.JOIN]: (obj: RoomIDObject) => void;

	[CHAT_EVENTS.IS_TYPING]: (
		obj: RoomIDObject & PlayerDisplayNameObject & { is_typing: boolean }
	) => void;
}
