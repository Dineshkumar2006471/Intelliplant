'use client';

import { useRef, useState } from 'react';

export default function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Optionally show a success toast here
      console.log('Upload successful');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        onClick={handleUploadClick}
        disabled={uploading}
        className="h-10 px-4 bg-interactive-primary text-white text-sm font-medium rounded-sm hover:bg-interactive-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
      >
        {uploading ? (
          <span className="w-4 h-4 shadow-sm rounded-sm flex items-center justify-center bg-interactive-hover text-xs animate-spin border border-white border-t-transparent"></span>
        ) : null}
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </>
  );
}
