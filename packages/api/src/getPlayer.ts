import axiosInstance from "./axiosInstance";

const getPlayer = async (player_id: string) => {
	const res = await axiosInstance.get("/api/player", {
		params: {
			player_id,
		},
	});

	return res;
};

export default getPlayer;
