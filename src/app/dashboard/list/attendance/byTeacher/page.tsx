'use client';
import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface Student {
  _id: string;
  name: string;
  surname: string;
  email: string;
  grade: Grade;
}
interface Grade {
   _id: string;  
  name: string;
}
interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  student: Student;
  booking: { title: string; start: string; end: string };
}

const columns = [
  { header: 'Name', accessor: 'student.name' },
  { header: 'Surname', accessor: 'student.surname', className: 'hidden md:table-cell' },
  { header: 'Grade', accessor: 'student.grade', className: 'hidden md:table-cell' },
  { header: 'Date', accessor: 'date', className: 'hidden md:table-cell' },
  { header: 'Status', accessor: 'status' },
  { header: 'Actions', accessor: 'actions' },
];

const TeacherAttendancePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const teacherId = session?.user?.id;
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));
  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));

  useEffect(() => {
    if (teacherId) fetchRecords();
  }, [teacherId]);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`/api/attendance/teacher?teacherId=${teacherId}`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setRecords(data.attendances);
    } catch (err) {
      console.error('Failed to load records:', err);
      setRecords([]);
    }
  };

  // Filter by month/year via client side
  const filtered = records.filter((r) => {
    const dt = new Date(r.date);
    return (!month || dt.getMonth() + 1 === +month) &&
           (!year || dt.getFullYear() === +year);
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
        
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedFiltered = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handleCalendar = (student: any) => {
  router.push(`/dashboard/list/attendance/${student._id}`);
};

  const renderRow = (r: AttendanceRecord) => (
          <tr key={r._id} className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100">
            <td className="py-3">{r.student.name}</td>
            <td className="py-3 hidden md:table-cell">{r.student.surname}</td>
            <td className="py-3 hidden md:table-cell">{r.student.grade?.name}</td>
            <td className="py-3 hidden md:table-cell">{new Date(r.date).toLocaleDateString()}</td>
            <td className="py-3">
              <span className={`px-2 py-1 rounded-full text-xs ${
                r.status === 'PRESENT' ? 'bg-green-100 text-green-800'
                  : r.status === 'LATE' ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>{r.status}</span>
            </td>
            <td className="py-3 flex space-x-2">
                    <button onClick={() => handleCalendar(r.student)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
                      <Image src="/calendar.png" alt="edit" width={14} height={14} />
                    </button>
                  </td>
          </tr>
        );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">Students Attendance Details</h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4 mt-4">
          <select onChange={e => setMonth(e.target.value)} value={month} className="p-2 border border-gray-300 rounded-md outline-none text-sm">
            <option value="">Select Month</option>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select onChange={e => setYear(e.target.value)} value={year} className="p-2 border border-gray-300 rounded-md outline-none text-sm">
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div>
      <Table columns={columns} renderRow={renderRow} data={paginatedFiltered} />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
}
export default TeacherAttendancePage;
