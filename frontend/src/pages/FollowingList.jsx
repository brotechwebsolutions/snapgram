import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { FiChevronLeft } from "react-icons/fi";
import toast from "react-hot-toast";

export default function FollowingList() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [followState, setFollowState]     = useState({});

  useEffect(() => {
    userAPI.getUser(username)
      .then(r => {
        const userId = r.data.data?.id;
        if (!userId) return;
        return userAPI.getFollowing(userId);
      })
      .then(r => setFollowingList(r?.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  const toggleFollow = async (u) => {
    const wasFollowing = followState[u.id] ?? u.isFollowing;
    setFollowState(prev => ({ ...prev, [u.id]: !wasFollowing }));
    try {
      wasFollowing ? await userAPI.unfollow(u.id) : await userAPI.follow(u.id);
      if (!wasFollowing) toast.success(`Following ${u.username}!`);
    } catch {
      setFollowState(prev => ({ ...prev, [u.id]: wasFollowing }));
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full">
          <FiChevronLeft size={22} />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">Following</h1>
      </div>

      {loading ? (
        <div className="p-4 space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton w-12 h-12 rounded-full" />
              <div className="flex-1"><div className="skeleton h-3 w-28 mb-2 rounded"/><div className="skeleton h-2 w-20 rounded"/></div>
            </div>
          ))}
        </div>
      ) : followingList.length === 0 ? (
        <EmptyState icon="👥" title="Not following anyone" subtitle="When this account follows someone, they'll appear here." />
      ) : (
        <div>
          {followingList.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-surface/50 transition-colors">
              <div className="cursor-pointer" onClick={() => navigate(`/profile/${u.username}`)}>
                <Avatar src={u.profilePic} name={u.username} size="md" />
              </div>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${u.username}`)}>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{u.username}</p>
                <p className="text-xs text-gray-400 truncate">{u.fullName}</p>
              </div>
              {u.id !== currentUser?.id && (
                <Button
                  variant={followState[u.id] ?? u.isFollowing ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => toggleFollow(u)}
                >
                  {followState[u.id] ?? u.isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
