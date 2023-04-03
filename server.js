const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "*"
	}
});

const store = {};

io.on("connection", (socket) => {
	console.log('new socket connected', socket.id);
	console.log('socket amount', io.sockets.sockets.size);

	socket.on("join", (roomID) => {
		socket.join(roomID);
		console.log('roomID', roomID);

		const size = io.sockets.adapter.rooms.get(roomID).size;
		console.log('roomSize', size);
		if(size === 2) {
			store[roomID] = new Map();
		}

		io.in(roomID).emit('game_start', { started: size === 2 });
	})

	socket.on('move', (sign) => {
		console.log(sign);
		const roomID = Array.from(socket.rooms)[1];
		// store[roomID].set(socket, {
		// 	sign,
		// 	score: store[roomID].get(socket)?.score ?? 0,
		// })
		// if (store[roomID].size === 2) {
		// 	const arr = Array.from(store[roomID].values());
		// 	const res = playRound(arr[0].sign, arr[1].sign);
		// 	if(!res) {
		// 		store[roomID].get(socket).score += 1;
		// 		socket.emit('opponent_move', {sign});
		// 	} else {
		//
		// 	}
		// }
		socket.to(roomID).emit('opponent_move', sign);
	})
});

const playRound = (player1, player2) => {
	if (player1 === player2) {
		return 'tie';
	} else if ((player1 === 'rock' && player2 === 'scissors') ||
		(player1 === 'paper' && player2 === 'rock') ||
		(player1 === 'scissors' && player2 === 'paper')) {
		return 'player1';
	} else {
		return 'player2';
	}
}

io.listen(8000);
