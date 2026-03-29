export const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n?.toString() || "0";
};
export const getInitials = (name) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";
export const extractHashtags = (text) => (text.match(/#\w+/g) || []).map(t => t.slice(1));
export const extractMentions = (text) => (text.match(/@\w+/g) || []).map(m => m.slice(1));
export const fileToBase64 = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
export const resizeImage = async (file, maxWidth = 1080) => {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = Math.floor(h * maxWidth / w); w = maxWidth; }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => res(new File([blob], file.name, { type: "image/jpeg" })), "image/jpeg", 0.85);
    };
    img.src = URL.createObjectURL(file);
  });
};
