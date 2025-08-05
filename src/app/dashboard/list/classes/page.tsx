'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Modal from '@/components/FormModal';
import ClassForm from '@/components/forms/classForm';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';

type Class = {
  _id: string;
  name: string;
  capacity: number;
};

const columns = [
  { header: "Grade", accessor: "name", className: "py-2 px-3" },
  { header: "Capacity", accessor: "capacity", className: "py-2 px-3 hidden md:table-cell" },
  { header: "Actions", accessor: "actions", className: "py-2 px-3" },
];

const ClassesListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(classes.length / rowsPerPage);
  const paginatedClasses = classes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpen = (cls?: Class) => {
    setSelectedClass(cls || null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
    fetchClasses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const res = await fetch(`/api/classes?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');
      alert('Class deleted successfully!');
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert('Failed to delete class');
    }
  };

  const renderRow = (cls: Class) => (
    <tr
      key={cls._id}
      className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100"
    >
      <td className="py-3 px-3">{cls.name}</td>
      <td className="py-3 px-3 hidden md:table-cell">{cls.capacity}</td>
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-400"
            onClick={() => handleOpen(cls)}
          >
            <Image src="/update.png" alt="edit" width={14} height={14} />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400"
            onClick={() => handleDelete(cls._id)}
          >
            <Image src="/close.png" alt="delete" width={10} height={10} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      {/* TOP */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">All Grades</h1>
        <button
          onClick={() => handleOpen()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400"
        >
          <Image src="/create.png" alt="Create" width={14} height={14} />
        </button>
      </div>

      {/* TABLE */}
      <Table columns={columns} data={paginatedClasses} renderRow={renderRow} />

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
              <h2 className="text-xl font-bold ml-4">
                {selectedClass ? 'Edit Class' : 'Create a New Class'}
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            <ClassForm
              existingClass={selectedClass ?? undefined}
              onClose={handleClose}
              refreshClasses={fetchClasses}
            />
        </div>
      </Modal>
    </div>
  );
};

export default ClassesListPage;