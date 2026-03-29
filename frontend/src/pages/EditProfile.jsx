import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import toast from "react-hot-toast";
import { FiCamera } from "react-icons/fi";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user?.fullName || "", bio: user?.bio || "", website: user?.website || "", isPrivate: user?.isPrivate || false });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(p => ({...p, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value}));

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const r = await userAPI.uploadAvatar(file); updateUser({ profilePic: r.data.data.profilePic }); toast.success("Profile picture updated!"); }
    catch { toast.error("Failed to upload"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const r = await userAPI.updateProfile(form); updateUser(r.data.data); toast.success("Profile updated!"); navigate(`/profile/${user?.username}`); }
    catch { toast.error("Update failed"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">←</button>
        <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">Edit Profile</h1>
      </div>
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar src={user?.profilePic} name={user?.username} size="xl" />
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 border-2 border-white dark:border-dark-bg">
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <FiCamera size={14} className="text-white" />
          </label>
        </div>
        <p className="text-primary-500 font-semibold text-sm mt-3 cursor-pointer hover:underline">Change profile photo</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Full name" value={form.fullName} onChange={set("fullName")} placeholder="Your full name" />
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label><textarea value={form.bio} onChange={set("bio")} placeholder="Tell people about yourself…" maxLength={150} className="input-base resize-none h-24" /><p className="text-right text-xs text-gray-400 mt-1">{form.bio.length}/150</p></div>
        <Input label="Website" value={form.website} onChange={set("website")} placeholder="https://yourwebsite.com" type="url" />
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isPrivate} onChange={set("isPrivate")} className="rounded" />
          <div><p className="font-medium text-sm text-gray-900 dark:text-gray-100">Private account</p><p className="text-xs text-gray-400">Only approved followers can see your posts</p></div>
        </label>
        <Button type="submit" loading={loading} className="w-full">Save changes</Button>
      </form>
    </div>
  );
}
