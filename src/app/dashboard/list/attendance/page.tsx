'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';
import { useRouter } from 'next/navigation';

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
interface Attendance {
  _id: string;
  date: string;
  status: string;
  time: string;
  student: Student;
}

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Surname', accessor: 'surname', className: 'hidden md:table-cell' },
  { header: 'Grade', accessor: 'grade', className: 'hidden md:table-cell' },
  { header: 'Date', accessor: 'date' },
  { header: 'Status', accessor: 'status' },
];

const AttendancePage = () => {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];
  
   const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));
  
    // Filter attendance data based on selected month and year
    const filteredAttendance = useMemo(() => {
      if (!selectedMonth && !selectedYear) {
        return attendanceData;
      }
  
      return attendanceData.filter(attendance => {
        const date = new Date(attendance.date);
        const monthMatches = !selectedMonth || (date.getMonth() + 1) === parseInt(selectedMonth);
        const yearMatches = !selectedYear || date.getFullYear() === parseInt(selectedYear);
        
        return monthMatches && yearMatches;
      });
    }, [attendanceData, selectedMonth, selectedYear]);
  
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
      
    const totalPages = Math.ceil(filteredAttendance.length / rowsPerPage);
    const paginatedfilteredAttendance = filteredAttendance.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

    const handleMonthChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e: any) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    getAllAttendance();
  }, []);
const getAllAttendance = async () => {
  try {
    const res = await fetch(`/api/attendance`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    setAttendanceData(data.attendances || []);
  } catch (err) {
    console.error('Failed to fetch attendance:', err);
    setAttendanceData([]); 
  } 
};

  
  const renderRow = (attendance: Attendance) => {
    const student = attendance.student._id as unknown as string || {};
    
    return (
      <tr key={attendance._id} className="text-left text-gray-700 text-sm even:bg-slate-50 hover:bg-purple-100">
        <td className="py-3">{attendance.student.name || 'N/A'}</td>
        <td className="py-3 hidden md:table-cell">{attendance.student.surname || 'N/A'}</td>
        <td className="py-3 hidden md:table-cell">{attendance.student.grade?.name || 'N/A'}</td>
        <td className="py-3">{new Date(attendance.date).toLocaleDateString()}</td>
        <td className="py-3">
          <span className={`px-2 py-1 rounded-full text-xs ${
            attendance.status === 'PRESENT' ? 'bg-green-100 text-green-800' 
            : attendance.status === 'LATE' ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
          }`}>
            {attendance.status}
          </span>
        </td>
      </tr>
    );
  };

  const viewbyClass = () => {
    router.push(`/dashboard/list/attendance/selectByClass`);
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">Monthly Attendance Details</h1>
        {/* <button onClick={() => viewbyClass()} className="ml-[4px] bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 rounded-md">
          View Students By Class
        </button> */}
        <div  className="flex gap-2">
          {/* Month Dropdown */}
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded-md outline-none text-sm"
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border border-gray-300 rounded-md outline-none text-sm"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredAttendance.length > 0 ? (
              <Table columns={columns} renderRow={renderRow} data={paginatedfilteredAttendance} />
            ) : (
              <p className="text-center text-gray-500">No attendance records found for the selected criteria.</p>
            )}
      <div>
       <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </div>
  );
};

export default AttendancePage;