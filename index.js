const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = new (require("socket.io")).Server(http)
const fs = require("fs").promises
const babel = require("@babel/core")

app.redirect = function(route, ...args) {
  this.all(route, (req, res) => res.redirect(...args))
}

app.redirect("/oauth/request", "https://discord.com/api/oauth2/authorize?client_id=1130627402704359515&redirect_uri=https%3A%2F%2Ffmsb.poollovernathan.repl.co%2Foauth/callback.html&response_type=code&scope=identify")

app.use(express.static(__dirname + "/static"))
app.use(express.static(__dirname + "/node_modules"))

app.get("/@@react/*", async (req, res, next) => {
  try {
    const content = await fs.readFile(__dirname + "/static/" + req.params[0])
    const transformed = await babel.transformAsync(content, {
      presets: ["@babel/preset-react"],
    })
    res.type("js")
    res.send(transformed.code)
  } catch (e) {
    next(e)
  }
})

const Client = require("./client.js")
io.on("connection", socket => {
  socket.clientClass = new Client(socket, io)
})

http.listen(8000, () => console.log("server's up, probably crashing in", Math.round(Math.random() * 4) + 3 + "", "minutes"))