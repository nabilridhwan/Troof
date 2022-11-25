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
		await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/socket`);
		setSocket(io());
	};

	return { socket };
}

// export async function serverSideUseSocket() {
// 	await InitializeSocket();
// 	return { socket };
// }
