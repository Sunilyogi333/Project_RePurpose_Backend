import 'reflect-metadata';
import { Server as SocketServer } from 'socket.io';
export declare const io: SocketServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare let stores: {
    [key: string]: string[];
};
export declare let sellers: {
    [key: string]: string[];
};
