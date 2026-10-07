import React, { useState } from 'react';
import { Camera, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { api } from '../services/api.js';

interface PhotoUploaderProps {
  onPhotosUpdated: (urls: string[]) => void;
  existingPhotoUrls?: string[];
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotosUpdated,
  existingPhotoUrls = [],
}) => {
  const [photoUrls, setPhotoUrls] = useState<string[]>(existingPhotoUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg('');
    setIsUploading(true);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files (JPEG, PNG, WEBP, GIF) are allowed.');
        setIsUploading(false);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Each photo must be smaller than 10MB.');
        setIsUploading(false);
        return;
      }
      validFiles.push(file);
    }

    try {
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const url = await api.uploadFile(file);
        uploadedUrls.push(url);
      }

      const updated = [...photoUrls, ...uploadedUrls];
      setPhotoUrls(updated);
      onPhotosUpdated(updated);
      setIsUploading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload photo.');
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(updated);
    onPhotosUpdated(updated);
  };

  return (
    <div className="p-6 rounded-3xl bg-white border-3 border-[#FFE4E8] space-y-4 shadow-scrapbook">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-display font-bold text-[#332C35]">
          <Camera className="w-5 h-5 text-[#F57F17]" />
          <span>Photo Attachments</span>
        </div>

        <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#FFF9C4] border border-[#FFF59D] text-[#F57F17] font-display font-bold text-xs hover:bg-[#FFF59D] transition-colors shadow-xs">
          <ImageIcon className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : '+ Add Photos'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs font-display flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Photos Grid Preview */}
      {photoUrls.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
          {photoUrls.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-2xl border-2 border-[#FFE4E8] overflow-hidden bg-[#FFF5F5]">
              <img
                src={url}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-rose-500 transition-colors"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs font-display text-[#7A6E7D] italic border-2 border-dashed border-[#FFE4E8] rounded-2xl bg-[#FFFBF7]">
          No photos attached yet. Tap "+ Add Photos" to select photos from your device.
        </div>
      )}
    </div>
  );
};
