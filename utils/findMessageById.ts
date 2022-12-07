import { MessageUpdatedFromServer } from "../Types";

const findMessageById = (id: string, messages: MessageUpdatedFromServer[]) => {
	return messages.find((message) => message.id === id);
};

export default findMessageById;
