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



http.listen(5000, function() {
   console.log('listening on *:5000');
});
