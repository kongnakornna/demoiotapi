import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class IotsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private readonly clientActivity;
    private cleanupInterval;
    broadcastMqttData(topic: string, data: any): number;
    afterInit(server: Server): void;
    private setupCleanupTimer;
    private isSocketServerAvailable;
    private get connectedSockets();
    cleanupInactiveClients(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleHeartbeat(client: Socket, data: any): {
        status: string;
    };
    handleIotData(client: Socket, data: any): {
        status: string;
    };
    sendToClient(clientId: string, event: string, data: any): boolean;
    broadcast(event: string, data: any): number;
    handleGetClients(client: Socket): {
        total: number;
        clients: {
            id: string;
            connected: boolean;
            lastActivity: number;
            rooms: string[];
        }[];
        timestamp: string;
        error?: undefined;
    } | {
        error: string;
        total?: undefined;
        clients?: undefined;
        timestamp?: undefined;
    };
    onModuleDestroy(): void;
    broadcastByKey(key: string, event: string, data: any): number;
    sendToClientByKey(key: string, event: string, data: any): boolean;
    handleGetAllData(client: Socket, data: any): {
        status: string;
        received: boolean;
    } | {
        status: string;
        received?: undefined;
    };
    handleSetKey(client: Socket, data: any): {
        status: string;
        message: string;
        key?: undefined;
    } | {
        status: string;
        key: any;
        message?: undefined;
    } | {
        status: string;
        message?: undefined;
        key?: undefined;
    };
    handleRequestAllData(client: Socket): {
        status: string;
        totalClients: number;
    } | {
        status: string;
        totalClients?: undefined;
    };
    getConnectedClientsCount(): number;
}
