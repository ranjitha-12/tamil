'use client';
import Image from 'next/image';
import NavDropdown from '@/components/NavDropdown';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';

const tamilPerks = [
  { title: 'Build Strong Tamil Base', icon: '/tamil.png' },
  { title: 'Activity-Based Learning', icon: '/activity.png' },
  { title: 'Stand-out Projects', icon: '/standout.png' },
];

const tamilStructure = [
  { title: '15 months program', icon: '/singleClass.png' },
  { title: '2 to 4 classes per week', icon: '/singleBranch.png' },
  { title: '60 minutes class', icon: '/singleAttendance.png' },
  { title: 'Up to 4 students per class', icon: '/maleFemale.png' },
];

const tamilFeatures = [
  { title: 'Video Recording for Tamil Classes', subtitle: 'Class Recordings', icon: '/home.png' },
  { title: '1:1 Parent Counsellings', subtitle: 'Student Success Manager', icon: '/parent.png' },
  { title: '1:1 Catch-Up Classes with Kids', subtitle: '1:1 Catch-Up Classes', icon: '/teacher.png' },
  { title: 'Monthly Show & Tell Calendar', subtitle: 'Show & Tell', icon: '/calendar.png' },
  { title: 'Module Specific Certificates', subtitle: 'Certificates', icon: '/assignment.png' },
  { title: 'Capstone Projects', subtitle: 'Capstone Projects', icon: '/exam.png' },
];

export default function TamilPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavDropdown />

      {/* Header */}
       <section className="bg-cover bg-center text-black py-40 px-6 text-center"
          style={{ backgroundImage: "url('/backimage.jpg')", }}>
        <h1 className="text-4xl font-bold mb-4">Spreading Tamil Across the Globe</h1>
        <p className="max-w-3xl mx-auto text-lg">
          Perks of Joining our Tamil Program
        </p>
      </section>

      {/* Tamil Perks */}
      <section className="bg-white py-12 px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {tamilPerks.map((perk, idx) => (
          <div key={idx} className="w-full sm:w-64 p-6 border rounded-xl shadow-md text-center hover:shadow-xl transition">
            <Image src={perk.icon} alt={perk.title} width={60} height={60} className="mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-700">{perk.title}</h3>
          </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="text-center py-12 bg-gray-100">
        <h2 className="text-3xl font-bold text-purple-800 mb-6">Our Tamil Program's Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12">
          {tamilFeatures.map((feature, idx) => (
            <div key={idx} className="p-6 border rounded-xl shadow-sm text-center hover:shadow-lg">
              <Image src={feature.icon} alt={feature.title} width={50} height={50} className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-700">{feature.subtitle}</h3>
              <p className="text-sm mt-2">{feature.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Program Structure */}
      <section className="text-center py-12 bg-white">
        <h2 className="text-3xl font-bold text-purple-800 mb-6">Our Tamil Program's Structure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12">
          {tamilStructure.map((item, idx) => (
            <div key={idx} className="p-6 border rounded-lg shadow-md hover:shadow-lg text-center">
              <Image src={item.icon} alt={item.title} width={50} height={50} className="mx-auto mb-4" />
              <h3 className="text-lg font-bold text-purple-700">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Converted Custom Section (from your HTML) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h6 className="text-lg font-semibold text-purple-600 mb-2">Amazing Tamil Online Classes For</h6>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Kids, Beginners & Enthusiasts</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Our Tamil classes help build a strong language foundation for children. With interactive, project-based
            learning and cultural insights, kids enjoy language while improving confidence and public speaking skills.
          </p>
          <a href="#" className="inline-block mt-4 px-6 py-2 border border-purple-600 text-purple-700 font-medium rounded-full hover:bg-purple-600 hover:text-white transition">
            Know More About Us
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-10">
          {[
            {
              icon: '/home.png',
              title: 'Effortless Learning',
              text: 'Interactive tools help students grasp concepts without stress. No need to memorize. Learn by doing.',
            },
            {
              icon: '/parent.png',
              title: 'Custom Lesson Plans',
              text: 'We tailor lesson pace and content to your child’s needs with engaging worksheets and activities.',
            },
            {
              icon: '/calendar.png',
              title: 'Monthly Cultural Themes',
              text: 'Each month features unique storytelling, festivals, and tradition-based sessions for immersive learning.',
            },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-6 border rounded-xl shadow hover:shadow-lg transition text-center">
              <Image src={card.icon} alt={card.title} width={60} height={60} className="mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-purple-700 mb-2">{card.title}</h4>
              <p className="text-gray-600 text-sm">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parent Reviews Section */}
<section className="bg-purple-50 py-16">
  <div className="max-w-5xl mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-12">
      Our Parents Love Us!
    </h2>

    {/* Carousel */}
    <div className="relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide">
        {[
          {
            name: 'Lakshmi Sundar',
            message: 'My daughter absolutely loves her Tamil classes! The teacher is patient and uses creative activities to keep her engaged. I’ve seen a huge improvement in her confidence.',
            image: '/01.jpg',
          },
          {
            name: 'Anand Raj',
            message: 'Thanks to this Tamil program, my son speaks with his grandparents more fluently. The curriculum is both fun and educational. Highly recommend!',
            image: '/02.jpg',
          },
          {
            name: 'Meena Iyer',
            message: 'The small group sizes and personalized attention are amazing. The storytelling sessions are a big hit in our home!',
            image: '/03.jpg',
          },
          {
            name: 'Karthik Balaji',
            message: 'Great structure and very communicative teachers. My child looks forward to every class. Truly impressed!',
            image: '/04.png',
          },
        ].map((review, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full border">
              <Image
                src={review.image}
                alt={review.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-lg font-semibold text-purple-700">{review.name}</h3>
            <p className="text-gray-700 mt-3 text-sm">{review.message}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Ratings and Buttons */}
    <div className="text-center mt-12">
      <h4 className="text-lg font-medium text-gray-700 mb-4 flex justify-center items-center gap-1 flex-wrap">
        Checkout our
        {Array(5).fill(0).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill="#ff7166"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
        ))}
        reviews from happy parents!
      </h4>
      <div className="flex justify-center gap-4 flex-wrap">
        <a
          href="#"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Facebook Reviews
        </a>
        <a
          href="#"
          className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
        >
          Google Reviews
        </a>
      </div>
    </div>
  </div>
</section>

      {/* Skills */}
      <section className="text-center py-10 bg-purple-50">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-700">Skills You Will Develop</h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Building communication, collaboration, and public speaking skills through interactive, Culture-rich Tamil lessons.
        </p>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}