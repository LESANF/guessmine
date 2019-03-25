import events from "./events";

const sockets = [];

const socketController = io => socket => {
  const notifyNewUser = nickname => socket.emit(events.newUser, { nickname });
  socket.on(events.login, ({ nickname }) => {
    socket.name = nickname;
    sockets.push(socket.id);
    notifyNewUser(nickname);
  });
};

export default socketController;
