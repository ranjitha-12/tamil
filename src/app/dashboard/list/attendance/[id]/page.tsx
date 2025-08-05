'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Table from "@/components/Table";
import Pagination from "@/components/pagination"; 

interface Attendance {
  _id: string;
  date: string;
  status: string;
  time: string;
  student?: {
    _id: string;
    name: string;
    surname: string;
    grade: string;
    email: string;
  };
}

const ListAttendance = () => {
  const { id } = useParams(); 
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [studentInfo, setStudentInfo] = useState<{ name: string; surname: string } | null>(null);

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

  useEffect(() => {
    if (id) {
      fetchAttendance(id as string);
    } 
  }, [id]); 

  const fetchAttendance = async (studentId: string) => {
    try {
      const res = await fetch(`/api/attendance/byStudent?studentId=${studentId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setAttendanceData(data.attendances || []);
      setStudentInfo(data.student || null);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);  
      setAttendanceData([]);
      setStudentInfo(null); 
    }
  };

  const handleMonthChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e: any) => {
    setSelectedYear(e.target.value);
  };

  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Time", accessor: "time" },
    { header: "Status", accessor: "status" },
  ];

  const renderRow = (attendance: Attendance) => (
    <tr key={attendance._id} className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100">
      <td className="py-3">{new Date(attendance.date).toLocaleDateString()}</td>
      <td className="py-3">{new Date(attendance.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td className="py-3">{attendance.status}</td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">
          {studentInfo ? `${studentInfo.name} ${studentInfo.surname} Attendance Details` : 'Student Attendance Details'}
        </h1>
        <div className="flex gap-2">
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
        <button onClick={() => window.history.back()} className="ml-[4px] bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 rounded-md">
          Back
        </button>
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

export default ListAttendance;