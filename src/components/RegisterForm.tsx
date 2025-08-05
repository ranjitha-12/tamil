"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegisterForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const resAdminExists = await fetch("api/adminExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const { admin } = await resAdminExists.json();
      if (admin) {
        setError("Admin already exists");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role}),
      });
      if (res.ok) {
        const form = e.target as HTMLFormElement;
        form.reset();
        router.push("/login");
      } else {
        console.log("====================================");
        console.log("Admin register failed");
        console.log("====================================");
      }
    } catch (error) {
      console.log("====================================");
      console.log("error during register", error);
      console.log("====================================");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center container mx-auto w-full h-screen px-[12px] "
      >
        <div className="max-w-md w-full mx-auto rounded-2xl p-8 py-12 md:py-12 space-y-8 shadow-input bg-white border border-[#1a1c24]">
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <div className="font-bold text-neutral-800 dark:text-neutral-200 flex flex-col space-y-2">
            <Link href="/login" className="flex items-start w-full justify-start">
              <h3 className="text-black font-bold text-[28px]">REGISTER</h3>
            </Link>
            <p className="font-normal text-[14px] text-neutral-800 ">
              Register in Tamil School
            </p>
          </div>

          <div className="flex flex-col space-y-6 mb-4">
            <div className="flex flex-col space-y-2 w-full">
              <label
                htmlFor="name"
                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name
              </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-3  mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                placeholder="enter name"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label
                htmlFor="email"
                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-3  mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                placeholder="abc@gmail.com"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label
                htmlFor="password"
                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <input
                type="text"
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-3  mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                placeholder="password"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label
                htmlFor="role"
                className="text-sm font-medium text-black  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Role
              </label>
              <select
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-3 mt-1 border rounded-lg border-gray-400 shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
              >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <button className="flex justify-center font-semibold border items-center gap-2 rounded-md py-2 px-8 w-full text-[16px]  cursor-pointer bg-[#f55418] hover:bg-transparent border-[#f55418] text-white ring-[#f55418]/20 hover:text-[#f55418]">
              Register
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-neutral-800 ">
              Already have an account?{" "}
              <Link href={"/login"}>
                <span className="text-[#1565C0] hover:underline">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
