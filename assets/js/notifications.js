const body = document.querySelector("body");

const KIND_LEFT = "left";
const KIND_JOINED = "joined";

function fireNotification(content, kind) {
  const notification = document.createElement("div");
  notification.className = "notification";
  if (kind === KIND_JOINED) {
    notification.style.backgroundColor = "#5856d6";
  } else if (kind === KIND_LEFT) {
    notification.style.backgroundColor = "rgb(255, 204, 0)";
  }
  notification.innerText = content;
  body.append(notification);
}

function subscribeToNewUser() {
  const onNewUser = ({ nickname }) => {
    fireNotification(`${nickname} just joined!`, KIND_JOINED);
  };
  socket.on(socketEvents.newUser, onNewUser);
}

function subscribeToDisconnect() {
  const onDisconnected = ({ nickname }) => {
    fireNotification(`${nickname} just left!`, KIND_LEFT);
  };
  socket.on(socketEvents.disconnected, onDisconnected);
}
