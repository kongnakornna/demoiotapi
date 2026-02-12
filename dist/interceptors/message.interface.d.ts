export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    FILE = "file",
    AUDIO = "audio",
    VIDEO = "video"
}
export declare enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed"
}
export declare enum ConversationType {
    DIRECT = "direct",
    GROUP = "group",
    CHANNEL = "channel"
}
export interface UserStatusType {
    userId: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    socketId?: string;
    lastSeen: Date;
}
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId?: string;
    content: string;
    type: MessageType;
    status: MessageStatus;
    timestamp: Date;
    readAt?: Date;
    deliveredAt?: Date;
    editedAt?: Date;
    deletedForSender?: boolean;
    deletedForReceiver?: boolean;
    deletedBy?: string;
    metadata?: Record<string, any>;
    version?: number;
    ttl?: number;
}
export interface Conversation {
    id: string;
    type: ConversationType;
    name?: string;
    participantIds: string[];
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: Message;
    lastMessageId?: string;
    lastMessageAt?: Date;
    lastActivityAt?: Date;
    archivedAt?: Date;
    unreadCounts?: Record<string, number>;
    members?: Record<string, any>;
    ttl?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: Date;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
export declare const redisKeyPatterns: {
    message: (id: string) => string;
    conversation: (id: string) => string;
    userMessages: (userId: string) => string;
    userConversations: (userId: string) => string;
    conversationMessages: (conversationId: string) => string;
    userStatus: (userId: string) => string;
    typing: (conversationId: string, userId: string) => string;
    readReceipt: (messageId: string, userId: string) => string;
    deliveryReceipt: (messageId: string, userId: string) => string;
    conversationMembers: (conversationId: string) => string;
};
export declare function createMessage(data: Partial<Message>): Message;
export declare function createConversation(data: Partial<Conversation>): Conversation;
export declare function createUserStatus(data: Partial<UserStatusType>): UserStatusType;
export declare function serializeMessage(message: Message): string;
export declare function deserializeMessage(data: string): Message;
