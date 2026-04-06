require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const players = {};
const messageTimeouts = {};

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.warn("MongoDB connection failed. Continuing in-memory mode.", err.message);
    });

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    socketId: String,
    avatar: String,
    x: Number,
    y: Number,
    lastSeen: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

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

    socket.on("playerMove", async (position) => {
        if (players[socket.id]) {
            Object.assign(players[socket.id], position);
            io.emit("playersUpdate", players);

            // Optional: Persist position to DB periodically or on every move
            try {
                await User.updateOne(
                    { socketId: socket.id },
                    { x: position.x, y: position.y, lastSeen: new Date() }
                );
            } catch (err) {
                console.error("Error updating position in MongoDB:", err);
            }
        }
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

    socket.on("disconnect", async () => {
        const wasJoined = players[socket.id];
        delete players[socket.id];

        try {
            // Update lastSeen and clear socketId
            await User.updateOne(
                { socketId: socket.id },
                { socketId: null, lastSeen: new Date() }
            );
        } catch (err) {
            console.error("Error updating disconnect in MongoDB:", err);
        }

        if (messageTimeouts[socket.id]) {
            clearTimeout(messageTimeouts[socket.id]);
            delete messageTimeouts[socket.id];
        }

        if (wasJoined) {
            io.emit("playersUpdate", players);
        }
        console.log("User disconnected:", socket.id);
    });

    socket.on("joinUser", async (data) => {
        const { name, avatarSeed } = data;
        const x = Math.floor(Math.random() * 700) + 50;
        const y = Math.floor(Math.random() * 500) + 50;

        players[socket.id] = {
            id: socket.id,
            name: name || "User",
            avatarSeed: avatarSeed || null,
            x,
            y,
            message: "",
        };

        try {
            await User.findOneAndUpdate(
                { socketId: socket.id },
                { username: name, avatarSeed, x, y, lastSeen: new Date() },
                { upsert: true }
            );
        } catch (err) {
            console.error("Error saving user to MongoDB:", err);
        }

        io.emit("playersUpdate", players);
    });


});



server.listen(5000, () => {
    console.log("Server running on port 5000");
});