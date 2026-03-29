import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postAPI, commentAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";
import { PostSkeleton } from "../components/ui/Skeleton";
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal, FiX } from "react-icons/fi";
import { formatNumber } from "../utils/helpers";
import { timeAgo } from "../utils/formatDate";
import toast from "react-hot-toast";

export default function PostDetail() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    postAPI.getPost(postId)
      .then(r => {
        const p = r.data.data;
        setPost(p);
        setLiked(p.isLiked || false);
        setSaved(p.isSaved || false);
        setLikesCount(p.likesCount || 0);
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));

    commentAPI.get(postId)
      .then(r => setComments(r.data.data?.content || []))
      .catch(() => {});
  }, [postId]);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(c => c + (wasLiked ? -1 : 1));
    try {
      wasLiked ? await postAPI.unlike(postId) : await postAPI.like(postId);
    } catch {
      setLiked(wasLiked);
      setLikesCount(c => c + (wasLiked ? 1 : -1));
    }
  };

  const handleSave = async () => {
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      wasSaved ? await postAPI.unsave(postId) : await postAPI.save(postId);
      toast.success(wasSaved ? "Removed from saved" : "Saved!");
    } catch {
      setSaved(wasSaved);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const r = await commentAPI.add(postId, { text: commentText });
      setComments(prev => [r.data.data, ...prev]);
      setCommentText("");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto p-4">
      <PostSkeleton />
    </div>
  );
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={() => navigate(-1)}
    >
      <button
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10"
        onClick={() => navigate(-1)}
      >
        <FiX size={24} />
      </button>

      <div
        className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="md:w-[58%] bg-black flex items-center justify-center min-h-[300px]">
          {post.imageUrls?.[0] ? (
            <img src={post.imageUrls[0]} alt="post" className="w-full max-h-[80vh] object-contain" />
          ) : (
            <div className="aspect-square w-full bg-gray-900 flex items-center justify-center text-6xl">📷</div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col md:w-[42%] min-h-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-dark-border flex-shrink-0">
            <Avatar src={post.user?.profilePic} name={post.user?.username} size="sm" ring />
            <p
              className="font-semibold text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${post.user?.username}`)}
            >
              {post.user?.username}
            </p>
            <button className="ml-auto text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <FiMoreHorizontal size={20} />
            </button>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {post.caption && (
              <div className="flex gap-2">
                <Avatar src={post.user?.profilePic} name={post.user?.username} size="xs" />
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold mr-1">{post.user?.username}</span>
                    {post.caption}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.createdAt)}</p>
                </div>
              </div>
            )}
            {comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <Avatar src={c.user?.profilePic} name={c.user?.username} size="xs" />
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold mr-1">{c.user?.username}</span>
                    {c.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(c.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-dark-border p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-4">
                <button
                  onClick={handleLike}
                  className={`transition-transform hover:scale-110 ${liked ? "text-accent-500" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {liked ? <FiHeart size={24} fill="currentColor" /> : <FiHeart size={24} />}
                </button>
                <button className="text-gray-700 dark:text-gray-300"><FiMessageCircle size={24} /></button>
                <button
                  onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/p/${postId}`); toast.success("Link copied!"); }}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <FiSend size={22} />
                </button>
              </div>
              <button
                onClick={handleSave}
                className={saved ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}
              >
                {saved ? <FiBookmark size={22} fill="currentColor" /> : <FiBookmark size={22} />}
              </button>
            </div>
            <p className="font-semibold text-sm mb-1">{formatNumber(likesCount)} likes</p>
            <p className="text-xs text-gray-400 mb-3">{timeAgo(post.createdAt)}</p>

            <form
              onSubmit={handleComment}
              className="flex gap-2 border-t border-gray-100 dark:border-dark-border pt-3"
            >
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 text-sm bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-primary-500 font-semibold text-sm disabled:opacity-50"
                >
                  {submitting ? "…" : "Post"}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
