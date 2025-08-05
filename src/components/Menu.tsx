"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Modal from "./FormModal";
import StudentForm from "./forms/studentForm";

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
        visible: ["admin", "teacher", "parent"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/dashboard/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/dashboard/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/dashboard/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subscription.png",
        label: "Subscription",
        href: "/dashboard/list/subscriptionPlans",
        visible: ["parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/dashboard/list/attendance",
        visible: ["admin"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/dashboard/list/attendance/byParent",
        visible: ["parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/dashboard/list/attendance/byTeacher",
        visible: ["teacher"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/dashboard/list/assignment",
        visible: ["admin"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/dashboard/list/assignment/teacher",
        visible: ["teacher"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/dashboard/list/assignment/student",
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
      {
        icon: "/image.png",
        label: "Banner Image",
        href: "/dashboard/list/bannerImage",
        visible: ["admin"],
      },
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
      {
        icon: "/paymenticon.png",
        label: "Teacher Payment",
        href: "/dashboard/list/teacherPayment",
        visible: ["admin"],
      },
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

export interface Parent {
   _id: string;
  username: string;
  email: string;
  whatsapp: string;
  motherFirstName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherLastName: string;
}
export interface Grade {
  _id: string;
  name: string;
}
export interface Student {
  _id: string;
   name: string;
   surname: string;
   email: string;
   age: number;
   grade: Grade;
   profileImage?: string;
   sex: 'MALE' | 'FEMALE' | 'OTHER';
   birthday: string;
   Role?: 'Student';
   parent: string | Parent;
}
const Menu = () => {
  const { data: session } = useSession();
  const role = session?.user?.role.toLowerCase() || "admin";
  const id = session?.user?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const refreshStudents = () => {
    if (!role) return;
    if (role === 'Parent' && id) {
      fetchStudentsByParent();
    }
  };
  useEffect(() => {
    refreshStudents(); 
  }, [role, id]);
 const fetchStudentsByParent = async () => {
  try {
    const res = await fetch(`/api/student/fetchStudentsByParent?parentId=${id}`);
    const data = await res.json();
    setStudents(data.students || []);
  } catch (err) {
    console.error('Failed to fetch students by parent:', err);
  }
};

const dimmedIcons = ["/image.png", "/feedback.png", "/trial.png", "/paymenticon.png", "/subscription.png"];

  return (
    <>
      <div className="mt-4 text-sm">
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

                      {item.label === "Students" && role === "parent" && (
                        <button
                          onClick={handleOpen}
                          className="flex items-center text-md ml-10 mt-1 text-gray-600 hidden lg:block"
                        >
                          {/* <Image src="/create.png" alt="Create" width={14} height={14} className="mr-1 hidden lg:block" /> */}
                          Add Student
                        </button>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          ))}
      </div>

      {/* Student Modal */}
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold ml-4">
                Add New Student
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Image src="/close.png" alt="Close" width={14} height={14} />
              </button>
            </div>
            <StudentForm onClose={handleClose} refreshStudents={refreshStudents} />
        </div>
      </Modal>
    </>
  );
};

export default Menu;