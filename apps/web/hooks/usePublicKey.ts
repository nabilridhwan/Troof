import { useState } from "react";

const usePublicKey = () => {
	const [publicKey, setPublicKey] = useState<string | null>(null);

	return {
		publicKey,
		setPublicKey,
	};
};

export default usePublicKey;
