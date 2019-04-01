import events from "./events";
import { getWord } from "./words";

const POINTS = 10;

let sockets = [];
let inProgress = false;
let word, leader;

const socketController = io => socket => {
  const chooseLeader = () =>
    sockets[Math.floor(Math.random() * sockets.length)];

  const startGame = () => {
    // inProgress = true;
    io.emit(events.starting);
    word = getWord();
    leader = chooseLeader();
    setTimeout(() => {
      io.emit(events.started);
      io.to(leader.id).emit(events.chosenLeader, { word });
    }, 5000);
  };

  const registerWin = () => {
    sockets = sockets.map(aSocket => {
      if (aSocket.id === socket.id) {
        return { ...aSocket, points: aSocket.points + POINTS };
      } else {
        return aSocket;
      }
    });
    io.emit(events.pong, { sockets, word, inProgress });
    io.emit(events.gameFinished);
    startGame();
  };

  socket.on(events.login, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, nickname, points: 0 });
    socket.broadcast.emit(events.newUser, { nickname });
    socket.broadcast.emit(events.pong, { sockets });
    if (sockets.length > 1 && inProgress === false) {
      startGame();
    }
  });

  socket.on(events.sendMessage, ({ message }) => {
    if (message === word) {
      return registerWin();
    } else {
      return socket.broadcast.emit(events.receiveMessage, {
        message,
        nickname: socket.nickname
      });
    }
  });

  socket.on(events.disconnect, () => {
    socket.broadcast.emit(events.disconnected, { nickname: socket.nickname });
    sockets = sockets.filter(aSocket => aSocket.id !== socket.id);
    socket.broadcast.emit(events.pong, { sockets });
  });

  socket.on(events.moving, ({ x, y }) =>
    socket.broadcast.emit(events.moved, { x, y })
  );
  socket.on(events.painting, ({ x, y, color }) =>
    socket.broadcast.emit(events.painted, { x, y, color })
  );
  socket.on(events.filling, ({ color }) =>
    socket.broadcast.emit(events.filled, { color })
  );
  socket.on(events.ping, () => {
    socket.emit(events.pong, { sockets, inProgress });
  });
  socket.on(events.gameFinished, () => {
    io.emit(events.gameFinished);
    inProgress = false;
    setTimeout(() => startGame(), 3000);
  });
};

setInterval(() => console.log(sockets), 2000);

export default socketController;
