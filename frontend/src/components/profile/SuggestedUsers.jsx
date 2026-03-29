import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import toast from "react-hot-toast";

export default function SuggestedUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [following, setFollowing] = useState({});

  useEffect(() => { userAPI.getSuggestions().then(r => setSuggestions(r.data.data || [])).catch(() => {}); }, []);

  const handleFollow = async (u) => {
    const wasFollowing = following[u.id];
    setFollowing(p => ({...p, [u.id]: !wasFollowing}));
    try { wasFollowing ? await userAPI.unfollow(u.id) : await userAPI.follow(u.id); if (!wasFollowing) toast.success(`Following ${u.username}!`); }
    catch { setFollowing(p => ({...p, [u.id]: wasFollowing})); }
  };

  return (
    <div className="sticky top-6">
      {user && (
        <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
          <Avatar src={user.profilePic} name={user.username} size="md" />
          <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{user.username}</p><p className="text-xs text-gray-400 truncate">{user.fullName}</p></div>
          <button className="text-primary-500 font-semibold text-xs hover:text-primary-600">Switch</button>
        </div>
      )}
      {suggestions.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4"><p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Suggested for you</p><button className="text-xs font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-600">See all</button></div>
          <div className="space-y-3">
            {suggestions.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <Avatar src={u.profilePic} name={u.username} size="sm" />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${u.username}`)}>
                  <p className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate">{u.username}</p>
                  <p className="text-xs text-gray-400 truncate">{u.followersCount} followers</p>
                </div>
                <button onClick={() => handleFollow(u)} className={`text-xs font-semibold ${following[u.id] ? "text-gray-400 hover:text-red-400" : "text-primary-500 hover:text-primary-600"}`}>
                  {following[u.id] ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-8">© 2025 SnapGram · Privacy · Terms</p>
        </>
      )}
    </div>
  );
}
