import { getSocket } from "./sockets";

const body = document.querySelector("body");

const KIND_LEFT = "left";
const KIND_JOINED = "joined";
const KIND_STARTING = "starting";

export function fireNotification(content, kind) {
  const notification = document.createElement("div");
  notification.className = "notification";
  if (kind === KIND_JOINED) {
    notification.style.backgroundColor = "#5856d6";
  } else if (kind === KIND_LEFT) {
    notification.style.backgroundColor = "rgb(255, 204, 0)";
  } else if (kind === KIND_STARTING) {
    notification.style.right = 0;
    notification.style.backgroundColor = "#2ecc71";
  }
  notification.innerText = content;
  body.append(notification);
}

function subscribeToNewUser() {
  const onNewUser = ({ nickname }) => {
    fireNotification(`${nickname} just joined!`, KIND_JOINED);
  };
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.newUser, onNewUser);
}

function subscribeToDisconnect() {
  const onDisconnected = ({ nickname }) => {
    fireNotification(`${nickname} just left!`, KIND_LEFT);
  };
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.disconnected, onDisconnected);
}

export default {
  subscribeToNewUser,
  subscribeToDisconnect
};
