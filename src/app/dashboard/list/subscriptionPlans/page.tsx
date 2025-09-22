'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from "next/image";

interface Plan {
  _id: string;
  name: string;
  price: number;
  features: string[];
  value: string;
}
interface Student {
  _id: string;
  name: string;
  surname: string;
  grade?: { name: string; };
  paymentStatus?: string;
  sessionLimit?: number;
  sessionUsed?: number;
}
interface PaymentDetails {
  sessionType: string;
  billingCycle: string;
  planName: string;
  monthlyPrice?: number;
  sessions?: number;
  totalAmount?: number;
  planStartDate?: string;
  planEndDate?: string;
}

const SubscriptionPlan = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<"freeTrial" | "monthly" | "yearly">("monthly");
  const [startMonth, setStartMonth] = useState<number | undefined>(undefined);
  const [startYear, setStartYear] = useState<number | undefined>(undefined); 
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();
  const parentId = session?.user?.id;

  useEffect(() => {
    if (parentId) {
      sessionStorage.setItem('parentId', parentId);
    }
  }, [parentId]);

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

  const months = [
    { value: 0, label: 'January' }, { value: 1, label: 'February' }, { value: 2, label: 'March' },
    { value: 3, label: 'April' }, { value: 4, label: 'May' }, { value: 5, label: 'June' },
    { value: 6, label: 'July' }, { value: 7, label: 'August' }, { value: 8, label: 'September' },
    { value: 9, label: 'October' }, { value: 10, label: 'November' }, { value: 11, label: 'December' }
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Show 6 months: 2 before, current, 3 ahead (clamped to month indexes 0..11)
  const visibleMonths = months.filter(m => {
    const diff = m.value - currentMonth;
    return diff >= -2 && diff <= 3;
  });

  const years = [currentYear, currentYear + 1, currentYear + 2];

 const handleSelectPlan = async (planValue: string) => {
    if (!planValue || !selectedStudent || !parentId) {
      setError('Please select a student and a plan.');
      return;
    }
    const selected = plans.find((p) => p.value === planValue);
    if (!selected) {
      setError('Selected plan not found.');
      return;
    }
    if (!sessionType && planValue !== 'freeTrial') {
      setError('Please select a session type.');
      return;
    }
    if (billingCycle === "monthly" && (startMonth === undefined || startYear === undefined)) {
      setError('Please select start date for monthly billing.');
      return;
    }
    setSelectedPlan(planValue);
    setError('');
    // Free plan
    if (planValue === 'freeTrial') {
      setLoading(true);
      try {
        const res = await fetch('/api/selectedPlan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: planValue,
            billingCycle,
            parentId,
            studentId: selectedStudent,
            sessionType,
            startMonth,
            startYear,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Failed to update plan.');
          return;
        }
        router.push(`/dashboard/parent/freeTrial/${parentId}`);
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }
   try {
      setLoading(true);
      const res = await fetch('/api/selectedPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planValue,
          billingCycle,
          parentId,
          studentId: selectedStudent,
          sessionType,
          startMonth,
          startYear,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to calculate payment.');
        return;
      }
      if (!data.paymentDetails) {
        setError('No payment details returned from server.');
        return;
      }
      setPaymentDetails(data.paymentDetails);
      const amount = data.paymentDetails.totalAmount;
      if (billingCycle === "yearly") {
        router.push(`/dashboard/list/subscriptionPlans/payment?studentId=${selectedStudent}&amount=${amount}`);
        return;
      }
      setShowPaymentModal(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/selectedPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          billingCycle,
          parentId,
          studentId: selectedStudent,
          sessionType,
          startMonth,
          startYear,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to process payment.');
        return;
      }
      const amount = data.paymentDetails.totalAmount;
      router.push(`/dashboard/list/subscriptionPlans/payment?studentId=${selectedStudent}&amount=${amount}`);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handleStudentChange = async (studentId: string) => {
    setSelectedStudent(studentId);
    setError('');
    if (!studentId) return;
    try {
      const res = await fetch(`/api/student/${studentId}`);
      if (!res.ok) throw new Error('Failed to fetch student details.');
      const studentData = await res.json();
      const { paymentStatus, sessionLimit, sessionUsed } = studentData || {};

      // If student already has active paid sessions, take them to select teachers
      if (paymentStatus === 'success' && sessionUsed < sessionLimit) {
        // router.push(`/dashboard/selectTeachers?studentId=${studentId}`);
         router.push('/dashboard/parent');
        return;
      }
    } catch (err) {
      console.error(err);
      setError('Failed to check student status.');
    }
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <h1 className="text-xl font-bold">Choose Subscription Plan For Your Children</h1>
      
      {loadingPlans && <div>Loading plans...</div>}
      
      <section className="py-1 px-1 md:px-0">
        <div className="flex flex-col gap-6 mt-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="invisible"></div>
            <select 
              id="student"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5 max-w-full"
              value={selectedStudent} 
              onChange={(e) => handleStudentChange(e.target.value)}
            >
              <option value="">-- Select Child --</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} {s.surname}
                </option>
              ))}
            </select>

            <select 
              id="sessionType"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5 max-w-full"
              value={sessionType} 
              onChange={(e) => setSessionType(e.target.value)}
            >
              <option value="">-- Select Session Type --</option>
              <option value="1h">2 × 1 Hour Sessions</option>
              <option value="30m">4 × 30 Min Sessions</option>
              <option value="40m">3 × 40 Min Sessions</option>
            </select>
            <div className="invisible"></div>
          </div>
          
          {billingCycle === "monthly" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="invisible"></div>
              <select 
                id="startMonth"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5 max-w-full"
                value={startMonth !== undefined ? startMonth : ""} 
                onChange={(e) => setStartMonth(parseInt(e.target.value))} 
              >
                <option value="" disabled hidden>-- Select Start Month --</option>
                {visibleMonths.map(month => (
                  <option key={month.value} value={month.value}> {month.label} </option>
                ))}
              </select>
              <select 
                id="startYear"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-md mb-5 max-w-full"
                value={startYear !== undefined ? startYear : ""} 
                onChange={(e) => setStartYear(parseInt(e.target.value))} 
              >
                <option value="" disabled hidden>-- Select Start Year --</option>
                {years.map(year => (
                  <option key={year} value={year}> {year} </option>
                ))}
              </select>
              <div className="invisible"></div>
            </div>
          )}
        </div>

        <h4 className="text-md font-bold text-center text-red-600 mt-10">
         Grades 1 to 4 (Basic), 5 & 6 (Intermediate), and 7 & 8 (Advanced) refer to the levels of Tamil language learning, not his/her school grade. For example, a 10 year-old is new to Tamil may start at Grade between 1 to 4 – Basic Tamil, while a 12 year-old with Good Tamil language skill might start at Grade 5 or 6 – Intermediate Tamil.</h4>
        <h5 className="text-md font-bold text-center text-red-600 mt-5 mb-5">
           * Tamil Grade is assigned by teacher after free trial session, based on the Tamil Grade you can choose the subscription plan.</h5>
        
        <div className="py-6 px-4 md:px-2 bg-gray-50 mt-4">
          <div className="flex justify-center mb-8">
            <div className="bg-white shadow-md rounded-full p-1 flex">
              <button onClick={() => setBillingCycle("freeTrial")} className={`px-6 py-2 rounded-full font-medium transition ${billingCycle === "freeTrial" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"}`}>Free Trial</button>
              <button onClick={() => setBillingCycle("monthly")} className={`px-6 py-2 rounded-full font-medium transition ${billingCycle === "monthly" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"}`}>Monthly</button>
              <button onClick={() => setBillingCycle("yearly")} className={`px-6 py-2 rounded-full font-medium transition ${billingCycle === "yearly" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"}`}>Yearly</button>
            </div>
          </div>

          <div className={`grid gap-8 ${billingCycle === "freeTrial" ? "grid-cols-1 place-items-center" : "grid-cols-1 md:grid-cols-4"}`}>
            {plans.filter((plan) => billingCycle === "freeTrial" ? plan.value === "freeTrial" : plan.value !== "freeTrial").map((plan) => (
              <div key={plan._id} className={`bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 ${billingCycle === "freeTrial" ? "w-full max-w-sm" : ""}`}>
                <h3 className="text-xl font-semibold text-purple-700 mb-2">{plan.name}</h3>
                <p className="text-gray-700 mb-4">Weekly Tamil Sessions</p>
                <hr className="my-2" />
                <p className="font-semibold text-gray-800 mb-3">Program Includes:</p>
                <ul className="text-sm space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">✔</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.value === "freeTrial" ? (
                  <p className="text-3xl font-bold mb-1">$0 <span className="text-base text-gray-500">/ Free Trial</span></p>
                ) : (
                  <p className="text-3xl font-bold mb-1">
                    ${billingCycle === "monthly" ? plan.price : (plan.price * 11)}
                    <span className="text-base text-gray-500"> {" "}/ {billingCycle}</span>
                  </p>
                )}
                <button
                  onClick={() => handleSelectPlan(plan.value)}
                  disabled={loading}
                  className={`w-full mt-2 py-2 text-white rounded ${selectedPlan === plan.value ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'} ${loading ? 'opacity-60' : ''}`}
                >
                  {loading && selectedPlan === plan.value ? 'Processing...' : (selectedPlan === plan.value ? 'Selected' : 'Choose Plan')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && paymentDetails && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold mb-4">
                  Payment & Sessions Preview
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="mb-4 w-8 h-8 flex items-center justify-center"
                >
                  <Image src="/close.png" alt="Close" width={14} height={14} />
                </button>
              </div>
              <div className="space-y-3">
                <p><strong>Plan:</strong> {paymentDetails.planName}</p>
                <p><strong>Billing Cycle:</strong> {paymentDetails.billingCycle}</p>
                <p><strong>Session Type:</strong> {paymentDetails.sessionType}</p>
                <p><strong>Total Sessions:</strong> {paymentDetails.sessions}</p>     
                {paymentDetails.planStartDate && paymentDetails.planEndDate && (
                  <>
                    <p><strong>Start Date:</strong> {new Date(paymentDetails.planStartDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(paymentDetails.planEndDate).toLocaleDateString()}</p>
                  </>
                )}      
                <div className="font-bold text-lg mt-4 border-t pt-3">
                  Total Amount: ${Number(paymentDetails.totalAmount || 0).toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <button onClick={() => handleConfirmPayment()} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {error && <div className="text-md font-bold text-center text-red-600 mt-4">{error}</div>}
      </section>
    </div>
  );
};

export default SubscriptionPlan;