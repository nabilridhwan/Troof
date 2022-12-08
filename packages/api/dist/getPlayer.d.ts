declare const getPlayer: (player_id: string) => Promise<import("axios").AxiosResponse<any, any>>;
export default getPlayer;
