'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

export interface Parent {
  _id: string;
  username: string;
  email: string;
  whatsapp: string;
  motherFirstName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherLastName: string;
}
export interface Grade {
  _id: string;
  name: string;
}
export interface StudentData {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  age: number;
  grade: Grade;
  profileImage?: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: string;
  Role?: 'Student';
  parent: string | Parent;
}

interface Props {
  existingStudent?: StudentData;
  onClose: () => void;
  refreshStudents: () => void;
}

const StudentForm = ({ existingStudent, onClose, refreshStudents }: Props) => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const parentId = session?.user?.id;

  const [parents, setParents] = useState<Parent[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [classes, setClasses] = useState<{ _id: string; name: string }[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState("");
useEffect(() => {
  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };
  fetchClasses();
}, []);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveExistingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setProfileImage(null);
    setRemoveExistingImage(true); 
  };

  useEffect(() => {
    if (!userRole) return;

    if (userRole === 'Admin' || userRole === 'Teacher') {
      fetchAllParents();
    } else if (userRole === 'Parent' && parentId) {
      fetchParentById(parentId);
    }
  }, [userRole, parentId]);

  useEffect(() => {
    if (existingStudent?.profileImage && !imagePreview) {
      setImagePreview(existingStudent.profileImage);
    }
    if (existingStudent?.grade?._id) {
    setSelectedGradeId(existingStudent.grade._id);
  }
  }, [existingStudent]);

  useEffect(() => {
    if (existingStudent?.parent && typeof existingStudent.parent !== 'string') {
      setSelectedParentId(existingStudent.parent._id);
    } else if (typeof existingStudent?.parent === 'string') {
      setSelectedParentId(existingStudent.parent);
    } else if (userRole === 'Parent' && parentId) {
      setSelectedParentId(parentId);
    }
  }, [existingStudent, parentId, userRole]);

  const fetchAllParents = async () => {
  try {
    const res = await fetch('/api/parents');
    const data = await res.json();
    if (Array.isArray(data.parents)) {
      setParents(data.parents);
    } else {
      setParents([]);
    }
  } catch (err) {
    console.error('Failed to fetch all parents:', err);
  }
};

  const fetchParentById = async (id: string) => {
    try {
      const res = await fetch(`/api/parents/${id}`);
      const data = await res.json();
      setParents([data]); 
    } catch (err) {
      console.error('Failed to fetch parent by ID:', err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    if (removeExistingImage && existingStudent?.profileImage) {
      formData.append("removeProfileImage", "true");
    }

    const method = existingStudent ? 'PUT' : 'POST';
    const url = existingStudent
      ? `/api/student?id=${existingStudent._id}`
      : '/api/student';

    const res = await fetch(url, {
      method,
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert(existingStudent ? 'Student updated successfully' : 'Student created successfully');
      refreshStudents();
      onClose();
    } else {
      alert(result.error || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-4xl mx-auto">
      <span className="text-xs text-gray-400 font-medium uppercase mb-4">Personal Information</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="name" defaultValue={existingStudent?.name} placeholder="First Name" className="border p-2 rounded" />
        <input required name="surname" defaultValue={existingStudent?.surname} placeholder="Surname" className="border p-2 rounded" />
        <input name="email" defaultValue={existingStudent?.email} placeholder="Email" className="border p-2 rounded" />
        <input name="age" type="number" defaultValue={existingStudent?.age || ''} placeholder="Age" className="border p-2 rounded" />
        <select required name="grade" value={selectedGradeId}
            onChange={(e) => setSelectedGradeId(e.target.value)} className="border p-2 rounded" >
          <option value="">Select Grade</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>{cls.name}</option>
          ))}
        </select>
        <input required type="date" name="birthday" defaultValue={formatDate(existingStudent?.birthday)} className="border p-2 rounded" />
        <select required name="sex" defaultValue={existingStudent?.sex || ''} className="border p-2 rounded">
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          required
          name="parent"
          value={selectedParentId}
          onChange={(e) => setSelectedParentId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Parent</option>
            {Array.isArray(parents) && parents.map((p) => (
              <option key={p._id} value={p._id}>
              {`${p.fatherFirstName} ${p.fatherLastName}`}
            </option>
          ))}
        </select>
      </div>

      {/* PROFILE IMAGE */}
      <div className="space-y-2">
        <label htmlFor="profileImage" className="block font-medium text-sm text-gray-700">
          Upload Profile Image
        </label>
        <input type="file" name="profileImage" accept="image/*" onChange={handleImageChange} 
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4" />
        {imagePreview && (
          <div className="flex items-center gap-4 mt-2">
            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full border" />
            <button type="button" onClick={handleRemoveImage} className="text-red-500 text-sm underline">Remove</button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
          {existingStudent ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StudentForm;