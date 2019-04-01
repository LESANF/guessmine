import { getSocket } from "./sockets";

const sendMessage = document.querySelector(".sendMessage");
const chatMessages = document.querySelector(".chatMessages");

function addMessage(text, from) {
  const li = document.createElement("li");
  li.innerHTML = `
        <span class="sender">${from ? from : "Me"}:</span>
        ${text}
      `;
  li.className = `chatMessage ${from ? "" : "mine"}`;
  chatMessages.append(li);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function onMessageSubmit(e) {
  e.preventDefault();
  const input = sendMessage.querySelector("input");
  input.className = "chatMessage";
  const message = input.value;
  input.value = "";
  // eslint-disable-next-line no-undef
  getSocket().emit(socketEvents.sendMessage, { message });
  addMessage(message, null);
}

function subscribeToNewMessage() {
  const onNewMessage = ({ message, nickname }) => addMessage(message, nickname);
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.receiveMessage, onNewMessage);
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
  // eslint-disable-next-line no-undef
  getSocket().emit(socketEvents.ping);
}

function subscribeToPong() {
  // eslint-disable-next-line no-undef
  getSocket().on(socketEvents.pong, paintPlayers);
}

export function lockChat() {
  sendMessage.style.display = "none";
}

export function unlockChat() {
  sendMessage.style.display = "block";
}

if (sendMessage) {
  sendMessage.addEventListener("submit", onMessageSubmit);
}

export default {
  ping,
  subscribeToPong,
  subscribeToNewMessage
};
