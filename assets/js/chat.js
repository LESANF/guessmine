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
  socket.emit(socketEvents.sendMessage, { message });
  addMessage(message, null);
}

function subscribeToNewMessage() {
  const onNewMessage = ({ message, nickname }) => addMessage(message, nickname);
  socket.on(socketEvents.receiveMessage, onNewMessage);
}
