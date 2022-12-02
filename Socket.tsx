import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./Types";

export default class SocketSingleton {
	private static socket: Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null = null;

	public static getSocket(): Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> {
		if (!this.socket) {
			const url = process.env.NEXT_PUBLIC_SERVICES_URL!;
			this.socket = io(url);
		}
		return this.socket;
	}
}
