import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { messageAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../ui/Avatar";
import { formatTime } from "../../utils/formatDate";
import { FiSend, FiImage, FiChevronLeft, FiPhone, FiVideo } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ChatWindow({ conversation }) {
  const { user } = useAuth();
  const { publish, subscribe } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const navigate = useNavigate();
  const other = conversation?.participants?.find(p => p.id !== user?.id);

  useEffect(() => {
    if (!conversation) return;
    messageAPI.getMessages(conversation.id).then(r => { setMessages((r.data.data?.content || []).reverse()); }).catch(() => {});
  }, [conversation?.id]);

  useEffect(() => {
    if (!conversation) return;
    const unsub = subscribe(`/user/${user?.id}/queue/messages`, (frame) => {
      const msg = JSON.parse(frame.body);
      if (msg.conversationId === conversation.id) setMessages(prev => [...prev, msg]);
    });
    const typingUnsub = subscribe(`/topic/typing/${conversation.id}`, (frame) => {
      const data = JSON.parse(frame.body);
      if (data.userId !== user?.id) { setIsTyping(data.isTyping); if (data.isTyping) { setTimeout(() => setIsTyping(false), 3000); } }
    });
    return () => { unsub?.unsubscribe?.(); typingUnsub?.unsubscribe?.(); };
  }, [conversation?.id, user?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    publish("/app/chat.typing", { conversationId: conversation.id, type: "TYPING" });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => publish("/app/chat.typing", { conversationId: conversation.id, type: "TYPING", isTyping: false }), 1000);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || sending) return;
    const msg = text.trim(); setText(""); setSending(true);
    try {
      const fd = new FormData();
      fd.append("message", new Blob([JSON.stringify({ text: msg })], { type: "application/json" }));
      const r = await messageAPI.send(conversation.id, fd);
      setMessages(prev => [...prev, r.data.data]);
    } catch { toast.error("Failed to send"); setText(msg); } finally { setSending(false); }
  };

  const handleImageSend = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData();
    fd.append("message", new Blob([JSON.stringify({ text: "" })], { type: "application/json" }));
    fd.append("media", file);
    try { const r = await messageAPI.send(conversation.id, fd); setMessages(prev => [...prev, r.data.data]); }
    catch { toast.error("Failed to send image"); }
  };

  if (!conversation) return (
    <div className="hidden md:flex flex-1 items-center justify-center flex-col gap-4 text-gray-400 bg-gray-50 dark:bg-dark-bg">
      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center"><FiSend size={40} className="text-gray-300" /></div>
      <p className="font-semibold text-xl text-gray-600 dark:text-gray-300">Your Messages</p>
      <p className="text-sm">Select a conversation to start messaging</p>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-dark-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-dark-border">
        <button onClick={() => navigate("/messages")} className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full"><FiChevronLeft size={22} /></button>
        <Avatar src={other?.profilePic} name={other?.username} size="sm" />
        <div className="flex-1 cursor-pointer" onClick={() => navigate(`/profile/${other?.username}`)}>
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{other?.username}</p>
          <p className="text-xs text-green-500">{isTyping ? "typing…" : "Active now"}</p>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full text-gray-600 dark:text-gray-400"><FiPhone size={20} /></button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full text-gray-600 dark:text-gray-400"><FiVideo size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => {
          const isMe = msg.sender?.id === user?.id;
          const showAvatar = !isMe && (i === 0 || messages[i-1]?.sender?.id !== msg.sender?.id);
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {!isMe && <div className="w-7 flex-shrink-0">{showAvatar && <Avatar src={msg.sender?.profilePic} name={msg.sender?.username} size="xs" />}</div>}
              <div className={`max-w-[68%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                {msg.mediaUrl && <img src={msg.mediaUrl} alt="media" className="rounded-2xl max-w-full object-cover" />}
                {msg.text && (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-primary-500 text-white rounded-br-sm" : "bg-gray-100 dark:bg-dark-surface text-gray-800 dark:text-gray-200 rounded-bl-sm"}`}>
                    {msg.text}
                  </div>
                )}
                <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}{isMe && <span className="ml-1">{msg.status === "SEEN" ? "✓✓" : "✓"}</span>}</span>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-end gap-2">
            <Avatar src={other?.profilePic} name={other?.username} size="xs" />
            <div className="bg-gray-100 dark:bg-dark-surface rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2.5 px-4 py-3 border-t border-gray-200 dark:border-dark-border">
        <label className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageSend} />
          <FiImage size={22} />
        </label>
        <input value={text} onChange={handleTextChange} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
          placeholder="Message…" className="flex-1 bg-gray-100 dark:bg-dark-surface rounded-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 outline-none" />
        <button type="submit" disabled={!text.trim() || sending} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${text.trim() ? "bg-primary-500 hover:bg-primary-600 text-white" : "text-gray-300 dark:text-gray-600"}`}>
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
}
