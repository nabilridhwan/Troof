/** @format */

import { Action, Log, Player, TRUTH_OR_DARE_EVENTS } from "@troof/socket";
import { useContext, useEffect, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";

interface UseTruthOrDareOptions {
	room_id: string;
	initialCurrentPlayer?: Partial<Player>;
	initialText?: string;
	initialAction?: Action;
}

export function useTruthOrDare({
	room_id,
	initialCurrentPlayer,
	initialText,
	initialAction,
}: UseTruthOrDareOptions) {
	const socket = useContext(SocketProviderContext);

	const [isLoadingState, setLoadingState] = useState<boolean>(false);
	const [currentPlayer, setCurrentPlayer] = useState<Partial<Player>>(
		initialCurrentPlayer ?? {}
	);
	const [text, setText] = useState<string>(initialText ?? "");
	const [action, setAction] = useState<Action>(
		initialAction ?? Action.Waiting_For_Selection
	);

	useEffect(() => {
		if (!socket) return;

		socket.on(TRUTH_OR_DARE_EVENTS.CONTINUE, (log: Log, player: Player) => {
			setCurrentPlayer(player);
			setText("");
			setAction(log.action as Action);
			setLoadingState(false);
		});

		socket.on(
			TRUTH_OR_DARE_EVENTS.INCOMING_DATA,
			(log: Log, player: Player) => {
				setText(log.data);
				setCurrentPlayer(player ?? {});
				setAction(
					(log.action as Action) ?? (Action.Waiting_For_Selection as Action)
				);
				setLoadingState(false);
			}
		);
	}, [socket]);

	const selectTruth = () => {
		setLoadingState(true);
		if (!socket) return;
		socket.emit(TRUTH_OR_DARE_EVENTS.SELECT_TRUTH, { room_id });
	};

	const selectDare = () => {
		if (!socket) return;
		setLoadingState(true);
		socket.emit(TRUTH_OR_DARE_EVENTS.SELECT_DARE, { room_id });
	};

	const handleContinue = () => {
		if (!socket) return;
		setLoadingState(true);
		socket.emit(TRUTH_OR_DARE_EVENTS.CONTINUE, { room_id });
	};

	return {
		isLoadingState,
		currentPlayer,
		text,
		action,
		selectTruth,
		selectDare,
		handleContinue,
	};
}
