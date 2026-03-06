import axiosInstance from "./axiosInstance";

const createRoom = async (displayName: string, captchaToken: string) => {
	const res = await axiosInstance.post(
		"/api/room/create",
		{
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

export default createRoom;
