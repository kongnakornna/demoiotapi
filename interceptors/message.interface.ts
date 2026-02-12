// @root/interceptors/message.interface.ts
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  CHANNEL = 'channel',
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

export const redisKeyPatterns = {
  message: (id: string) => `message:${id}`,
  conversation: (id: string) => `conversation:${id}`,
  userMessages: (userId: string) => `user:messages:${userId}`,
  userConversations: (userId: string) => `user:conversations:${userId}`,
  conversationMessages: (conversationId: string) =>
    `conversation:messages:${conversationId}`,
  userStatus: (userId: string) => `user:status:${userId}`,
  typing: (conversationId: string, userId: string) =>
    `typing:${conversationId}:${userId}`,
  readReceipt: (messageId: string, userId: string) =>
    `read:${messageId}:${userId}`,
  deliveryReceipt: (messageId: string, userId: string) =>
    `delivery:${messageId}:${userId}`,
  conversationMembers: (conversationId: string) =>
    `conversation:members:${conversationId}`,
};

export function createMessage(data: Partial<Message>): Message {
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
    ttl: data.ttl || 86400 * 30, // 30 days default
  };
}

export function createConversation(data: Partial<Conversation>): Conversation {
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
    ttl: data.ttl || 86400 * 90, // 90 days default
  };
}

export function createUserStatus(
  data: Partial<UserStatusType>,
): UserStatusType {
  return {
    userId: data.userId || '',
    status: data.status || 'offline',
    socketId: data.socketId,
    lastSeen: data.lastSeen || new Date(),
  };
}

export function serializeMessage(message: Message): string {
  return JSON.stringify(message);
}

export function deserializeMessage(data: string): Message {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    timestamp: new Date(parsed.timestamp),
    readAt: parsed.readAt ? new Date(parsed.readAt) : undefined,
    deliveredAt: parsed.deliveredAt ? new Date(parsed.deliveredAt) : undefined,
    editedAt: parsed.editedAt ? new Date(parsed.editedAt) : undefined,
  };
}
