import axiosInstance from "./axiosInstance";

const getRoomBootstrap = async (token: string, roomId: string) => {
	const res = await axiosInstance.get("/api/room/bootstrap", {
		headers: {
			token,
		},
		params: {
			room_id: roomId,
		},
	});

	return res;
};

export default getRoomBootstrap;
