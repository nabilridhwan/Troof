import axiosInstance from "./axiosInstance";

const createRoom = async (displayName: string) => {
  const res = await axiosInstance.post("/api/room/create", {
    display_name: displayName,
  });

  return res;
};

export default createRoom;
