"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Table from "@/components/Table";
import Pagination from "@/components/pagination";

interface Attendance {
  _id: string;
  date: string;
  status: string;
}
interface Grade {
   _id: string;  
  name: string;
}
interface Student {
  _id: string;
  name: string;
  surname: string;
  grade: Grade;
}

const ParentAttendancePage = () => {
  const { data: session } = useSession();
  const parentId = session?.user?.id;

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState<{ name: string; surname: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (!parentId) return;
    fetchStudentsByParent();
  }, [parentId]);

  useEffect(() => {
    if (selectedStudent) {
      fetchAttendanceByStudentId(selectedStudent);
    } else {
      setAttendances([]);
    }
  }, [selectedStudent]);

  const fetchStudentsByParent = async () => {
    try {
      const res = await fetch(`/api/student/fetchStudentsByParent?parentId=${parentId}`);
      const data = await res.json();
      setStudents(data.students || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setLoading(false);
    }
  };

  const fetchAttendanceByStudentId = async (studentId: string) => {
    try {
      const res = await fetch(`/api/attendance/byStudent?studentId=${studentId}`);
      const data = await res.json();
      setAttendances(data.attendances || []);
      setStudentInfo(data.student || null);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setAttendances([]);
      setStudentInfo(null);
    }
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
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs ${
          attendance.status === 'PRESENT' ? 'bg-green-100 text-green-800'
          : attendance.status === 'LATE' ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
        }`}>{attendance.status}</span>
      </td>
    </tr>
  );
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
        return attendances;
      }
  
      return attendances.filter(attendance => {
        const date = new Date(attendance.date);
        const monthMatches = !selectedMonth || (date.getMonth() + 1) === parseInt(selectedMonth);
        const yearMatches = !selectedYear || date.getFullYear() === parseInt(selectedYear);
        
        return monthMatches && yearMatches;
      });
    }, [attendances, selectedMonth, selectedYear]);

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

  if (loading) return <div className="p-4">Loading Attendance...</div>;
  if (!students.length) return <div className="p-4">No students found.</div>;

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">
          {studentInfo ? `${studentInfo.name} ${studentInfo.surname} Attendance Details` : 'Your Children Attendance Details'}
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
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-8 mt-8">
        <label htmlFor="studentSelect" className="mr-2 font-medium">Select Student:</label>
        <select
          id="studentSelect"
          className="border rounded min-w-[200px] sm:min-w-[250px] md:min-w-[300px] px-2 py-1 w-full sm:w-auto"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- select --</option>
          {students.map((stud) => (
            <option key={stud._id} value={stud._id}>
              {stud.name} {stud.surname} ({stud.grade?.name})
            </option>
          ))}
        </select>
      </div>

      {filteredAttendance.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={paginatedfilteredAttendance} />
      ) : (
        <p className="text-center text-gray-500 mt-4">No attendance records for selected month/year.</p>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
};

export default ParentAttendancePage;