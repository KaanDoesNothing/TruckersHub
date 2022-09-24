import socketIO from "socket.io-client";
export const io = socketIO(`${window.location.host}/frontend`);