'use client';

import React, { useEffect, useState } from 'react';

type Teacher = {
  _id: string;
  name: string;
  email: string;
  attendanceCount: number;
};

type Props = {
  teacher: Teacher | null;
  onClose: () => void;
};

const TeacherPaymentForm: React.FC<Props> = ({ teacher, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [monthlyCount, setMonthlyCount] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const amountPerSession = 20;
  const totalAmount = teacher && monthlyCount !== null ? monthlyCount * amountPerSession : 0;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const fetchMonthlyAttendance = async () => {
    if (!teacher?._id) return;

    try {
      const res = await fetch(`/api/attendance/monthly?teacherId=${teacher._id}`);
      const { data } = await res.json();

      const selectedMonthData = data.find(
        (item: { _id: { year: number; month: number }; count: number }) =>
          item._id.year === selectedYear && item._id.month === selectedMonth
      );

      if (selectedMonthData) {
        setMonthlyCount(selectedMonthData.count);
      } else {
        setMonthlyCount(0); 
      }
    } catch (err) {
      console.error('Failed to fetch monthly attendance', err);
      setMonthlyCount(null);
    }
  };

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [teacher, selectedMonth, selectedYear]);

  const handlePayment = async () => {
    if (!teacher) return;

    const confirm = window.confirm(
      `Are you sure you want to pay $${totalAmount} to ${teacher.name}?`
    );
    if (!confirm) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/payments/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher._id,
          attendanceCount: monthlyCount,
          amount: totalAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      setSuccessMessage(`Successfully paid $${totalAmount} to ${teacher.name}`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className="space-y-4 px-4 py-2">
      <div>
        <label className="block text-sm text-gray-600">Teacher Name</label>
        <div className="font-medium">{teacher.name}</div>
      </div>

      <div>
        <label className="block text-sm text-gray-600">Email</label>
        <div className="font-medium">{teacher.email}</div>
      </div>

      <div>
        <label className="block text-sm text-gray-600">Total Attendance Count</label>
        <div className="font-medium">{teacher.attendanceCount}</div>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block text-sm text-gray-600">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {months.map((month, idx) => (
              <option key={month} value={idx + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Select Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {monthlyCount !== null && (
        <div>
          <label className="block text-sm text-gray-600">
            {months[selectedMonth - 1]} {selectedYear} Attendance
          </label>
          <div className="font-medium text-blue-600">
            {monthlyCount} session{monthlyCount !== 1 && 's'}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-600">Amount to Pay</label>
        <div className="font-semibold text-green-700 text-lg">${totalAmount}</div>
      </div>

      {successMessage && (
        <div className="text-green-600 text-sm font-medium">{successMessage}</div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={isSubmitting || monthlyCount === null}
          className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Paying...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
};

export default TeacherPaymentForm;