'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Teacher = {
  _id: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  address: string;
  subjects: { name: string }[];
  classes: { name: string }[];
  day: string[];
  slots: string[];
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Email", accessor: "email", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const SelectTeacher = () => {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const router = useRouter();
  const { data: session } = useSession();
  const parentId = session?.user?.id;
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(teachers.length / rowsPerPage);
  const paginatedTeachers = teachers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleCalendar = (teacher: Teacher) => {
  if (studentId) {
    router.push(`/dashboard/selectTeachers/${teacher._id}?studentId=${studentId}`);
  } else {
    alert("Missing student ID.");
  }
};

  useEffect(() => {
  if (!studentId) return;

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/student/${studentId}`);
      const data = await res.json();
      setSelectedPlan(data?.selectedPlan || null);
    } catch (err) {
      console.error("Failed to fetch plan", err);
    }
  };

  fetchPlan();
}, [studentId]);

useEffect(() => {
  if (!studentId || !selectedPlan) return;

  const fetchMatchingTeachers = async () => {
    try {
      const res = await fetch(`/api/teacher/matchStudentClass?studentId=${studentId}`);
      const data = await res.json();
      setTeachers(selectedPlan === 'free' ? data.slice(0, 1) : data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  fetchMatchingTeachers();
}, [studentId, selectedPlan]);

  const renderRow = (teacher: Teacher) => (
    <tr
      key={teacher._id}
      className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100 mr-2"
    >
      <td className="py-3">{teacher.name}</td>
      <td className="py-3 hidden md:table-cell">{teacher.subjects.map(s => s.name).join(", ")}</td>
      <td className="py-3 hidden md:table-cell">{teacher.classes.map(c => c.name).join(", ")}</td>
      <td className="py-3 hidden lg:table-cell">{teacher.email}</td>
      <td className="py-3 hidden lg:table-cell">{teacher.address}</td>
      <td className="py-3 flex space-x-2">
        <button
          onClick={() => handleCalendar(teacher)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400"
        >
          <Image src="/calendar.png" alt="calendar" width={14} height={14} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">Available Teachers</h1>
      </div>

      <div>
        <Table columns={columns} renderRow={renderRow} data={paginatedTeachers} />
      </div>

      {selectedPlan !== 'free' && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default SelectTeacher;