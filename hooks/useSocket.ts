import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../Types";

export function useSocket() {
	const [socket, setSocket] = useState<Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null>(null);

	const [useEffectRan, setUseEffectRan] = useState(false);

	useEffect(() => {
		if (!useEffectRan) {
			clientSocketInitializer();
			setUseEffectRan(true);
		}
	}, [useEffectRan]);

	const clientSocketInitializer = async () => {
		const url = process.env.NEXT_PUBLIC_SERVICES_URL!;
		console.log(`Connecting to socket at ${url}`);
		const s: Socket<ServerToClientEvents, ClientToServerEvents> = io(url);
		setSocket(s);
	};

	return { socket };
}

// export async function serverSideUseSocket() {
// 	await InitializeSocket();
// 	return { socket };
// }
