import React, { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadApi } from "@/api/upload.api";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  folder,
  label = "Image",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Local object URL for instant preview before upload finishes
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    // Show image instantly from local file — no waiting for network
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file, folder);
      onChange(res.url); // replace local blob with real Cloudinary URL
    } catch (e: unknown) {
      const msg = (e as Error)?.message ?? "Upload failed. Please try again.";
      setError(msg);
    } finally {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && !uploading) handleFile(file);
  };

  const displayUrl = localPreview ?? value;

  return (
    <div>
      <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-2 block">
        {label}
      </label>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />

      {displayUrl ? (
        /* Preview */
        <div className="relative rounded-xl overflow-hidden border border-border-color group/img">
          <img
            src={displayUrl}
            alt="preview"
            className="w-full h-40 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/50 transition-all flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => !uploading && inputRef.current?.click()}
              className="opacity-0 group-hover/img:opacity-100 transition-opacity px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Change
            </button>
            <button
              type="button"
              onClick={() => !uploading && onChange("")}
              className="opacity-0 group-hover/img:opacity-100 transition-opacity p-2 bg-red-500/80 backdrop-blur-md rounded-lg text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-salon-gold animate-spin" />
              <span className="text-white text-xs font-bold">Uploading…</span>
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border-color rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-salon-gold hover:bg-salon-gold/5 transition-all"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-salon-gold animate-spin" />
          ) : (
            <>
              <div className="w-10 h-10 bg-salon-gold/10 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-salon-gold" />
              </div>
              <p className="text-sm text-text-secondary text-center">
                <span className="font-bold text-salon-gold">
                  Click to upload
                </span>{" "}
                or drag & drop
              </p>
              <p className="text-xs text-text-secondary">
                JPEG, PNG, WebP · max 10 MB
              </p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
