import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ParentForm from "@/components/forms/parentForm";

export default async function Register() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");
  return (
    <>
      {/* <RegisterForm /> */}
      <ParentForm />
    </>
  );
}
