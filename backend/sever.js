const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const players = {};
const messageTimeouts = {};

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
        if (players[socket.id]) {
            players[socket.id].message = message;
            io.emit("playersUpdate", players);

            // Clear existing timeout if any
            if (messageTimeouts[socket.id]) {
                clearTimeout(messageTimeouts[socket.id]);
            }

            // Clear message after 5 seconds
            messageTimeouts[socket.id] = setTimeout(() => {
                if (players[socket.id]) {
                    delete players[socket.id].message;
                    io.emit("playersUpdate", players);
                }
                delete messageTimeouts[socket.id];
            }, 5000);
        }

        io.emit("receiveMessage", {
            senderId: socket.id,
            text: message,
        });
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        if (messageTimeouts[socket.id]) {
            clearTimeout(messageTimeouts[socket.id]);
            delete messageTimeouts[socket.id];
        }
        io.emit("playersUpdate", players);
        console.log("User disconnected:", socket.id);
    });
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});