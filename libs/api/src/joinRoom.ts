import axiosInstance from "./axiosInstance";

const joinRoom = async (
	roomId: string,
	displayName: string,
	captchaToken: string
) => {
	const res = await axiosInstance.post(
		"/api/room/join",
		{
			room_id: roomId,
			display_name: displayName,
		},
		{
			headers: {
				troof_captcha_token: captchaToken,
			},
		}
	);

	return res;
};

export default joinRoom;
