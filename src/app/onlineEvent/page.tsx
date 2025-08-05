'use client';

import React from 'react';
import Image from 'next/image';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

const upcomingEvents = [
  {
    title: 'Tamil Storytelling Contest',
    date: 'July 28, 2025',
    time: '6:00 PM IST',
    image: '/event1.jpg',
    description: 'A fun online contest where kids tell their favorite Tamil stories to improve speaking skills.',
  },
  {
    title: 'Parent-Teacher Webinar',
    date: 'August 5, 2025',
    time: '7:30 PM IST',
    image: '/event2.jpg',
    description: 'Join us for a live webinar to understand how we support kids abroad in learning Tamil effectively.',
  },
];

const pastEvents = [
  {
    title: 'Monthly Show & Tell',
    image: '/past1.jpg',
  },
  {
    title: 'Online Tamil Debate',
    image: '/past2.jpg',
  },
  {
    title: 'Kids Speech Showcase',
    image: '/past3.jpeg',
  },
];

const OnlineEventsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <NavDropdown />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Upcoming & Past Online Events</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Our vibrant online events keep students engaged, excited, and confident in using Tamil beyond the classroom.
        </p>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col md:flex-row gap-6"
            >
              <Image
                src={event.image}
                alt={event.title}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full md:w-[200px] h-[200px]"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-purple-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📅 {event.date} | 🕒 {event.time}
                  </p>
                  <p className="text-sm text-gray-700">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Highlights Section */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Past Event Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pastEvents.map((event, index) => (
            <div key={index} className="bg-gray-100 rounded-xl overflow-hidden shadow">
              <Image
                src={event.image}
                alt={event.title}
                width={400}
                height={250}
                className="w-full h-[200px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-700 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Want to Join Our Next Event?</h2>
        <p className="max-w-xl mx-auto mb-6 text-lg">
          Participate in contests, shows, debates, and webinars designed to boost your child’s confidence in Tamil!
        </p>
        <button className="bg-white text-indigo-700 px-6 py-3 font-semibold rounded-full hover:bg-gray-100 transition">
          Register for Free Event
        </button>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default OnlineEventsPage;
