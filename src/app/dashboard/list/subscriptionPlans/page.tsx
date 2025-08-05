'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Plan {
  _id: string;
  name: string;
  price: string;
  features: string[];
  value: string;
}

interface Student {
  _id: string;
  name: string;
  surname: string;
  grade?: {
    name: string;
  };
}

const SubscriptionPlan = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();

  const parentId = session?.user?.id;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/subscription');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch plans.');
        setPlans(data);
      } catch {
        setError('Failed to load subscription plans.');
      } finally {
        setLoadingPlans(false);
      }
    };

    const fetchStudents = async () => {
      if (!parentId) return;
      try {
        const res = await fetch(`/api/student/fetchStudentsByParent?parentId=${parentId}`);
        const data = await res.json();
        setStudents(data.students || []);
      } catch {
        setError('Failed to load students.');
      }
    };

    fetchPlans();
    fetchStudents();
  }, [parentId]);

  const handleSelectPlan = async (planValue: string) => {
    if (!planValue || !selectedStudent || !parentId) {
      setError('Please select a student and a plan.');
      return;
    }

    setSelectedPlan(planValue);
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/selectedPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planValue, parentId, studentId: selectedStudent }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to update plan.');
        return;
      }

      if (selectedStudent) {
        router.push(`/dashboard/selectTeachers?studentId=${selectedStudent}`);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Choose Subscription Plan for Student</h1>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label htmlFor="student" className="font-medium">Student:</label>
        <select
          id="student"
          className="border px-3 py-2 rounded min-w-[250px]"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} {s.surname} ({s.grade?.name || 'No Grade'})
            </option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loadingPlans && <div>Loading plans...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`border rounded p-4 shadow ${
              selectedPlan === plan.value ? 'border-green-500' : ''
            }`}
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="text-green-600 text-xl">{plan.price}</p>
            <ul className="text-sm list-disc list-inside my-2">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan.value)}
              disabled={loading}
              className={`w-full mt-2 py-2 text-white rounded ${
                selectedPlan === plan.value
                  ? 'bg-green-700'
                  : 'bg-green-600 hover:bg-green-700'
              } ${loading ? 'opacity-60' : ''}`}
            >
              {loading && selectedPlan === plan.value
                ? 'Processing...'
                : selectedPlan === plan.value
                ? 'Selected'
                : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;