import axios, { Axios } from "axios";

const axiosInstance: Axios = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVICES_URL,
});

export default axiosInstance;
