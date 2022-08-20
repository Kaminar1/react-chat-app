const express = require("express")
const app = express()
const http = require("http").Server(app)
const cors = require("cors")
const Server = require("socket.io").Server

const socketIO = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
  },
})

const PORT = 4000

let users = []
// app.use(cors())

socketIO.on("connection", (socket) => {
  console.log(`💡 ${socket.id} user connected!`)

  socket.on("newUser", (data) => {
    users.push(data)
    socketIO.emit("newUserResponse", users)
  })

  socket.on("disconnect", () => {
    console.log(`👋 someone disconnected`)

    // filter out the user that disconnected
    users = users.filter((user) => user.socketID !== socket.id)
    socketIO.emit("newUserResponse", users)
    socket.disconnect()
  })

  socket.on("message", (data) => {
    // console.log(data)
    socketIO.emit("messageResponse", data)
  })
})

// app.get("/api", (req, res) => {
//   res.json({
//     message: "💯",
//   })
// })

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
