import axiosInstance from "./axiosInstance";

const getServerVersion = async () => {
	const res = await axiosInstance.get("/");
	const sVersion = res.data.data.version;
	return sVersion;
};

export default getServerVersion;
