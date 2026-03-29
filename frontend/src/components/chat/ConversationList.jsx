import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../ui/Avatar";
import { formatShort } from "../../utils/formatDate";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function ConversationList({ conversations, loading }) {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(c => {
    const other = c.participants?.find(p => p.id !== user?.id);
    return !search || other?.username?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">{user?.username}</h2>
          <button onClick={() => navigate("/messages/new")} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full"><FiEdit size={20} /></button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" className="input-base text-sm py-2.5" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && [1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="skeleton w-12 h-12 rounded-full" />
            <div className="flex-1"><div className="skeleton h-3 w-28 mb-2 rounded" /><div className="skeleton h-2 w-40 rounded" /></div>
          </div>
        ))}
        {filtered.map(conv => {
          const other = conv.participants?.find(p => p.id !== user?.id);
          const isActive = conv.id === conversationId;
          return (
            <div key={conv.id} onClick={() => navigate(`/messages/${conv.id}`)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${isActive ? "bg-gray-100 dark:bg-dark-surface" : "hover:bg-gray-50 dark:hover:bg-dark-surface/60"}`}>
              <div className="relative flex-shrink-0">
                <Avatar src={other?.profilePic} name={other?.username} size="md" />
                {conv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className={`font-semibold text-sm truncate ${conv.unreadCount > 0 ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>{other?.username}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatShort(conv.lastMessageAt)}</span>
                </div>
                <p className={`text-xs truncate ${conv.unreadCount > 0 ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-400"}`}>{conv.lastMessage || "Start a conversation"}</p>
              </div>
              {conv.unreadCount > 0 && <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">{conv.unreadCount > 9 ? "9+" : conv.unreadCount}</div>}
            </div>
          );
        })}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No conversations yet</div>}
      </div>
    </div>
  );
}
