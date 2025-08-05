'use client';
import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
interface ClassType {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Surname', accessor: 'surname', className: 'hidden md:table-cell' },
  { header: 'Email', accessor: 'email', className: 'hidden md:table-cell' },
  { header: 'Actions', accessor: 'actions' },
];

const AttendancePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
         
   const totalPages = Math.ceil(students.length / rowsPerPage);
   const paginatedStudents = students.slice(
     (currentPage - 1) * rowsPerPage,
     currentPage * rowsPerPage
   );
  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      const classList = Array.isArray(data) ? data : data.classes;
      setClasses(classList || []);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      setClasses([]);
    }
  };

  const fetchStudentsByClass = async (classId: string) => {
    try {
      const res = await fetch(`/api/student/studentByClass?classId=${classId}`);
      const data = await res.json();

      const formattedStudents = (data.students || []).map((s: any) => ({
        _id: s._id,
        name: s.name || '',
        surname: s.surname || '',
        email: s.email || '',
      }));

      setStudents(formattedStudents);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setStudents([]);
    }
  };
  const handleCalendar = (student: any) => {
  router.push(`/dashboard/list/attendance/${student._id}`);
};

  const renderRow = (student: Student) => (
    <tr key={student._id} className="text-left text-gray-700 text-sm even:bg-slate-50 hover:bg-purple-100">
      <td className="py-3">{student.name}</td>
      <td className="py-3 hidden md:table-cell">{student.surname}</td>
      <td className="py-3 hidden md:table-cell">{student.email}</td>
      <td className="py-3 flex space-x-2">
        <button onClick={() => handleCalendar(student)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
          <Image src="/calendar.png" alt="edit" width={14} height={14} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">Class wise Student List</h1>
        <button onClick={() => window.history.back()} className="ml-[4px] bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 rounded-md">
          Back
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-8 mt-8">
        <label htmlFor="classSelect" className="mr-2 font-medium">Select Class:</label>
        <select
          id="classSelect"
          className="border rounded min-w-[200px] sm:min-w-[250px] md:min-w-[300px] px-2 py-1 w-full sm:w-auto"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">-- select --</option>
          {Array.isArray(classes) && classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      <Table columns={columns} renderRow={renderRow} data={paginatedStudents} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
};

export default AttendancePage;
