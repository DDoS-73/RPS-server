const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true
	},
	transports: ['websocket', 'polling', 'flashsocket'],
});

io.on("connection", (socket) => {
	console.log('New socket connected', socket.id);
	console.log('Socket amount', io.sockets.sockets.size);

	socket.on("join", (roomID) => {
		socket.join(roomID);
		console.log(`Socket ${socket.id} connected to room ${roomID}`);

		const size = io.sockets.adapter.rooms.get(roomID).size;
		console.log(`Room ${roomID} size is ${size}`);

		io.in(roomID).emit('game_start', { started: size >= 2 });
	})

	socket.on('move', (sign) => {
		const roomID = Array.from(socket.rooms)[1];
		socket.to(roomID).emit('opponent_move', sign);
	});

});

io.listen(8000);
