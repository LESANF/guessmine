import paint from "./paint";
import notifications from "./notifications";
import chat from "./chat";
import game from "./game";

let socket = null;

export const getSocket = () => socket;

const updateSocket = aSocket => (socket = aSocket);

const initSockets = () => {
  chat.subscribeToNewMessage();
  notifications.subscribeToNewUser();
  notifications.subscribeToDisconnect();
  paint.subscribeToMoved();
  paint.subscribeToPainted();
  paint.subscribeToFilled();
  chat.subscribeToPong();
  chat.ping();
  game.subscribeToGameStarting();
  game.subscribeToGameStarted();
  game.subscribeToGamePong();
  game.subscribeToLeaderChosen();
  game.subscribeToGameFinished();
};

export default {
  getSocket,
  updateSocket,
  initSockets
};
