'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import SubjectForm from '@/components/forms/subjectForm';
import Modal from '@/components/FormModal';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';

type Subject = {
  _id: string;
  name: string;
  code?: string;
  teachers?: { name: string }[];
};

const columns = [
  { header: "Subject Name", accessor: "name", className: "py-2 px-3" },
  { header: "Actions", accessor: "action", className: "py-2 px-3" },
];

const SubjectListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpen = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedSubject(null);
    setIsModalOpen(false);
    fetchSubjects();
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    try {
      const res = await fetch(`/api/subjects?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      alert('Subject deleted successfully');
      fetchSubjects();
    } catch (error) {
      console.error('Delete error', error);
      alert('Failed to delete subject');
    }
  };

  const totalPages = Math.ceil(subjects.length / rowsPerPage);
  const paginatedSubjects = subjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderRow = (subject: Subject) => (
    <tr key={subject._id} className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100">
      <td className="py-3 px-3">{subject.name}</td>
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
          <button onClick={() => handleEdit(subject)} className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-400">
            <Image src="/update.png" alt="edit" width={14} height={14} />
          </button>
          <button onClick={() => handleDelete(subject._id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400">
            <Image src="/close.png" alt="delete" width={10} height={10} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">All Subjects</h1>
        <div className="flex items-center gap-4">
          <button onClick={handleOpen} className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
            <Image src="/create.png" alt="Create" width={14} height={14} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} data={paginatedSubjects} renderRow={renderRow} />

      {/* PAGINATION (custom controls) */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />

      {/* MODAL FORM */}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
              <h2 className="text-xl font-bold ml-4">{selectedSubject ? "Edit Subject" : "Create Subject"}</h2>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center">
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            <SubjectForm existingSubject={selectedSubject} onClose={handleClose} />
        </div>
      </Modal>
    </div>
  );
};

export default SubjectListPage;
