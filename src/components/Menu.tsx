"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard",
        visible: ["admin"],
      },
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard/parent",
        visible: ["parent"],
      },
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard/teacher",
        visible: ["teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subscription",
        href: "/dashboard/list/subscription",
        visible: ["admin"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/dashboard/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/dashboard/list/student",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Children",
        href: "/dashboard/list/children",
        visible: ["parent"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/dashboard/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subscription.jpg",
        label: "Subscription",
        href: "/dashboard/list/subscriptionPlans",
        visible: ["parent"],
      },
      {
        icon: "/payment.png",
        label: "Payment",
        href: "/dashboard/list/paymentDetails",
        visible: ["parent"],
      },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/dashboard/list/attendance",
      //   visible: ["admin"],
      // },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/dashboard/list/attendance/byParent",
      //   visible: ["parent"],
      // },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/dashboard/list/attendance/byTeacher",
      //   visible: ["teacher"],
      // },
      {
        icon: "/assignment.png",
        label: "Assign Grade",
        href: "/dashboard/list/assignGradeTeacher",
        visible: ["admin"],
      },
      {
        icon: "/invoice.png",
        label: "Generate Bill",
        href: "/dashboard/list/generateBill",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/dashboard/list/classes",
        visible: ["admin", "teacher"],
      },
       {
        icon: "/subject.png",
        label: "Subjects",
        href: "/dashboard/list/subjects",
        visible: ["admin"],
      },
      // {
      //   icon: "/assignment.png",
      //   label: "Assignments",
      //   href: "/dashboard/list/assignment/teacher",
      //   visible: ["teacher"],
      // },
      // {
      //   icon: "/assignment.png",
      //   label: "Assignments",
      //   href: "/dashboard/list/assignment/student",
      //   visible: ["parent"],
      // },
      {
        icon: "/paymenticon.png",
        label: "Invoice Bill",
        href: "/dashboard/list/invoiceBill",
        visible: ["parent"],
      },
      {
        icon: "/feedback.png",
        label: "Feedback",
        href: "/dashboard/list/parentFeedback",
        visible: ["parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/dashboard/list/announcement",
        visible: ["admin", "teacher"],
      },
      // {
      //   icon: "/image.png",
      //   label: "Banner Image",
      //   href: "/dashboard/list/bannerImage",
      //   visible: ["admin"],
      // },
      {
        icon: "/trial.png",
        label: "Free Trial",
        href: "/dashboard/list/freeTrial",
        visible: ["admin"],
      },
      {
        icon: "/message.png",
        label: "Message",
        href: "/dashboard/list/contactMessage",
        visible: ["admin"],
      },
      // {
      //   icon: "/paymenticon.png",
      //   label: "Teacher Payment",
      //   href: "/dashboard/list/teacherPayment",
      //   visible: ["admin"],
      // },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/dashboard/parentProfile",
        visible: ["parent"],
      },
      // {
      //   icon: "/logout.png",
      //   label: "Sign Out",
      //   href: "/landingPage",
      //   visible: ["parent"],
      // },
    ],
  },
];

const Menu = () => {
  const { data: session } = useSession();
  const role = session?.user?.role.toLowerCase() || "admin";
  const id = session?.user?.id;

const dimmedIcons = ["/image.png", "/feedback.png", "/trial.png", "/paymenticon.png", "/subscription.jpg", "/payment.png", "/invoice.png"];

  return (
    <>
      <div className="mt-4 text-md">
        {menuItems
          .filter((section) => section.title !== "OTHER" || role === "parent")
          .map((section) => (
            <div className="flex flex-col gap-2" key={section.title}>
              <span className="hidden lg:block text-gray-400 font-light my-4">
                {section.title}
              </span>
              {section.items.map((item) => {
                if (item.visible.includes(role)) {
                  return (
                    <div key={item.label} className="relative">
                      <Link
                        href={item.href}
                        className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                      > 
                        <Image src={item.icon} alt="" width={20} height={20}
                        className={dimmedIcons.includes(item.icon) ? "opacity-90" : ""} />
                        <span className="hidden lg:block">{item.label}</span>
                      </Link>
                    </div>
                  );
                }
              })}
            </div>
          ))}
      </div>
    </>
  );
};

export default Menu;