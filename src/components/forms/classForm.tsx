'use client';

import { useState, useEffect } from 'react';

interface ClassData {
  _id?: string;
  name: string;
  capacity: number;
}

interface ClassProps {
  existingClass?: ClassData;
  onClose: () => void;
  refreshClasses: () => void;
}

export default function ClassForm({ existingClass, onClose, refreshClasses }: ClassProps) {
  const [formData, setFormData] = useState<ClassData>({
    name: '',
    capacity: 0,
  });

  useEffect(() => {
    if (existingClass) {
      setFormData(existingClass);
    } else {
      setFormData({ name: '', capacity: 0 });
    }
  }, [existingClass]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = existingClass ? 'PUT' : 'POST';
    const endpoint = existingClass
      ? `/api/classes?id=${existingClass._id}`
      : '/api/classes';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Request failed');

      alert(`Class ${existingClass ? 'updated' : 'created'} successfully!`);
      refreshClasses();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving Class');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <label className="block font-medium">Grade:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Enter Class name"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="block font-medium">Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min={1}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Enter capacity"
          />
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          >
            {existingClass ? 'Update' : 'Create'}
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