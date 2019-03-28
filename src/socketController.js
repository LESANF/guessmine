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
    socket.broadcast.emit(events.disconnected, { nickname: socket.nickname })
  );

  socket.on(events.moving, ({ x, y }) =>
    socket.broadcast.emit(events.moved, { x, y })
  );
  socket.on(events.painting, ({ x, y }) =>
    socket.broadcast.emit(events.painted, { x, y })
  );
  socket.on(events.filling, ({ color }) =>
    socket.broadcast.emit(events.filled, { color })
  );
};

export default socketController;
