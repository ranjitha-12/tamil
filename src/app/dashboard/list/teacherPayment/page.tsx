"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Table from "@/components/Table";
import Pagination from "@/components/pagination";
import Modal from "@/components/FormModal";
import TeacherPaymentForm from "@/components/forms/teacherPaymentForm";

const columns = [
  { header: "Name", accessor: "name", className: "py-2 px-3" },
  { header: "Email", accessor: "email", className: "py-2 px-3 hidden md:table-cell" },
  { header: "Attendance Count", accessor: "attendanceCount", className: "py-2 px-3" },
  { header: "Actions", accessor: "action", className: "py-2 px-3" },
];

const TeacherPaymentPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rowsPerPage = 10;

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teacher");
      const data = await res.json();
      setTeachers(data.teachers || []);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handlePayment = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedTeacher(null);
    setIsModalOpen(false);
    fetchTeachers();
  };

  const totalPages = Math.ceil(teachers.length / rowsPerPage);
  const paginatedTeachers = teachers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderRow = (teacher: any) => (
    <tr
      key={teacher._id}
      className="text-left text-gray-600 text-sm even:bg-slate-50 hover:bg-purple-100"
    >
      <td className="py-3 px-3">{teacher.name}</td>
      <td className="py-3 px-3 hidden md:table-cell">{teacher.email}</td>
      <td className="py-3 px-3">{teacher.attendanceCount || 0}</td>
      <td className="py-3 px-3 whitespace-nowrap">
        <button
          onClick={() => handlePayment(teacher)} className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-400">
            <Image src="/update.png" alt="edit" width={14} height={14} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl font-semibold">
          Teacher Payments
        </h1>
      </div>

      <Table columns={columns} data={paginatedTeachers} renderRow={renderRow} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Teacher Payment</h2>
              <button onClick={handleClose}>
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            {selectedTeacher && (
              <TeacherPaymentForm teacher={selectedTeacher} onClose={handleClose} />
            )}
        </div>
      </Modal>
    </div>
  );
};

export default TeacherPaymentPage;