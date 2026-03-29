import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { messageAPI } from "../api/endpoints";
import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";

export default function Messages() {
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState(null);

  useEffect(() => {
    messageAPI.getConversations().then(r => setConversations(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (conversationId && conversations.length > 0) setActiveConv(conversations.find(c => c.id === conversationId) || null);
    else if (!conversationId) setActiveConv(null);
  }, [conversationId, conversations]);

  return (
    <div className="flex h-[calc(100vh-0px)] md:h-screen overflow-hidden bg-white dark:bg-dark-card">
      <div className={`${conversationId ? "hidden md:flex" : "flex"} flex-col w-full md:w-[360px] flex-shrink-0`}>
        <ConversationList conversations={conversations} loading={loading} />
      </div>
      <div className={`${conversationId ? "flex" : "hidden md:flex"} flex-1 min-w-0`}>
        <ChatWindow conversation={activeConv} />
      </div>
    </div>
  );
}
