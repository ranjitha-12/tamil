'use client';
import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';
import { useRouter } from 'next/navigation';

interface Student {
  _id: string;
  name: string;
  surname: string;
  profileStatus: 'enrolled' | 'deEnrolled';
  enrollmentCategory: 'initialCall' | 'statusCheck' | 'continue' | 'hold' | 'followUp' | 'inActive';
}

const columns = [
  { header: "Student Name", accessor: "name", className: "py-2 px-3" },
  { header: "Current Status", accessor: "status", className: "py-2 px-3" },
  { header: "Enrollment Category", accessor: "category", className: "py-2 px-3" },
  { header: "Actions", accessor: "actions", className: "py-2 px-3" },
];

export default function GenerateInvoice() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        `${student.name} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
    setCurrentPage(1);
  }, [searchTerm, students]);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchStudents = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch('/api/student');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveStudentChanges = async (student: Student) => {
    setUpdating(student._id);
    try {
      const response = await fetch(`/api/student/${student._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileStatus: student.profileStatus,
          enrollmentCategory: student.enrollmentCategory,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      // Refresh the student list to get updated data
      await fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      setError('Failed to save student changes. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const renderRow = (student: Student) => (
    <tr
      key={student._id}
      className="text-left text-gray-500 text-md even:bg-slate-50 hover:bg-purple-100"
    >
      <td className="py-3 px-3">
        {student.name} {student.surname}
      </td>
      <td className="py-3 px-3">
        <div className="flex justify-start">
          <div className="bg-white shadow-md font-bold rounded-full p-1 flex">
            <button
              onClick={() =>
                setStudents(prev =>
                  prev.map(s =>
                    s._id === student._id ? { ...s, profileStatus: 'enrolled' } : s
                  )
                )
              }
              className={`px-4 py-1 rounded-full text-xs transition ${
                student.profileStatus === 'enrolled'
                  ? 'bg-[#f7ae20] text-[#1e235d]'
                  : 'text-[#1e235d] hover:text-[#f7ae20]'
              }`}
              disabled={updating === student._id}
            >
              Enrolled
            </button>
            <button
              onClick={() =>
                setStudents(prev =>
                  prev.map(s =>
                    s._id === student._id ? { ...s, profileStatus: 'deEnrolled' } : s
                  )
                )
              }
              className={`px-4 py-1 rounded-full text-xs transition ${
                student.profileStatus === 'deEnrolled'
                  ? 'bg-[#f7ae20] text-[#1e235d]'
                  : 'text-[#1e235d] hover:text-[#f7ae20]'
              }`}
              disabled={updating === student._id}
            >
              De-Enrolled
            </button>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <select
          value={student.enrollmentCategory}
          onChange={(e) =>
            setStudents(prev =>
              prev.map(s =>
                s._id === student._id
                  ? { ...s, enrollmentCategory: e.target.value as Student['enrollmentCategory'] }
                  : s
              )
            )
          }
          disabled={updating === student._id}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {student.profileStatus === 'enrolled' ? (
            <>
              <option value="initialCall">Initial Call</option>
              <option value="statusCheck">Status Check</option>
              <option value="continue">Continue</option>
              <option value="hold">Hold</option>
              <option value="followUp">Follow Up</option>
            </>
          ) : (
            <option value="inActive">Inactive</option>
          )}
        </select>
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
          <button className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition"
            onClick={() => saveStudentChanges(student)} disabled={updating === student._id} >
            {updating === student._id ? 'Updating...' : 'Update'}
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4 flex justify-center items-center h-64">
        Loading students...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">
          Student Enrollment Management
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-8 mt-8">
        <label htmlFor="student" className="mr-2 font-semibold">Search Student By Name:</label>
          <input 
            id="student" 
            type="text" 
            placeholder="Enter student name" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" 
          />
      </div>

      <h4 className="text-md font-bold text-center text-red-700 mt-10">
        * initialCall (enrolled) – Parent who registered and added children but has not purchased any subscription plans.<br />
        * statusCheck (enrolled) – Parent who registered, added children, and purchased subscription plans.<br />
        * continue (enrolled) – Parent who wants the next bill for their subscription plans.<br />
        * hold (enrolled) – Parent whose children are on vacation for a specific period of time.<br />
        * followUp (enrolled) – After vacation, confirmation is required to continue the sessions.<br />
        * inActive (deEnrolled) – Parent who wants to stop and is not willing to continue with UTA sessions.<br />
      </h4>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-red-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {filteredStudents.length === 0 && !loading ? (
        <div className="text-center py-8">
          {searchTerm ? `No students found matching "${searchTerm}"` : 'No students available'}
        </div>
      ) : (
        <>
          <Table columns={columns} data={paginatedStudents} renderRow={renderRow} />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </>
      )}
    </div>
  );
}