import { useState } from "react";
import { commentAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import toast from "react-hot-toast";

export default function CommentInput({ postId, onAdded, disabled }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    setLoading(true);
    try {
      const r = await commentAPI.add(postId, { text });
      onAdded?.(r.data.data);
      setText("");
    } catch { toast.error("Failed to post comment"); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2.5 pt-2 border-t border-gray-100 dark:border-dark-border mt-2">
      <Avatar src={user?.profilePic} name={user?.username} size="xs" />
      <input value={text} onChange={e => setText(e.target.value)} disabled={disabled}
        placeholder={disabled ? "Comments are disabled" : "Add a comment…"}
        className="flex-1 text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none" />
      {text.trim() && (
        <button type="submit" disabled={loading} className="text-primary-500 font-semibold text-sm hover:text-primary-600 disabled:opacity-50">
          {loading ? "…" : "Post"}
        </button>
      )}
    </form>
  );
}
