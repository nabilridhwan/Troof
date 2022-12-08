declare const joinRoom: (roomId: string, displayName: string) => Promise<import("axios").AxiosResponse<any, any>>;
export default joinRoom;
