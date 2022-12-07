import { MessageUpdatedFromServer } from "../Types";

const findMessageById = (id: number, messages: MessageUpdatedFromServer[]) => {
	return messages.find((message) => message.id === id);
};

export default findMessageById;
