import { getSocket } from "./sockets";
import { enableCanvas, disableCanvas } from "./paint";
import { lockChat } from "./chat";

const gameNotifications = document.getElementById("gameNotifications");

const updateNotifications = text => {
  if (gameNotifications) {
    gameNotifications.innerText = text;
  }
};

function subscribeToGamePong() {
  const onGamePong = ({ inProgress }) =>
    updateNotifications(
      inProgress ? "Game in progress" : "Game will start soon!"
    );
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.pong, onGamePong);
}

function subscribeToGameStarting() {
  const onGameStarting = () => updateNotifications("Game will start soon!");
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.starting, onGameStarting);
}

function subscribeToGameStarted() {
  const onGameStarted = () => {
    updateNotifications("Game stared!");
    disableCanvas();
  };
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.started, onGameStarted);
}

function subscribeToLeaderChosen() {
  const onChosenLeader = ({ word }) => {
    updateNotifications(`You're the painter, your word is ${word}`);
    enableCanvas();
    lockChat();
  };
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.chosenLeader, onChosenLeader);
}

export default {
  subscribeToGameStarting,
  subscribeToGameStarted,
  subscribeToGamePong,
  subscribeToLeaderChosen
};
