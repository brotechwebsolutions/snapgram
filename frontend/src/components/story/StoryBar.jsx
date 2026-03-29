import { useState, useEffect } from "react";
import { storyAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import StoryViewer from "./StoryViewer";
import StoryUpload from "./StoryUpload";

export default function StoryBar() {
  const { user } = useAuth();
  const [storyGroups, setStoryGroups] = useState([]);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    storyAPI.getFeed().then(r => setStoryGroups(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <>
      <div className="flex gap-4 px-4 md:px-0 py-4 overflow-x-auto scrollbar-hide">
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer" onClick={() => setShowUpload(true)}>
          <div className="relative w-16 h-16">
            <Avatar src={user?.profilePic} name={user?.username} size="lg" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-card">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
          <span className="text-[11px] text-gray-600 dark:text-gray-400 max-w-[64px] truncate text-center">Your story</span>
        </div>

        {storyGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer" onClick={() => setViewingGroup(idx)}>
            <div className={`p-[2.5px] rounded-full ${group.hasUnviewed ? "bg-gradient-to-br from-accent-500 via-orange-400 to-primary-500" : "bg-gray-300 dark:bg-gray-700"}`}>
              <div className="bg-white dark:bg-dark-card p-[2px] rounded-full">
                <Avatar src={group.user?.profilePic} name={group.user?.username} size="lg" />
              </div>
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 max-w-[64px] truncate text-center">{group.user?.username}</span>
          </div>
        ))}
      </div>

      {viewingGroup !== null && (
        <StoryViewer groups={storyGroups} initialGroup={viewingGroup} onClose={() => setViewingGroup(null)} />
      )}
      {showUpload && <StoryUpload onClose={() => setShowUpload(false)} onUploaded={(g) => { setStoryGroups(prev => [g, ...prev]); setShowUpload(false); }} />}
    </>
  );
}
