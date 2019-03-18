var app = require('http').createServer()
var io = module.exports.io = require('socket.io')(app)

// require("dotenv").config();
const PORT = 3005
const QueueOperator = require("./QueueOperator");

let users = {
  'ghi': {
    currentMusicData: { album: '÷ (Deluxe)', artist: 'Ed Sheeran', song: 'Perfect', cover:
         'https://i.scdn.co/image/3b673c999773ba34acd5d724d47666e407fa06f2'},
    locationInfo:
      {
        longitude: -79.40227565453004,
        latitude: 43.64407861007,
        timestamp: 1552082456.135453
      },
    doesntLike: []
  },
  'def':{
    currentMusicData: { album: '戀愛的力量', artist: 'Fish Leong', song: '勇氣' },
    locationInfo:
    {
      longitude: 120.58225979466396,
      latitude: 24.504068145075146,
      timestamp: 1552157136.9262118
    }
  },
  'abc':{
    currentMusicData: { album: '忠孝東路走九遍', artist: 'Power Station', song: '忠孝東路走九遍' },
    locationInfo:
    {
      longitude: -79.399672,
      latitude: 43.671502,
      timestamp: 1552157136.9262118
    }
  }
};

io.on('connection', function (socket) {

  console.log('user connected');
  const userQueueOperator = new QueueOperator();

  socket.on('message', function (data) {
    console.log('in message', data.chatroomId)
    socket.broadcast.emit(data.chatroomId, {
      messageSend: true
    })
  });

  socket.on('usersQueue', function (data) {
    users = userQueueOperator.addUserInfoQueue(users, data);
    // console.log("------ user start ------");
    // console.log(users);
    // console.log("------ user end ------");
  });

  socket.on('findPeople', function (data) {
    console.log("In findPeople");
    console.log(data);
    let match = userQueueOperator.pairPeopleFromQueue(users, data.myName, socket);
    socket.emit('findMatchPeople', match);
  });
});

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`)
})