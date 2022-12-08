/** @format */

import { createContext } from "react";
import { useSocket } from "../hooks/useSocket";

type UseSocketType = ReturnType<typeof useSocket>["socket"];

export const SocketProviderContext = createContext<UseSocketType | null>(null);

interface SocketProviderProps {
	children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
	const { socket } = useSocket();
	return (
		<>
			<SocketProviderContext.Provider value={socket}>
				{children}
			</SocketProviderContext.Provider>
		</>
	);
};
