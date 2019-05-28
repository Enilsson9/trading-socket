var app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const stock = require("./stock.js");

var princessTarta = {
    name: "gasoline",
    rate: 1.002,
    variance: 0.6,
    startingPoint: 20,
};

var cakes = [princessTarta];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

setInterval(function () {
    cakes.map((cake) => {
        cake["startingPoint"] = stock.getStockPrice(cake);
        return cake;
    });

    // console.log(cakes);

    io.emit("stocks", cakes);
}, 1000);



const mongo = require('mongodb').MongoClient;
// Start up socket.io
 //const ios = require('socket.io')(server);
// Connect to mongo
//mongo.connect('mongodb://localhost:27017/chat', function(err, db){
mongo.connect('mongodb://127.0.0.1/newgraph', function(err, db){
  if(err){
      throw err;
  }

  console.log('MongoDB connected...');

  io.on('connection', function(socket) {
      //console.log(socket.id)
      let graph = db.collection('newgraph');
      //console.log(chat);

      // Get chats from mongo collection
      graph.find().limit(100).sort({_id:1}).toArray(function(err, res){
        if(err){
            throw err;
        }
        // Emit the messages
        socket.emit('MESSAGES', res);
      });

      socket.on('SEND_MESSAGE', function(data) {
        let gasoline = data.gasoline;
        //let message = data.message;

        //console.log(data);

        graph.insert({gasoline: gasoline}, function(){
            io.emit('MESSAGES', data)
        });
      });
  });
});
















http.listen(3000, function() {
   console.log('listening on *:3000');
});
