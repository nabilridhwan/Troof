import tenorAxiosInstance from "../tenorAxiosInstance";

const getFeaturedGifs = async (limit: number = 30) => {
  const res = await tenorAxiosInstance.get("/v2/featured", {
    params: {
      limit: limit,
      media_filter: "gif,tinygif",
    },
  });
  return res.data;
};

export default getFeaturedGifs;
