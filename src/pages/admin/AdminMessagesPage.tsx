import React, { useState, useEffect } from 'react';
import { INITIAL_CONVERSATIONS, Conversation, ChatMessage } from '../../mock/chatMock';
import { ConversationListPanel } from '../../components/admin/chat/ConversationListPanel';
import { ChatWindowPanel } from '../../components/admin/chat/ChatWindowPanel';
import { EmptyChatState } from '../../components/admin/chat/EmptyChatState';

export const AdminMessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  
  // Set default active conversation: first one on desktop, null on mobile
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return INITIAL_CONVERSATIONS[0]?.id || null;
    }
    return null;
  });

  // Current active conversation object
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  // Handle selecting a conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);

    // Clear unread count when opened
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Format current time HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Handle sending a new message
  const handleSendMessage = (
    text: string,
    attachment?: { name: string; type: 'file' | 'image' | 'shp'; size: string }
  ) => {
    if (!activeConversationId) return;

    const timeStr = getCurrentTime();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'superadmin',
      senderName: 'Daffa Arynt',
      text,
      timestamp: timeStr,
      isOutgoing: true,
      status: 'read',
      attachment,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessageSnippet: text || (attachment ? `📎 ${attachment.name}` : ''),
            lastMessageTime: timeStr,
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    // Optional simulated reply from the recipient for interactive demo delight (after 2s)
    if (text.toLowerCase().includes('cek') || text.toLowerCase().includes('terima') || text.toLowerCase().includes('verifikasi')) {
      const activeUser = activeConversation?.userName;
      const targetId = activeConversationId;

      setTimeout(() => {
        const replyTime = getCurrentTime();
        const incomingReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          senderId: targetId,
          senderName: activeUser || 'Peneliti',
          text: 'Siap Pak Daffa, terima kasih banyak atas tanggapan dan arahannya.',
          timestamp: replyTime,
          isOutgoing: false,
        };

        setConversations((currentList) =>
          currentList.map((conv) => {
            if (conv.id === targetId) {
              return {
                ...conv,
                lastMessageSnippet: incomingReply.text,
                lastMessageTime: replyTime,
                messages: [...conv.messages, incomingReply],
              };
            }
            return conv;
          })
        );
      }, 1500);
    }
  };

  // Handle creating a new conversation
  const handleNewConversation = (
    name: string,
    role: 'Peneliti' | 'Analyst',
    initialMsg: string
  ) => {
    const timeStr = getCurrentTime();
    const newId = `conv-${Date.now()}`;
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const newConv: Conversation = {
      id: newId,
      userId: `usr-${Date.now()}`,
      userName: name,
      userRole: role,
      userAvatarBg: role === 'Analyst' ? 'from-amber-600 to-rose-600' : 'from-blue-600 to-indigo-600',
      userInitials: initials || 'US',
      isOnline: true,
      unreadCount: 0,
      lastMessageSnippet: initialMsg,
      lastMessageTime: timeStr,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'superadmin',
          senderName: 'Daffa Arynt',
          text: initialMsg,
          timestamp: timeStr,
          isOutgoing: true,
          status: 'read',
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex overflow-hidden bg-white border-t border-slate-200">
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANEL: CONVERSATION LIST                                 */}
      {/* Hidden on mobile if conversation is active                     */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`
          w-full md:w-80 lg:w-96 shrink-0 h-full flex flex-col border-r border-slate-200
          ${activeConversationId ? 'hidden md:flex' : 'flex'}
        `}
      >
        <ConversationListPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANEL: ACTIVE CHAT WINDOW / EMPTY STATE                */}
      {/* Hidden on mobile if no conversation is active                 */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`
          flex-1 h-full flex flex-col min-w-0 bg-slate-50
          ${!activeConversationId ? 'hidden md:flex' : 'flex'}
        `}
      >
        {activeConversation ? (
          <ChatWindowPanel
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onBackMobile={() => setActiveConversationId(null)}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
