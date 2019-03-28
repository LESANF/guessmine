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

  // Painting

  const modeBtn = document.getElementById("paintMode");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const colors = document.getElementsByClassName("color");

  canvas.width = 700;
  canvas.height = 700;

  let painting = false,
    filling = false,
    x,
    y;

  context.lineWidth = 2.5;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#000000";

  function onMouseMove(event) {
    x = event.offsetX;
    y = event.offsetY;
    if (!filling) {
      if (!painting) {
        context.beginPath();
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
        context.stroke();
      }
    }
  }

  function startPainting() {
    painting = true;
  }
  function stopPainting() {
    painting = false;
  }

  function startFilling() {
    filling = true;
  }
  function stopFilling() {
    filling = false;
  }

  function onModeClick() {
    if (filling === true) {
      modeBtn.innerText = "Fill";
      stopFilling();
    } else {
      modeBtn.innerText = "Paint";
      startFilling();
    }
  }

  function onCanvasClick() {
    if (filling) {
      context.closePath();
      context.beginPath();
      context.fillStyle = context.strokeStyle;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function onColorClick(e) {
    const style = e.target.style;
    context.strokeStyle = style.backgroundColor;
  }

  Array.from(colors).forEach(color =>
    color.addEventListener("click", onColorClick, false)
  );

  if (modeBtn) {
    modeBtn.addEventListener("click", onModeClick);
  }
  if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("mousedown", startPainting, false);
    canvas.addEventListener("mouseup", stopPainting, false);
    canvas.addEventListener("mouseleave", stopPainting, false);
    canvas.addEventListener("click", onCanvasClick, false);
  }
})();
