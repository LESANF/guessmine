const jsLogin = document.querySelector(".jsLogin");

const NICKNAME = "nickname";
const HIDDEN_CLASSNAME = "jsHidden";

let nickname = localStorage.getItem(NICKNAME) || null;
let socket = null;

function logIn(nickname) {
  socket = io("/");
  socket.emit(socketEvents.login, { nickname });
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
    jsLogin.classList.remove(HIDDEN_CLASSNAME);
    jsLogin.addEventListener("submit", handleLoginSubmit);
  }
}

function hideLogin() {
  if (jsLogin) {
    jsLogin.classList.add(HIDDEN_CLASSNAME);
    jsLogin.removeEventListener("submit", handleLoginSubmit);
  }
}

if (nickname) {
  logIn(nickname);
} else {
  if (jsLogin) {
    showLogin();
  }
}

if (socket) {
  const onNewUser = data => {
    console.log(data);
  };
  socket.on(socketEvents.newUser, onNewUser);
}
