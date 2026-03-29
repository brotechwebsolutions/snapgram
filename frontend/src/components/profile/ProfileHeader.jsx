import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { formatNumber } from "../../utils/helpers";
import { FiSettings, FiMoreHorizontal, FiLink } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProfileHeader({ profile, onUpdate, isOwnProfile }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(profile.isFollowing);
  const [followerCount, setFollowerCount] = useState(profile.followersCount);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const handleFollow = async () => {
    setLoadingFollow(true);
    try {
      if (following) { await userAPI.unfollow(profile.id); setFollowing(false); setFollowerCount(c => c - 1); toast.success(`Unfollowed ${profile.username}`); }
      else { await userAPI.follow(profile.id); setFollowing(true); setFollowerCount(c => c + 1); toast.success(`Following ${profile.username}!`); }
    } catch {} finally { setLoadingFollow(false); }
  };

  const shareProfile = () => { navigator.clipboard?.writeText(window.location.href); toast.success("Profile link copied!"); };

  return (
    <div className="p-4 md:p-6">
      {/* Cover */}
      {profile.coverPhoto && (
        <div className="relative -mx-4 md:-mx-6 -mt-4 md:-mt-6 h-32 md:h-48 mb-4 overflow-hidden rounded-b-2xl">
          <img src={profile.coverPhoto} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="flex items-start gap-4 md:gap-8 mb-5">
        <Avatar src={profile.profilePic} name={profile.username} size="xl" ring={profile.stories?.length > 0} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{profile.username}</h1>
            {profile.emailVerified && <span className="text-primary-500 text-sm">✓</span>}
          </div>
          {profile.fullName && <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{profile.fullName}</p>}

          {/* Stats - desktop */}
          <div className="hidden md:flex gap-6">
            <StatItem value={profile.postsCount} label="posts" />
            <StatItem value={followerCount} label="followers" onClick={() => navigate(`/profile/${profile.username}/followers`)} />
            <StatItem value={profile.followingCount} label="following" onClick={() => navigate(`/profile/${profile.username}/following`)} />
          </div>
        </div>
      </div>

      {/* Stats - mobile */}
      <div className="flex md:hidden gap-4 mb-4 border-y border-gray-100 dark:border-dark-border py-3">
        <StatItem value={profile.postsCount} label="posts" />
        <StatItem value={followerCount} label="followers" />
        <StatItem value={profile.followingCount} label="following" />
      </div>

      {/* Bio */}
      {profile.bio && <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">{profile.bio}</p>}
      {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-500 flex items-center gap-1 mb-4 hover:underline"><FiLink size={13} />{profile.website}</a>}

      {/* Buttons */}
      <div className="flex gap-2.5">
        {isOwnProfile ? (
          <>
            <button onClick={() => navigate("/edit-profile")} className="flex-1 btn-secondary text-sm">Edit Profile</button>
            <button onClick={shareProfile} className="flex-1 btn-secondary text-sm">Share Profile</button>
            <button onClick={() => navigate("/settings")} className="btn-secondary p-2.5"><FiSettings size={18} /></button>
          </>
        ) : (
          <>
            <Button onClick={handleFollow} loading={loadingFollow} variant={following ? "secondary" : "primary"} className="flex-1 text-sm">
              {following ? "Following" : "Follow"}
            </Button>
            <button onClick={() => navigate("/messages")} className="flex-1 btn-secondary text-sm">Message</button>
            <button className="btn-secondary p-2.5"><FiMoreHorizontal size={18} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function StatItem({ value, label, onClick }) {
  return (
    <div className={`flex-1 text-center ${onClick ? "cursor-pointer hover:opacity-80" : ""}`} onClick={onClick}>
      <div className="font-bold text-base md:text-lg text-gray-900 dark:text-gray-100">{formatNumber(value || 0)}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
