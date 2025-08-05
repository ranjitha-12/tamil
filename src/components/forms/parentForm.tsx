'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo (Brazzaville)", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor Timur)",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway",
  "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

interface ClassItem {
  _id: string;
  name: string;
}

const ParentRegisterForm = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [formData, setFormData] = useState({
    whatsapp: '', email: '', password: '', country: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClasses(data);
      })
      .catch(err => console.error('Error fetching classes', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/parentSignup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'Parent' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setMessage(data.message);
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen">
      {/* Left: Image */}
      <div className="w-full md:w-[70%] h-[250px] md:h-full relative">
        <Image
          src="/registerimage.jpg"
          alt="Register Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-[30%] flex flex-col justify-center px-6 py-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <div className="font-bold text-neutral-800 flex flex-col space-y-2">
            <h3 className="text-black font-bold text-[28px]">Parent Registration</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2 w-full">
              <input
                type="email"
                name="email"
                placeholder="abc@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 focus:outline-none focus:bg-gray-50 sm:text-sm"
                required
              />
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <input
                type="tel"
                name="whatsapp"
                placeholder="+123456789"
                value={formData.whatsapp}
                onChange={handleChange}
                className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 focus:outline-none focus:bg-gray-50 sm:text-sm"
                required
              />
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <input
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 focus:outline-none focus:bg-gray-50 sm:text-sm"
                required
              />
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 bg-white focus:outline-none focus:bg-gray-50 sm:text-sm"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <button
                type="submit"
                className="w-full py-3 font-semibold text-white bg-[#f55418] hover:bg-transparent border border-[#f55418] rounded-md hover:text-[#f55418] transition"
              >
                Register
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-neutral-800">
                Already have an account?{' '}
                <Link href="/login">
                  <span className="text-[#1565C0] hover:underline">Login</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentRegisterForm;