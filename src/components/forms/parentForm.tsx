'use client'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const countries = [
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "Andorra", code: "+376" },
  { name: "Angola", code: "+244" },
  { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" },
  { name: "Australia", code: "+61" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" },
  { name: "Bahamas", code: "+1-242" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Barbados", code: "+1-246" },
  { name: "Belarus", code: "+375" },
  { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" },
  { name: "Benin", code: "+229" },
  { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" },
  { name: "Bosnia and Herzegovina", code: "+387" },
  { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" },
  { name: "Brunei", code: "+673" },
  { name: "Bulgaria", code: "+359" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cambodia", code: "+855" },
  { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Cape Verde", code: "+238" },
  { name: "Central African Republic", code: "+236" },
  { name: "Chad", code: "+235" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" },
  { name: "Comoros", code: "+269" },
  { name: "Congo (Brazzaville)", code: "+242" },
  { name: "Congo", code: "+243" },
  { name: "Costa Rica", code: "+506" },
  { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" },
  { name: "Cyprus", code: "+357" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Djibouti", code: "+253" },
  { name: "Dominica", code: "+1-767" },
  { name: "Dominican Republic", code: "+1-809" },
  { name: "East Timor (Timor Timur)", code: "+670" },
  { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" },
  { name: "El Salvador", code: "+503" },
  { name: "Equatorial Guinea", code: "+240" },
  { name: "Eritrea", code: "+291" },
  { name: "Estonia", code: "+372" },
  { name: "Ethiopia", code: "+251" },
  { name: "Fiji", code: "+679" },
  { name: "Finland", code: "+358" },
  { name: "France", code: "+33" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Georgia", code: "+995" },
  { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" },
  { name: "Greece", code: "+30" },
  { name: "Grenada", code: "+1-473" },
  { name: "Guatemala", code: "+502" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bissau", code: "+245" },
  { name: "Guyana", code: "+592" },
  { name: "Haiti", code: "+509" },
  { name: "Honduras", code: "+504" },
  { name: "Hungary", code: "+36" },
  { name: "Iceland", code: "+354" },
  { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Israel", code: "+972" },
  { name: "Italy", code: "+39" },
  { name: "Ivory Coast", code: "+225" },
  { name: "Jamaica", code: "+1-876" },
  { name: "Japan", code: "+81" },
  { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" },
  { name: "Kenya", code: "+254" },
  { name: "Kiribati", code: "+686" },
  { name: "Korea (North)", code: "+850" },
  { name: "Korea (South)", code: "+82" },
  { name: "Kuwait", code: "+965" },
  { name: "Kyrgyzstan", code: "+996" },
  { name: "Laos", code: "+856" },
  { name: "Latvia", code: "+371" },
  { name: "Lebanon", code: "+961" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Liechtenstein", code: "+423" },
  { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" },
  { name: "Macedonia", code: "+389" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Malaysia", code: "+60" },
  { name: "Maldives", code: "+960" },
  { name: "Mali", code: "+223" },
  { name: "Malta", code: "+356" },
  { name: "Marshall Islands", code: "+692" },
  { name: "Mauritania", code: "+222" },
  { name: "Mauritius", code: "+230" },
  { name: "Mexico", code: "+52" },
  { name: "Micronesia", code: "+691" },
  { name: "Moldova", code: "+373" },
  { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" },
  { name: "Montenegro", code: "+382" },
  { name: "Morocco", code: "+212" },
  { name: "Mozambique", code: "+258" },
  { name: "Myanmar", code: "+95" },
  { name: "Namibia", code: "+264" },
  { name: "Nauru", code: "+674" },
  { name: "Nepal", code: "+977" },
  { name: "Netherlands", code: "+31" },
  { name: "New Zealand", code: "+64" },
  { name: "Nicaragua", code: "+505" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Palau", code: "+680" },
  { name: "Panama", code: "+507" },
  { name: "Papua New Guinea", code: "+675" },
  { name: "Paraguay", code: "+595" },
  { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Qatar", code: "+974" },
  { name: "Romania", code: "+40" },
  { name: "Russia", code: "+7" },
  { name: "Rwanda", code: "+250" },
  { name: "Saint Kitts and Nevis", code: "+1-869" },
  { name: "Saint Lucia", code: "+1-758" },
  { name: "Saint Vincent", code: "+1-784" },
  { name: "Samoa", code: "+685" },
  { name: "San Marino", code: "+378" },
  { name: "Sao Tome and Principe", code: "+239" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Senegal", code: "+221" },
  { name: "Serbia", code: "+381" },
  { name: "Seychelles", code: "+248" },
  { name: "Sierra Leone", code: "+232" },
  { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" },
  { name: "Slovenia", code: "+386" },
  { name: "Solomon Islands", code: "+677" },
  { name: "Somalia", code: "+252" },
  { name: "South Africa", code: "+27" },
  { name: "Spain", code: "+34" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" },
  { name: "Suriname", code: "+597" },
  { name: "Swaziland", code: "+268" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" },
  { name: "Taiwan", code: "+886" },
  { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" },
  { name: "Thailand", code: "+66" },
  { name: "Togo", code: "+228" },
  { name: "Tonga", code: "+676" },
  { name: "Trinidad and Tobago", code: "+1-868" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: "Turkmenistan", code: "+993" },
  { name: "Tuvalu", code: "+688" },
  { name: "Uganda", code: "+256" },
  { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Uruguay", code: "+598" },
  { name: "Uzbekistan", code: "+998" },
  { name: "Vanuatu", code: "+678" },
  { name: "Vatican City", code: "+379" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabwe", code: "+263" }
];

const ParentRegisterForm = () => {
  const [formData, setFormData] = useState({
    whatsapp: '', 
    email: '', 
    password: '', 
    country: '',
    countryCode: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    phone: '',
    general: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    phone: false,
    country: false
  });
  const router = useRouter();

  // Validation functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    if (!hasMinLength) return "At least 6 characters";
    if (!hasUpperCase) return "At least one uppercase letter";
    if (!hasLowerCase) return "At least one lowercase letter";
    if (!hasNumber) return "At least one number";
    if (!hasSpecialChar) return "At least one special character (@$!%*?&)";
    return "";
  };

  const validatePhone = (phone: string, countryCode: string) => {
    if (!countryCode) return "Please select country first";
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 6) return "Please enter a valid Phone number";
    return "";
  };

  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'country') {
      const selectedCountry = countries.find(c => c.name === value);
      setFormData({ 
        ...formData, 
        country: value,
        countryCode: selectedCountry?.code || ''
      });
      // Mark country as touched when changed
      setTouched(prev => ({ ...prev, country: true }));
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Validate on change if field was touched
    if (touched.email && name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Please enter a valid email address'
      }));
    }
    
    if (touched.password && name === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    }
    
    if (touched.phone && name === 'whatsapp') {
      setErrors(prev => ({
        ...prev,
        phone: validatePhone(value, formData.countryCode)
      }));
    }
    
    // If country changes and phone is already touched, revalidate phone
    if (name === 'country' && touched.phone) {
      setErrors(prev => ({
        ...prev,
        phone: validatePhone(formData.whatsapp, value)
      }));
    }
  };

  // Handle field blur (when user leaves the field)
  const handleBlur = (field: 'email' | 'password' | 'phone' | 'country') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(formData.email) ? '' : 'Please enter a valid email address'
      }));
    }
    
    if (field === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(formData.password)
      }));
    }
    
    if (field === 'phone') {
      setErrors(prev => ({
        ...prev,
        phone: validatePhone(formData.whatsapp, formData.countryCode)
      }));
    }
    
    if (field === 'country') {
      // If country is blurred and phone is already touched, validate phone
      if (touched.phone) {
        setErrors(prev => ({
          ...prev,
          phone: validatePhone(formData.whatsapp, formData.countryCode)
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors({
      email: '',
      password: '',
      phone: '',
      general: ''
    });

    // Validate all fields
    const emailError = validateEmail(formData.email) ? '' : 'Please enter a valid email address';
    const passwordError = validatePassword(formData.password);
    const phoneError = validatePhone(formData.whatsapp, formData.countryCode);

    if (emailError || passwordError || phoneError || !formData.country) {
      setErrors({
        email: emailError,
        password: passwordError,
        phone: phoneError || (!formData.country ? 'Please select a country' : ''),
        general: 'Please fix all errors before submitting'
      });
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        password: true,
        phone: true,
        country: true
      });
      return;
    }

    try {
      // Clean the phone number (remove any non-digit characters)
      const cleanedPhone = formData.whatsapp.replace(/\D/g, '');
      const fullWhatsappNumber = formData.countryCode + cleanedPhone;
      
      const res = await fetch('/api/parentSignup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          whatsapp: fullWhatsappNumber,
          password: formData.password,
          role: 'Parent',
          country: formData.country,
          countryCode: formData.countryCode
        }),
      });   
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setMessage(data.message || 'Registration successful!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        general: err.message
      }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen">
      {/* Left: Image */}
      <div className="w-full md:w-[70%] h-[250px] md:h-full relative">
        <Image
          src="/utaregister.png"
          alt="Register Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-[30%] flex flex-col justify-center px-6 py-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <div className="font-bold text-neutral-800 flex flex-col space-y-2">
            <h3 className="text-black font-bold text-3xl">PARENT REGISTRATION</h3>
            <p className="text-md text-neutral-400">Create New Account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="flex flex-col space-y-1 w-full">
              <input
                type="email"
                name="email"
                placeholder="User Name (abc@gmail.com)"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`block w-full px-3 py-3 mt-1 border rounded-lg focus:outline-none text-md ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:bg-gray-50'
                }`}
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            {/* Password Field */}
            <div className="flex flex-col space-y-1 w-full">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={`block w-full px-3 py-3 mt-1 border rounded-lg focus:outline-none text-md ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:bg-gray-50'
                }`}
                required
              />
              {errors.password && (
                <div className="text-sm text-red-500">
                  <p>Password must 6 characters and contain 1 uppercase, 1 lowercase, 1 number, 1 symbol</p>
                  <ul className="list-disc pl-5">
                    {errors.password.split('. ').map((item, i) => (
                      item && <li key={i}>Enter {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Country Field - Removed error styling */}
            <div className="flex flex-col space-y-1 w-full">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={() => handleBlur('country')}
                className="block w-full px-3 py-3 mt-1 border border-gray-400 rounded-lg focus:outline-none focus:bg-gray-50 text-md"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Field */}
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex">
                <div className="w-1/4 pr-2">
                  <input
                    type="text"
                    value={formData.countryCode}
                    placeholder="+1"
                    readOnly
                    className="block w-full px-3 py-3 mt-1 border border-gray-400 rounded-lg focus:outline-none bg-gray-100 text-md"
                  />
                </div>
                <div className="w-3/4">
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="Phone number"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    className={`block w-full px-3 py-3 mt-1 border rounded-lg focus:outline-none text-md ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:bg-gray-50'
                    }`}
                    required
                  />
                </div>
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="w-full pt-2">
              <button
                type="submit"
                className="w-full py-3 font-semibold text-md text-white bg-amber-700 hover:bg-transparent border border-amber-700 rounded-md hover:text-amber-700 transition"
              >
                Register
              </button>
            </div>

            <div className="text-center">
              <p className="text-md font-medium text-neutral-800">
                Already have an account?{' '}
                <Link href="/login">
                  <span className="text-[#1565C0] hover:underline text-md">Login</span>
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