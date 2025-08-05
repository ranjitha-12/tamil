'use client';
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const TeacherAssign = () => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [student, setStudent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const { data: session } = useSession();
  const teacherId = session?.user?.id;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (teacherId) fetchStudentsByTeacher();
  }, [teacherId]);

  const fetchStudentsByTeacher = async () => {
    try {
      const res = await fetch(`/api/student/fetchStudentsByTeacher?teacherId=${teacherId}`);
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error('Failed to fetch students by teacher:', err);
    }
  };

  const submit = async () => {
    if (!title || !dueDate || !student) return toast.error("Missing fields");

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("dueDate", dueDate);
    form.append("teacher", teacherId ?? "");
    form.append("student", student);

    if (file) form.append("attachments", file); 

    setLoading(true);
    const res = await fetch("/api/assignment/teacher", { method: "POST", body: form });
    setLoading(false);

    if (res.ok) {
      toast.success("Assignment created!");
      setTitle(""); setDesc(""); setDueDate(""); setStudent(""); 
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleViewAssignment = () => {
    router.push(`/dashboard/list/assignment/teacher/viewDetails`);
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">Assign Assignment</h1>
        <button
          onClick={() => handleViewAssignment()}
          className="ml-[4px] bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 rounded-md"
        >
          View Assignment
        </button>
      </div>
    
      <input
        type="text"
        placeholder="Title"
        className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
        rows={4}
        value={description}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        type="date"
        className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <select
        className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm bg-white mb-5"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      >
        <option value="">Select student</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>{s.name} ({s.grade.name})</option>
        ))}
      </select>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-5"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 float-end text-white py-2 px-6 rounded-md"
      >
        {loading ? "Assigning..." : "Assign"}
      </button>
    </div>
  );
};

export default TeacherAssign;
