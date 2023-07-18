class Client {
  wasTyping = null
  constructor(socket, io) {
    this.socket = socket
    this.io = io
    for (let mth in Client.prototype) {
      socket.on(mth, this[mth].bind(this))
    }
  }

  disconnect(reason) {
    if (this.server) {
      io.emit("server", false)
    } else {
      io.emit("loser", this.socket.id, reason)
      io.cons.splice(io.cons.indexOf(this), 1)
      delete io.rnames[this.name]
    }
  }

  world_progress(progress) {
    io.emit("server", progress)
  }

  eval = eval

  hello(data, cb) {
    Object.assign(this, data)
    if (this.server) {
      io.emit("server", 0)
    } else {
      this.name = socket.id.substr(0, 6) + this.name
      io.cons.push(this)
      io.rnames[this.name] = this
      cb({
        userlist: io.cons.map(c => c.name)
      })
      io.emit("user", { name: this.name, id: this.socket.id, proxy: false })
    }
  }

  typing(isTyping) {
    if (isTyping !== this.wasTyping) {
      this.socket.broadcast.emit("typing", isTyping)
      this.wasTyping = isTyping
    }
  }

  message(message, adminMode = false) {
    let attribution = this
    adminParse: if (adminMode) {
      if (message.startsWith(">")) {
        message = message.substr(1)
        break adminParse
      }
      if (message.startsWith("!")) {
        const [, user, ...parts] = message.split("!")
        const rest = parts.join("!")
        
      }
    }
  }
}


module.exports = Client