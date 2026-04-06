export interface User {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt?: string;
}

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  lastReadAt: string;
  lastDeliveredAt: string;
  user: User;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: Pick<User, "id" | "name" | "email">;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  name?: string | null;
  createdAt: string;
  members: ConversationMember[];
  messages: Message[];
  unreadCount?: number;
}

export interface TypingUpdate {
  conversationId: string | null;
  userId: string;
  isTyping: boolean;
}
