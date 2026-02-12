"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeMessage = exports.serializeMessage = exports.createUserStatus = exports.createConversation = exports.createMessage = exports.redisKeyPatterns = exports.ConversationType = exports.MessageStatus = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["FILE"] = "file";
    MessageType["AUDIO"] = "audio";
    MessageType["VIDEO"] = "video";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
    MessageStatus["FAILED"] = "failed";
})(MessageStatus = exports.MessageStatus || (exports.MessageStatus = {}));
var ConversationType;
(function (ConversationType) {
    ConversationType["DIRECT"] = "direct";
    ConversationType["GROUP"] = "group";
    ConversationType["CHANNEL"] = "channel";
})(ConversationType = exports.ConversationType || (exports.ConversationType = {}));
exports.redisKeyPatterns = {
    message: (id) => `message:${id}`,
    conversation: (id) => `conversation:${id}`,
    userMessages: (userId) => `user:messages:${userId}`,
    userConversations: (userId) => `user:conversations:${userId}`,
    conversationMessages: (conversationId) => `conversation:messages:${conversationId}`,
    userStatus: (userId) => `user:status:${userId}`,
    typing: (conversationId, userId) => `typing:${conversationId}:${userId}`,
    readReceipt: (messageId, userId) => `read:${messageId}:${userId}`,
    deliveryReceipt: (messageId, userId) => `delivery:${messageId}:${userId}`,
    conversationMembers: (conversationId) => `conversation:members:${conversationId}`,
};
function createMessage(data) {
    return {
        id: data.id || '',
        conversationId: data.conversationId || '',
        senderId: data.senderId || '',
        receiverId: data.receiverId,
        content: data.content || '',
        type: data.type || MessageType.TEXT,
        status: data.status || MessageStatus.SENT,
        timestamp: data.timestamp || new Date(),
        readAt: data.readAt,
        deliveredAt: data.deliveredAt,
        editedAt: data.editedAt,
        deletedForSender: data.deletedForSender || false,
        deletedForReceiver: data.deletedForReceiver || false,
        deletedBy: data.deletedBy,
        metadata: data.metadata || {},
        version: data.version || 1,
        ttl: data.ttl || 86400 * 30,
    };
}
exports.createMessage = createMessage;
function createConversation(data) {
    return {
        id: data.id || '',
        type: data.type || ConversationType.DIRECT,
        name: data.name,
        participantIds: data.participantIds || [],
        creatorId: data.creatorId || '',
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
        lastMessage: data.lastMessage,
        lastMessageId: data.lastMessageId,
        lastMessageAt: data.lastMessageAt,
        lastActivityAt: data.lastActivityAt || new Date(),
        archivedAt: data.archivedAt,
        unreadCounts: data.unreadCounts || {},
        members: data.members || {},
        ttl: data.ttl || 86400 * 90,
    };
}
exports.createConversation = createConversation;
function createUserStatus(data) {
    return {
        userId: data.userId || '',
        status: data.status || 'offline',
        socketId: data.socketId,
        lastSeen: data.lastSeen || new Date(),
    };
}
exports.createUserStatus = createUserStatus;
function serializeMessage(message) {
    return JSON.stringify(message);
}
exports.serializeMessage = serializeMessage;
function deserializeMessage(data) {
    const parsed = JSON.parse(data);
    return Object.assign(Object.assign({}, parsed), { timestamp: new Date(parsed.timestamp), readAt: parsed.readAt ? new Date(parsed.readAt) : undefined, deliveredAt: parsed.deliveredAt ? new Date(parsed.deliveredAt) : undefined, editedAt: parsed.editedAt ? new Date(parsed.editedAt) : undefined });
}
exports.deserializeMessage = deserializeMessage;
//# sourceMappingURL=message.interface.js.map