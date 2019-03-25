import events from "./events";
const socketController = socket => {
  const notifyNewUser = nickname => socket.emit(events.newUser, { nickname });
  socket.on(events.login, ({ nickname }) => {
    socket.name = nickname;
    notifyNewUser(nickname);
  });
};

export default socketController;
