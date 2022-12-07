"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameType = exports.Action = exports.Status = exports.TRUTH_OR_DARE_GAME = exports.MESSAGE_EVENTS = exports.EVENTS = void 0;
var EVENTS;
(function (EVENTS) {
    EVENTS["JOIN_ROOM"] = "join_room";
    EVENTS["PLAYERS_UPDATE"] = "event:players_update";
    EVENTS["DISCONNECTED"] = "disconnected";
    EVENTS["GAME_UPDATE"] = "event:game_update";
    EVENTS["START_GAME"] = "start_game";
    EVENTS["LEFT_GAME"] = "left_game";
    EVENTS["CHANGE_NAME"] = "change_name";
})(EVENTS = exports.EVENTS || (exports.EVENTS = {}));
var MESSAGE_EVENTS;
(function (MESSAGE_EVENTS) {
    MESSAGE_EVENTS["LATEST_MESSAGES"] = "event:latest_messages";
    MESSAGE_EVENTS["MESSAGE_NEW"] = "message:new";
    MESSAGE_EVENTS["MESSAGE_ANSWER"] = "message:answer";
    MESSAGE_EVENTS["MESSAGE_REACTION"] = "message:reaction";
    MESSAGE_EVENTS["MESSAGE_UPDATE"] = "message:update";
    MESSAGE_EVENTS["MESSAGE_DELETE"] = "message:delete";
    MESSAGE_EVENTS["MESSAGE_SYSTEM"] = "message:system";
    MESSAGE_EVENTS["IS_TYPING"] = "is_typing";
    MESSAGE_EVENTS["JOIN"] = "join";
})(MESSAGE_EVENTS = exports.MESSAGE_EVENTS || (exports.MESSAGE_EVENTS = {}));
var TRUTH_OR_DARE_GAME;
(function (TRUTH_OR_DARE_GAME) {
    TRUTH_OR_DARE_GAME["INCOMING_DATA"] = "incoming_data";
    TRUTH_OR_DARE_GAME["SELECT_DARE"] = "select_dare";
    TRUTH_OR_DARE_GAME["SELECT_TRUTH"] = "select_truth";
    TRUTH_OR_DARE_GAME["JOINED"] = "truth_or_dare_joined";
    TRUTH_OR_DARE_GAME["CONTINUE"] = "continue";
    TRUTH_OR_DARE_GAME["LEAVE_GAME"] = "leave_game";
})(TRUTH_OR_DARE_GAME = exports.TRUTH_OR_DARE_GAME || (exports.TRUTH_OR_DARE_GAME = {}));
var Status;
(function (Status) {
    Status["In_Lobby"] = "in_lobby";
    Status["In_Game"] = "in_game";
    Status["Game_Over"] = "game_over";
})(Status = exports.Status || (exports.Status = {}));
var Action;
(function (Action) {
    Action["Waiting_For_Selection"] = "waiting_for_selection";
    Action["Truth"] = "truth";
    Action["Dare"] = "dare";
})(Action = exports.Action || (exports.Action = {}));
var GameType;
(function (GameType) {
    GameType[GameType["Truth_Or_Dare"] = 1] = "Truth_Or_Dare";
})(GameType = exports.GameType || (exports.GameType = {}));
