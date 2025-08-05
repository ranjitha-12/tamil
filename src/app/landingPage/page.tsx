'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/FormModal';
import FreeClass from './freeClass/page';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

interface CarouselImage {
  _id: string;
  url: string;
  public_id: string;
}

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerImages, setBannerImages] = useState<CarouselImage[]>([]);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        const res = await fetch('/api/carousel');
        const data = await res.json();
        setBannerImages(data);
      } catch (err) {
        console.error('Failed to fetch banner images:', err);
      }
    };
    fetchBannerImages();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      {/* Banner Carousel */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {bannerImages.length > 0 ? (
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            showIndicators
            className="h-full"
          >
            {bannerImages.map((img) => (
              <div key={img._id} className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src={img.url}
                  alt="Banner Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            {/* <p className="text-gray-500">No banner images available</p> */}
            <Image src="/banner.jpg" alt="Banner" layout="fill" objectFit="cover" />
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-12">
        <div className="md:w-7/12 text-justify">
          <h2 className="text-2xl font-bold mb-4">About Our Online Tamil Courses</h2>
          <p>
            Our online Tamil classes are designed for students across the world to learn Tamil in a structured and engaging way.
            Whether you're a beginner or looking to improve, our curriculum is tailored to all levels. Join thousands of students
            learning Tamil from experienced native teachers with interactive lessons and activities.
          </p>
        </div>
        <div className="md:w-5/12">
          <Image src="/about.png" alt="About Tamil" width={500} height={400} className="rounded-lg" />
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-12 mb-12">
        <div className="p-6 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Structured Learning</h3>
          <p>Each course is tailored to fit student levels and goals with assessments and progression.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Live Classes</h3>
          <p>Our interactive live sessions with expert teachers make language learning fun and effective.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Global Community</h3>
          <p>Join learners from around the world and be part of a growing Tamil-speaking community.</p>
        </div>
      </div>

      {/* Milestone Section */}
      <div className="bg-gray-100 py-12 px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold">Our online classes have been taken by over 5,000+ Students so far</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tamil Online Course achieved quite a few milestones!
            Our student and parent self-service portal was launched, and we upgraded our Tamil multiple times to better serve our students.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-2xl font-bold text-purple-700">100,000+</h3>
            <p className="text-gray-700 mt-2">Skills Mastered</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-2xl font-bold text-purple-700">1,000+</h3>
            <p className="text-gray-700 mt-2">Projects</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-2xl font-bold text-purple-700">800,000+</h3>
            <p className="text-gray-700 mt-2">Problems Solved</p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Free Class Modal */}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold ml-4">Try Free Class</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            <FreeClass />
        </div>
      </Modal>
      <ScrollToTop />
    </div>
  );
};

export default HomePage;