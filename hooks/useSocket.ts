import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../Types";

export function useSocket() {
	const [socket, setSocket] = useState<Socket<
		ServerToClientEvents,
		ClientToServerEvents
	> | null>(null);

	const [effectRan, setEffectRan] = useState(false);

	useEffect(() => {
		console.log("USESOCKET: USEEFFECT RUNNING");
		if (effectRan || socket) return;
		clientSocketInitializer();

		return () => {
			if (socket) {
				console.log("USESOCKET: Disconnecting socket");
				(socket as Socket).disconnect();
			}
		};
	}, [socket, effectRan]);

	const clientSocketInitializer = async () => {
		console.log("USESOCKET: Client Socket Initializer Ran");
		const url = process.env.NEXT_PUBLIC_SERVICES_URL!;
		const s = io(url);
		setSocket(s);
		setEffectRan(true);
	};

	return { socket };
}

// export async function serverSideUseSocket() {
// 	await InitializeSocket();
// 	return { socket };
// }
