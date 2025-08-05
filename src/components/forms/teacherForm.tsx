'use client';
import React, { useEffect, useState } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface Slot {
  date: string;
  localTime: string;
  utcTime: string;
}

interface Assignment {
  classes: string;
  subjects: string;
  slots: Slot[];
}

interface TeacherData {
  _id: string;
  username: string;
  name: string;
  surname: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  address: string;
  bloodType: string;
  sex: string;
  birthday: string;
  password: string;
  assignments: Assignment[];
  subjects: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
}

interface TeacherProps {
  existingTeacher?: TeacherData;
  onClose: () => void;
  refreshTeachers: () => void;
}

interface ClassType {
  _id: string;
  name: string;
}

interface SubjectType {
  _id: string;
  name: string;
}

const TeacherForm = ({ existingTeacher, onClose, refreshTeachers }: TeacherProps) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [slotsDate, setSlotsDate] = useState('');
  const [slotsInput, setSlotsInput] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classList, setClassList] = useState<ClassType[]>([]);
  const [subjectList, setSubjectList] = useState<SubjectType[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

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
    if (!existingTeacher) return;
    if (existingTeacher.assignments && existingTeacher.assignments.length > 0) {
      setAssignments(existingTeacher.assignments);
    } else {
      const generatedAssignments: Assignment[] = [];
      if (existingTeacher.classes.length > 0 && existingTeacher.subjects.length > 0) {
        const minLength = Math.min(
          existingTeacher.classes.length,
          existingTeacher.subjects.length
        );   
        for (let i = 0; i < minLength; i++) {
          generatedAssignments.push({
            classes: existingTeacher.classes[i].name,
            subjects: existingTeacher.subjects[i].name,
            slots: []
          });
        }
      }
      setAssignments(generatedAssignments);
    }
  }, [existingTeacher]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, subjectRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/subjects'),
        ]);
        const classData = await classRes.json();
        const subjectData = await subjectRes.json();
        setClassList(Array.isArray(classData) ? classData : []);
        setSubjectList(Array.isArray(subjectData) ? subjectData : []);
      } catch (error) {
        console.error('Error fetching class or subject data:', error);
      }
    };
    fetchData();
  }, []);

  const addAssignment = () => {
  if (!selectedClass || !selectedSubject || !slotsDate || !slotsInput) return;

  const slotsArray = slotsInput.split(',').map(slot => slot.trim());
  const parsedSlots: Assignment[] = slotsArray.map(localTime => ({
    classes: selectedClass,
    subjects: selectedSubject,
    slots: [{
      date: slotsDate || new Date().toISOString().split('T')[0],
      localTime,
      utcTime: "",
    }],
  }));

  const filtered = parsedSlots.filter(newAssign => {
    return !assignments.some(
      existing => existing.classes === newAssign.classes &&
        existing.subjects === newAssign.subjects &&
        existing.slots.some(s => 
          newAssign.slots.some(ns => ns.date === s.date && ns.localTime === s.localTime)
        )
    );
  });

  setAssignments(prev => [...prev, ...filtered]);
  setSelectedClass('');
  setSelectedSubject('');
  setSlotsDate('');
  setSlotsInput('');
};

  const removeAssignment = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const removeSlot = (assignmentIndex: number, slotIndex: number) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[assignmentIndex].slots = updatedAssignments[assignmentIndex].slots.filter(
      (_, i) => i !== slotIndex
    );
    if (updatedAssignments[assignmentIndex].slots.length === 0) {
      updatedAssignments.splice(assignmentIndex, 1);
    }   
    setAssignments(updatedAssignments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    formData.append('assignments', JSON.stringify(assignments));
    formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

    const phone = formData.get('phone')?.toString() || '';
    if (phone && !isValidPhoneNumber(phone)) {
      alert("Invalid phone number! Please enter a valid phone number.");
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
          <InputField label="Username" name="username" defaultValue={existingTeacher?.username} required />
          <InputField label="Email" name="email" type="email" defaultValue={existingTeacher?.email} />
          <InputField label="Password" name="password" type="password" defaultValue={existingTeacher?.password} 
            placeholder={existingTeacher ? "Leave blank to keep current" : ""} />
        </div>

        <span className="text-xs text-gray-400 font-medium uppercase">Personal Information</span>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField label="First Name" name="name" defaultValue={existingTeacher?.name} required />
          <InputField label="Last Name" name="surname" defaultValue={existingTeacher?.surname} required />
          <InputField label="Whatsapp No" name="phone" defaultValue={existingTeacher?.phone} />
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
        </div>

        <span className="text-xs text-gray-400 font-medium uppercase">Teaching Assignments</span>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label htmlFor="classSelect" className="text-xs text-gray-500">Class</label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
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

          <div className="flex flex-col gap-2 w-full md:w-1/5">
            <label htmlFor="slotsDate" className="text-xs text-gray-500">Date</label>
            <input
              id="slotsDate"
              type="date"
              value={slotsDate}
              onChange={(e) => setSlotsDate(e.target.value)}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            />
          </div>

          <div className="flex flex-col gap-2 w-full md:w-1/5">
            <label htmlFor="slotsInput" className="text-xs text-gray-500">Slots</label>
            <input
              id="slotsInput"
              type="text"
              placeholder="eg. 10:00AM-11:00AM, 03:00PM-04:00PM"
              value={slotsInput}
              onChange={(e) => setSlotsInput(e.target.value)}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            />
          </div>

          <button
            type="button"
            onClick={addAssignment}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            disabled={!selectedClass || !selectedSubject || !slotsDate || !slotsInput}
          >
            Add Assignment
          </button>
        </div>

        {assignments.length > 0 && (
          <table className="w-full border border-gray-300 rounded-md mt-4 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Slots</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, assignmentIdx) => (
                <React.Fragment key={`${assignment.classes}-${assignment.subjects}-${assignmentIdx}`}>
                  {assignment.slots.length > 0 ? (
                    assignment.slots.map((slot, slotIdx) => (
                      <tr key={`${assignment.classes}-${assignment.subjects}-${slotIdx}`}>
                        {slotIdx === 0 && (
                          <>
                            <td className="border border-gray-300 px-4 py-2" rowSpan={assignment.slots.length}>
                              {assignment.classes}
                            </td>
                            <td className="border border-gray-300 px-4 py-2" rowSpan={assignment.slots.length}>
                              {assignment.subjects}
                            </td>
                          </>
                        )}
                        <td className="border border-gray-300 px-4 py-2">{slot.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{slot.localTime}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeSlot(assignmentIdx, slotIdx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">{assignment.classes}</td>
                      <td className="border border-gray-300 px-4 py-2">{assignment.subjects}</td>
                      <td className="border border-gray-300 px-4 py-2" colSpan={3}>No slots</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeAssignment(assignmentIdx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}

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