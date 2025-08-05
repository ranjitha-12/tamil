'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useMemo } from "react";
import Table from "@/components/Table";
import Pagination from "@/components/pagination";
import { access } from "fs";
interface Student {
  _id: string;  
  name: string;
  surname: string;
  grade: Grade;
  profileImage?: string;
}
interface Grade {
   _id: string;  
  name: string;
}
interface Assignment {
  _id: string;
  title: string;
  description: string;
  status: "PENDING" | "COMPLETED" | "OVERDUE" ;
  dueDate: string;
  submissionDate: string;
  attachment?: string;
}

const StudentAssignment = () => {
  const { data: session } = useSession();
  const teacherId = session?.user?.id;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState<{ name: string; surname: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
 
   useEffect(() => {
     if (!teacherId) return;
     fetchStudentsByTeacher();
   }, [teacherId]);
 
   useEffect(() => {
     if (selectedStudent) {
       fetchAssignmentByStudentId(selectedStudent);
     } else {
       setAssignments([]);
     }
   }, [selectedStudent]);
 
   const fetchStudentsByTeacher = async () => {
     try {
       const res = await fetch(`/api/student/fetchStudentsByTeacher?teacherId=${teacherId}`);
       const data = await res.json();
       setStudents(data.students || []);
       setLoading(false);
     } catch (err) {
       console.error("Failed to fetch students:", err);
       setLoading(false);
     }
   };
 
   const fetchAssignmentByStudentId = async (studentId: string) => {
  try {
    const res = await fetch(`/api/assignment/fetchByStudentId?studentId=${studentId}`);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to fetch assignments");
      return;
    }
    setAssignments(data.assignments || []);
    const selected = students.find((s) => s._id === studentId);
    if (selected) {
      setStudentInfo({ name: selected.name, surname: selected.surname });
    }
  } catch (err) {
    console.error("Failed to fetch assignments:", err);
    toast.error("Failed to fetch assignments");
  }
};

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description", className: 'hidden md:table-cell' },
    { header: "Due Date", accessor: "dueDate", className: 'hidden md:table-cell'},
    { header: "Submission Date", accessor: "submissionDate", className: 'hidden md:table-cell' },
    { header: "Attachment", accessor: "attachment" },
    { header: "Status", accessor: "status", className: 'hidden md:table-cell' },
  ];

const renderRow = (assignment: Assignment) => {
  const studentFile = (assignment as any).attachments?.studentFiles?.[0];
  return (
    <tr key={assignment._id} className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100">
      <td className="py-3">{assignment.title}</td>
      <td className="py-3 hidden md:table-cell">{assignment.description}</td>
      <td className="py-3 hidden md:table-cell">{new Date(assignment.dueDate).toLocaleDateString()}</td>
      <td className="py-3 hidden md:table-cell">{new Date(assignment.submissionDate).toLocaleDateString()}</td>
      <td className="py-3">
        {studentFile?.fileUrl ? (
          <a href={studentFile.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {studentFile.fileName || "View Attachment"}
          </a>
        ) : (
          "No Attachment"
        )}
      </td>
      <td className="py-3 hidden md:table-cell">
        <span className={`px-2 py-1 rounded ${
          assignment.status === "PENDING"
            ? 'bg-red-100 text-red-800'
            : assignment.status === "COMPLETED"
            ? "bg-blue-200 text-blue-800"
            : "bg-green-200 text-green-800"
        }`}>
          {assignment.status}
        </span>
      </td>
    </tr>
  );
};

  const months = [
        { value: '1', label: 'January' }, { value: '2', label: 'February' },
        { value: '3', label: 'March' }, { value: '4', label: 'April' },
        { value: '5', label: 'May' }, { value: '6', label: 'June' },
        { value: '7', label: 'July' }, { value: '8', label: 'August' },
        { value: '9', label: 'September' }, { value: '10', label: 'October' },
        { value: '11', label: 'November' }, { value: '12', label: 'December' },
      ];
    
      const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));
    
      // Filter assignment data based on selected month and year
      const filteredAssignment = useMemo(() => {
        if (!selectedMonth && !selectedYear) {
          return assignments;
        }
        return assignments.filter(assignment => {
          const date = new Date(assignment.dueDate);
          const monthMatches = !selectedMonth || (date.getMonth() + 1) === parseInt(selectedMonth);
          const yearMatches = !selectedYear || date.getFullYear() === parseInt(selectedYear);
          
          return monthMatches && yearMatches;
        });
      }, [assignments, selectedMonth, selectedYear]);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
      
    const totalPages = Math.ceil(filteredAssignment.length / rowsPerPage);
    const paginatedfilteredAssignment = filteredAssignment.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  
    const handleMonthChange = (e: any) => {
      setSelectedMonth(e.target.value);
    };
    const handleYearChange = (e: any) => {
      setSelectedYear(e.target.value);
    };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">
          {studentInfo ? `${studentInfo.name} ${studentInfo.surname} Assignment Details` : 'Your Student Assignment Details'}
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
      
      {assignments.length === 0 && <p>No assignments found</p>}

      {filteredAssignment.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={paginatedfilteredAssignment} />
          ) : (
            <p className="text-center text-gray-500 mt-4">No Assignment records for selected month/year.</p>
          )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
}
export default StudentAssignment;
