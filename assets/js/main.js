(function() {
  const body = document.querySelector("body");
  const jsLogin = document.querySelector(".jsLogin");
  const sendMessage = document.querySelector(".sendMessage");
  const chatMessages = document.querySelector(".chatMessages");

  const NICKNAME = "nickname";
  const LOGGED_OUT_CLASS = "loggedOut";
  const LOGGED_IN_CLASS = "loggedIn";

  const KIND_LEFT = "left";
  const KIND_JOINED = "joined";

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
      jsLogin.classList.add(HIDDEN_CLASSNAME);
      jsLogin.removeEventListener("submit", handleLoginSubmit);
    }
  }

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

  function subscribeToDisconnect() {
    const onDisconnected = ({ nickname }) => {
      fireNotification(`${nickname} just left!`, KIND_LEFT);
    };
    socket.on(socketEvents.disconnected, onDisconnected);
  }

  function initSockets() {
    subscribeToNewUser();
    subscribeToNewMessage();
    subscribeToDisconnect();
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
