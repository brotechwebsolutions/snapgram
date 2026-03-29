import { useEffect, useState } from "react";
import { notificationAPI } from "../api/endpoints";
import Avatar from "../components/ui/Avatar";
import { formatShort } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { NotifSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import toast from "react-hot-toast";

const icons = { LIKE: "❤️", COMMENT: "💬", FOLLOW: "👤", MENTION: "@", REPLY: "↩️", STORY_REACT: "😍" };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    notificationAPI.get().then(r => setNotifications(r.data.data?.content || [])).finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    toast.success("All marked as read");
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-4 flex items-center justify-between">
        <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">Notifications</h1>
        <button onClick={handleMarkRead} className="text-sm text-primary-500 font-semibold hover:underline">Mark all read</button>
      </div>
      {loading ? <NotifSkeleton /> : notifications.length === 0 ? <EmptyState icon="🔔" title="No notifications" subtitle="When someone likes or comments on your posts, you'll see it here." /> : (
        <div>
          {notifications.map(n => (
            <div key={n.id} onClick={() => n.postId && navigate(`/p/${n.postId}`)}
              className={`flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-colors ${n.isRead ? "hover:bg-gray-50 dark:hover:bg-dark-surface/50" : "bg-primary-50 dark:bg-primary-900/10 hover:bg-primary-100/60 dark:hover:bg-primary-900/20"}`}>
              <div className="relative flex-shrink-0">
                <Avatar src={n.sender?.profilePic} name={n.sender?.username} size="md" />
                <div className="absolute -bottom-1 -right-1 text-sm">{icons[n.type]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                  <span className="font-semibold cursor-pointer hover:underline" onClick={e => { e.stopPropagation(); navigate(`/profile/${n.sender?.username}`); }}>{n.sender?.username}</span>
                  {" "}{n.message}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatShort(n.createdAt)}</p>
              </div>
              {!n.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
