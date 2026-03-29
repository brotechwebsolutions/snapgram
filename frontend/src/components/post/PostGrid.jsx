import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { formatNumber } from "../../utils/helpers";

export default function PostGrid({ posts }) {
  if (!posts?.length) return null;
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map(post => (
        <Link key={post.id} to={`/p/${post.id}`} className="relative aspect-square bg-gray-100 dark:bg-dark-surface group overflow-hidden">
          {post.imageUrls?.[0] ? (
            <img src={post.imageUrls[0]} alt="post" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-50 dark:from-dark-surface dark:to-dark-card flex items-center justify-center text-3xl">📷</div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
            <div className="flex items-center gap-1.5 font-semibold"><FiHeart size={18} fill="white" />{formatNumber(post.likesCount)}</div>
            <div className="flex items-center gap-1.5 font-semibold"><FiMessageCircle size={18} fill="white" />{formatNumber(post.commentsCount)}</div>
          </div>
          {post.imageUrls?.length > 1 && <div className="absolute top-2 right-2 bg-black/60 rounded text-white text-xs px-1">⊞</div>}
        </Link>
      ))}
    </div>
  );
}
