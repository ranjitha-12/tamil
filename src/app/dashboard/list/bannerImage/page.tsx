'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CarouselImage {
  _id: string;
  url: string;
  public_id: string;
}

const BannerImagePage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBannerImages = async () => {
    try {
      const res = await fetch('/api/carousel');
      const data = await res.json();
      setExistingImages(data);
    } catch (err) {
      console.error('Error fetching banner images:', err);
    }
  };

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selected = Array.from(files);
      setSelectedFiles(prev => [...prev, ...selected]);
      const newPreviews = selected.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setLoading(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/carousel', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        setExistingImages(prev => [data, ...prev]);
      }

      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (public_id: string) => {
    try {
      await fetch(`/api/carousel?id=${encodeURIComponent(public_id)}`, {
        method: 'DELETE',
      });
      setExistingImages(prev => prev.filter(img => img.public_id !== public_id));
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };
  const handleRemovePreview = (index: number) => {
  setPreviews(prev => prev.filter((_, i) => i !== index));
  setSelectedFiles(prev => prev.filter((_, i) => i !== index));
};

  return (
    <div className="bg-white rounded-md flex-1 m-4 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-lg font-semibold mb-6">Add Banner Images</h1>
      </div>

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {existingImages.map((img) => (
            <div key={img._id} className="relative border rounded overflow-hidden">
              <Image
                src={img.url}
                alt="Banner"
                width={600}
                height={300}
                className="object-cover w-full h-[200px]"
              />
              <button
                onClick={() => handleDelete(img.public_id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File input */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
      />

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {previews.map((url, idx) => (
            <div key={idx} className="relative border rounded overflow-hidden">
              <Image
                src={url}
                alt={`Preview ${idx}`}
                width={600}
                height={300}
                className="object-cover w-full h-[200px]"
              />
              <button onClick={() => handleRemovePreview(idx)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
              > ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFiles.length || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload Selected Images'}
      </button>
    </div>
  );
};

export default BannerImagePage;