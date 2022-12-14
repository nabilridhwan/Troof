/** @format */

import {
	ClientToServerEvents,
	DisconnectedRoomObject,
	EVENTS,
	MESSAGE_EVENTS,
	PlayerIDObject,
	Room,
	RoomIDObject,
	ServerToClientEvents,
	Status,
	StatusChangeObject,
	SystemMessage,
} from "@troof/socket";
import { Server, Socket } from "socket.io";
import ChatModel from "../model/chat";
import PlayerModel from "../model/player";
import RoomModel from "../model/room";

import { logger } from "@troof/logger";

const roomHandler = (
	io: Server<ClientToServerEvents, ServerToClientEvents>,
	socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
	logger.info("Registered room handler");

	const joinRoomHandler = async (obj: RoomIDObject) => {
		// Make the socket join the room ID
		socket.join(obj.room_id);

		// Find all the players in the room
		const players = PlayerModel.getPlayersInRoom(obj.room_id);

		// Fetch the game so we can broadcast the status
		const room = RoomModel.getRoom({ room_id: obj.room_id });

		if (!room) return;

		// Wait for all promises to complete
		const [playersInRoom, roomData] = await Promise.all([players, room]);

		// Broadcast back the room, updating the players
		io.to(obj.room_id).emit(EVENTS.PLAYERS_UPDATE, playersInRoom);

		// Broadcast back the room, updating the game status
		io.to(obj.room_id).emit(EVENTS.GAME_UPDATE, {
			...(roomData as Room),
		});
	};

	const disconnectedHandler = async (obj: DisconnectedRoomObject) => {
		logger.warn(
			`Disconnected received from ${obj.player_id}. Method not implemented!`
		);

		// try {
		// 	// The method below returns the remaining players in the room (after removing)
		// 	const players = await RoomModel.removePlayerFromRoom(
		// 		obj.room_id,
		// 		obj.player_id
		// 	);

		// 	// Broadcast back to each room the latest players
		// 	io.to(obj.room_id).emit(EVENTS.PLAYERS_UPDATE, players);
		// } catch (error) {
		// 	logger.info(
		// 		"Cannot remove player from room. Maybe they're disconnected already!"
		// 	);
		// }
	};

	const statusChangeHandler = async (obj: StatusChangeObject) => {
		logger.info(`Status changed to ${obj.status} received for ${obj.room_id}`);

		const room = await RoomModel.updateRoomStatus(obj.room_id, obj.status);

		// Broadcast to the room that the game has started
		io.to(obj.room_id).emit(EVENTS.GAME_UPDATE, {
			...room,
		});
	};

	const startGameHandler = async (obj: RoomIDObject) => {
		logger.info(`Start game received for ${obj.room_id}`);

		// Update status
		const room = await RoomModel.updateRoomStatus(obj.room_id, Status.In_Game);

		// Broadcast to the room that the game has started
		io.to(obj.room_id).emit(EVENTS.GAME_UPDATE, {
			...room,
		});
	};

	const changeUserDisplayName = async (
		obj: Parameters<ClientToServerEvents[EVENTS.CHANGE_NAME]>[0]
	) => {
		logger.info(`Change name received for ${obj.player_id} ${obj.room_id}`);

		// ! Check if the player is the current player
		if (socket.data.player_id !== obj.player_id) {
			logger.error(
				`Can't change name: Player ${socket.data.player_id} is not the player who sent the request ${obj.player_id}`
			);
			return;
		}

		// Change the users's name
		await PlayerModel.updatePlayerName(obj.player_id, obj.new_name);

		// Get all the players in the room
		const players = await PlayerModel.getPlayersInRoom(obj.room_id);

		// Broadcast back to the room a system message
		const systemMessageToSend: SystemMessage = {
			message: `${obj?.display_name} has changed their name to ${obj.new_name}`,
			room_id: obj.room_id,
			display_name: "",
			reply_to: null,
			created_at: new Date(),
			type: "system",
		};

		// Broadcast back to the room the latest players
		io.to(obj.room_id).emit(EVENTS.PLAYERS_UPDATE, players);

		socket.broadcast
			.to(obj.room_id)
			.emit(MESSAGE_EVENTS.MESSAGE_SYSTEM, systemMessageToSend);

		// Write to database
		ChatModel.pushSystemMessage(systemMessageToSend);
	};

	const transferPartyLeaderHandler = async (
		obj: RoomIDObject & PlayerIDObject
	) => {
		const playerWhoSentTheRequest = await PlayerModel.getPlayer({
			player_id: socket.data.player_id,
		});

		if (!playerWhoSentTheRequest) {
			logger.error("Player who sent the request is not in the database");
			return;
		}

		// ! Check if the player is the current player
		if (!playerWhoSentTheRequest.is_party_leader) {
			logger.error(
				`Can't update party leader: Player ${socket.data.player_id} is not the party leader.`
			);
			return;
		}

		// Update the room leader
		const p = await RoomModel.updateRoomLeader(obj.room_id, obj.player_id);

		io.to(obj.room_id).emit(EVENTS.PLAYERS_UPDATE, p.player);
	};

	const getSelfInfo = async (obj: PlayerIDObject) => {
		logger.info(`Get self info received for ${obj.player_id}`);
		const playerWhoSentTheRequest = await PlayerModel.getPlayer({
			player_id: socket.data.player_id,
		});

		if (!playerWhoSentTheRequest) {
			logger.error("Player who sent the request is not in the database");
			return;
		}

		// ! Check if the player is the current player
		if (socket.data.player_id !== obj.player_id) {
			logger.error(
				`Can't get private info: Player ${socket.data.player_id} is not ${obj.player_id}`
			);
			return;
		}

		const p = await PlayerModel.getPlayer({
			player_id: obj.player_id,
		});

		if (!p) {
			logger.error(`[${EVENTS.SELF_INFO}] Player not found`);
			return;
		}

		socket.emit(EVENTS.SELF_INFO, p);
	};

	socket.on(EVENTS.GAME_UPDATE, statusChangeHandler);
	socket.on(EVENTS.DISCONNECTED, disconnectedHandler);
	socket.on(EVENTS.JOIN_ROOM, joinRoomHandler);
	socket.on(EVENTS.START_GAME, startGameHandler);
	socket.on(EVENTS.CHANGE_NAME, changeUserDisplayName);
	socket.on(EVENTS.TRANSFER_PARTY_LEADER, transferPartyLeaderHandler);
	socket.on(EVENTS.SELF_INFO, getSelfInfo);
};

export default roomHandler;
