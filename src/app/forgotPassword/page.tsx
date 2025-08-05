'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen">
      {/* Left Image Section */}
      <div className="w-full md:w-[70%] h-[300px] md:h-full relative">
        <Image
          src="/reset.jpg"
          alt="Forgot Password Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-[30%] flex items-center justify-center px-8 py-12">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col space-y-2">
            <Link href="/login">
              <h3 className="text-black font-bold text-[28px]">FORGOT PASSWORD</h3>
            </Link>
            <p className="text-sm text-neutral-800">
              Reset your password by email
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 focus:outline-none focus:bg-gray-50 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-[#f55418] hover:bg-transparent border border-[#f55418] rounded-md hover:text-[#f55418] transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-sm text-neutral-800 text-center">
            <Link href="/login" className="text-[#1565C0] hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}