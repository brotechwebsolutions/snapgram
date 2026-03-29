import { useCallback, useEffect } from "react";
import { postAPI } from "../api/endpoints";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import PostGrid from "../components/post/PostGrid";
import EmptyState from "../components/ui/EmptyState";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

export default function Saved() {
  const navigate = useNavigate();
  const fetchPosts = useCallback((page) => postAPI.getSaved(page).then(r => r.data.data), []);
  const { items: posts, hasMore, initialLoading, loadMore } = useInfiniteScroll(fetchPosts);
  useEffect(() => { loadMore(); }, []);
  return (
    <div className="max-w-[935px] mx-auto">
      <div className="sticky top-0 z-10 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">←</button>
        <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">Saved</h1>
      </div>
      {initialLoading ? <div className="grid grid-cols-3 gap-0.5">{[...Array(9)].map((_,i) => <div key={i} className="skeleton aspect-square" />)}</div> :
        posts.length === 0 ? <EmptyState icon="🔖" title="No saved posts" subtitle="Save posts by tapping the bookmark icon." /> : (
        <InfiniteScroll dataLength={posts.length} next={loadMore} hasMore={hasMore} loader={<div />}><PostGrid posts={posts} /></InfiniteScroll>
      )}
    </div>
  );
}
