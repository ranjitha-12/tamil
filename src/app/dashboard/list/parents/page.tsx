'use client';
import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export interface Parent {
  _id: string;
  username: string;
  email: string;
  whatsapp: string;
  motherFirstName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherLastName: string;
  country: string;
  studentName?: string;
}

const ParentListPage = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const id = session?.user?.id;

  const columns = [
    { header: 'Name', accessor: 'username' },
    { header: 'Country', accessor: 'country', className: 'hidden md:table-cell' },
    { header: 'Email', accessor: 'email', className: 'hidden md:table-cell' },
    { header: 'Whatsapp No', accessor: 'whatsapp' },
    { header: 'Student Name', accessor: 'studentName', className: 'hidden md:table-cell' },
    ...(userRole === 'Admin'
      ? [{ header: 'Actions', accessor: 'action' }]
      : []),
  ];
  
   useEffect(() => {
    if (!userRole) return;
  
    if (userRole === 'Admin' ) {
      fetchParents();
    } else if (userRole === 'Teacher' && id) {
      fetchParentByStudent();
    }
  }, [userRole, id]);
  
  const refreshStudents = () => {
    if (!userRole) return;
    if (userRole === 'Admin') {
      fetchParents();
    } else if (userRole === 'Teacher' && id) {
      fetchParentByStudent();
    }
  };
  useEffect(() => {
    refreshStudents(); 
  }, [userRole, id]);

  const fetchParents = async () => {
  try {
    const res = await fetch('/api/parents');
    const data = await res.json();
    const { parents, students } = data;
    const transformed = parents.map((parent: any) => {
      const studentNames = students
        .filter((s: any) => parent.students.includes(s._id))
        .map((s: any) => s.name)
        .join(', ');

      return {
        _id: parent._id,
        username: parent.username,
        country: parent.country,
        email: parent.email,
        whatsapp: parent.whatsapp,
        studentName: studentNames,
      };
    });
    setParents(transformed);
  } catch (err) {
    console.error('Failed to fetch parents:', err);
  }
};
 
  const fetchParentByStudent = async () => {
    try {
      const res = await fetch(`/api/student/fetchStudentsByTeacher?teacherId=${id}`);
      const data = await res.json();
      const studentIds = data.students.map((s: any) => s._id);
      const parentRes = await fetch(`/api/parents/fetchParentByStudent?studentIds=${studentIds.join(',')}`);
      const parentData = await parentRes.json();
      const transformed = parentData.map((parent: any) => {
        const studentNames = parent.student?.map((s: any) => s.name).join(', ') || '';
        return {
          _id: parent._id,
          username: parent.username,
          country: parent.country,
          email: parent.email,
          whatsapp: parent.whatsapp,
          studentName: studentNames,
        };
      });
      setParents(transformed);
    } catch (err) {
      console.error('Failed to fetch students by teacher:', err);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
         
   const totalPages = Math.ceil(parents.length / rowsPerPage);
   const paginatedParents = parents.slice(
     (currentPage - 1) * rowsPerPage,
     currentPage * rowsPerPage
   );
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this parent?')) return;
    try {
      const res = await fetch(`/api/parents?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setParents((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error('Error deleting parent:', err);
    }
  };

  const renderRow = (parent: Parent) => (
    <tr key={parent._id} className="text-left text-gray-700 text-sm even:bg-slate-50 hover:bg-purple-100">
      <td className="py-3">{parent.username}</td>
      <td className="py-3 hidden md:table-cell">{parent.country}</td>
      <td className="py-3 hidden md:table-cell">{parent.email}</td>
      <td className="py-3">{parent.whatsapp}</td>
      <td className="py-3 hidden md:table-cell">{parent.studentName}</td>
      <td className="py-3 whitespace-nowrap">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
        {userRole === 'Admin' && (
          <button onClick={() => handleDelete(parent._id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400">
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
            <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">Parent List</h1>
        </div>
      <div>
            <Table columns={columns} renderRow={renderRow} data={paginatedParents} />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
};

export default ParentListPage;
