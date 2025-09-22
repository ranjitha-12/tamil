'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Table from '@/components/Table';
import Pagination from '@/components/pagination';

export interface StudentData {
  _id: string;
  name: string;
  surname: string;
  email: string;
  grade: {
    _id: string;
    name: string;
  };
  tamilGrade?: string;
  profileImage?: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: string;
  parent: {
    _id: string;
    fatherFirstName: string;
    fatherLastName: string;
    motherFirstName: string;
    motherLastName: string;
  } | null;
  teacher?: {
    _id: string;
    name: string;
    surname: string;
  };
}

export interface TeacherData {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

const AssignGradeTeacher = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const router = useRouter();
  
  const [students, setStudents] = useState<StudentData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [tamilGrade, setTamilGrade] = useState<string>("");
  const [teacherId, setTeacherId] = useState<string>("");
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (userRole !== 'Admin') {
      router.push('/dashboard');
      return;
    }
    fetchStudents();
    fetchTeachers();
  }, [userRole, router]);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/student");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else {
        console.error("Failed to fetch students");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teacher");
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.teachers || data);
      } else {
        console.error("Failed to fetch teachers");
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    
    if (studentId) {
      const student = students.find(s => s._id === studentId);
      if (student) {
        setTamilGrade(student.tamilGrade || "");
        setTeacherId(student.teacher?._id || "");
      }
    } else {
      setTamilGrade("");
      setTeacherId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setMessage({ type: 'error', text: 'Please select a student' });
      return;
    }
    setUpdating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/assignGradeTeacher", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          tamilGrade: tamilGrade || undefined,
          teacherId: teacherId || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Student updated successfully' });
        await fetchStudents();
        setSelectedStudent("");
        setTamilGrade("");
        setTeacherId("");
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update student' });
      }
    } catch (err) {
      console.error("Error updating student:", err);
      setMessage({ type: 'error', text: 'An error occurred while updating the student' });
    } finally {
      setUpdating(false);
    }
  };

  // Filter out students with null parent
  const studentsWithParent = students.filter(student => student.parent !== null);
  const totalPages = Math.ceil(studentsWithParent.length / rowsPerPage);
  const paginatedStudents = studentsWithParent.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Table columns
  const columns = [
    { header: "Student Name", accessor: "name", className: "py-2 px-3" },
    { header: "Parent", accessor: "parent", className: "py-2 px-3 hidden md:table-cell" },
    { header: "Tamil Grade", accessor: "tamilGrade", className: "py-2 px-3" },
    { header: "Assigned Teacher", accessor: "teacher", className: "py-2 px-3 hidden lg:table-cell" },
  ];

  // Render row function for Table component
  const renderRow = (student: StudentData) => (
    <tr key={student._id} className={`text-left text-gray-500 text-md even:bg-slate-50 hover:bg-blue-50 ${selectedStudent === student._id ? 'bg-blue-100' : ''}`}>
      <td className="py-3 px-3 whitespace-nowrap">
        {student.name} {student.surname}
      </td>
      <td className="py-3 px-3 whitespace-nowrap hidden md:table-cell">
        {student.parent ? `${student.parent.fatherFirstName} ${student.parent.fatherLastName}` : 'No parent assigned'}
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        {student.tamilGrade || 'Not assigned'}
      </td>
      <td className="py-3 px-3 whitespace-nowrap hidden lg:table-cell">
        {student.teacher ? `${student.teacher.name} ${student.teacher.surname}` : 'Not assigned'}
      </td>
    </tr>
  );
  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 5000); 
    return () => clearTimeout(timer); 
  }
  }, [message]);

  if (loading) {
    return (
      <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <h2 className="text-2xl font-bold mb-6">Assign Teacher and Tamil Grade to Students</h2>
      
      {message && (
        <div className={`p-3 rounded-md mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="student" className="block text-md text-gray-700 mb-1">
              Select Student
            </label>
            <select
              id="student"
              value={selectedStudent}
              onChange={handleStudentChange}
              className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-md"
              required
            >
              <option value="">Select a student</option>
              {studentsWithParent.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} {student.surname} - {student.parent?.fatherFirstName} {student.parent?.fatherLastName}'s child
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tamilGrade" className="block text-md text-gray-700 mb-1">
              Tamil Grade
            </label>
            <select
              id="tamilGrade"
              value={tamilGrade}
              onChange={(e) => setTamilGrade(e.target.value)}
              className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-md"
            >
              <option value="">Select Tamil Grade</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
            </select>
          </div>

          <div>
            <label htmlFor="teacher" className="block text-md text-gray-700 mb-1">
              Assign Teacher
            </label>
            <select
              id="teacher"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-md"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name} {teacher.surname}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={updating}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md disabled:opacity-50"
          >
            {updating ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>

      {/* Students Table using Table component */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Students List</h3>
        <Table 
          columns={columns} 
          data={paginatedStudents} 
          renderRow={renderRow} 
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        )}
      </div>
    </div>
  );
};

export default AssignGradeTeacher;