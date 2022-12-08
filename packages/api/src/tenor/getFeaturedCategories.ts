import tenorAxiosInstance from "../tenorAxiosInstance";

const getFeaturedCategories = async () => {
	const res = await tenorAxiosInstance.get("/v2/categories", {
		params: {
			type: "featured",
		},
	});
	return res.data;
};

export default getFeaturedCategories;
