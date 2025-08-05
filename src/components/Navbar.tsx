"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from 'next/link';

const Navbar = () => {
  const { data: session } = useSession();
  const [parentImage, setParentImage] = useState<string | null>(null);
  const [loginUser, setLoginUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (session?.user?.role === "Parent" && session?.user?.id) {
          const res = await fetch(`/api/parents/${session.user.id}`);
          const data = await res.json();
          if (data?.profileImage) {
            setParentImage(data.profileImage);
          }
          if (data?.username) {
            setLoginUser(data.username);
          }
        }
      } catch (error) {
        console.error("Failed to load parent profile:", error);
      }
    };

    fetchProfile();
  }, [session]);

  const profileImage = session?.user?.image || parentImage || "/avatar.png";
  const loginUserName = session?.user?.name || loginUser;
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      {/* <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="Search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div> */}

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div> */}
        {session?.user?.role !== "Parent" && (
        <Link href="/dashboard/list/announcement">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image
            src="/announcement.png"
            alt="Notifications"
            width={20}
            height={20}
          />
          {/* <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div> */}
        </div>
        </Link>
        )}

        {session?.user && (
          <>
            <div className="flex flex-col">
              <span className="text-xs leading-3 font-medium">
                {loginUserName}
              </span>
              <span className="text-[10px] text-gray-500 text-right">
                {session?.user?.email}
              </span>
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
          onClick={() => {
            document.cookie.split(";").forEach((c) => {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
            });
            signOut({ callbackUrl: "/landingPage", redirect: true });
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;