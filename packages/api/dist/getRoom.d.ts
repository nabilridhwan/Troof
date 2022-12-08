declare const getRoom: (room_id: string) => Promise<import("axios").AxiosResponse<any, any>>;
export default getRoom;
