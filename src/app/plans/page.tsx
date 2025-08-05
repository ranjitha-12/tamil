'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NavDropdown from '@/components/NavDropdown';
import Link from 'next/link';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

const Plans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Join Our Online Tamil Classes Today</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Choose a subscription that fits your learning journey. Enjoy live classes, activities, and progress tracking.
        </p>
      </div>

      {/* Subscription Plans */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Our Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-1">{plan.price}</p>
              <p className="text-gray-600 mb-4">{plan.duration}</p>
              <ul className="text-sm space-y-2 mb-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition">
                  Get Started
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm text-center">
            <Image src="/activity.png" alt="Engaging" width={80} height={80} className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Engaging Classes</h3>
            <p>Live sessions filled with interactive and activity-based learning for every level.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm text-center">
            <Image src="/standout.png" alt="Projects" width={80} height={80} className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Stand-out Projects</h3>
            <p>Monthly show-and-tell, speaking events, and more to showcase student progress.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm text-center">
            <Image src="/tamil.png" alt="Support" width={80} height={80} className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
            <p>1:1 catch-up sessions, progress reports, and personal mentoring for students.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">What Parents Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="italic mb-4">"My child has shown remarkable improvement in Tamil speaking skills. The classes are well-organized!"</p>
            <div className="flex items-center gap-4">
              <Image src="/01.jpg" alt="Parent 1" width={50} height={50} className="rounded-full" />
              <div>
                <p className="font-semibold">Sowmya R.</p>
                <p className="text-sm text-gray-500">Chennai, India</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="italic mb-4">"We love the format of show and tell. My son is excited to join every class!"</p>
            <div className="flex items-center gap-4">
              <Image src="/02.jpg" alt="Parent 2" width={50} height={50} className="rounded-full" />
              <div>
                <p className="font-semibold">Arun K.</p>
                <p className="text-sm text-gray-500">New Jersey, USA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

     <Footer />
     <ScrollToTop />
    </div>
  );
};

export default Plans;
