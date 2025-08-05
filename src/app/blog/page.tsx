'use client';

import React from 'react';
import Image from 'next/image';
import NavDropdown from '@/components/NavDropdown';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/footer';

const blogs = [
  {
    title: 'Why Learning Tamil Online Works for NRI Kids',
    excerpt: 'Discover how structured online classes help kids living abroad stay connected with their heritage.',
    image: '/blog1.jpg',
    date: 'June 12, 2025',
  },
  {
    title: 'Activity-Based Learning: Making Tamil Fun!',
    excerpt: 'Learn how we use storytelling, games, and show-and-tell to make Tamil exciting for young learners.',
    image: '/blog2.jpg',
    date: 'May 28, 2025',
  },
  {
    title: 'Parent Testimonials That Inspire Us',
    excerpt: 'Real stories from parents across the globe sharing their journey with Tamil Online Classes.',
    image: '/blog3.jpg',
    date: 'April 10, 2025',
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Explore stories, ideas, and tips about Tamil education, student success, and cultural connection.
        </p>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogs.map((post) => (
            <div key={post.title} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <Image src={post.image} alt={post.title} width={600} height={300} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{post.date}</p>
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-700">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPage;
