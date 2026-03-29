import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI, postAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import ProfileHeader from "../components/profile/ProfileHeader";
import PostGrid from "../components/post/PostGrid";
import { ProfileSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { FiGrid, FiFilm, FiBookmark } from "react-icons/fi";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate as useNav } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const initialized = useRef(false);
  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    initialized.current = false;
    setLoading(true);
    setError(null);
    setProfile(null);

    // getUser now calls /users/by-username/:username (fixed endpoint)
    userAPI.getUser(username)
      .then(r => setProfile(r.data.data))
      .catch(() => setError("User not found"))
      .finally(() => setLoading(false));
  }, [username]);

  const fetchPosts = useCallback(
    (page) => {
      if (!profile?.id) return Promise.resolve({ content: [], hasNext: false });
      return postAPI.getUserPosts(profile.id, page).then(r => r.data.data);
    },
    [profile?.id]
  );

  const { items: posts, hasMore, initialLoading, loadMore } = useInfiniteScroll(fetchPosts);

  useEffect(() => {
    if (!profile?.id || initialized.current) return;
    initialized.current = true;
    loadMore();
  }, [profile?.id]);

  const tabs = [
    { id: "posts",  icon: FiGrid,     label: "Posts" },
    { id: "reels",  icon: FiFilm,     label: "Reels" },
    { id: "saved",  icon: FiBookmark, label: "Saved" },
  ];

  if (loading) return <ProfileSkeleton />;
  if (error)   return (
    <EmptyState
      icon="👤"
      title="User not found"
      subtitle="This account doesn't exist or has been removed."
      action={<button onClick={() => navigate(-1)} className="btn-secondary">Go back</button>}
    />
  );
  if (!profile) return null;

  return (
    <div className="max-w-[935px] mx-auto">
      <ProfileHeader
        profile={profile}
        onUpdate={setProfile}
        isOwnProfile={isOwnProfile}
      />

      {/* Tab bar */}
      <div className="flex border-t border-gray-200 dark:border-dark-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? "border-t-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 -mt-px"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeTab === "posts" && (
        initialLoading ? (
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="skeleton aspect-square" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon="📷"
            title="No posts yet"
            subtitle={isOwnProfile
              ? "Share your first photo!"
              : `${username} hasn't posted yet.`}
            action={isOwnProfile
              ? <button onClick={() => navigate("/create")} className="btn-primary">Create Post</button>
              : null}
          />
        ) : (
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="grid grid-cols-3 gap-0.5">
                {[1, 2, 3].map(i => <div key={i} className="skeleton aspect-square" />)}
              </div>
            }
          >
            <PostGrid posts={posts} />
          </InfiniteScroll>
        )
      )}

      {activeTab === "reels" && (
        <EmptyState icon="🎬" title="No reels yet" subtitle="Video reels coming soon." />
      )}

      {activeTab === "saved" && !isOwnProfile && (
        <EmptyState icon="🔒" title="Private" subtitle="Only the account owner can see saved posts." />
      )}

      {activeTab === "saved" && isOwnProfile && (
        <div className="p-4 text-center">
          <button onClick={() => navigate("/saved")} className="btn-primary">
            View Saved Posts
          </button>
        </div>
      )}
    </div>
  );
}
