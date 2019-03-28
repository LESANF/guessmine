(function() {
  const body = document.querySelector("body");
  const jsLogin = document.querySelector(".jsLogin");
  const sendMessage = document.querySelector(".sendMessage");
  const chatMessages = document.querySelector(".chatMessages");

  const NICKNAME = "nickname";
  const LOGGED_OUT_CLASS = "loggedOut";
  const LOGGED_IN_CLASS = "loggedIn";

  let nickname = localStorage.getItem(NICKNAME) || null;
  let socket = null;

  function logIn(nickname) {
    socket = io("/");
    socket.emit(socketEvents.login, { nickname });
    initSocketSubs();
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
      jsLogin.classList.add(HIDDEN_CLASSNAME);
      jsLogin.removeEventListener("submit", handleLoginSubmit);
    }
  }

  function subscribeToNewUser() {
    const onNewUser = ({ nickname }) => {
      const notification = document.createElement("div");
      notification.innerHTML = `<div class="notification">${nickname} just joined!</div>`;
      body.append(notification);
    };
    socket.on(socketEvents.newUser, onNewUser);
  }

  function addMessage(text, from) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="sender">${from ? from : "Me"}:</span>
      ${text}
    `;
    li.className = `chatMessage ${from ? "" : "mine"}`;
    chatMessages.prepend(li);
  }

  function onMessageSubmit(e) {
    e.preventDefault();
    const input = sendMessage.querySelector("input");
    input.className = "chatMessage";
    const message = input.value;
    input.value = "";
    socket.emit(socketEvents.sendMessage, { message });
    addMessage(message, null);
  }

  function subscribeToNewMessage() {
    const onNewMessage = ({ message, nickname }) =>
      addMessage(message, nickname);
    socket.on(socketEvents.receiveMessage, onNewMessage);
  }

  function initSocketSubs() {
    subscribeToNewUser();
    subscribeToNewMessage();
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
})();
