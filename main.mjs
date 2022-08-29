import http from "http"

import express from "express"
import cors from "cors"
import { Server } from "socket.io"

const app = express()

app.use(cors())
app.use(
    express.json({
        limit: "10kb",
    })
)
app.get(
    "/:roomID",
    (req, res, next) => {
        res.json(
            io.of(req.params.roomID).sockets.size
        )
    }
)
app.post(
    "/broadcast/:roomID",
    (req, res, next) => {
        const { roomID } = req.params
        console.log("broadcast to", roomID)
        io.of(roomID).emit(
            req.body.type,
            req.body.data
        )
        res.json(true)
    }
)

const nodeServer = http.createServer(app)
const io = new Server(nodeServer)

io.of("test").use(
    (socket, next) => {
        console.log(socket.handshake.headers.origin)
        next()
    }
)
io.of("test").on(
    "connection",
    (socket) => {
        socket.emit("hi", [1, 2, 3, 4])
    }
)

nodeServer.listen(
    process.env.port ?? 4746,
    () => console.log("Unus Mundus Network online")
)
