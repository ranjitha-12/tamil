'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import Image from "next/image";
interface AssignmentRow {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: string;
  student: { _id: string; name: string; surname: string; grade: string };
  teacher: { _id: string; name: string; surname: string; email: string };
  attachments?: {
    teacherFiles?: { fileName: string; fileUrl: string }[];
    studentFiles?: { fileName: string; fileUrl: string }[];
  };
  submissionDate?: string;
}

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Student", accessor: "student", className: 'hidden md:table-cell' },
  { header: "Teacher", accessor: "teacher", className: 'hidden md:table-cell' },
  { header: "Due Date", accessor: "dueDate", className: 'hidden lg:table-cell' },
  { header: "Status", accessor: "status" },
  { header: "Teacher File", accessor: "teacherFile", className: 'hidden md:table-cell' },
  { header: "Student File", accessor: "studentFile", className: 'hidden md:table-cell' },
  { header: "Action", accessor: "action"},
];

const AdminAssignmentsPage = () => {
  const [data, setData] = useState<AssignmentRow[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentYear] = useState<number>(new Date().getFullYear());
 
  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));

  // 🧠 Filtered assignments
  const filteredAssignment = useMemo(() => {
    if (!selectedMonth && !selectedYear) return data;

    return data.filter((assignment) => {
      const date = new Date(assignment.dueDate);
      const monthMatches = !selectedMonth || date.getMonth() + 1 === parseInt(selectedMonth);
      const yearMatches = !selectedYear || date.getFullYear() === parseInt(selectedYear);
      return monthMatches && yearMatches;
    });
  }, [data, selectedMonth, selectedYear]);

   const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
  
    const totalPages = Math.ceil(filteredAssignment.length / rowsPerPage);
    const paginatedfilteredAssignment = filteredAssignment.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/assignment");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load assignments:", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

 const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/assignment?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Remove from local state
      setData((prev) => prev.filter((item) => item._id !== id));
    } else {
      const error = await res.json();
      alert(error.error || "Failed to delete assignment");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Something went wrong while deleting");
  }
};

  const renderRow = (a: AssignmentRow) => {
    const teacherFile = a.attachments?.teacherFiles?.[0];
    const studentFile = a.attachments?.studentFiles?.[0];

    return (
      <tr key={a._id} className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100">
        <td className="py-3">{a.title}</td>
        <td className="py-3 hidden md:table-cell">{`${a.student.name} ${a.student.surname}`}</td>
        <td className="py-3 hidden md:table-cell">{`${a.teacher.name} ${a.teacher.surname}`}</td>
        <td className="py-3 hidden lg:table-cell">{new Date(a.dueDate).toLocaleDateString()}</td>
        <td className="py-3">{a.status}</td>
        <td className="py-3 hidden md:table-cell">
          {teacherFile ? (
            <a href={teacherFile.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {teacherFile.fileName}
            </a>
          ) : "—"}
        </td>
        <td className="py-3 hidden md:table-cell">
          {studentFile ? (
            <a href={studentFile.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {studentFile.fileName}
            </a>
          ) : "—"}
        </td>
        <td>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400"
            onClick={() => handleDelete(a._id)}
          >
            <Image src="/close.png" alt="delete" width={10} height={10} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-lg md:text-lg sm:text-md lg:text-xl 2xl:text-xl font-semibold mb-6">All Assignment Details</h1>
        <div className="flex gap-2">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm">
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm">
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredAssignment.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={paginatedfilteredAssignment} />
      ) : (
        <p className="text-center text-gray-500 mt-4">No Assignment records for selected month/year.</p>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
};

export default AdminAssignmentsPage;