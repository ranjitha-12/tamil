'use client';

import React from 'react';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Please read these Terms carefully before using Tamil Online Classes.
        </p>
      </section>

      <section className="flex-grow px-6 py-12 max-w-5xl mx-auto text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing or using our website or services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Services Offered</h2>
        <p className="mb-6">
          Tamil Online Classes offers live online Tamil language sessions, learning materials, and related educational resources. These services are available to registered users only.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>Ensure that the information provided during registration is accurate.</li>
          <li>Maintain the confidentiality of your login credentials.</li>
          <li>Do not share class content, materials, or recordings publicly without permission.</li>
          <li>Respect the learning environment and your fellow students.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">4. Payment & Refund Policy</h2>
        <p className="mb-4">
          Payment for classes must be made in advance. We offer trial sessions where applicable. Refunds are provided only for valid cases like technical failure or instructor unavailability, and solely at our discretion.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
        <p className="mb-6">
          All content including lesson plans, videos, graphics, and logos are the intellectual property of Tamil Online Classes. You may not reproduce or reuse any part of our service without explicit permission.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. User-Generated Content</h2>
        <p className="mb-6">
          You are responsible for any content you upload or share through our platform. We reserve the right to remove any content that is inappropriate or violates our terms.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Account Termination</h2>
        <p className="mb-6">
          We reserve the right to suspend or terminate accounts for misuse, non-payment, abusive behavior, or breach of these terms. No refund will be issued for terminated accounts due to policy violation.
        </p>

        <h2 className="text-2xl font-semibold mb-4">8. Service Changes</h2>
        <p className="mb-6">
          Tamil Online Classes reserves the right to modify or discontinue any feature of the platform at any time. We aim to provide advance notice of any major changes.
        </p>

        <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
        <p className="mb-6">
          We are not liable for any direct, indirect, incidental, or consequential damages arising out of your use of our services. Our liability is limited to the amount paid for the current subscription or class.
        </p>

        <h2 className="text-2xl font-semibold mb-4">10. Privacy</h2>
        <p className="mb-6">
          Our use of your data is governed by our <a href="/privacyPolicy" className="text-blue-600 underline">Privacy Policy</a>. Please review it to understand how your data is collected and used.
        </p>

        <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
        <p className="mb-6">
          These terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of Chennai courts.
        </p>

        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
        <p className="mb-6">
          For any questions regarding these terms, please contact:
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

export default TermsAndConditionsPage;
