'use client';

import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
const Footer = () => {
  return (
  <footer className="bg-gradient-to-r from-[#1e235d] to-[#1e235d] text-white">
  <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

    {/* Brand */}
    <div>
      <h2 className="text-2xl font-bold mb-2">Universal Tamil Academy</h2>
      <p className="text-sm text-white">
        Empowering students with Tamil language skills through engaging and personalized online sessions.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm text-white">
        <li><a href="/" className="hover:text-yellow-300 font-bold">Home</a></li>
        <li><a href="/privacyPolicy" className="hover:text-yellow-300 font-bold">Privacy Policy</a></li>
        <li><a href="/termsConditions" className="hover:text-yellow-300 font-bold">Terms & Conditions</a></li>
        <li><a href="/contact" className="hover:text-yellow-300 font-bold">Contact Us</a></li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
      <p className="text-sm text-white">
        Email: <a href="mailto:universaltamilacademy@gmail.com" className="hover:text-yellow-300">universaltamilacademy@gmail.com</a><br />
        Phone: +91 99999 99999<br />
        Location: Chennai, Tamil Nadu, India
      </p>
    </div>

    {/* Social */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
      <div className="flex space-x-4 text-xl">
        <a href="#" aria-label="Facebook" className="hover:text-blue-400">
          <FaFacebook />
        </a>
        <a href="#" aria-label="Instagram" className="hover:text-pink-400">
          <FaInstagram />
        </a>
        <a href="#" aria-label="YouTube" className="hover:text-red-400">
          <FaYoutube />
        </a>
        <a href="#" aria-label="WhatsApp" className="hover:text-green-400">
          <FaWhatsapp />
        </a>
      </div>
    </div>
  </div>

  <div className="border-t border-gray-200 text-center py-4 text-sm text-white">
    &copy; {new Date().getFullYear()} Universal Tamil Academy. All rights reserved.
  </div>
</footer>
  );
};

export default Footer;