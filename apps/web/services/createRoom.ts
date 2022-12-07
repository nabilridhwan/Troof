import axiosInstance from "../utils/axiosInstance";

export const createRoom = async (displayName: string) => {
	const res = await axiosInstance.post("/api/room/create", {
		display_name: displayName,
	});

	return res;
};
