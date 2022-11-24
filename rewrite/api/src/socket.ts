import { Server } from "socket.io";
import { setup } from "./db";
import { launchSocket } from "./socket/index";

const io = new Server({});
launchSocket(io);

setup();

io.listen(7998);