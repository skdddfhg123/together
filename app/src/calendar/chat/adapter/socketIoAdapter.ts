import { IoAdapter } from "@nestjs/platform-socket.io";

export class SocketIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);

        console.log("port: " + port);
        console.log("options", options);

        return server;
    }
}