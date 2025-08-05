'use client';

import React from 'react';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Your trust is important to us. Learn how we protect your data and ensure transparency in our services.
        </p>
      </section>

      <section className="flex-grow px-6 py-12 max-w-5xl mx-auto text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-6">
          Welcome to our Tamil Online Classes platform. Your privacy is very important to us. This Privacy Policy explains how we
          collect, use, share, and protect your personal data when you visit or use our website and related services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. What is a Privacy Policy?</h2>
        <p className="mb-4">
          A Privacy Policy outlines how we collect, use, and protect your personal information. It ensures transparency and compliance
          with regulations like GDPR, Indian IT Act, and others.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Why Do We Have This Policy?</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>To explain how we handle data</li>
          <li>To comply with laws</li>
          <li>To build trust with users</li>
          <li>To ensure safe use of our services</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Data We Collect</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Personal Info: Name, Email, Phone, Address, Gender, DOB, Profile Image, Student Details</li>
          <li>Account Info: Username, Password (encrypted)</li>
          <li>Class Data: Bookings, Subjects, Assignments</li>
          <li>Device Info: IP address, Browser, Device Type, Pages Visited</li>
          <li>Recordings, feedback, chat data, student content like blogs or videos</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. How We Collect Data</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Direct input during registration, class booking, etc.</li>
          <li>Automatically via cookies and analytics</li>
          <li>From third parties (e.g., payment processors, analytics)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. How We Use Your Data</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>To register and manage accounts</li>
          <li>To schedule classes and track progress</li>
          <li>To communicate through email, WhatsApp, or SMS</li>
          <li>To improve our services and personalize experiences</li>
          <li>To send updates and notifications</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Sharing of Data</h2>
        <p className="mb-4">We do not sell personal data. We may share it with:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Teachers and internal team for scheduling and tracking</li>
          <li>Service providers like hosting, email, payment systems</li>
          <li>Legal authorities, if required</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Children’s Privacy</h2>
        <p className="mb-4">
          We comply with COPPA and do not collect data from children under 13 without parental consent. Parents may review or delete
          their child’s data.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Security Measures</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Encrypted passwords and HTTPS connections</li>
          <li>Role-based access control</li>
          <li>Regular backups and firewall protection</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. User Rights</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Access and correct personal data</li>
          <li>Delete your account</li>
          <li>Withdraw consent</li>
          <li>Request data export</li>
          <li>Opt-out of marketing</li>
        </ul>
        <p className="mb-4">
          To exercise your rights, contact us at <strong>support@tamillclasses.com</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">10. Cookies and Tracking</h2>
        <p className="mb-4">
          We use cookies and similar technologies for site analytics, user personalization, and targeted advertising. Your IP, location,
          and browser data may be collected for these purposes.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">11. Updates to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy. Any changes will be posted here with an updated date. We recommend checking periodically.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">12. Copyright</h2>
        <p className="mb-4">
          All content on this site, including text and images, is owned by Tamil Online Classes and protected by copyright law. Do not
          copy without permission.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">13. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or requests about this Privacy Policy:
          <br />📧 Email: support@tamillclasses.com
          <br />📞 Phone: +91 99999 99999
          <br />🌐 Website: www.tamillclasses.com
        </p>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PrivacyPolicyPage;