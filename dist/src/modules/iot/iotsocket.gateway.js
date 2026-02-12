"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IotsocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let IotsocketGateway = IotsocketGateway_1 = class IotsocketGateway {
    constructor() {
        this.logger = new common_1.Logger(IotsocketGateway_1.name);
        this.clientActivity = new Map();
    }
    broadcastMqttData(topic, data) {
        return this.broadcast('mqtt_data', {
            topic,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
        this.setupCleanupTimer();
    }
    setupCleanupTimer() {
        if (!this.server) {
            this.logger.warn('Cannot setup cleanup timer: server not initialized');
            return;
        }
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.cleanupInterval = setInterval(() => {
            this.cleanupInactiveClients();
        }, 5 * 60 * 1000);
        this.logger.log('Cleanup timer set up (every 5 minutes)');
    }
    isSocketServerAvailable() {
        return !!(this.server &&
            this.server.sockets &&
            typeof this.server.sockets.sockets === 'object');
    }
    get connectedSockets() {
        if (!this.isSocketServerAvailable()) {
            return new Map();
        }
        return this.server.sockets.sockets;
    }
    cleanupInactiveClients() {
        try {
            if (!this.isSocketServerAvailable()) {
                this.logger.warn('Socket server not available for cleanup');
                return;
            }
            const now = Date.now();
            const timeoutDuration = 30 * 60 * 1000;
            const inactiveClients = [];
            this.connectedSockets.forEach((socket, clientId) => {
                const lastActivity = this.clientActivity.get(clientId) || 0;
                if (now - lastActivity > timeoutDuration) {
                    inactiveClients.push(clientId);
                }
            });
            inactiveClients.forEach((clientId) => {
                try {
                    const socket = this.connectedSockets.get(clientId);
                    if (socket) {
                        socket.disconnect(true);
                        this.clientActivity.delete(clientId);
                        this.logger.log(`Disconnected inactive client: ${clientId}`);
                    }
                }
                catch (error) {
                    this.logger.error(`Error disconnecting client ${clientId}:`, error);
                }
            });
            if (inactiveClients.length > 0) {
                this.logger.log(`Cleaned up ${inactiveClients.length} inactive clients`);
            }
        }
        catch (error) {
            this.logger.error('Error during socket cleanup:', error);
        }
    }
    handleConnection(client) {
        try {
            const clientId = client.id;
            this.clientActivity.set(clientId, Date.now());
            this.logger.log(`Client connected: ${clientId}`);
            this.logger.log(`Total connected clients: ${this.connectedSockets.size}`);
            client.emit('connected', {
                message: 'Connected to IoT Socket Server',
                clientId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.error('Error in handleConnection:', error);
        }
    }
    handleDisconnect(client) {
        try {
            const clientId = client.id;
            this.clientActivity.delete(clientId);
            this.logger.log(`Client disconnected: ${clientId}`);
            this.logger.log(`Total connected clients: ${this.connectedSockets.size}`);
        }
        catch (error) {
            this.logger.error('Error in handleDisconnect:', error);
        }
    }
    handleHeartbeat(client, data) {
        try {
            const clientId = client.id;
            this.clientActivity.set(clientId, Date.now());
            client.emit('heartbeat_ack', {
                status: 'ok',
                timestamp: new Date().toISOString(),
                clientId,
            });
            return { status: 'heartbeat_received' };
        }
        catch (error) {
            this.logger.error('Error in handleHeartbeat:', error);
            client.emit('error', { message: 'Heartbeat processing failed' });
        }
    }
    handleIotData(client, data) {
        try {
            const clientId = client.id;
            this.clientActivity.set(clientId, Date.now());
            this.logger.log(`IoT data from ${clientId}:`, data);
            client.broadcast.emit('iot_data_update', {
                clientId,
                data,
                timestamp: new Date().toISOString(),
            });
            return { status: 'data_received' };
        }
        catch (error) {
            this.logger.error('Error in handleIotData:', error);
            client.emit('error', { message: 'Data processing failed' });
        }
    }
    sendToClient(clientId, event, data) {
        try {
            const socket = this.connectedSockets.get(clientId);
            if (socket && socket.connected) {
                socket.emit(event, data);
                return true;
            }
            return false;
        }
        catch (error) {
            this.logger.error(`Error sending to client ${clientId}:`, error);
            return false;
        }
    }
    broadcast(event, data) {
        try {
            if (!this.isSocketServerAvailable()) {
                this.logger.warn('Cannot broadcast: server not available');
                return 0;
            }
            let sentCount = 0;
            this.connectedSockets.forEach((socket) => {
                if (socket.connected) {
                    socket.emit(event, data);
                    sentCount++;
                }
            });
            if (sentCount > 0) {
                this.logger.log(`Broadcasted ${event} to ${sentCount} clients`);
            }
            return sentCount;
        }
        catch (error) {
            this.logger.error('Error in broadcast:', error);
            return 0;
        }
    }
    handleGetClients(client) {
        try {
            const clients = Array.from(this.connectedSockets.entries()).map(([id, socket]) => ({
                id,
                connected: socket.connected,
                lastActivity: this.clientActivity.get(id) || null,
                rooms: Array.from(socket.rooms || []),
            }));
            return {
                total: clients.length,
                clients,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Error in handleGetClients:', error);
            return { error: 'Failed to get clients list' };
        }
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.logger.log('Cleanup timer cleared');
        }
        try {
            this.connectedSockets.forEach((socket) => {
                socket.disconnect(true);
            });
        }
        catch (error) {
            this.logger.error('Error during final cleanup:', error);
        }
        this.clientActivity.clear();
        this.logger.log('IotsocketGateway destroyed');
    }
    broadcastByKey(key, event, data) {
        try {
            if (!this.isSocketServerAvailable()) {
                this.logger.warn('Cannot broadcast by key: server not available');
                return 0;
            }
            let sentCount = 0;
            this.connectedSockets.forEach((socket) => {
                if (socket.connected) {
                    if (socket.data.key === key) {
                        socket.emit(event, data);
                        sentCount++;
                        this.logger.log(`Sent to client ${socket.id} with key: ${key}`);
                    }
                }
            });
            this.logger.log(`Broadcasted ${event} to ${sentCount} clients with key: ${key}`);
            return sentCount;
        }
        catch (error) {
            this.logger.error('Error in broadcastByKey:', error);
            return 0;
        }
    }
    sendToClientByKey(key, event, data) {
        try {
            let sent = false;
            this.connectedSockets.forEach((socket) => {
                if (socket.connected && socket.data.key === key) {
                    socket.emit(event, data);
                    sent = true;
                    this.logger.log(`Sent to client ${socket.id} with key: ${key}`);
                }
            });
            return sent;
        }
        catch (error) {
            this.logger.error(`Error sending to clients with key ${key}:`, error);
            return false;
        }
    }
    handleGetAllData(client, data) {
        try {
            const clientId = client.id;
            this.clientActivity.set(clientId, Date.now());
            this.logger.log(`Received data from ${clientId}:`, data);
            client.emit('data_received', {
                status: 'success',
                clientId,
                timestamp: new Date().toISOString(),
                data: data,
            });
            client.broadcast.emit('new_data_available', {
                source: clientId,
                data: data,
                timestamp: new Date().toISOString(),
            });
            return {
                status: 'data_received',
                received: true,
            };
        }
        catch (error) {
            this.logger.error('Error in handleGetAllData:', error);
            client.emit('error', { message: 'Data processing failed' });
            return { status: 'error' };
        }
    }
    handleSetKey(client, data) {
        try {
            const clientId = client.id;
            const key = data.key;
            if (!key) {
                client.emit('error', { message: 'Key is required' });
                return { status: 'error', message: 'Key is required' };
            }
            client.data.key = key;
            this.clientActivity.set(clientId, Date.now());
            client.emit('key_set', {
                status: 'success',
                clientId,
                key: key,
                timestamp: new Date().toISOString(),
            });
            this.logger.log(`Client ${clientId} set key to: ${key}`);
            return { status: 'key_set', key: key };
        }
        catch (error) {
            this.logger.error('Error in handleSetKey:', error);
            client.emit('error', { message: 'Failed to set key' });
            return { status: 'error' };
        }
    }
    handleRequestAllData(client) {
        try {
            const clientId = client.id;
            this.clientActivity.set(clientId, Date.now());
            const allData = [];
            this.connectedSockets.forEach((socket, id) => {
                if (socket.data) {
                    allData.push({
                        clientId: id,
                        key: socket.data.key || null,
                        lastActivity: this.clientActivity.get(id) || null,
                        connected: socket.connected,
                    });
                }
            });
            client.emit('all_data_response', {
                totalClients: allData.length,
                data: allData,
                timestamp: new Date().toISOString(),
            });
            return {
                status: 'data_sent',
                totalClients: allData.length,
            };
        }
        catch (error) {
            this.logger.error('Error in handleRequestAllData:', error);
            client.emit('error', { message: 'Failed to get all data' });
            return { status: 'error' };
        }
    }
    getConnectedClientsCount() {
        var _a, _b;
        return ((_b = (_a = this.server) === null || _a === void 0 ? void 0 : _a.engine) === null || _b === void 0 ? void 0 : _b.clientsCount) || 0;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], IotsocketGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('heartbeat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleHeartbeat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('iot_data'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleIotData", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_clients'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleGetClients", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_all_data'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleGetAllData", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('set_key'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleSetKey", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_all_data'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], IotsocketGateway.prototype, "handleRequestAllData", null);
IotsocketGateway = IotsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'iot',
    })
], IotsocketGateway);
exports.IotsocketGateway = IotsocketGateway;
//# sourceMappingURL=iotsocket.gateway.js.map