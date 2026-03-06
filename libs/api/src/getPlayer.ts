import axiosInstance from "./axiosInstance";

const getPlayer = async (token: string) => {
	const res = await axiosInstance.get("/api/player", {
		headers: {
			token,
		},
	});

	return res;
};

export default getPlayer;
