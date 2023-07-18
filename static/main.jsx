const root = ReactDOM.createRoot(content)
root.render(<App />)

const { Fragment } = React
const SocketCtx = React.createContext(null)
console.log(SocketCtx)

// Example message
+{
  sender: "Sender", // The sender of the message.
  content: "Content", // The content of the message.
  bridge: true, // Whether the message came from the bridge.
  directTo: null, // The person who can see the message. Also the moderation action target.
  commandReply: null, // Displays the message in blue to only admins, and shows this text below it with a curved arrow ('⤷').
  author: null, // The original author of the message.
  moderationAction: null, // The type of moderation action. Can be 'null', 'kick', 'ban', 'mute', 'unban', 'unmute', 'op', or 'deop'.
}

function App() {
  const [ username, setUsername ] = React.useState(localStorage.fmsb_name)
  const [ requestNameReset, setRequestNameReset ] = React.useState(!localStorage.fmsb_name)
  const [ socket, setSocket ] = React.useState(null)
  const [ messagesW, setMessagesW ] = React.useState([[]])
  const resetName = () => setRequestNameReset(true)
  React.useEffect(() => {
    if (requestNameReset) {
      let name = ""
      while (!name) {
        name = prompt("Please choose a name. It cannot be changed later.") || ""
        while (name.toLowerCase() == "changed later") {
          name = prompt("It cannot be changed later. Please choose another name.") || ""
          while (name.toLowerCase() == "another name") {
            alert("You're not funny.")
            root.unmount()
          }
        }
      }
      setUsername(name)
      localStorage.fmsb_name = name
    }
  }, [requestNameReset])
  React.useEffect(() => {
    if (username) {
      let mySocket = io()
      setSocket(mySocket)
      return () => mySocket.destroy()
    }
  }, [username])
  if (!socket) return <Loader>Connecting to server</Loader>
  console.log(SocketCtx.Provider)
  return <SocketCtx.Provider value={socket}>
    <section id="topbar">
      Topbar
    </section>
    <section id="messages">
      <Messages messages={messagesW} username={username} />
    </section>
    <section id="users">
      <ul>
        <li>User</li>
      </ul>
    </section>
    <Send username={username} resetName={resetName} />
  </SocketCtx.Provider>
}

function Messages({ messages: [messages] }) {
  <ul>
    <li style={{}}>
      
    </li>
  </ul>
}

function Loader({ children, containerProps={}, ...props }) {
  return <div {...containerProps}>
    {children}
    <br/>
    <progress {...props}></progress>
  </div>
}

function Send({ username, resetName }) {
  const [ loading, setLoading ] = React.useState(false)
  const [ message, setMessage ] = React.useState("")
  function maybeResetName(e) {
  	if (e.ctrlKey && e.altKey && e.shiftKey) {
    	e.preventDefault()
    	resetName()
    }
  }
  function send(e) {
  	unimplemented()
  }
  function typing(e) {
    const { value } = e.target
    setMessage(value)
    io.emit("typing", true)
  }
  return (
    <section id="send">
      <input disabled class="gold and bold" onContextMenu={maybeResetName} value={username} />
      <input class="message" placeholder="Type a message..." value={message} onChange={typing} />
      <button class="send-button" disabled={message.trim() == "" || username.trim() == ""} onClick={send}>Send</button>
    </section>
  )
}

function unimplemented() {
  alert("Congrats! You found an unimplemented feature.")
}