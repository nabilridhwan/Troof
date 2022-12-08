import axios, { Axios } from "axios";

const tenorAxiosInstance: Axios = axios.create({
	baseURL: "https://tenor.googleapis.com/",
	params: {
		key: process.env.NEXT_PUBLIC_TENOR_API_KEY,
	},
});

export default tenorAxiosInstance;
