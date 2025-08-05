'use client';

import React, { useEffect, useState } from 'react';
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import Image from "next/image";
import Modal from '@/components/FormModal';
import SubscriptionForm from '@/components/forms/subscriptionForm';

type Subscription = {
  _id: string;
  name: string;
  price: string;
  value: string;
  features: string[];
};

const columns = [
  { header: "Name", accessor: "name", className: "py-2 px-3" },
  { header: "Price", accessor: "price", className: "py-2 px-3" },
  { header: "Value", accessor: "value", className: "py-2 px-3 hidden md:table-cell" },
  { header: "Actions", accessor: "action", className: "py-2 px-3" },
];

const SubscriptionSinglePage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(subscriptions.length / rowsPerPage);
  const paginatedSubscriptions = subscriptions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleOpen = () => {
    setSelectedSubscription(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedSubscription(null);
    setIsModalOpen(false);
    fetchSubscriptions();
  };

  const handleEdit = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    try {
      const res = await fetch(`/api/subscription?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      alert('Subscription deleted successfully');
      fetchSubscriptions();
    } catch (error) {
      console.error('Delete error', error);
      alert('Failed to delete subscription');
    }
  };

  const renderRow = (sub: Subscription) => (
    <tr key={sub._id} className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100">
      <td className="py-3 px-3">{sub.name}</td>
      <td className="py-3 px-3">{sub.price}</td>
      <td className="py-3 px-3 hidden md:table-cell">{sub.value}</td>
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(sub)} className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-400">
            <Image src="/update.png" alt="edit" width={14} height={14} />
          </button>
          <button onClick={() => handleDelete(sub._id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400">
            <Image src="/close.png" alt="delete" width={10} height={10} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-xl lg:text-xl 2xl:text-xl font-semibold">All Subscriptions</h1>
        <div className="flex items-center gap-4">
          <button onClick={handleOpen} className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
            <Image src="/create.png" alt="Create" width={14} height={14} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={paginatedSubscriptions} />

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* MODAL FORM */}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
              <h2 className="text-xl font-bold ml-4">
                {selectedSubscription ? "Edit Subscription" : "Create Subscription"}
              </h2>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center">
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            <SubscriptionForm
              existingSubscription={selectedSubscription ?? undefined}
              onClose={handleClose}
            />
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionSinglePage;