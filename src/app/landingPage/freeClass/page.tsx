'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Teacher = {
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
  subjects: { name: string }[];
  classes: { name: string }[];
  day: string[];
  slots: string[];
  assignments: {
    classes: string;
    subjects: string;
    day: string;
    slots: string[];
  }[];
};

const columns = [
  { header: 'Info', accessor: 'info' },
  { header: 'Subjects', accessor: 'subjects', className: 'hidden md:table-cell' },
  { header: 'Classes', accessor: 'classes', className: 'hidden md:table-cell' },
  { header: 'Address', accessor: 'address', className: 'hidden lg:table-cell' },
  { header: 'Actions', accessor: 'action' }
];

const FreeClass = () => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const handleCalendar = (teacher: Teacher) => {
    router.push(`/landingPage/freeClass/${teacher._id}`);
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/teacher');
      const data = await res.json();
      setTeachers(data.teachers);
    } catch (error) {
      console.error('Failed to fetch teachers', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const renderRow = (teacher: Teacher) => (
    <tr
      key={teacher._id}
      className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100"
    >
      <td className="flex items-center gap-2 py-3">
        <Image
          src={teacher.profileImage || '/noimage.png'}
          alt=""
          width={35}
          height={35}
          className="w-10 h-10 rounded-full object-cover"
        />
        <h3 className="font-semibold">{teacher.name}</h3>
      </td>
      <td className="py-3 hidden md:table-cell">
        {teacher.subjects.map((s) => s.name).join(', ')}
      </td>
      <td className="py-3 hidden md:table-cell">
        {teacher.classes.map((c) => c.name).join(', ')}
      </td>
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
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">To Join a Free Tamil Class</h3>
      <p className="mb-4">
        Choose a teacher to view their available class slots in calendar. Login is required to book an event.
      </p>
      <div className="bg-white rounded-md">
        <Table columns={columns} renderRow={renderRow} data={teachers} />
      </div>
    </div>
  );
};

export default FreeClass;