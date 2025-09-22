'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';

interface FreeTrial {
  _id: string;
  parentEmail: string;
  student: {
    _id: string;
    name: string;
    surname: string;
    grade: {
      _id: string;
      name: string;
    };
  };
  bookedAt: string;
}

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Surname', accessor: 'surname', className: 'hidden md:table-cell' },
  { header: 'Grade', accessor: 'grade', className: 'hidden md:table-cell' },
  { header: 'Parent Email', accessor: 'email' },
  { header: 'Booked Date', accessor: 'bookedAt' },
];

const FreeTrialList = () => {
  const [freeTrials, setFreeTrials] = useState<FreeTrial[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
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

  const filteredFreeTrials = useMemo(() => {
    if (!selectedMonth && !selectedYear) return freeTrials;

    return freeTrials.filter((trial) => {
      const date = new Date(trial.bookedAt);
      const monthMatches = !selectedMonth || date.getMonth() + 1 === parseInt(selectedMonth);
      const yearMatches = !selectedYear || date.getFullYear() === parseInt(selectedYear);
      return monthMatches && yearMatches;
    });
  }, [freeTrials, selectedMonth, selectedYear]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
         
   const totalPages = Math.ceil(filteredFreeTrials.length / rowsPerPage);
   const paginatedFilteredFreeTrials = filteredFreeTrials.slice(
     (currentPage - 1) * rowsPerPage,
     currentPage * rowsPerPage
   );

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    fetchFreeTrials();
  }, []);

  const fetchFreeTrials = async () => {
    try {
      const res = await fetch('/api/freeTrial/list');
      const data = await res.json();
      setFreeTrials(data.freeTrials || []);
    } catch (err) {
      console.error('Failed to fetch free trials:', err);
    }
  };

  const renderRow = (trial: FreeTrial) => {
    return (
      <tr
        key={trial._id}
        className="text-left text-gray-700 text-md even:bg-slate-50 hover:bg-purple-100"
      >
        <td className="py-3">{trial.student.name}</td>
        <td className="py-3 hidden md:table-cell">{trial.student.surname}</td>
        <td className="py-3 hidden md:table-cell">{trial.student.grade?.name}</td>
        <td className="py-3">{trial.parentEmail}</td>
        <td className="py-3">{new Date(trial.bookedAt).toLocaleDateString()}</td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">Free Trial Classes List</h1>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded-md text-md"
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border border-gray-300 rounded-md text-md"
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

      {filteredFreeTrials.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={paginatedFilteredFreeTrials} />
      ) : (
        <p className="text-center text-gray-500">No free trial bookings found for the selected criteria.</p>
      )}

      <div>
       <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </div>
  );
};

export default FreeTrialList;