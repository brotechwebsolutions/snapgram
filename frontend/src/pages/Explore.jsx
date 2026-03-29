import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { postAPI, searchAPI } from "../api/endpoints";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useDebounce } from "../hooks/useDebounce";
import InfiniteScroll from "react-infinite-scroll-component";
import PostGrid from "../components/post/PostGrid";
import Avatar from "../components/ui/Avatar";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

export default function Explore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("tag") ? `#${searchParams.get("tag")}` : "");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const debouncedQ = useDebounce(query, 400);

  const fetchPosts = useCallback((p) => postAPI.getExplore(p, 21).then(r => r.data.data), []);
  const { items: posts, hasMore, initialLoading, loadMore } = useInfiniteScroll(fetchPosts);

  useEffect(() => { loadMore(); }, []);

  useEffect(() => {
    if (!debouncedQ.trim()) { setSearchResults(null); return; }
    setSearching(true);
    searchAPI.search(debouncedQ).then(r => setSearchResults(r.data.data)).catch(() => {}).finally(() => setSearching(false));
  }, [debouncedQ]);

  const tags = ["photography","travel","food","fashion","art","nature","fitness","architecture","design","minimal"];

  return (
    <div className="max-w-[935px] mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-gray-50 dark:bg-black px-4 md:px-0 py-3 mb-4">
        <div className="relative max-w-[400px]">
          <FiSearch size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users, hashtags, posts…"
            className="input-base pl-10 pr-10 py-2.5 text-sm" />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><FiX size={16} /></button>}
        </div>
      </div>

      {searchResults ? (
        <div className="px-4 md:px-0">
          {searching && <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}
          {searchResults.users?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">People</h3>
              <div className="space-y-2">
                {searchResults.users.map(u => (
                  <div key={u.id} onClick={() => navigate(`/profile/${u.username}`)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface cursor-pointer">
                    <Avatar src={u.profilePic} name={u.username} size="md" />
                    <div><p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{u.username}</p><p className="text-xs text-gray-400">{u.fullName}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {searchResults.posts?.length > 0 && (<div><h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Posts</h3><PostGrid posts={searchResults.posts} /></div>)}
        </div>
      ) : (
        <>
          <div className="px-4 md:px-0 mb-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {tags.map(t => <button key={t} onClick={() => setQuery(`#${t}`)} className="flex-shrink-0 px-4 py-1.5 bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border rounded-full text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors">#{t}</button>)}
          </div>
          {initialLoading ? <div className="grid grid-cols-3 gap-0.5">{[...Array(9)].map((_, i) => <div key={i} className="skeleton aspect-square" />)}</div> : (
            <InfiniteScroll dataLength={posts.length} next={loadMore} hasMore={hasMore} loader={<div className="col-span-3 text-center py-4"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
              <PostGrid posts={posts} />
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
}
