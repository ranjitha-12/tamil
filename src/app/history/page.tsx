'use client';

import React from 'react';
import Image from 'next/image';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

const HistoryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <NavDropdown />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Journey: Spreading Tamil Across the Globe</h1>
        <p className="max-w-3xl mx-auto text-lg">
          From humble beginnings to a worldwide movement, discover how Tamil Online Classes connected thousands of
          international students to their heritage.
        </p>
      </section>

      {/* History Timeline */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Milestones in Our History</h2>
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image src="/founding.png" alt="Founded" width={300} height={200} className="rounded-lg" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-700">2025 – The Beginning</h3>
              <p>
                We started with just a few passionate teachers and students eager to preserve the Tamil language. The mission was clear:
                make Tamil learning accessible online.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <Image src="/growth.png" alt="Growth" width={300} height={200} className="rounded-lg" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-700">2025 – Rapid Growth</h3>
              <p>
                With the demand rising from parents in the USA, Canada, Singapore, and UAE, we expanded with more levels, teacher training,
                and student activity programs like Show & Tell and storytelling.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image src="/tech.png" alt="Tech Expansion" width={300} height={200} className="rounded-lg" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-purple-700">2027 – Goal of Tech Empowerment</h3>
              <p>
                We launched our student-parent dashboard, introduced personalized assignments, live progress reports, and interactive class
                tracking, making Tamil learning more engaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="bg-gray-50 py-16 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-12">Global Tamil Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-indigo-700">25+ Countries</h3>
            <p className="mt-2 text-gray-600">Our students join from North America, Europe, Middle East, and Asia-Pacific.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-indigo-700">5000+ Students</h3>
            <p className="mt-2 text-gray-600">Every student receives personalized attention and real-time feedback.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-indigo-700">100+ Teachers</h3>
            <p className="mt-2 text-gray-600">Our native Tamil-speaking faculty bring deep cultural insights to every lesson.</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-indigo-700 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-lg">
          We believe Tamil is not just a language – it’s a legacy. Our mission is to pass on this cultural treasure to the next generation
          of Tamil-speaking children living abroad, in a fun, modern, and meaningful way.
        </p>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default HistoryPage;
