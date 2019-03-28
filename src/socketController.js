import events from "./events";

const sockets = [];

const socketController = io => socket => {
  socket.on(events.login, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push(socket.id);
    socket.broadcast.emit(events.newUser, { nickname });
  });

  socket.on(events.sendMessage, ({ message }) => {
    socket.broadcast.emit(events.receiveMessage, {
      message,
      nickname: socket.nickname
    });
  });

  socket.on(events.disconnect, () =>
    io.sockets.emit(events.disconnected, { nickname: socket.nickname })
  );
};

export default socketController;
