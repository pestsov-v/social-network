const connected = false;

const socket = io("http://localhost:3003");
socket.emit("setup", userLoggedIn);

socket.on("connected", () => connected = true)