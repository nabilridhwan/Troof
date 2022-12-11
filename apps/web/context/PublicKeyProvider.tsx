/** @format */

import { createContext } from "react";
import usePublicKey from "../hooks/usePublicKey";

export type UsePublicKeyType = ReturnType<typeof usePublicKey>;

export const PublicKeyProviderContext = createContext<UsePublicKeyType | null>(
	null
);

interface PublicKeyProviderProps {
	children: React.ReactNode;
}

export const PublicKeyProvider = ({ children }: PublicKeyProviderProps) => {
	const { setPublicKey, publicKey } = usePublicKey();

	return (
		<>
			<PublicKeyProviderContext.Provider value={{ publicKey, setPublicKey }}>
				{children}
			</PublicKeyProviderContext.Provider>
		</>
	);
};
