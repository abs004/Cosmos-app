const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const players = {};

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    players[socket.id] = {
        x: 400,
        y: 300,
    };

    io.emit("playersUpdate", players);

    socket.on("playerMove", (position) => {
        players[socket.id] = position;
        io.emit("playersUpdate", players);
    });

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("playersUpdate", players);
        console.log("User disconnected:", socket.id);
    });
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});