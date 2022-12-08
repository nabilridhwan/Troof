import axiosInstance from "./axiosInstance";

const joinRoom = async (roomId: string, displayName: string) => {
	const res = await axiosInstance.post("/api/room/join", {
		room_id: roomId,
		display_name: displayName,
	});

	return res;
};

export default joinRoom;
