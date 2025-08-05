'use client';
import React, { useEffect, useState } from 'react';
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import Image from "next/image";
import TeacherForm from '@/components/forms/teacherForm';
import Modal from '@/components/FormModal';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

interface Slot {
  date: string;
  localTime: string;
  utcTime: string;
}
interface Assignment {
  classes: string;
  subjects: string;
  slots: Slot[];
}
interface Teacher {
  _id: string;
  username: string;
  name: string;
  surname: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  address: string;
  bloodType: string;
  sex: string;
  birthday: string;
  password: string;
  assignments: Assignment[];
  subjects: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
}

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const TeacherListPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const teacherId  = session?.user.id;
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(teachers.length / rowsPerPage);
  const paginatedTeachers = teachers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleEdit = (teacher: Teacher) => {
  setEditingTeacher(teacher);
  setIsModalOpen(true);
  };

  const handleCalendar = (teacher: any) => {
  router.push(`/dashboard/list/teachers/${teacher._id}`);
};

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this teacher?')) return;
  try {
    const res = await fetch(`/api/teacher/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } else {
      console.error('Failed to delete teacher');
    }
  } catch (err) {
    console.error('Error deleting teacher:', err);
  }
};

const fetchAllTeachers = async () => {
    try {
      const res = await fetch("/api/teacher");
      const data = await res.json();
      if (userRole === "Teacher") {
        const filtered = data.teachers.filter((t: Teacher) => t._id === teacherId);
        setTeachers(filtered);
      } else {
        setTeachers(data.teachers);
      }
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

useEffect(() => {
  if (session) fetchAllTeachers();
}, [session, userRole, teacherId]);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
  setIsModalOpen(false);
  setEditingTeacher(null);
};

  const renderRow = (teacher: Teacher) => (
    <tr key={teacher._id} className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100 mr-2">
      <td className="flex items-center gap-2 py-3">
        <Image src={teacher.profileImage || '/noimage.png'} alt=""
          width={35} height={35} className="xl:block w-10 h-10 rounded-full object-cover"/>
        <h3 className="font-semibold">{teacher.name}</h3>
      </td>
      <td className="py-3 hidden md:table-cell">{teacher.subjects.map(s => s.name).join(", ")}</td>
      <td className="py-3 hidden md:table-cell">{teacher.classes.map(c => c.name).join(", ")}</td>
      <td className="py-3 hidden lg:table-cell">{teacher.phone}</td>
      <td className="py-3 hidden lg:table-cell">{teacher.address}</td>
      <td className="py-3 whitespace-nowrap">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
        <button onClick={() => handleEdit(teacher)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-400">
          <Image src="/update.png" alt="edit" width={14} height={14} />
        </button>
        {userRole === "Admin" && (
        <button onClick={() => handleCalendar(teacher)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
          <Image src="/calendar.png" alt="edit" width={14} height={14} />
        </button>)}
        {userRole === "Admin" && (
        <button onClick={() => handleDelete(teacher._id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400">
          <Image src="/close.png" alt="delete" width={10} height={10} />
        </button>)}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      {/* TOP */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">All Teachers</h1>  
           {userRole === "Admin" && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleOpen}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400"
            >
              <Image src="/create.png" alt="Create" width={14} height={14} />
            </button>
          </div>)}
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={paginatedTeachers} />
      </div>

      {/* PAGINATION */}
      <div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
              <h2 className="text-xl font-bold ml-4">{editingTeacher ? "Edit Teacher" : "Create a New Teacher"}</h2>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center">
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            <TeacherForm existingTeacher={editingTeacher ?? undefined} onClose={handleClose} 
              refreshTeachers={() => { fetchAllTeachers(); }}/>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherListPage;