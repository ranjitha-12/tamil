'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
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
interface PaymentHistory {
  amount: number;
  currency: string;
  transactionId: string;
  paymentMethod: string;
  paidAt: string;
  planStartDate: string;
  planEndDate: string;
}
interface Student {
  _id: string;
  name: string;
  surname: string;
  tamilGrade?: string;
  grade: Grade;
  email: string;
  paymentStatus?: string;
  paymentHistory?: PaymentHistory[];
  profileStatus?: string;
  enrollmentCategory?: string;
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
interface SubscriptionPlan {
  value: string;
  _id: string;
  name: string;
  price: number;
  features: string[];
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
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"freeTrial" | "monthly" | "yearly">("monthly");
  const [showPlans, setShowPlans] = useState(true);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/subscription');
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
      }
    };
    fetchPlans();
  }, []);

  // Store parentId
  useEffect(() => {
    if (parentId) {
      sessionStorage.setItem('parentId', parentId);
    }
  }, [parentId]);

// Fetch parent, students, announcements
useEffect(() => {
  const fetchData = async () => {
    if (!parentId) return;
    try {
      const parentRes = await fetch(`/api/parents/${parentId}`);
      const parentData = await parentRes.json();
      setParent(parentData);

      // Profile completeness check
      const isEmpty = (val: any) => val === null || val === undefined || String(val).trim() === "";
      const isIncomplete =
        isEmpty(parentData.fatherFirstName) ||
        isEmpty(parentData.motherFirstName);
      setShowProfilePopup(isIncomplete);

      // Fetch students
      const studentRes = await fetch(`/api/student/fetchStudentsByParent?parentId=${parentId}`);
      const studentData = await studentRes.json();
      const studentList: Student[] = studentData.students || [];
      setStudents(studentList);

      // --- Update enrollmentCategory based on payment history ---
      for (const student of studentList) {
        if (student.paymentHistory && student.paymentHistory.length > 0) {
          // Has payments → should be "statusCheck"
          if (student.enrollmentCategory !== "statusCheck") {
            await fetch(`/api/student/${student._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                enrollmentCategory: "statusCheck",
              }),
            });
          }
        } else {
          // No payments → keep as "initialCall"
          if (student.enrollmentCategory !== "initialCall") {
            await fetch(`/api/student/${student._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                enrollmentCategory: "initialCall",
              }),
            });
          }
        }
      }

      // --- Main Logic for showing subscription ---
      const hasAnyPaymentHistory = studentList.some(
        (s: Student) => s.paymentHistory && s.paymentHistory.length > 0
      );
      if (studentList.length === 0 || !hasAnyPaymentHistory) {
        setShowPlans(true);
      } else {
        setShowPlans(false);
      }

      // Fetch announcements
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

  const handleSubscription = () => {
    router.push('/dashboard/list/subscriptionPlans');
  };

  const handleGoToProfile = () => {
    router.push('/dashboard/parentProfile');
  };

  if (loading) return <div className="p-6 text-lg text-gray-600">Loading dashboard...</div>;
  if (!parent) return <div className="p-6 text-lg text-red-500">No parent data found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Incomplete profile popup */}
      {showProfilePopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-600">Incomplete Profile</h2>
            <p className="text-gray-700">Please update your profile information and Add Children information to continue using.</p>
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
      <section className="bg-amber-100 text-black py-10 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Parent Dashboard</h1>
      </section>

      {/* Show Subscription if no student or no payment history */}
      {showPlans ? (
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-4">Universal Tamil Academy – Subscription Plans</h2>
          {/* Billing Cycle Switch */}
          <div className="flex justify-center mb-12">
            <div className="bg-white shadow-md rounded-full p-1 flex">
              {["freeTrial", "monthly", "yearly"].map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle as any)}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    billingCycle === cycle ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {/* Plans */}
          <div className={`grid gap-8 ${
            billingCycle === "freeTrial" ? "grid-cols-1 place-items-center" : "grid-cols-1 md:grid-cols-4"
          }`}>
            {plans.filter((plan) => {
              if (billingCycle === "freeTrial") return plan.value === "freeTrial";
              return plan.value !== "freeTrial";
            }).map((plan) => (
              <div key={plan._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">{plan.name}</h3>
                <p className="text-gray-700 mb-4">Weekly Tamil Sessions</p>
                <ul className="text-sm space-y-2 mb-4">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">✔</span>{f}
                    </li>
                  ))}
                </ul>
                <p className="text-3xl font-bold mb-1">
                  {plan.value === "freeTrial"
                    ? "$0 / Free Trial"
                    : `$${billingCycle === "monthly" ? plan.price : plan.price * 11} / ${billingCycle}`}
                </p>
                <button
                  onClick={handleSubscription}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition"
                >
                  {plan.value === "freeTrial" ? "Start Free Trial" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
          {/* Announcements */}
          {announcements.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-800">📢 Announcements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((a) => (
                  <div key={a._id} className="border-l-4 border-blue-400 bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold text-blue-700">{a.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" /> {new Date(a.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{a.description}</p>
                    <p className="text-sm text-gray-400">Class: {a.class?.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Student Cards */}
          <div className="my-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">👨‍🎓 Children Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {students.map((s) => (
                <div key={s._id} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow hover:shadow-xl border">
                  <p className="text-lg font-semibold text-blue-700">{s.name} {s.surname}</p>
                  <p className="text-black">E-mail: <span className="text-gray-600">{s.email}</span></p>
                  <p className="text-black">Tamil Grade: <span className="text-gray-600">{s.tamilGrade || "Not yet assigned by teacher"}</span></p>
                  <p className="text-black">Payment Status:
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      s.paymentStatus === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                      {s.paymentStatus}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboardPage;