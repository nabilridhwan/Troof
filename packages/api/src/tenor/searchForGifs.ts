import tenorAxiosInstance from "../tenorAxiosInstance";

const searchForGifs = async (
	query: string,
	limit: number = 30,
	pos: number = 0
) => {
	const res = await tenorAxiosInstance.get("/v2/search", {
		params: {
			q: query,
			limit: limit,
			media_filter: "gif,tinygif",
			pos: pos,
		},
	});
	return res.data;
};

export default searchForGifs;
