const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Sever is running');
});

io.on('connection', (socket) => {
  // console.log(socket.id.substring(0, 4));
  // let id = socket.id.substring(0, 6);
  console.log(typeof socket.id);
  let sock = socket.id.substring(0, 4);
  console.log(typeof sock);
  socket.emit('me', sock);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callended');
  });

  socket.on('calluser', ({ userToCall, signalData, from, name }) => {
    console.log('User to call - ', userToCall);
    console.log('From ', from);
    io.to(userToCall).emit('calluser', { signal: signalData, from, name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callaccepted', data.signal);
  });
});

server.listen(PORT, () => console.log(`Server listening on Port ${PORT}`));
