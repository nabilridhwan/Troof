/** @format */

import { MessageUpdatedFromServer } from "@troof/socket";

const findMessageById = (id: string, messages: MessageUpdatedFromServer[]) => {
	return messages.find((message) => message.id === id);
};

export default findMessageById;
