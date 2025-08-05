'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function ChangePasswordForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const t = searchParams.get('token');
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error('Missing token');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/changePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">Loading token...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen">
      {/* Left Image Section */}
      <div className="w-full md:w-[70%] h-[300px] md:h-full relative">
        <Image
          src="/change.jpg"
          alt="Reset Password Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-[30%] flex items-center justify-center px-8 py-12 bg-white">
        <form onSubmit={handleSubmit} className="w-full space-y-6 max-w-md">
          <div className="flex flex-col space-y-2">    
              <h3 className="text-black font-bold text-[28px]">RESET PASSWORD</h3>
            <p className="text-sm text-neutral-800">Enter your new password below</p>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 focus:outline-none focus:bg-gray-50 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-[#f55418] hover:bg-transparent border border-[#f55418] rounded-md hover:text-[#f55418] transition"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
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
