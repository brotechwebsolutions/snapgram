import { useState, useEffect, useRef } from "react";
import { FiX, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { storyAPI } from "../../api/endpoints";
import Avatar from "../ui/Avatar";
import { formatShort } from "../../utils/formatDate";

const STORY_DURATION = 5000;

export default function StoryViewer({ groups, initialGroup, onClose }) {
  const [groupIdx, setGroupIdx] = useState(initialGroup);
  const [storyIdx, setStoryIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState("");
  const timerRef = useRef(null);

  const group = groups[groupIdx];
  const story = group?.stories?.[storyIdx];

  useEffect(() => {
    if (!story) return;
    storyAPI.view(story.id).catch(() => {});
  }, [story?.id]);

  useEffect(() => {
    if (paused) {
      clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(nextStory, STORY_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [groupIdx, storyIdx, paused]);

  const nextStory = () => {
    if (storyIdx < (group?.stories?.length || 0) - 1) {
      setStoryIdx(p => p + 1);
    } else if (groupIdx < groups.length - 1) {
      setGroupIdx(p => p + 1);
      setStoryIdx(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (storyIdx > 0) {
      setStoryIdx(p => p - 1);
    } else if (groupIdx > 0) {
      setGroupIdx(p => p - 1);
      setStoryIdx(0);
    }
  };

  const handleReact = async (emoji) => {
    try {
      await storyAPI.react(story.id, emoji);
      toast.success(`${emoji} Reaction sent!`);
    } catch { /* silent */ }
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    setReply("");
    toast.success("Reply sent!");
  };

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div className="relative w-full h-full max-w-sm mx-auto">
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
          {group.stories.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
              {i < storyIdx && <div className="h-full bg-white w-full" />}
              {i === storyIdx && (
                <div
                  key={`${groupIdx}-${storyIdx}`}
                  className={`h-full bg-white ${paused ? "" : "story-progress-bar"}`}
                  style={paused ? undefined : undefined}
                />
              )}
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-8 right-4 text-white p-1 hover:bg-white/20 rounded-full z-10"
        >
          <FiX size={22} />
        </button>

        {/* User info */}
        <div className="absolute top-8 left-4 right-14 z-10 flex items-center gap-2">
          <Avatar src={group.user?.profilePic} name={group.user?.username} size="sm" />
          <div>
            <p className="text-white font-semibold text-sm">{group.user?.username}</p>
            <p className="text-white/60 text-xs">{formatShort(story.createdAt)}</p>
          </div>
        </div>

        {/* Story media */}
        <div
          className="w-full h-full bg-black flex items-center justify-center"
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <img src={story.mediaUrl} alt="story" className="w-full h-full object-cover" />
          {story.caption && (
            <div className="absolute bottom-28 left-4 right-4 bg-black/50 text-white text-sm p-3 rounded-xl backdrop-blur-sm">
              {story.caption}
            </div>
          )}
        </div>

        {/* Tap zones */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={prevStory} />
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full pointer-events-auto cursor-pointer" onClick={nextStory} />
        </div>

        {/* Emoji reactions */}
        <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2">
          {["❤️", "😂", "😮", "😢", "🔥"].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-xl hover:bg-white/30 transition-all hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Reply input */}
        <div className="absolute bottom-6 left-4 right-4 z-10 flex gap-2">
          <input
            value={reply}
            onChange={e => setReply(e.target.value)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={e => { if (e.key === "Enter") handleSendReply(); }}
            placeholder="Reply to story…"
            className="flex-1 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 rounded-full px-4 py-2 text-sm outline-none"
          />
          <button
            onClick={handleSendReply}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
