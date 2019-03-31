const body = document.querySelector("body");
const jsLogin = document.querySelector(".jsLogin");
const sendMessage = document.querySelector(".sendMessage");

const NICKNAME = "nickname";
const LOGGED_OUT_CLASS = "loggedOut";
const LOGGED_IN_CLASS = "loggedIn";

let nickname = localStorage.getItem(NICKNAME) || null;

let socket = null;

function logIn(nickname) {
  socket = io("/");
  socket.emit(socketEvents.login, { nickname });
  initSockets();
  body.classList.remove(LOGGED_OUT_CLASS);
  body.classList.add(LOGGED_IN_CLASS);
}

function saveUser(payload) {
  nickname = localStorage.setItem(NICKNAME, payload);
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const input = jsLogin.querySelector("input");
  hideLogin();
  saveUser(input.value);
  logIn(input.value);
}

function showLogin() {
  if (jsLogin) {
    body.classList.add(LOGGED_OUT_CLASS);
    jsLogin.addEventListener("submit", handleLoginSubmit);
  }
}

function hideLogin() {
  if (jsLogin) {
    body.classList.remove(LOGGED_OUT_CLASS);
    body.classList.add(LOGGED_IN_CLASS);
    jsLogin.removeEventListener("submit", handleLoginSubmit);
  }
}

function paintPlayers({ sockets }) {
  const players = document.getElementById("players");
  if (players) {
    players.innerHTML = "";
    sockets.forEach(player => {
      const div = document.createElement("div");
      div.innerHTML = `
        <span class="nickname">${player.nickname}:</span>
        <span class="points">${player.points}</span>
      `;
      div.className = "player";
      players.appendChild(div);
    });
  }
}

function ping() {
  socket.emit(socketEvents.ping);
}

function subscribeToPong() {
  socket.on(socketEvents.pong, paintPlayers);
}

function initSockets() {
  subscribeToNewUser();
  subscribeToNewMessage();
  subscribeToDisconnect();
  subscribeToMoved();
  subscribeToPainted();
  subscribeToFilled();
  subscribeToPong();
  ping();
}

if (nickname !== null) {
  logIn(nickname);
} else {
  if (jsLogin) {
    showLogin();
  }
}

if (sendMessage) {
  sendMessage.addEventListener("submit", onMessageSubmit);
}
