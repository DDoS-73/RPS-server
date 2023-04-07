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

	socket.emit('connection_result', true);

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

	socket.on('disconnecting', () => {
		const roomID = Array.from(socket.rooms)[1];

		if(roomID) {
			socket.to(roomID).emit('opponent_leave');
		}
	})

	socket.on('disconnect', () => {
		console.log(`Socket ${socket.id} disconnected`);
		console.log('Socket amount', io.sockets.sockets.size);

		if(io.sockets.sockets.size === 0) {
			console.log('--------------------------');
		}
	})
});

io.listen(8000);
