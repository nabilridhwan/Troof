import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
	const [socket, setSocket] = useState<Socket | null>(null);

	const [useEffectRan, setUseEffectRan] = useState(false);

	useEffect(() => {
		if (!useEffectRan) {
			clientSocketInitializer();
			setUseEffectRan(true);
		}
	}, [useEffectRan]);

	const clientSocketInitializer = async () => {
		// TODO: initialize with backend url
		const url = `http://localhost:3030`;
		console.log(`Connecting to socket at ${url}`);
		setSocket(io(url));
	};

	return { socket };
}

// export async function serverSideUseSocket() {
// 	await InitializeSocket();
// 	return { socket };
// }
