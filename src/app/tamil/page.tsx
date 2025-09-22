'use client';
import Footer from '@/components/footer';
import NavDropdown from '@/components/NavDropdown';
import ScrollToTop from '@/components/ScrollToTop';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const TamilHeritagePage = () => {
  const [activeTab, setActiveTab] = useState('language');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <NavDropdown />
      {/* Header Section */}
    <header className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[200px] overflow-hidden">
      <div className="absolute inset-0">
      <Image src="/utatamil.png" alt="Banner Image" fill className="object-cover" priority sizes="100vw"/>
      </div>
    </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 py-4">
            {[
              { id: 'language', label: 'Language' },
              { id: 'science', label: 'Science' },
              { id: 'health', label: 'Health' },
              { id: 'tradition', label: 'Tradition' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors ${activeTab === tab.id 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                <span className="block font-tamil text-lg">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Language Section */}
        {activeTab === 'language' && (
          <section className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-6 font-tamil">Tamil Language Importance</h2>
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="md:w-1/2">
                <Image
                  src="/tamil1.png" 
                  alt="Tamil Language Heritage"
                  width={500}
                  height={350}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-amber-700 mb-4">Tamil</h3>
                <p className="text-gray-700 mb-4">
                  Tamil is one of the world's oldest living languages, with a recorded history spanning over 2,000 years. 
                  It is recognized as a classical language by UNESCO and has a rich literary tradition.
                </p>
                <p className="text-gray-700 mb-4">
                  The Tamil language has influenced many other languages and cultures across Southeast Asia. 
                  Its grammatical structure, described in the Tolkāppiyam (3rd century BCE), is one of the most 
                  comprehensive and scientific grammatical systems of any language.
                </p>
                <p className="text-gray-700">
                  Today, Tamil is spoken by over 80 million people worldwide and continues to thrive as a vibrant 
                  medium of literature, cinema, and daily communication.
                </p>
              </div>
            </div>
            </div>

            <div className="bg-amber-100 p-6 rounded-lg mb-12">
              <h3 className="text-2xl font-bold text-amber-800 mb-4 font-tamil">Tamil Literature</h3>
              <p className="text-gray-700 mb-4">
                Tamil literature is broadly categorized into Sangam literature, devotional literature, and modern literature. 
                The Sangam works (300 BCE to 300 CE) include remarkable poetic compositions that provide insights into ancient Tamil society.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { title: 'Tholkappiyam', desc: 'Tholkappiyam is the oldest surviving work of Tamil literature, composed by Tholkappiyar.' },
                  { title: 'Thirukkural', desc: 'Thirukkural, written by the great poet Thiruvalluvar, is a timeless Tamil classic, it contains 1,330 couplets.' },
                  { title: 'Silappathikaram', desc: 'Silappathikaram, composed by Ilango Adigal, is one of the Five Great Epics of Tamil literature.' }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-amber-700 font-tamil text-xl">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Science Section */}
        {activeTab === 'science' && (
          <section className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-6 font-tamil">The Ancient Science and Inventions of the Tamil</h2>
            
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="md:w-1/2 order-2 md:order-1">
                  <h3 className="text-2xl font-bold text-amber-700 mb-4">Medicine & Surgery</h3>
                  <p className="text-gray-700 mb-4">
                    Ancient Tamils had advanced knowledge of medicine, as documented in texts like the "Tholkappiyam" and "Agathiyar Suvai." 
                    Siddha medicine, one of India's oldest traditional medicine systems, originated in Tamil Nadu.
                  </p>
                  <p className="text-gray-700">
                    Surgical instruments described in ancient Tamil texts show remarkable sophistication, with procedures for cataract surgery, 
                    lithotomy, and plastic surgery documented centuries before they appeared in Western medicine.
                  </p>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <Image
                    src="/science.jfif" 
                    alt="Ancient Tamil Medicine"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-amber-700 mb-4 font-tamil">Architecture</h3>
                <p className="text-gray-700 mb-4">
                  Tamil architecture, particularly temple architecture, demonstrates advanced engineering knowledge. 
                  The Chola temples like Brihadeeswarar Temple showcase remarkable precision in stone construction 
                  and understanding of structural mechanics.
                </p>
                <p className="text-gray-700">
                  Ancient Tamil texts describe sophisticated urban planning principles, water management systems, 
                  and construction techniques that were far ahead of their time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-amber-700 mb-4 font-tamil">Mathematics and Astronomy</h3>
                <p className="text-gray-700 mb-4">
                  Tamil scholars made significant contributions to mathematics and astronomy. The concept of zero, 
                  place-value system, and precise astronomical calculations were documented in Tamil texts.
                </p>
                <p className="text-gray-700">
                  Ancient Tamil calendars were remarkably accurate, with sophisticated methods for calculating 
                  planetary positions and predicting eclipses.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Health Section */}
        {activeTab === 'health' && (
          <section className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-6 font-tamil">Tamil Health Research and Medicine</h2>
            
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="md:w-1/2">
                  <Image
                    src="/health.jpg" 
                    alt="Siddha Medicine"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-amber-700 mb-4">Siddha Medicine System</h3>
                  <p className="text-gray-700 mb-4">
                    Siddha medicine, originating from Tamil civilization, is one of the oldest traditional medicine systems in India. 
                    It emphasizes the connection between nature and human health, using herbs, minerals, and animal products for treatment.
                  </p>
                  <p className="text-gray-700">
                    The system is based on the concept of three humors (vatha, pitha, and kapha) and focuses on maintaining 
                    their balance for optimal health. It includes detailed diagnostic methods and treatments for various ailments.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-100 p-6 rounded-lg mb-12">
              <h3 className="text-2xl font-bold text-amber-700 mb-4 font-tamil">Food and Nutrition</h3>
              <p className="text-gray-700 mb-4">
                Traditional Tamil cuisine is not only delicious but also nutritionally balanced, designed to promote health and prevent disease. 
                The concept of "Sattvic" food emphasizes fresh, natural ingredients that promote physical and mental well-being.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { title: 'Medicinal Herbs', desc: 'Medicinal herbs have been an integral part of traditional Tamil life. They are used not only in medicine but also in daily cooking to enhance flavor and promote health.' },
                  { title: 'Nutritious Grains', desc: 'Nutritious whole grains and millets have been staples of the Tamil diet for centuries. Varieties like foxtail millet, pearl millet, finger millet, protein, and minerals.' },
                  { title: 'Balanced Diet', desc: 'A balanced diet ensures the body receives all essential nutrients in the right proportion. It includes cereals, pulses, vegetables, fruits, dairy, and moderate fats.' }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-amber-700 font-tamil text-lg">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tradition Section */}
        {activeTab === 'tradition' && (
          <section className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-6 font-tamil">Tamil Culture and Heritage</h2>
            
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="md:w-1/2 order-2 md:order-1">
                  <h3 className="text-2xl font-bold text-amber-700 mb-4">Living Traditions</h3>
                  <p className="text-gray-700 mb-4">
                    Tamil traditions represent a continuous cultural thread connecting ancient practices with contemporary life. 
                    These traditions encompass rituals, customs, arts, and ways of living that have been preserved across generations.
                  </p>
                  <p className="text-gray-700 mb-4">
                    From Kolam (decorative floor designs) to traditional attire, from culinary practices to family values, 
                    Tamil traditions reflect a deep connection with nature, community, and spirituality.
                  </p>
                  <p className="text-gray-700">
                    Traditional art forms like Bharatanatyam dance, Carnatic music, and Tamil folk arts continue to thrive, 
                    preserving ancient techniques while adapting to modern contexts.
                  </p>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <Image
                    src="/culture.jpg" 
                    alt="Tamil Traditions"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-amber-700 mb-4 font-tamil">Rituals</h3>
                <p className="text-gray-700 mb-4">
                  Tamil rituals and ceremonies are deeply symbolic, often connecting human life with cosmic cycles. 
                  These include daily prayers, seasonal festivals, and rites of passage that maintain cultural continuity.
                </p>
                <p className="text-gray-700">
                  Temple rituals, folk traditions, and community celebrations play vital roles in preserving Tamil heritage 
                  and transmitting values to younger generations.
                </p>
              </div>
            
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-amber-700 mb-4 font-tamil">Traditional Festivals</h3>
                <p className="text-gray-700 mb-4">
                  Tamil festivals reflect the agricultural calendar, religious traditions, and cultural values. 
                  Pongal, the harvest festival, is one of the most important celebrations, expressing gratitude to nature.
                </p>
                <p className="text-gray-700">
                  Other significant festivals include Tamil New Year, Deepavali, Navaratri, and various temple festivals 
                  that showcase Tamil Nadu's rich cultural heritage through music, dance, and rituals.
                </p>
              </div>
            </div>
          </section>
        )}

	    <section>
	    <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8 text-center font-tamil">About Our Academy</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">Why Choose Universal Tamil Academy?</h3>
                  <p className="text-gray-700 mb-4">
                    Learning Tamil with us is more than just a language course — it's an inspiring journey into a rich culture, guided by experienced educators who care about your progress.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Expert Tamil instructors with global teaching experience</li>
                    <li>Dynamic online classes that keep you motivated</li>
                    <li>Step-by-step learning from alphabets to fluent expression</li>
                    <li>Discover Tamil heritage through stories, arts, and traditions</li>
                    <li>Study at your own space with flexible learning plans</li>
                  </ul>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 font-tamil">Our Unique Approach</h3>
                  <p className="mb-4">
                    We blend the beauty of traditional Tamil teaching with modern, interactive methods to ensure an enjoyable and effective learning experience:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>Storytelling and role-play to make lessons memorable</li>
                    <li>Real-life conversation practice</li>
                    <li>Practical speaking sessions for everyday communication</li>
                    <li>Interactive tools, songs, and visuals for faster recall</li>
                    <li>Cultural insights that bring words to life</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
	
	<section>
	<h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8 text-center font-tamil">Our Courses</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  level: 'Basic',
                  description: 'For absolute beginners with no prior knowledge of Tamil',
                  features: ['Alphabet & sounds', 'Basic greetings', 'Simple sentences', 'Everyday vocabulary'],
                  color: 'from-green-500 to-teal-600'
                },
                {
                  level: 'Intermediate',
                  description: 'For those with basic understanding wanting to improve',
                  features: ['Grammar fundamentals', 'Conversational skills', 'Reading practice', 'Writing exercises'],
                  color: 'from-blue-500 to-indigo-600'
                },
                {
                  level: 'Advanced',
                  description: 'For fluent speakers wanting to master the language',
                  features: ['Complex grammar', 'Literary Tamil', 'Debating skills', 'Professional vocabulary'],
                  color: 'from-purple-500 to-blue-600'
                },
                {
                  level: 'Customized',
                  description: 'Tailored to your specific needs and goals',
                  features: ['Personalized curriculum', 'Specialized vocabulary', 'Flexible scheduling', 'One-on-one attention'],
                  color: 'from-amber-500 to-orange-600'
                }
              ].map((course, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className={`bg-gradient-to-r ${course.color} text-white py-4 text-center`}>
                    <h3 className="text-xl font-bold">{course.level}</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700 mb-4">{course.description}</p>
                    <ul className="list-disc pl-5 text-gray-700 text-sm">
                      {course.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                    <button 
                      //onClick={openModal}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

	 <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8 rounded-2xl text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 font-tamil">Start Learning Tamil Today!</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">Join thousands of students who have successfully learned Tamil with our proven methods</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              //onClick={openModal}
              className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-amber-400 transition text-lg"
            >
              Enroll Now
            </button>
            <button className="border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-blue-800 transition text-lg">
              Try Free Class
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap');
        .font-tamil {
          font-family: 'Noto Sans Tamil', sans-serif;
        }
        .fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TamilHeritagePage;