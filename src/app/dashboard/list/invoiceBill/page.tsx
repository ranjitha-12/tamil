"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Table from '@/components/Table';
import Pagination from '@/components/pagination';

type PaymentHistory = {
  amount: number;
  currency: string;
  transactionId: string;
  paymentMethod: string;
  paidAt: string;
  invoiceGenerated?: boolean;
  billingCycle?: string;
  planName?: string;
  sessionType?: string;
  sessions?: number;
};

type Student = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  grade?: { _id: string; name: string };
  tamilGrade?: string;
  selectedPlan: string;
  billingCycle: string;
  sessionType: string;
  sessionLimit: number;
  sessionUsed: number;
  planStartDate: string;
  planEndDate: string;
  paymentStatus: string;
  profileStatus: string;
  enrollmentCategory: string;
  paymentHistory: PaymentHistory[];
};

function formatDate(d?: string | Date) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString();
}

export default function InvoiceBillPage() {
  const { data: session } = useSession();
  const parentId = session?.user?.id || "";
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingBillFor, setGeneratingBillFor] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!parentId) {
      setLoading(false);
      return;
    }
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `/api/student/fetchStudentsByParent?parentId=${parentId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load students");
        setStudents(data.students || []);
      } catch (err: any) {
        console.error("fetch students error", err);
        setError(err?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [parentId]);

  const now = new Date();

  // Eligible if plan ended + pending + continue enrolled
  const eligibleStudents = students.filter((s) => {
    if (!s.planEndDate) return false;
    const planEnd = new Date(s.planEndDate);
    return (
      planEnd < now &&
      s.paymentStatus === "pending" &&
      s.profileStatus === "enrolled" &&
      s.enrollmentCategory === "continue"
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(eligibleStudents.length / rowsPerPage);
  const paginatedStudents = eligibleStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleGenerateAndPay = async (student: Student) => {
    try {
      setGeneratingBillFor(student._id);
      setError(null);
      const billRes = await fetch("/api/adminInvoice/billGenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student._id }),
      });
      const billData = await billRes.json();

      if (!billRes.ok) {
        throw new Error(billData.error || "Failed to generate bill");
      }
      const latestPayment = billData.student.paymentHistory[billData.student.paymentHistory.length - 1];
      const query = new URLSearchParams({
        studentId: student._id,
        amount: latestPayment.amount.toString(),
      }).toString();

      router.push(`/dashboard/list/subscriptionPlans/payment?${query}`);
    } catch (err: any) {
      console.error("Bill generation error", err);
      setError(err?.message || "Failed to generate bill");
    } finally {
      setGeneratingBillFor(null);
    }
  };

  // Define table columns
  const columns = [
    { header: "Student Name", accessor: "name", className: "py-2 px-3" },
    { header: "Plan", accessor: "plan", className: "py-2 px-3" },
    { header: "Session Type", accessor: "sessionType", className: "py-2 px-3 hidden md:table-cell" },
    { header: "Billing Cycle", accessor: "billingCycle", className: "py-2 px-3 hidden md:table-cell" },
    { header: "Existing Plan EndDate", accessor: "planEndDate", className: "py-2 px-3 hidden md:table-cell" },
    { header: "Amount", accessor: "amount", className: "py-2 px-3" },
    { header: "Actions", accessor: "actions", className: "py-2 px-3" },
  ];

  // Render each row in the table
  const renderRow = (student: Student) => {
    // Get the last successful payment to determine the amount
    const lastSuccessfulPayment = student.paymentHistory
      .filter(p => p.transactionId && p.paidAt)
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())[0];
    
    const amount = lastSuccessfulPayment?.amount || 0;

    return (
      <tr
        key={student._id}
        className="text-left text-gray-500 text-md even:bg-slate-50 hover:bg-purple-100"
      >
        <td className="py-3 px-3">
          {student.name} {student.surname}
        </td>
        <td className="py-3 px-3">
          {student.selectedPlan}
        </td>
        <td className="py-3 px-3 hidden md:table-cell">
          {student.sessionType}
        </td>
        <td className="py-3 px-3 hidden md:table-cell">
          {student.billingCycle}
        </td> 
        <td className="py-3 px-3 hidden md:table-cell">
          {formatDate(student.planEndDate)}
        </td>
        <td className="py-3 px-3 font-bold">
          ${amount.toFixed(2)}
        </td>
        <td className="py-3 px-3 whitespace-nowrap">
          <button
            onClick={() => handleGenerateAndPay(student)}
            disabled={generatingBillFor === student._id}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
          >
            {generatingBillFor === student._id
              ? "Generating..."
              : "Pay Bill"}
          </button>
        </td>
      </tr>
    );
  };

  if (loading) return <p className="p-6">Loading students...</p>;

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-2 sm:p-3 md:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl font-semibold">
          Subscription Bills
        </h1>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
      )}

      {eligibleStudents.length === 0 ? (
        <div className="p-10 bg-gray-100 rounded">
          No New subscription bills due at this time.
        </div>
      ) : (
        <>
          <Table columns={columns} data={paginatedStudents} renderRow={renderRow} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </>
      )}
    </div>
  );
}