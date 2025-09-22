'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';
import TableSearch from '@/components/TableSearch';
import Modal from '@/components/FormModal';
import { useSession } from 'next-auth/react';
import StudentForm from '@/components/forms/studentForm';

export interface Parent {
   _id: string;
  username: string;
  email: string;
  whatsapp: string;
  motherFirstName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherLastName: string;
}
export interface Grade {
  _id: string;
  name: string;
}
export interface Student {
  _id: string;
   name: string;
   surname: string;
   email: string;
   grade: Grade;
   tamilGrade?: string;
   profileImage?: string;
   sex: 'MALE' | 'FEMALE' | 'OTHER';
   birthday: string;
   Role?: 'Student';
   parent: string | Parent;
}

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Surname', accessor: 'surname', className: 'hidden md:table-cell' },
  { header: 'Email', accessor: 'email', className: 'hidden md:table-cell' },
  { header: 'Tamil Grade', accessor: 'tamilGrade', className: 'hidden lg:table-cell' },
  { header: 'Actions', accessor: 'action' },
];

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const id = session?.user?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
    const totalPages = Math.ceil(students.length / rowsPerPage);
    const paginatedStudents = students.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

 useEffect(() => {
  if (!userRole) return;

  if (userRole === 'Admin') {
    fetchAllStudents();
  } else if (userRole === 'Teacher' && id) {
    fetchStudentsByTeacher();
  }
}, [userRole, id]);

const refreshStudents = () => {
  if (!userRole) return;
  if (userRole === 'Admin') {
    fetchAllStudents();
  } else if (userRole === 'Teacher' && id) {
    fetchStudentsByTeacher();
  }
};
useEffect(() => {
  refreshStudents(); 
}, [userRole, id]);

const fetchAllStudents = async () => {
  try {
    const res = await fetch('/api/student');
    const data = await res.json();
    setStudents(data);
  } catch (err) {
    console.error('Failed to fetch all students:', err);
  }
};

const fetchStudentsByTeacher = async () => {
  try {
    const res = await fetch(`/api/student/fetchStudentsByTeacher?teacherId=${id}`);
    const data = await res.json();
    setStudents(data.students || []);
  } catch (err) {
    console.error('Failed to fetch students by teacher:', err);
  }
};

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      const res = await fetch(`/api/student?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const renderRow = (student: Student) => (
    <tr key={student._id} className="text-left text-gray-700 text-md even:bg-slate-50 hover:bg-purple-100">
      <td className="flex items-center gap-2 py-3">
        <Image src={student.profileImage || '/noimage.png'} alt=""
          width={35} height={35} className="xl:block w-10 h-10 rounded-full object-cover"/>
        <h3 className="font-semibold">{student.name}</h3>
      </td>
      <td className="py-3 hidden md:table-cell">{student.surname}</td>
      <td className="py-3 hidden md:table-cell">{student.email}</td>
      <td className="py-3 hidden lg:table-cell"> {student.tamilGrade || "Not Assigned"}</td>
      <td className="py-3 whitespace-nowrap">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
        {(userRole === 'Admin' || userRole === 'Parent' || userRole === 'Teacher') && (
        <button onClick={() => handleEdit(student)} className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-400">
          <Image src="/update.png" alt="edit" width={14} height={14} />
        </button>)}
        {(userRole === 'Admin' || userRole === 'Parent') && (
          <button onClick={() => handleDelete(student._id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400">
            <Image src="/close.png" alt="delete" width={10} height={10} />
          </button>
        )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">All Students</h1>
          {(userRole === 'Parent' || userRole === 'Admin') && (
          <div className="flex items-center gap-4">
          <button onClick={handleOpen} className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
            <Image src="/create.png" alt="Create" width={14} height={14} />
          </button>
          </div>)}
      </div>

      <div>
        <Table columns={columns} renderRow={renderRow} data={paginatedStudents} />
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold ml-4">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center">
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            <StudentForm
              existingStudent={editingStudent ?? undefined}
              onClose={handleClose}
              refreshStudents={refreshStudents}
            />
        </div>
      </Modal>
    </div>
  );
};

export default StudentList;
