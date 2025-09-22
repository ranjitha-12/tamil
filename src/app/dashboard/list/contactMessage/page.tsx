'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/pagination';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email', className: 'hidden md:table-cell' },
  { header: 'Message', accessor: 'message', className: 'hidden md:table-cell' },
  { header: 'Date', accessor: 'createdAt' },
];

const ContactMessagePage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    }
  };

  const paginatedMessages = messages.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(messages.length / rowsPerPage);

  const renderRow = (msg: ContactMessage) => {
    return (
      <tr
        key={msg._id}
        className="text-left text-gray-700 text-md even:bg-slate-50 hover:bg-purple-100"
      >
        <td className="py-3">{msg.name}</td>
        <td className="py-3 hidden md:table-cell">{msg.email}</td>
        <td className="py-3 max-w-[300px] truncate hidden md:table-cell">{msg.message}</td>
        <td className="py-3">{new Date(msg.createdAt).toLocaleDateString()}</td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">Contact Messages</h1>
      </div>

      {messages.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={paginatedMessages} />
      ) : (
        <p className="text-center text-gray-500">No contact messages found.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ContactMessagePage;