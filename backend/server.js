import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import { db } from "./db.js";
import dotenv from "dotenv"



const app = express();
const server = createServer(app);
const port=process.env.PORT

const io = new Server(server, {
    cors: { origin: "*" },
});

const ROOM = "group";

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // USER JOINS ROOM
    socket.on("joinRoom", async (userName) => {
        await socket.join(ROOM);

        // Save user in DB if not exists
        await db.execute(
            `INSERT INTO users (name, socket_id) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE socket_id=?`,
            [userName, socket.id, socket.id]
        );

        socket.to(ROOM).emit("roomNotice", userName);

        // Send last 50 messages to this user
        const [messages] = await db.execute(
            "SELECT * FROM messages ORDER BY ts ASC LIMIT 50"
        );
        socket.emit("oldMessages", messages);
    });

    // USER SENDS MESSAGE
    socket.on("chatMessage", async (msg) => {
        // Save message in DB
        await db.execute(
            "INSERT INTO messages (sender, text, ts) VALUES (?, ?, ?)",
            [msg.sender, msg.text, msg.ts]
        );

        // Broadcast to others
        socket.to(ROOM).emit("chatMessage", msg);
    });

    // TYPING INDICATORS
    socket.on("typing", (userName) => {
        socket.to(ROOM).emit("typing", userName);
    });
    socket.on("stopTyping", (userName) => {
        socket.to(ROOM).emit("stopTyping", userName);
    });
});

app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

server.listen(port, () => {
    console.log("Server running at ",port);
});
