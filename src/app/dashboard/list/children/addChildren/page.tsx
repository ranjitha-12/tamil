'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  grade: Grade;
  tamilGrade?: 'Grade 1 to 4' | 'Grade 5 & 6' | 'Grade 7 & 8';
  profileImage?: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: string;
  Role?: 'Student';
  parent: string | Parent;
}

const AddChildren = () => {
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
  const router = useRouter();

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

    if (userRole === 'Parent' && parentId) {
      fetchParentById(parentId);
    }
  }, [userRole, parentId]);

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
  const form = e.currentTarget;
  const formData = new FormData(form);

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  if (removeExistingImage && profileImage) {
    formData.append("removeProfileImage", "true");
  }
  if (parentId) {
    formData.append("parent", parentId);
  }
  const res = await fetch("/api/student", { method: "POST", body: formData, });

  const result = await res.json();
  if (res.ok) {
    alert("Student created successfully");
    form.reset();
    setImagePreview(null);
    setProfileImage(null);
    setSelectedGradeId("");
    setSelectedParentId("");
    router.push("/dashboard/list/children");
  } else {
    alert(result.error || "An error occurred");
  }
};

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
    <h2 className="text-2xl font-bold mb-6">Add New Child</h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <span className="text-md text-gray-400 font-medium uppercase mb-2">Child Personal Information</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="name" placeholder="Child First Name" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5" />
        <input required name="surname" placeholder="Child Last Name" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5" />
        <select required name="sex" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5">
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <input required type="date" name="birthday" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5" />
        <select required name="grade" value={selectedGradeId}
            onChange={(e) => setSelectedGradeId(e.target.value)} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5" >
          <option value="">Select Academic Grade</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>{cls.name}</option>
          ))}
        </select>
        <input name="email" placeholder="E-mail ID (To Assign Tamil Home Work)" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5" />
        {/* <select
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
        </select> */}
      </div>

      {/* PROFILE IMAGE */}
      <div className="space-y-2">
        <label htmlFor="profileImage" className="text-md text-black font-medium">
          Upload Child Profile Image:
        </label>
        <input type="file" name="profileImage" accept="image/*" onChange={handleImageChange} 
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4 mt-4" />
        {imagePreview && (
          <div className="flex items-center gap-4 mt-2">
            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full border" />
            <button type="button" onClick={handleRemoveImage} className="text-red-500 text-sm underline">Remove</button>
          </div>
        )}
      </div>
      <span className="text-red-600">* Academic Grade means your child current school grade or standard, not their Tamil language level.</span>
      <span className="text-red-600">** Please provide an active E-mail ID. It will be used for Tamil home work and should be checked on regular basis.</span>

      <div className="flex justify-end gap-2">
        <button type="submit" className="mr-4 bg-blue-500 hover:bg-blue-600 hover:bg-transparent border border-blue-600 hover:text-blue-600 text-white transition py-1 px-4 rounded-md">
          Create
        </button>
        {/* <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md">
          Cancel
        </button> */}
      </div>
    </form>
    </div>
  );
};

export default AddChildren;