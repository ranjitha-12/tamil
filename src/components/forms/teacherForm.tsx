'use client';
import React, { useEffect, useState } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface TeacherData {
  _id: string;
  name: string;
  surname: string;
  email: string;
  resume?: string;
  profileImage?: string;
  phone?: string;
  additionalPhone?: string;
  address: string;
  bloodType: string;
  sex: string;
  birthday: string;
  password: string;
  subjects: { _id: string; name: string }[];
}

interface TeacherProps {
  existingTeacher?: TeacherData;
  onClose: () => void;
  refreshTeachers: () => void;
}

interface SubjectType {
  _id: string;
  name: string;
}

const TeacherForm = ({ existingTeacher, onClose, refreshTeachers }: TeacherProps) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [removeExistingResume, setRemoveExistingResume] = useState(false);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setResumeFile(file);
    setResumeName(file.name);
    setRemoveExistingResume(false);
  }
};
const handleRemoveResume = () => {
  setResumeFile(null);
  setResumeName(null);
  setRemoveExistingResume(true);
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (existingTeacher?.profileImage) {
      setImagePreview(existingTeacher.profileImage);
    }
  }, [existingTeacher]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes] = await Promise.all([
          fetch('/api/subjects'),
        ]);
        const subjectData = await subjectRes.json()
        setSubjectList(Array.isArray(subjectData) ? subjectData : []);
      } catch (error) {
        console.error('Error fetching  subject data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const phone = formData.get('phone')?.toString() || '';
    const additionalPhone = formData.get('additionalPhone')?.toString() || '';
    if (phone && !isValidPhoneNumber(phone)) {
      alert("Invalid phone number! Please enter a valid phone number.");
      return;
    }
     if (additionalPhone && !isValidPhoneNumber(additionalPhone)) {
    alert("Invalid additional phone number! Please enter a valid phone number.");
    return;
  }
    const password = formData.get('password')?.toString() || '';
    if (!password) {
      formData.delete('password');
    }
    if (removeExistingImage) {
      formData.append('removeImage', 'true');
    } else if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    if (removeExistingResume) {
      formData.append("removeResume", "true");
    } else if (resumeFile) {
      formData.append("resume", resumeFile);
    }
    const method = existingTeacher ? 'PUT' : 'POST';
    const endpoint = existingTeacher
      ? `/api/teacher?id=${existingTeacher._id}`
      : '/api/teacher';

    try {
      const response = await fetch(endpoint, {
        method,
        body: formData,
      });
      let result;
      try {
        result = await response.json();
      } catch (err) {
        console.error('Failed to parse JSON response', err);
        result = { msg: 'No response or invalid JSON from server' };
      }
      if (response.ok) {
        alert(existingTeacher ? 'Teacher updated successfully!' : 'Teacher created successfully!');
        onClose();
        refreshTeachers();
      } else {
        alert(`Error: ${result.msg || 'Unknown error'}`);
        console.error(result);
      }
    } catch (err) {
      alert('An unexpected error occurred.');
      console.error(err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <span className="text-xs text-gray-400 font-medium uppercase">Authentication Information</span>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField label="E-mail ID" name="email" type="email" defaultValue={existingTeacher?.email} />
          <InputField label="Password" name="password" type="password" defaultValue={existingTeacher?.password} 
            placeholder={existingTeacher ? "Leave blank to keep current" : ""} />
            <div className="invisible"></div><div className="invisible"></div>
            <div className="invisible"></div>
        </div>

        <span className="text-xs text-gray-400 font-medium uppercase">Personal Information</span>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField label="First Name" name="name" defaultValue={existingTeacher?.name} required />
          <InputField label="Last Name" name="surname" defaultValue={existingTeacher?.surname} required />
          <InputField label="Whatsapp No" name="phone" defaultValue={existingTeacher?.phone} />
          <InputField label="Alternate Phone No" name="additionalPhone" defaultValue={existingTeacher?.additionalPhone} />
          <InputField label="Address" name="address" defaultValue={existingTeacher?.address} required />
          <InputField label="Blood Type" name="bloodType" defaultValue={existingTeacher?.bloodType} required />
          <InputField label="Birthday" name="birthday" type="date" defaultValue={formatDate(existingTeacher?.birthday)} required />

          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Sex</label>
            <select
              name="sex"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={existingTeacher?.sex || ""}
              required
            >
              <option value="" disabled>Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label htmlFor="subjectSelect" className="text-xs text-gray-500">Subject</label>
            <select
              id="subjectSelect"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            >
              <option value="">Select Subject</option>
              {subjectList.map((subj) => (
                <option key={subj._id} value={subj.name}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="profileImage" className="block font-medium text-sm text-gray-700">
            Upload Profile Image
          </label>
          <input 
            type="file" 
            name="profileImage" 
            accept="image/*" 
            onChange={handleImageChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4" 
          />
          {imagePreview && (
            <div className="flex items-center gap-4 mt-2">
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full border" />
              <button type="button" onClick={handleRemoveImage} className="text-red-500 text-sm underline">
                Remove
              </button>
            </div>
          )}
        </div>
         {/* Resume Upload */}
  <div className="space-y-2">
    <label className="block font-medium text-sm text-gray-700">Upload Resume</label>
    <input
      type="file"
      name="resume"
      accept=".pdf,.doc,.docx"
      onChange={handleResumeChange}
      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 
                 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mb-2"
    />
    {(resumeName || existingTeacher?.resume) && (
      <div className="flex items-center gap-4">
        <p className="text-sm">{resumeName || "Existing Resume Uploaded"}</p>
        <button
          type="button"
          onClick={handleRemoveResume}
          className="text-red-500 text-sm underline"
        >
          Remove
        </button>
      </div>
    )}
  </div>

        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          >
            {existingTeacher ? "Update" : "Create"}
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
};

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}

const InputField = ({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required = false
}: InputFieldProps) => (
  <div className="flex flex-col gap-2 w-full md:w-1/4">
    <label htmlFor={name} className="text-xs text-gray-500">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
      required={required}
    />
  </div>
);

export default TeacherForm;