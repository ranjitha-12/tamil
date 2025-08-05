"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "./landingPage/page";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session, status, router]);
  return (
    <>
      <main>
        <LandingPage />
      </main>
    </>
  );
}
