'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/FormModal';
import StudentForm from '@/components/forms/studentForm';

interface Student {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

const FreeTrialPage = () => {
  const { id: parentId } = useParams();
  const router = useRouter();
  const [used, setUsed] = useState<boolean | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!parentId) return;

    const fetchData = async () => {
      try {
        const studentRes = await fetch(`/api/student/fetchStudentsByParent?parentId=${parentId}`);
        const studentData = await studentRes.json();
        setStudents(studentData.students || []);

        const parentRes = await fetch(`/api/parents/${parentId}`);
        const parent = await parentRes.json();

        const trialRes = await fetch(`/api/freeTrial?email=${parent.email}`);
        const trialData = await trialRes.json();
        setUsed(trialData.used);
      } catch (err) {
        console.error('Error fetching data:', err);
        setUsed(false);
      }
    };

    fetchData();
  }, [parentId]);

  const handleBook = async () => {
    if (used) {
      alert('Free trial already used. Please subscribe.');
      return;
    }
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    const res = await fetch('/api/freeTrial', {
      method: 'POST',
      body: JSON.stringify({ parentId, studentId: selectedStudent }),
      headers: { 'Content-type': 'application/json' },
    });

    const result = await res.json();
    if (res.ok) {
      alert('Free trial booked!');
      router.push('/dashboard/parent');
    } else {
      alert(result.error || 'Booking failed');
    }
  };

 const renderStudentSection = () => {
  if (students.length === 0 && used !== null) {
    return (
      <>
        <p className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">You have no students. Please add one to proceed.</p>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-bl-600 text-white rounded-md mt-4"
        >
          + Add Student
        </button>
      </>
    );
  }
  if (students.length > 0) {
    return (
      <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          disabled={used === true}
        >
          <option value="">-- Select Child --</option>
          {students.map((st) => (
            <option key={st._id} value={st._id}>
              {st.name} {st.surname}
            </option>
          ))}
        </select>
        <button
          onClick={handleBook}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md mt-4"
          disabled={used === true}
        >
          Book Free Trial
        </button>
      </div>
    );
  }
  return null;
};

  return (
    <div>
    <div className="relative h-64 bg-[url('/parentDashboard.png')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/50 w-full h-full absolute inset-0" />
        <h1 className="relative z-10 text-white text-3xl sm:text-4xl font-bold">Parent Dashboard</h1>
      </div>
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-6 mt-4">
      <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-bold mb-4">Book Your Free Trial Class</h1>

      {used && (
        <div className="mb-4 bg-yellow-100 border border-yellow-300 text-yellow-700 p-3 rounded-md">
          <p>⚠️ You have already used your free trial.</p>
          <p>Please subscribe to continue booking classes.</p>
        </div>
      )}

      {/* Render student section via function */}
      {renderStudentSection()}

      {/* Add Student Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <StudentForm
          onClose={() => {
            setShowForm(false);
            fetch(`/api/student/fetchStudentsByParent?parentId=${parentId}`)
              .then((res) => res.json())
              .then((data) => {
                setStudents(data.students || []);
              })
              .catch(console.error);
          }}
          refreshStudents={() => {}}
        />
      </Modal>
    </div>
    </div>
  );
};

export default FreeTrialPage;