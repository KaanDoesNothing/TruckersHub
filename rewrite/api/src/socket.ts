import { Server } from "socket.io";
import { setup } from "./db";
import { launchShifter } from "./socket/index";

const io = new Server({});
launchShifter(io);

setup();

io.listen(7998);