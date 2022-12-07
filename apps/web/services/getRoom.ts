import axiosInstance from "../utils/axiosInstance";

const getRoom = async (room_id: string) => {
	const res = await axiosInstance.get("/api/room", {
		params: {
			room_id,
		},
	});

	return res;
};

export default getRoom;
