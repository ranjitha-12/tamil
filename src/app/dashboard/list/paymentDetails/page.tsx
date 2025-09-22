"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table";
import Pagination from "@/components/pagination";
import { useSession } from "next-auth/react";

type PaymentDetails = {
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paidAt: string;
  planEndDate: string;
};

type Student = {
  _id: string;
  name: string;
  surname: string;
  paymentHistory: PaymentDetails[];
};

const columns = [
  { header: "Student Name", accessor: "studentName", className: "py-2 px-3" },
  { header: "Transaction ID", accessor: "transactionId", className: "py-2 px-3 hidden lg:table-cell" },
  { header: "Amount", accessor: "amount", className: "py-2 px-3" },
  { header: "Payment Method", accessor: "paymentMethod", className: "py-2 px-3 hidden md:table-cell" },
  { header: "Payment Date", accessor: "paidAt", className: "py-2 px-3 hidden md:table-cell" },
  { header: "Existing Plan EndDate", accessor: "planEndDate", className: "py-2 px-3" },
];

const PaymentDetailsPage = () => {
  const { data: session } = useSession();
  const parentId = session?.user?.id;
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/savePayment?parentId=${parentId}`);
      const data = await res.json();
      setStudents(data.students || []); 
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  useEffect(() => {
    if (parentId) fetchPayments();
  }, [parentId]);

  // Only map rows if student has payments
  const allRows = students.flatMap((student) =>
    student.paymentHistory && student.paymentHistory.length > 0
      ? student.paymentHistory.map((payment, idx) => ({
          key: `${student._id}-${idx}`,
          studentName: `${student.name} ${student.surname}`,
          transactionId: payment.transactionId,
          amount: `$${payment.amount} ${payment.currency}`,
          paymentMethod: payment.paymentMethod,
          paidAt: new Date(payment.paidAt).toLocaleDateString(),
          planEndDate: payment.planEndDate
            ? new Date(payment.planEndDate).toLocaleDateString()
            : "-",
        }))
      : [] 
  );

  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const paginatedData = allRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderRow = (row: any) => (
    <tr
      key={row.key}
      className="text-left text-gray-600 text-md even:bg-slate-50 hover:bg-purple-100"
    >
      <td className="py-3 px-3">{row.studentName}</td>
      <td className="py-3 px-3 hidden lg:table-cell">{row.transactionId}</td>
      <td className="py-3 px-3">{row.amount}</td>
      <td className="py-3 px-3 hidden md:table-cell">{row.paymentMethod}</td>
      <td className="py-3 px-3 hidden md:table-cell">{row.paidAt}</td>
      <td className="py-3 px-3">{row.planEndDate}</td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-2 sm:p-3 md:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl font-semibold">
          Parent Payment History
        </h1>
      </div>

      {allRows.length > 0 ? (
        <>
          <Table columns={columns} data={paginatedData} renderRow={renderRow} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <p className="text-gray-500 text-sm">No payment history found.</p>
      )}
    </div>
  );
};

export default PaymentDetailsPage;