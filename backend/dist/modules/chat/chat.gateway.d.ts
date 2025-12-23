import { Server } from "socket.io";
export declare class ChatGateway {
    server: Server;
    handlePing(data: string): {
        event: string;
        data: string;
    };
}
