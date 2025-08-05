'use client';

import React from 'react';
import Image from 'next/image';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

const teamMembers = [
  {
    name: 'Saravana Raja',
    role: 'Founder',
    image: '/02.jpg',
    bio: 'Passionate about spreading Tamil globally. 10+ years of experience in children overseas.',
  },
  {
    name: 'Porkodi',
    role: 'Curriculum Designer',
    image: '/01.jpg',
    bio: 'Specialist in activity-based Tamil curriculum tailored for international students.',
  },
  {
    name: 'Joseline',
    role: 'Parent Coordinator',
    image: '/03.jpg',
    bio: 'Bridge between parents and teachers. Handles parent feedback and weekly communication.',
  },
];

const OurTeamPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
        <p className="max-w-2xl mx-auto text-lg">
          A passionate group of educators, coordinators, and curriculum experts committed to Tamil education across the world.
        </p>
      </section>

      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-purple-800">{member.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{member.role}</p>
              <p className="text-sm text-gray-700">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default OurTeamPage;
