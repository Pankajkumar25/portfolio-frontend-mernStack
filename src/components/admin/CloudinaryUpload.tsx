"use client";

import { useCallback, useState } from "react";
import { HiUpload, HiX } from "react-icons/hi";
import toast from "react-hot-toast";

interface CloudinaryImage {
  url: string;
  publicId: string;
}

interface CloudinaryUploadProps {
  images: CloudinaryImage[];
  onChange: (images: CloudinaryImage[]) => void;
  maxImages?: number;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export default function CloudinaryUpload({ images, onChange, maxImages = 5 }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Cloudinary not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onChange([...images, { url: data.secure_url, publicId: data.public_id }]);
        toast.success("Image uploaded");
      } else {
        toast.error(data.error?.message || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [images, onChange]);

  const removeImage = (publicId: string) => {
    onChange(images.filter((img) => img.publicId !== publicId));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxImages - images.length;
    files.slice(0, remaining).forEach(uploadImage);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-gray-400 mb-1">Images ({images.length}/{maxImages})</label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div key={img.publicId || img.url} className="relative group aspect-video rounded-xl overflow-hidden glass">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.publicId)}
              className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <HiX size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="aspect-video rounded-xl glass border-2 border-dashed border-white/10 hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary transition-colors">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <HiUpload size={20} />
                <span className="text-xs">Upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}
