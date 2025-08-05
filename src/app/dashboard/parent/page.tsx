'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CalendarDays, User, Mail, MapPin } from "lucide-react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  date: string;
  class: { name: string };
}
interface Grade {
  _id: string;
  name: string;
}
interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  grade: Grade;
  email: string;
}
interface Parent {
  _id: string;
  username: string;
  email: string;
  whatsapp: string;
  state: string;
  country: string;
  motherFirstName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherLastName: string;
  students: Student[];
}

const ParentDashboardPage = () => {
  const { data: session } = useSession();
  const parentId = session?.user?.id;
  const [parent, setParent] = useState<Parent | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const router = useRouter();
  const [todaySessions, setTodaySessions] = useState<{ start: string; end: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!parentId) return;
      try {
        const parentRes = await fetch(`/api/parents/${parentId}`);
        const parentData = await parentRes.json();
        setParent(parentData);

        // Check if profile is incomplete
        const isIncomplete =
          !parentData.username ||
          !parentData.fatherFirstName ||
          !parentData.fatherLastName ||
          !parentData.motherFirstName ||
          !parentData.motherLastName;

        if (isIncomplete) {
          setShowProfilePopup(true);
        }

        const studentRes = await fetch(`/api/student/fetchStudentsByParent?parentId=${parentId}`);
        const studentData = await studentRes.json();
        const studentList = studentData.students || [];
        setStudents(studentList);

        if (studentList.length > 0) {
          const ids = studentList.map((s: Student) => s._id).join("&studentIds=");
          const sessionsRes = await fetch(`/api/booking/today?studentIds=${ids}`);
          const sessionsData = await sessionsRes.json();
          setTodaySessions(sessionsData.sessions || []);
        }

        const announcementsRes = await fetch("/api/announcement");
        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentId]);

  const handleOpen = () => {
    router.push(`/dashboard/parent/freeTrial/${parentId}`);
  };

  const handleGoToProfile = () => {
    router.push('/dashboard/parentProfile'); 
  };

  if (loading) return <div className="p-6 text-lg text-gray-600">Loading dashboard...</div>;
  if (!parent) return <div className="p-6 text-lg text-red-500">No parent data found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Profile Update Popup */}
      {showProfilePopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-600">Incomplete Profile</h2>
            <p className="text-gray-700">Please update your profile information and Add student information to continue using.</p>
            <button
              onClick={handleGoToProfile}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Update Now
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="relative h-64 bg-[url('/parentDashboard.png')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/50 w-full h-full absolute inset-0" />
        <h1 className="relative z-10 text-white text-3xl sm:text-4xl font-bold">Parent Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Free Class Button */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg text-center">
          <button onClick={handleOpen} className="font-semibold text-purple-700 transition">
            Try Free Classes
          </button>
        </div>

        {/* Sessions Section */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-blue-800">📈 Sessions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p>Today Sessions:{" "} <span className="font-semibold text-red-400">
              {todaySessions.length === 0
                ? "—"
                : todaySessions
                  .map((s) => {
                    const start = new Date(s.start);
                    const end = new Date(s.end);
                    const options: Intl.DateTimeFormatOptions = {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    };
                    return `${start.toLocaleTimeString([], options)} - ${end.toLocaleTimeString([], options)}`;
                  })
                  .join(", ")}
            </span></p>
            <p>Validity: <span className="font-semibold">—</span></p>
          </div>
        </div>

        {/* Announcement Section */}
        {announcements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-800">📢 Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((a) => (
                <div key={a._id} className="border-l-4 border-blue-400 bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold text-blue-700">{a.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(a.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">{a.description}</p>
                  <p className="text-sm text-gray-400">Class: {a.class?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parent Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">👨‍👩‍👧‍👦 Parent Info</h2>
          <p><Mail className="inline w-4 h-4 mr-2" /> {parent.email}</p>
          <p><User className="inline w-4 h-4 mr-2" /> {parent.fatherFirstName} & {parent.motherFirstName}</p>
          <p><MapPin className="inline w-4 h-4 mr-2" /> {parent.state}, {parent.country}</p>
          <p>📱 WhatsApp: {parent.whatsapp}</p>
        </div>

        {/* Student Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-purple-800">👨‍🎓 Your Children</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {students.map((s) => (
              <div key={s._id} className="bg-white p-4 rounded-xl shadow border hover:shadow-md">
                <h3 className="text-lg font-bold">{s.firstName} {s.lastName}</h3>
                <p className="text-gray-600">Grade: {s.grade?.name}</p>
                <p className="text-gray-600">Age: {s.age}</p>
                <p className="text-gray-600">Email: {s.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardPage;