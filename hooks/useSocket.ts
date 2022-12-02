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
		if (effectRan) return;
		clientSocketInitializer();
	}, [socket]);

	const clientSocketInitializer = async () => {
		const url = process.env.NEXT_PUBLIC_SERVICES_URL!;
		setSocket(io(url));
		setEffectRan(true);
	};

	return { socket };
}

// export async function serverSideUseSocket() {
// 	await InitializeSocket();
// 	return { socket };
// }
