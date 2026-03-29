import { useCallback, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { postAPI } from "../api/endpoints";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import StoryBar from "../components/story/StoryBar";
import PostCard from "../components/post/PostCard";
import { PostSkeleton } from "../components/ui/Skeleton";
import SuggestedUsers from "../components/profile/SuggestedUsers";

export default function Feed() {
  const initialized = useRef(false);
  const fetchPosts = useCallback(
    (page) => postAPI.getFeed(page).then(r => r.data.data),
    []
  );
  const { items: posts, hasMore, loading, initialLoading, loadMore, setItems } = useInfiniteScroll(fetchPosts);

  // FIX: use ref to prevent double-fire in React 18 StrictMode
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadMore();
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setItems(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  return (
    <div className="max-w-[975px] mx-auto px-0 md:px-4 xl:px-0 py-0 md:py-6 flex gap-8">
      {/* Main feed column */}
      <div className="flex-1 min-w-0 max-w-[614px]">
        {/* Stories */}
        <div className="card mb-4 md:rounded-2xl rounded-none overflow-hidden">
          <StoryBar />
        </div>

        {/* Posts */}
        {initialLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<PostSkeleton />}
            endMessage={
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">You're all caught up! 🎉</p>
              </div>
            }
          >
            {posts.map(post => (
              <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} />
            ))}
          </InfiniteScroll>
        )}
      </div>

      {/* Right panel - desktop only */}
      <div className="hidden xl:block w-[320px] flex-shrink-0">
        <SuggestedUsers />
      </div>
    </div>
  );
}
