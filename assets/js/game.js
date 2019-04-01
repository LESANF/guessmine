import { getSocket } from "./sockets";
import { enableCanvas, disableCanvas } from "./paint";
import { lockChat } from "./chat";

const gameNotifications = document.getElementById("gameNotifications");
const status = gameNotifications.querySelector(".status");
const clock = gameNotifications.querySelector(".clock");

let timeRemaining = 30;
let clockInterval = null;

function countBack() {
  clock.innerText = `00:${
    timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining
  }`;
  timeRemaining--;
}

function startClock() {
  if (clockInterval === null) {
    timeRemaining = 30;
    countBack();
    clockInterval = setInterval(countBack, 1000);
  }
}

function stopClock() {
  clearInterval(clockInterval);
  clockInterval = null;
}

function updateNotifications(text) {
  if (gameNotifications) {
    status.innerText = text;
  }
}

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
    startClock();
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      getSocket().emit(socketEvents.gameFinished);
      disableCanvas();
      stopClock();
    }, 30000);
  };
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.chosenLeader, onChosenLeader);
}

function subscribeToGameFinished() {
  const onGameFinished = () => {
    stopClock();
    updateNotifications("Game is finished");
  };
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.gameFinished, onGameFinished);
}

export default {
  subscribeToGameStarting,
  subscribeToGameStarted,
  subscribeToGamePong,
  subscribeToLeaderChosen,
  subscribeToGameFinished
};
