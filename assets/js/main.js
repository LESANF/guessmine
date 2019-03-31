import sockets from "./sockets";
const body = document.querySelector("body");
const LOGGED_OUT_CLASS = "loggedOut";
const LOGGED_IN_CLASS = "loggedIn";

const jsLogin = document.querySelector(".jsLogin");
const NICKNAME = "nickname";

let nickname = localStorage.getItem(NICKNAME) || null;

function logIn(nickname) {
  // eslint-disable-next-line no-undef
  sockets.updateSocket(io("/"));
  // eslint-disable-next-line no-undef
  sockets.getSocket().emit(socketEvents.login, { nickname });
  sockets.initSockets();
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

if (nickname !== null) {
  logIn(nickname);
} else {
  if (jsLogin) {
    showLogin();
  }
}
