'use client';

import React, { useState } from 'react';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg('✅ Message sent successfully!');
        setFormData({ name: '', email: '', message: '' }); 
      } else {
        setResponseMsg(`❌ ${data.error || 'Failed to send message.'}`);
      }
    } catch (error) {
      console.error('Form error:', error);
      setResponseMsg('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-lg">
          We’re here to help! Reach out to us for any questions about our Tamil classes, schedules, or feedback.
        </p>
      </section>

      {/* Contact Info + Form */}
      <section className="flex-grow px-6 py-12 max-w-4xl mx-auto text-gray-800">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-purple-700">Get in Touch</h2>
            <p className="mb-4">
              Whether you’re a parent, student, or just curious about Tamil Online Classes, we’re just a message away.
            </p>
            <ul className="space-y-2">
              <li>📧 <strong>Email:</strong>{' '}
                <a href="" className="text-blue-600 underline">
                  support@tamillclasses.com
                </a>
              </li>
              <li>📞 <strong>Phone:</strong> +91 99999 99999</li>
              <li>🌐 <strong>Website:</strong>{' '}
                <a href="" className="text-blue-600 underline">
                  www.tamillclasses.com
                </a>
              </li>
              <li>🕐 <strong>Working Days:</strong> All Seven Days 24/7</li>
              <li>📍 <strong>Location:</strong> Chennai, Tamil Nadu, India (Online Worldwide)</li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-purple-700">Send a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={4}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-200 disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
              {responseMsg && (
                <p className="text-sm text-center mt-2">{responseMsg}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ContactPage;