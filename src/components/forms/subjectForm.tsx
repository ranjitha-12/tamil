'use client';
import { useState, useEffect } from 'react';

interface SubjectData {
  _id?: string;
  name: string;
}

interface SubjectProps {
  existingSubject: SubjectData | null;
  onClose: () => void;
}

export default function SubjectForm({ existingSubject, onClose }: SubjectProps) {
  const [formData, setFormData] = useState<SubjectData>({ name: '' });

  useEffect(() => {
  if (existingSubject) {
    setFormData({ name: existingSubject.name });
  }
}, [existingSubject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = existingSubject ? 'PUT' : 'POST';
    const endpoint = existingSubject
      ? `/api/subjects?id=${existingSubject._id}`
      : '/api/subjects';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Request failed');

      alert(`Subject ${existingSubject ? 'updated' : 'created'} successfully!`);
      setFormData({ name: '' });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving subject');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex justify-between flex-wrap gap-4">
          <label className="block font-medium">Subject Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Enter subject name"
          />
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          >
           {existingSubject ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
           onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}