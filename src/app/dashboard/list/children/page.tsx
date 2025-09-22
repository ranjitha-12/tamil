'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  grade: Grade;
  tamilGrade?: 'Grade 1 to 4' | 'Grade 5 & 6' | 'Grade 7 & 8';
  profileImage?: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: string;
  Role?: 'Student';
  parent: string | Parent;
}

const ChildrenList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const id = session?.user?.id;
  const router = useRouter();

  useEffect(() => {
    if (!userRole) return;
    if (userRole === 'Parent' && id) {
      fetchStudentsByParent();
    }
  }, [userRole, id]);

  const fetchStudentsByParent = async () => {
    try {
      const res = await fetch(`/api/student/fetchStudentsByParent?parentId=${id}`);
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error('Failed to fetch students by parent:', err);
    }
  };

  const createChildren = () => {
    router.push(`/dashboard/list/children/addChildren`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold">
          Children Information
        </h1>
        {(userRole === 'Parent' || userRole === 'Admin') && (
          <div className="flex items-center gap-4">
            <button
              onClick={createChildren}
              className="bg-blue-500 hover:bg-blue-600 hover:bg-transparent border border-blue-600 hover:text-blue-600 text-white transition px-4 py-1 rounded-md"
            >
              Add Child
            </button>
          </div>
        )}
      </div>

      {students.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No children found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="border rounded-2xl shadow-md p-4 flex flex-col items-center bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition"
            >
              {/* Profile Image */}
              <div className="w-24 h-24 rounded-full overflow-hidden border mb-3">
                <img
                  src={ student.profileImage|| '/noimage.png' }
                  alt={`${student.name} ${student.surname}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h2 className="text-lg font-semibold text-gray-800">
                {student.name} {student.surname}
              </h2>

              {/* Info */}
              <div className="mt-2 text-sm text-gray-600 space-y-1 text-center">
                <p>
                  <span className="font-medium">Gender:</span> {student.sex}
                </p>
                <p>
                  <span className="font-medium">Date of Birth:</span> {formatDate(student.birthday)}
                </p>
                <p>
                  <span className="font-medium">E-mail ID:</span> {student.email}
                </p>
                <p>
                  <span className="font-medium">Academic Grade:</span> {student.grade?.name || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Tamil Grade:</span>{' '}
                  {student.tamilGrade ? student.tamilGrade : 'Not yet assigned by teacher'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildrenList;