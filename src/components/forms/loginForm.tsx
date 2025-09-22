'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Credentials");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      if (role === "Admin") {
        router.push("/dashboard");
      } else if (role === "Teacher") {
        router.push("/dashboard/teacher");
      } else if (role === "Parent") {
        router.push("/dashboard/parent");
      } else if (role === "Student") {
        router.push("/dashboard/student");
      } else {
        alert("Unknown role. Cannot redirect.");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen">
      {/* Left Image Section */}
      <div className="w-full md:w-[70%] h-[300px] md:h-full relative">
        <Image
          src="/login.jpg"
          alt="Login Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-[30%] flex flex-col justify-center px-8 py-12">
        <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto space-y-6">
          <div className="flex flex-col space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="font-bold text-neutral-800 flex flex-col space-y-2">
              <Link href="/login">
                <h3 className="text-black font-bold text-3xl">LOGIN</h3>
              </Link>
              <p className="text-md text-neutral-400">
                Universal Tamil Academy Login
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2 w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="User Name (abc@gmail.com)"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 focus:bg-gray-50 text-md"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2 w-full">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 focus:bg-gray-50 text-md"
                  required
                />
              </div>
            </div>

            <div className="w-full">
              <button className="w-full py-3 font-semibold text-md text-white bg-amber-700 hover:bg-transparent border border-amber-700 rounded-md hover:text-amber-700 transition">
                Login
              </button>
            </div>

            <div className="text-center text-md font-medium text-neutral-800">
              <p>
                Create New Account?{" "}
                <Link href="/register">
                  <span className="text-[#1565C0] hover:underline">Register</span>
                </Link>
              </p>
            </div>
            <div className="text-center text-md font-medium text-neutral-800">
              <Link href="/forgotPassword" className="text-[#1565C0] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}