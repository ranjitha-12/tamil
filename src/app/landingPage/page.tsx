'use client';
import Footer from '@/components/footer';
import NavDropdown from '@/components/NavDropdown';
import ScrollToTop from '@/components/ScrollToTop';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('language');
  const router = useRouter();
  
 const goToPlans = () => {
    router.push('/plans'); 
 };
 const goToLogin = () => {
    router.push('/login'); 
 };
 const goToRegister = () => {
    router.push('/register'); 
 };

  return (
    <div className="min-h-screen bg-white">
      <NavDropdown />
      
      {/* Header Section */}
      <header className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[85vh] min-h-[250px] overflow-hidden">
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
                className={`px-4 py-2 rounded-full text-sm md:text-base font-bold transition-colors ${activeTab === tab.id 
                  ? 'bg-amber-700 text-white' 
                  : 'bg-amber-100 text-[#1e235d] hover:bg-amber-200'
                }`}
              >
                <span className="block text-xl">{tab.label}</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e235d] mb-6 ">Tamil</h2>
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="md:w-1/2">
                  <Image
                    src="/Ancient.jpg" 
                    alt="Tamil Language Heritage"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-3xl font-bold text-[#1e235d] mb-4">The Language Importance</h3>
                  <p className="text-black text-lg mb-4">
                    Tamil is one of the longest-surviving classical languages in the world, with a history dating back over 2,000 years. 
                    It is recognized as one of the oldest languages still in use today. UNESCO has declared Tamil as a classical language, acknowledging its rich heritage and independent tradition.
                  </p>
                  <p className="text-black text-lg mb-4">
                    The Tamil language has influenced many other languages and cultures across Southeast Asia. 
                    Its grammatical structure, described in the Tolkappiyam (3rd century BCE), is one of the most 
                    comprehensive and scientific grammatical systems of any language.
                  </p>
                  <p className="text-black text-lg">
                    Today, Tamil is spoken by over 80 million people worldwide and continues to thrive as a vibrant 
                    medium of literature, cinema, and daily communication.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg mb-12">
              <h3 className="text-3xl font-bold text-[#1e235d] mb-4 ">Tamil Literature</h3>
              <p className="text-black text-lg mb-4">
                Tamil literature is broadly categorized into Sangam literature, devotional literature, and modern literature. 
                The Sangam works (300 BCE to 300 CE) include remarkable poetic compositions that provide insights into ancient Tamil society.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { title: 'Tholkappiyam', desc: 'Tholkappiyam is the oldest surviving work of Tamil literature, composed by Tholkappiyar.' },
                  { title: 'Thirukkural', desc: 'Thirukkural, written by the great poet Thiruvalluvar, is a timeless Tamil classic, it contains 1,330 couplets.' },
                  { title: 'Silappathikaram', desc: 'Silappathikaram, composed by Ilango Adigal, is one of the Five Great Epics of Tamil literature.' }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <h4 className="font-bold text-[#1e235d]  text-xl">{item.title}</h4>
                    <p className="text-md text-gray-600 mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Science Section */}
        {activeTab === 'science' && (
          <section className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e235d] mb-6 ">The Ancient Science and Inventions of the Tamil</h2>
            
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="md:w-1/2 order-2 md:order-1">
                  <h3 className="text-3xl font-bold text-[#1e235d] mb-4">Medicine & Surgery</h3>
                  <p className="text-black text-lg mb-4">
                    Ancient Tamils had advanced knowledge of medicine, as documented in texts like the "Tholkappiyam" and "Agathiyar Suvai." 
                    Siddha medicine, one of India's oldest traditional medicine systems, originated in Tamil Nadu.
                    </p>
                  <p className="text-black text-lg">
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
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1e235d] mb-4 ">Architecture</h3>
                <p className="text-black text-md mb-4">
                  Tamil architecture, particularly temple architecture, demonstrates advanced engineering knowledge. 
                  The Chola temples like Brihadeeswarar Temple showcase remarkable precision in stone construction 
                  and understanding of structural mechanics.
                </p>
                <p className="text-black text-md">
                  Ancient Tamil texts describe sophisticated urban planning principles, water management systems, 
                  and construction techniques that were far ahead of their time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1e235d] mb-4 ">Mathematics and Astronomy</h3>
                <p className="text-black text-md mb-4">
                  Tamil scholars made significant contributions to mathematics and astronomy. The concept of zero, 
                  place-value system, and precise astronomical calculations were documented in Tamil texts.
                </p>
                <p className="text-black text-md">
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e235d] mb-6 ">Tamil Health Research and Medicine</h2>
            
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
                  <h3 className="text-3xl font-bold text-[#1e235d] mb-4">Siddha Medicine System</h3>
                  <p className="text-black text-lg mb-4">
                    Siddha medicine, originating from Tamil civilization, is one of the oldest traditional medicine systems in India. 
                    It emphasizes the connection between nature and human health, using herbs, minerals, and animal products for treatment.
                  </p>
                  <p className="text-black text-lg">
                    The system is based on the concept of three humors (vatha, pitha, and kapha) and focuses on maintaining 
                    their balance for optimal health. It includes detailed diagnostic methods and treatments for various ailments.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg mb-12">
              <h3 className="text-3xl font-bold text-[#1e235d] mb-4 ">Food and Nutrition</h3>
              <p className="text-black text-lg mb-4">
                Traditional Tamil cuisine is not only delicious but also nutritionally balanced, designed to promote health and prevent disease. 
                The concept of "Sattvic" food emphasizes fresh, natural ingredients that promote physical and mental well-being.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { title: 'Medicinal Herbs', desc: 'Medicinal herbs have been an integral part of traditional Tamil life. They are used not only in medicine but also in daily cooking to enhance flavor and promote health.' },
                  { title: 'Nutritious Grains', desc: 'Nutritious whole grains and millets have been staples of the Tamil diet for centuries. Varieties like foxtail millet, pearl millet, finger millet, protein, and minerals.' },
                  { title: 'Balanced Diet', desc: 'A balanced diet ensures the body receives all essential nutrients in the right proportion. It includes cereals, pulses, vegetables, fruits, dairy, and moderate fats.' }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <h4 className="font-bold text-[#1e235d]  text-xl">{item.title}</h4>
                    <p className="text-md text-black mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tradition Section */}
        {activeTab === 'tradition' && (
          <section className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e235d] mb-6 ">Tamil Culture and Heritage</h2>
            
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="md:w-1/2 order-2 md:order-1">
                  <h3 className="text-3xl font-bold text-[#1e235d] mb-4">Living Traditions</h3>
                  <p className="text-black text-lg mb-4">
                    Tamil traditions represent a continuous cultural thread connecting ancient practices with contemporary life. 
                    These traditions encompass rituals, customs, arts, and ways of living that have been preserved across generations.
                  </p>
                  <p className="text-black text-lg mb-4">
                    From Kolam (decorative floor designs) to traditional attire, from culinary practices to family values, 
                    Tamil traditions reflect a deep connection with nature, community, and spirituality.
                  </p>
                  <p className="text-black text-lg">
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
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1e235d] mb-4 ">Rituals</h3>
                <p className="text-black text-md mb-4">
                  Tamil rituals and ceremonies are deeply symbolic, often connecting human life with cosmic cycles. 
                  These include daily prayers, seasonal festivals, and rites of passage that maintain cultural continuity.
                </p>
                <p className="text-black text-md">
                  Temple rituals, folk traditions, and community celebrations play vital roles in preserving Tamil heritage 
                  and transmitting values to younger generations.
                </p>
              </div>
            
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1e235d] mb-4 ">Traditional Festivals</h3>
                <p className="text-black text-md mb-4">
                  Tamil festivals reflect the agricultural calendar, religious traditions, and cultural values. 
                  Pongal, the harvest festival, is one of the most important celebrations, expressing gratitude to nature.
                </p>
                <p className="text-black text-md">
                  Other significant festivals include Tamil New Year, Deepavali, Navaratri, and various temple festivals 
                  that showcase Tamil Nadu's rich cultural heritage through music, dance, and rituals.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e235d] mb-8 text-center ">Our Courses</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                level: 'Basic',
                description: 'For absolute beginners with no prior knowledge of Tamil',
                features: ['Alphabet & sounds', 'Basic greetings', 'Simple sentences', 'Everyday vocabulary'],
                color: 'from-amber-700 to-amber-700'
              },
              {
                level: 'Intermediate', 
                description: 'For those with basic knowledge wanting to improve',
                features: ['Grammar fundamentals', 'Conversational skills', 'Reading practice', 'Writing exercises'],
                color: 'from-amber-700 to-amber-700'
              },
              {
                level: 'Advanced',
                description: 'For fluent speakers wanting to master the language',
                features: ['Complex grammar', 'Literary Tamil', 'Debating skills', 'Professional vocabulary'],
                color: 'from-amber-700 to-amber-700'
              },
              {
                level: 'Customized',
                description: 'Tailored to your specific needs and goals',
                features: ['Personalized curriculum', 'Specialized vocabulary', 'Flexible scheduling', 'One-on-one attention'],
                color: 'from-amber-700 to-amber-700'
              }
            ].map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className={`bg-gradient-to-r ${course.color} text-white py-4 text-center`}>
                  <h3 className="text-xl font-bold">{course.level}</h3>
                </div>
                <div className="p-5">
                  <p className="text-black text-md mb-4">{course.description}</p>
                  <ul className="list-disc pl-5 text-black text-md">
                    {course.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <button onClick={goToPlans}
                    className="mt-4 bg-[#1e235d] text-white text-lg w-full py-2 rounded hover:bg-blue-700 transition" >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Academy Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e235d] mb-8 text-center ">About Our Academy</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1e235d] mb-4">Why Choose Universal Tamil Academy?</h3>
                <p className="text-black text-lg mb-4">
                  Learning Tamil with us is more than just a language course — it's an inspiring journey into a rich culture, guided by experienced educators who care about your progress.
                </p>
                <ul className="list-disc pl-5 text-black text-lg">
                  <li>Expert Tamil instructors with global teaching experience</li>
                  <li>Dynamic online classes that keep you motivated</li>
                  <li>Step-by-step learning from alphabets to fluent expression</li>
                  <li>Discover Tamil heritage through stories, arts, and traditions</li>
                  <li>Study at your own space with flexible learning plans</li>
                </ul>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-gradient-to-r from-amber-100 to-amber-50 text-black p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 ">Our Unique Approach</h3>
                <p className="mb-4 text-lg">
                  We blend the beauty of traditional Tamil teaching with modern, interactive methods to ensure an enjoyable and effective learning experience:
                </p>
                <ul className="list-disc text-lg pl-5">
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
  
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-100 to-amber-50 text-black p-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 ">Start Learning Tamil Today!</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">Join thousands of students who have successfully learned Tamil with our proven methods</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={goToRegister}
              className="bg-amber-700 hover:bg-white transition text-white hover:text-[#1e235d] px-10 py-3 rounded-full font-bold text-lg" >
              Enroll Now
            </button>
            <button onClick={goToLogin} className="border-2 border-amber-700 px-6 py-3 rounded-full hover:bg-white font-bold hover:text-[#1e235d] transition text-lg">
              Try Free Class
            </button>
          </div>
        </section>
      </main>
      
      {/* Testimonials Section */}
      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e235d] mb-12">
            Parent Testimonials
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform border border-gray-100">
              <p className="text-black mb-4 italic">
                "My son had no prior knowledge of Tamil, but after joining UTA he can now speak and write confidently. The teachers are so patient and encouraging."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/01.jpg"
                  alt="Parent"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="text-black font-semibold">Mrs. Lakshmi</h4>
                  <span className="text-sm text-black">Canada</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform border border-gray-100">
              <p className="text-black mb-4 italic">
                "We live abroad and always worried about our kids forgetting Tamil. Thanks to UTA, my daughter enjoys learning and speaks Tamil with her grandparents now."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/04.png"
                  alt="Parent"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="text-black font-semibold">Mr. Aravind</h4>
                  <span className="text-sm text-black">Mexico</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform border border-gray-100">
              <p className="text-black mb-4 italic">
                "Universal Tamil Academy interactive classes make Tamil fun. My kids look forward to every class, and I can see their confidence growing each week."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/03.jpg"
                  alt="Parent"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="text-black font-semibold">Mrs. Priya</h4>
                  <span className="text-sm text-black">California</span>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform border border-gray-100">
              <p className="text-black mb-4 italic">
                "I appreciate how flexible Universal Tamil Academy is with timings. The teachers are very supportive and the lessons are structured to suit different levels of learners."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/02.jpg"
                  alt="Parent"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="text-black font-semibold">Mr. Kumar</h4>
                  <span className="text-sm text-black">USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default LandingPage;