import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { storyAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export default function StoryUpload({ onClose, onUploaded }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(files => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "image/*": [], "video/*": [] }, maxFiles: 1 });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("media", file);
      fd.append("caption", caption);
      const r = await storyAPI.upload(fd);
      onUploaded({ user, stories: [r.data.data], hasUnviewed: false });
      toast.success("Story uploaded!");
    } catch (e) { toast.error("Upload failed"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-semibold text-lg mb-4">Add Story</h3>
        {!preview ? (
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl p-10 text-center cursor-pointer hover:border-primary-500 transition-colors">
            <input {...getInputProps()} />
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-500 text-sm">Tap to select a photo or video</p>
          </div>
        ) : (
          <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
        {preview && <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..." className="input-base mt-3 mb-4" />}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          {preview && <Button onClick={handleUpload} loading={loading} className="flex-1">Share Story</Button>}
        </div>
      </div>
    </div>
  );
}
