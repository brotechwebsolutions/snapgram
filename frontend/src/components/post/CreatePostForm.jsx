import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../../api/endpoints";
import { resizeImage, extractHashtags } from "../../utils/helpers";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { FiX, FiMapPin, FiImage, FiPlus } from "react-icons/fi";

export default function CreatePostForm() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select");

  const onDrop = useCallback(async (accepted) => {
    const resized = await Promise.all(accepted.slice(0, 10).map(f => resizeImage(f)));
    setFiles(resized);
    setPreviews(resized.map(f => URL.createObjectURL(f)));
    setStep("edit");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] }, maxFiles: 10 });

  const removeImage = (i) => { setFiles(f => f.filter((_,idx) => idx !== i)); setPreviews(p => p.filter((_,idx) => idx !== i)); if (files.length === 1) setStep("select"); };

  const handleSubmit = async () => {
    if (!files.length) { toast.error("Please add at least one image"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("images", f));
      const postData = { caption, hashtags: extractHashtags(caption), location, commentsDisabled };
      fd.append("post", new Blob([JSON.stringify(postData)], { type: "application/json" }));
      await postAPI.create(fd);
      toast.success("Post shared! 🎉");
      navigate("/");
    } catch { toast.error("Failed to create post"); } finally { setLoading(false); }
  };

  if (step === "select") return (
    <div className="max-w-xl mx-auto p-6">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${isDragActive ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" : "border-gray-300 dark:border-dark-border hover:border-primary-400"}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-dark-surface rounded-full flex items-center justify-center"><FiImage size={32} className="text-gray-400" /></div>
          <div><p className="font-semibold text-lg text-gray-700 dark:text-gray-300">Drag photos here</p><p className="text-sm text-gray-400 mt-1">or tap to select from your device</p></div>
          <button type="button" className="btn-primary mt-2">Select from device</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="card overflow-hidden">
        <div className="md:flex">
          {/* Image preview */}
          <div className="md:w-1/2">
            <div className="relative aspect-square bg-gray-100 dark:bg-dark-surface">
              <img src={previews[0]} alt="preview" className="w-full h-full object-cover" />
              {previews.length > 1 && (
                <div className="absolute bottom-2 left-2 right-2 flex gap-1 overflow-x-auto scrollbar-hide">
                  {previews.map((p, i) => (
                    <div key={i} className="relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 border-white">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"><FiX size={10} /></button>
                    </div>
                  ))}
                  <div {...getRootProps()} className="flex-shrink-0 w-12 h-12 rounded border-2 border-dashed border-gray-300 dark:border-dark-border flex items-center justify-center cursor-pointer hover:border-primary-500"><input {...getInputProps()} /><FiPlus size={16} className="text-gray-400" /></div>
                </div>
              )}
            </div>
          </div>
          {/* Form */}
          <div className="md:w-1/2 p-5 flex flex-col gap-4">
            <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption... use #hashtags and @mentions"
              className="w-full text-sm resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 leading-relaxed min-h-[100px]" maxLength={2200} />
            <div className="text-right text-xs text-gray-400">{caption.length}/2200</div>
            <div className="flex items-center gap-2 border-t border-gray-100 dark:border-dark-border pt-3">
              <FiMapPin size={18} className="text-gray-400 flex-shrink-0" />
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Add location" className="flex-1 text-sm bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer border-t border-gray-100 dark:border-dark-border pt-3">
              <input type="checkbox" checked={commentsDisabled} onChange={e => setCommentsDisabled(e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Disable comments</span>
            </label>
            <div className="flex gap-3 mt-2">
              <button onClick={() => { setStep("select"); setFiles([]); setPreviews([]); }} className="flex-1 btn-secondary">Discard</button>
              <Button onClick={handleSubmit} loading={loading} className="flex-1">Share</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
