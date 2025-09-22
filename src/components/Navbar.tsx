"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [parentImage, setParentImage] = useState<string | null>(null);
  const [loginUser, setLoginUser] = useState<string | null>(null);
  const [emailUser, setEmailUser] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const storedParentId = sessionStorage.getItem('parentId');
    if (storedParentId) {
      setParentId(storedParentId);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = session?.user?.id || parentId;
        if (!userId) return;
        const isParent = session?.user?.role === "Parent" || Boolean(parentId);
        if (isParent) {
          const res = await fetch(`/api/parents/${userId}`);
          const data = await res.json();
          if (data?.profileImage) {
            setParentImage(data.profileImage);
          }
          if (data?.username) {
            setLoginUser(data.username);
          }
          if (data?.email) {
            setEmailUser(data.email);
          }
        }
      } catch (error) {
        console.error("Failed to load parent profile:", error);
      }
    };
    fetchProfile();
  }, [session, parentId]); 

  const handleLogout = () => {
    // Clear session storage on logout
    sessionStorage.removeItem('parentId');
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    signOut({ callbackUrl: "/landingPage", redirect: true });
  };

  const profileImage = session?.user?.image || parentImage || "/avatar.png";
  const loginUserName = session?.user?.name || loginUser || "Guest";
  const loginUserEmail = session?.user?.email || emailUser || "";
  
  return (
    <div className="flex items-center justify-between p-4">
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Only show announcement if we have a session and user is not parent */}
        {/* {(session?.user && session?.user?.role !== "Parent") && (
          <Link href="/dashboard/list/announcement">
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
              <Image
                src="/announcement.png"
                alt="Notifications"
                width={20}
                height={20}
              />
            </div>
          </Link>
        )} */}

        {/* Show user info if we have either session or parent data */}
        {(session?.user || parentId) && (
          <>
            <div className="flex flex-col">
              {/* <span className="text-xs leading-3 font-medium">
                {loginUserName}
              </span>
                <span className="text-[10px] text-gray-500 text-right">
                  {loginUserEmail}
                </span> */}
                <span className="text-xs justify-center font-medium">{loginUserEmail}</span>
            </div>
            <Image
              src={profileImage}
              alt="user-avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
          </>
        )}
        <Image
          src="/logout.png"
          alt="logout"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;