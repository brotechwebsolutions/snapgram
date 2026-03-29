import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal, FiMapPin, FiX } from "react-icons/fi";
import { postAPI, commentAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import { formatShort } from "../../utils/formatDate";
import { formatNumber } from "../../utils/helpers";
import CommentInput from "./CommentInput";
import toast from "react-hot-toast";

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const lastTap = useRef(0);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(c => c + (wasLiked ? -1 : 1));
    try {
      wasLiked ? await postAPI.unlike(post.id) : await postAPI.like(post.id);
    } catch {
      setLiked(wasLiked);
      setLikesCount(c => c + (wasLiked ? 1 : -1));
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) {
        handleLike();
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
      }
    }
    lastTap.current = now;
  };

  const handleSave = async () => {
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      wasSaved ? await postAPI.unsave(post.id) : await postAPI.save(post.id);
      toast.success(wasSaved ? "Removed from saved" : "Saved to collection!");
    } catch {
      setSaved(wasSaved);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/p/${post.id}`);
    toast.success("Link copied to clipboard!");
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const r = await commentAPI.get(post.id);
        setComments(r.data.data?.content || []);
      } catch { /* silent */ } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(p => !p);
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const images = post.imageUrls || [];

  return (
    <article className="card mb-4 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate(`/profile/${post.user?.username}`)}
        >
          <Avatar src={post.user?.profilePic} name={post.user?.username} size="sm" ring />
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              {post.user?.username}
            </p>
            {post.location && (
              <p className="text-[11px] text-gray-400 flex items-center gap-0.5">
                <FiMapPin size={10} />
                {post.location}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatShort(post.createdAt)}</span>
          <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full">
            <FiMoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Image carousel */}
      <div className="relative bg-gray-100 dark:bg-dark-surface overflow-hidden" onClick={handleDoubleTap}>
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIdx]}
              alt="post"
              className="w-full aspect-square object-cover select-none"
              draggable={false}
            />
            {images.length > 1 && (
              <>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
                {imgIdx > 0 && (
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx(p => p - 1); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white text-lg"
                  >
                    ‹
                  </button>
                )}
                {imgIdx < images.length - 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx(p => p + 1); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white text-lg"
                  >
                    ›
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-primary-50 to-accent-50 dark:from-dark-surface dark:to-dark-card flex items-center justify-center">
            <span className="text-gray-300 dark:text-gray-700 text-6xl">📷</span>
          </div>
        )}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-7xl double-tap-heart">❤️</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`transition-transform hover:scale-110 active:scale-90 ${liked ? "text-accent-500" : "text-gray-700 dark:text-gray-300"}`}
            >
              {liked ? <FiHeart size={23} fill="currentColor" /> : <FiHeart size={23} />}
            </button>
            <button
              onClick={handleToggleComments}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <FiMessageCircle size={23} />
            </button>
            <button
              onClick={handleShare}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <FiSend size={21} />
            </button>
          </div>
          <button
            onClick={handleSave}
            className={`transition-transform hover:scale-110 active:scale-90 ${saved ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}`}
          >
            {saved ? <FiBookmark size={22} fill="currentColor" /> : <FiBookmark size={22} />}
          </button>
        </div>

        {likesCount > 0 && (
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
            {formatNumber(likesCount)} {likesCount === 1 ? "like" : "likes"}
          </p>
        )}

        {post.caption && (
          <p className="text-sm text-gray-800 dark:text-gray-200 mb-1 leading-relaxed">
            <Link
              to={`/profile/${post.user?.username}`}
              className="font-semibold mr-1 hover:underline"
            >
              {post.user?.username}
            </Link>
            {post.caption.split(" ").map((word, i) =>
              word.startsWith("#") ? (
                <Link key={i} to={`/explore?tag=${word.slice(1)}`} className="text-primary-500 hover:underline">
                  {word}{" "}
                </Link>
              ) : word.startsWith("@") ? (
                <Link key={i} to={`/profile/${word.slice(1)}`} className="text-primary-500 hover:underline">
                  {word}{" "}
                </Link>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </p>
        )}

        {post.commentsCount > 0 && !showComments && (
          <button
            onClick={handleToggleComments}
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-2 block"
          >
            View all {formatNumber(post.commentsCount)} comments
          </button>
        )}

        {showComments && (
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto mb-2">
            {loadingComments ? (
              <div className="space-y-2">
                {[1, 2].map(i => <div key={i} className="skeleton h-3 w-full rounded" />)}
              </div>
            ) : (
              comments.map(c => (
                <div key={c.id} className="flex gap-2 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 flex-shrink-0">
                    {c.user?.username}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{c.text}</span>
                </div>
              ))
            )}
          </div>
        )}

        {!post.commentsDisabled && (
          <CommentInput postId={post.id} onAdded={handleCommentAdded} />
        )}
        {post.commentsDisabled && (
          <p className="text-xs text-gray-400 mt-1">Comments are turned off</p>
        )}
      </div>
    </article>
  );
}
