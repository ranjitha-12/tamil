'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  date: string;
  class: {
    _id: string;
    name: string;
  };
}
interface Class {
  _id: string;
  name: string;
}

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    classId: ''
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchClasses();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/announcement');
    const json = await res.json();
    if (json.success) setAnnouncements(json.data);
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const json = await res.json();
      if (Array.isArray(json)) setClasses(json);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const json = await res.json();
    if (json.success) {
      toast.success("Announcement posted successfully");
      setFormData({ title: '', description: '', date: '', classId: '' });
      fetchAnnouncements();
    } else {
      toast.error("Failed to post: " + json.error);
    }
  };

  const handleDelete = async (announcementId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/announcement?id=${announcementId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Announcement deleted");
        fetchAnnouncements(); 
      } else {
        toast.error("Failed to delete: " + json.error);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.");
    }
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">📢 Announcement Page</h1>

      {/* Admin Form */}
      <form onSubmit={handlePost} className="mb-6 space-y-2 border-b pb-14">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        />
        <select
          value={formData.classId}
          onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 float-end text-white py-2 px-6 rounded-md">
          Post Announcement
        </button>
      </form>

      {/* Announcement List */}
      {announcements.length === 0 ? (
        <p className="text-gray-600">No announcements yet.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((ann) => (
            <li key={ann._id} className="border relative rounded-lg p-4 shadow-md">
              <button
                onClick={() => handleDelete(ann._id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center hover:bg-red-100 rounded-full"
              >
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>

              <h2 className="text-xl font-semibold text-red-600">{ann.title}</h2>
              <p className="text-gray-700">{ann.description}</p>
              <p className="text-sm mt-2 text-gray-500">Date: {new Date(ann.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Class: {ann.class?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnnouncementPage;