import { Server, Socket } from "socket.io";
import roomHandler from "../../socket/roomHandler";
import truthOrDareHandler from "../../socket/truthOrDareHandler";

export default function SocketHandler(req: any, res: any) {
	if (res.socket.server.io) {
		console.log("SOCKET ALREADY RUNNING");
	} else {
		console.log("SOCKET NOT RUNNING, CREATING SOCKET");
		const io = new Server(res.socket.server);

		// Create the io
		res.socket.server.io = io;

		// ! Following clean architecture, we have a socket folder that contains all the socket handlers
		const onConnection = (socket: Socket) => {
			roomHandler(io, socket);
			truthOrDareHandler(io, socket);
		};

		io.on("connection", onConnection);
	}

	res.end();
	return;
}
